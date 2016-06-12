class Spec < ActiveRecord::Base
    # The orphan subtree is added to the parent of the deleted node.
    # If the deleted node is Root, then rootify the orphan subtree.
    has_ancestry
    
    belongs_to :spec_type
    belongs_to :project
    has_many :tags, dependent: :destroy
    has_many :tickets, dependent: :destroy
    has_many :comments, dependent: :destroy
    has_many :tag_types, through: :tags
    
    alias_attribute :name, :description
    
    validates_presence_of :description
    validates_presence_of :spec_type_id
    validates_presence_of :project_id
    
    scope :with_tag_type, ->(type_id) { joins(:tags).where(tags: {tag_type_id: type_id})  }
    scope :for_project, ->(project_id) { where(:project_id => project_id) }
    scope :has_ticket, -> { joins(:tickets) }
    scope :full_ancestry_of_spec, -> (spec) {spec.path.union(spec.descendants)}
    
    before_save :format
    
    def full_ancestry_ids
        self.path.union(self.descendants).pluck(:id)
    end
    
    def bottom?
        spec_type === SpecType.it
    end
    
    def closest_older_sibling_id
        sibling_ids = self.siblings.for_project(self.project_id).pluck(:id)
        self_index = sibling_ids.index(self.id)
        if self_index-1 < 0
            return -1
        end
        sibling_ids[self_index-1]
    end
    
    def can_indent?
        closest_older_sibling_id >= 0
    end
    
    def to_hash
        {   :id => self.id,
            :description => self.description,
            :project_id => self.project_id,
            :root => self.root?,
            :bookmarked => self.bookmarked?
        }
    end
    
    def self.all_ancestry_ids(specs)
        query = specs
        specs.map do |spec|
            query = query.union(Spec.full_ancestry_of_spec(spec))
        end
        
        query.pluck(:id)
    end

    def self.parse_block(text, project_id, parent_id=nil, next_top_order)
        self.parse_alternate(   :text_array => text.split("\n"), 
                                :project_id => project_id, 
                                :parent_id => parent_id,
                                :next_top_order => next_top_order)
    end
    
    def self.parse_alternate(text_array:, project_id:, parent_id:nil, depth:0, previous:nil, error_count:0, next_top_order:)
        #regex = /(\t*|-*)\s?(\w+)\s?(.*)/
        #instead of looking for s{2}* we should replace s{2}* with \t
        # not sure if this needs to be just the leading whitespace only?
        regex = /(-*)\s?(\w+)\s?(.*)/
        unless text_array.any?
            return error_count
        end
        
        line = text_array.first
        #this is where we turn spaces into -s
        line.gsub!(/[ ]{2}/, '-')
        line.gsub!(/\t/, '-')
        
        tabs, spec_type_indicator, spec_description_rest = line.scan(regex).first
        spec_depth = tabs.nil? ? 0 : tabs.length
        
        spec_description = "#{spec_type_indicator} #{spec_description_rest}"
        
        begin
            # spec_order = previous ? (previous.spec_order + 1): 1
            spec = Spec.create!(:description => spec_description,
                                :spec_type_id => 1,
                                :project_id => project_id)
            
            if(spec_depth == 0)
                spec.update_attributes!(:parent_id => parent_id,
                                        :spec_order => next_top_order)
                puts "next_top_order = #{next_top_order}"
                next_top_order= next_top_order + 1
            else
                if(depth == spec_depth)
                    parent = previous.nil? ? nil : previous.parent
                    spec.update!(:parent => parent,
                                 :spec_order => previous.spec_order + 1)
                elsif (spec_depth > depth) #deeper in, set the parent
                    spec.update!(:parent => previous, 
                                 :spec_order => 1)
                else #spec_depth < depth. farther out... no idea
                    
                    (depth-spec_depth).times do #this is how far back we need to go
                        previous = previous.parent
                    end
                    spec.update!(:parent => previous.parent,
                                 :spec_order => previous.spec_order + 1)
                end
            end
        rescue => error
            puts error.inspect
        end
        
        text_array.delete(line)
        self.parse_alternate(   :text_array => text_array, 
                                :project_id => project_id, 
                                :depth => spec_depth, 
                                :previous => spec, 
                                :error_count => error_count,
                                :parent_id => parent_id,
                                :next_top_order => next_top_order)
    end
    
    def self.parse(text_array, project_id, depth=0, previous=nil, error_count=0)
        regex = /(\t*|-*)\s*(\bdescribe\b|\bit\b)\s(.*)/
        unless text_array.any?
            return error_count
        end
        
        line = text_array.first
        tabs, spec_type, spec_description = line.scan(regex).first
        spec_depth = tabs.nil? ? 0 : tabs.length
        
        begin
            spec = Spec.create!(:description => spec_description,
                            :spec_type => SpecType.find_by!(:name=> spec_type),
                            :project_id => project_id)
            if(depth == spec_depth)
                parent_id = previous.nil? ? nil : previous.parent_id
                spec.update!(:parent_id => parent_id)
            elsif (spec_depth > depth) #deeper in, set the parent
                spec.update!(:parent_id => previous.id)
            else #spec_depth < depth. farther out... no idea
                (1+depth-spec_depth).times do #this is how far back we need to go
                    previous = previous.parent
                end
                parent_id = previous.nil? ? nil : previous.id
                spec.update!(:parent_id => parent_id)
            end
        rescue => error
            puts error.inspect
        end
        
        text_array.delete(line)
        self.parse(text_array, project_id, spec_depth, spec, error_count)
    end
    
    def self.export_spec_to_protractor(spec:, protractor_html: "", depth: 0)
        
        if spec["children"].any?
            depth.times do 
                protractor_html << "\t"
            end
            protractor_html << "describe('#{spec["description"].squish}', function(){\n\n"
            
            # children
            spec["children"].each do |child|
                export_spec_to_protractor( :spec => child, 
                                            :protractor_html => protractor_html,
                                            :depth => depth + 1)
            end
            
            
        else
            depth.times do 
                protractor_html << "\t"
            end
            protractor_html << "it('#{spec["description"].squish}', function(){\n\n"
            depth.times do 
                protractor_html << "\t"
            end
            protractor_html << "});\n\n"
            return protractor_html
        end
        depth.times do 
            protractor_html << "\t"
        end
        protractor_html << "};\n\n"
        
        protractor_html
    end
    
    def self.export_specs_to_protractor(specs:)
        protractor_html = "\n"
        
        specs.each do |spec|
            protractor_html << export_spec_to_protractor(:spec => spec)
        end
            
        protractor_html
    end
    
    private
        def format
            self.name.downcase!
            self.name.squish!
        end
end
