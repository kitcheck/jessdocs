class TagType < ActiveRecord::Base
    belongs_to :tag_type_group
    
    validates_presence_of :name
    # validates_uniqueness_of :name, :scope => :tag_type_group_id, :allow_nil => true, :allow_blank => true
    validates_presence_of :color
    
    has_many :tags, dependent: :destroy
    
    default_scope { order("LOWER(name)") }
    
    before_create :downcase
    
    private
        def downcase
            self.name.downcase!
        end
end
