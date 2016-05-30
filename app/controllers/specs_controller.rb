class SpecsController < ApplicationController
  # before_action :set_spec, only: [:show, :edit, :update, :destroy]
  
  
  before_action :initialize_tags, only: [ :index, 
                                          :filter_project, 
                                          :filter_tag, 
                                          :mass_add_view,
                                          :mass_add,
                                          :create,
                                          :dedent,
                                          :indent]
  before_action :can_view_edit_buttons, only: [ :index,
                                                :filter_project,
                                                :filter_tag,
                                                :mass_add,
                                                :create,
                                                :indent,
                                                :dedent]
  
  
  before_action :can_edit, only: [:new,
                                  :create,
                                  :edit,
                                  :update,
                                  :mass_add_view,
                                  :mass_add,
                                  :delete,
                                  :destroy]
                                  
  
  # GET /specs
  # GET /specs.json
  # def index
  #   @can_view = can_view
    
  #   @filtered_spec_ids = Spec.pluck(:id)
  #   @projects = Project.all
  #   @selected_project_id = params[:project_id] || Project.first.id
  
  #   @specs = get_spec_hash(Spec.for_project(@selected_project_id))
    
  #   @tag_types = TagType.all
    
  # end
  
  def index
    filter_view
  end
  
  def filter_tag
    filter_view
    respond_to do |format|
      format.html
      format.js { render :layout => false }
    end
  end

  # GET /specs/1
  # GET /specs/1.json
  def show
     @spec = Spec.find(params[:id])
  end

  # GET /specs/new
  def new
    if params[:project_id]
      @selected_project_id = params[:project_id]
    end
    @spec_types = SpecType.all
    @projects = Project.all
    
    if params[:id]
      if params[:add_child]
        @parent = Spec.find(params[:id])
        @spec = @parent.children.new
      else
        @spec = Spec.new
        @spec_types = SpecType.where.not(:name => 'it')
        @child = Spec.find(params[:id])
      end
    else
      @spec = Spec.new
    end
  end

  # GET /specs/1/edit
  def edit
    @projects = Project.all
    @spec = Spec.find(params[:id])
    @spec_types = SpecType.all
    
  end

  # POST /specs
  # POST /specs.json
  def create
    @spec = Spec.create(spec_params)
    @projects = Project.all
    
    if params[:spec][:child_id]
      @child_id = params[:spec][:child_id]
      @child = Spec.find(params[:spec][:child_id])
    end
    
    if @spec.save
      if params[:spec][:child_id]
        @spec.update!(:parent => @child.parent, :spec_order => @child.spec_order)
        @child.update!(:parent => @spec, :spec_order => 1)
      end
      
      if spec_params[:parent_id]
        @print_specs_hash = @spec.parent.subtree.arrange_serializable do |parent, children|
          parent.to_hash.merge({ :children => children})
        end
      else
        @print_specs_hash = @spec.subtree.arrange_serializable do |parent, children|
          parent.to_hash.merge({ :children => children})
        end
      end
      
      # redirect_to :action => 'index'
    else
      @spec_types = SpecType.all
      render :action => 'new'
    end
     
  end

  # PATCH/PUT /specs/1
  # PATCH/PUT /specs/1.json
  def update
    @spec = Spec.find(params[:id])
	  
	  
    if @spec.update_attributes(spec_param)
      # redirect_to :action => 'index', :id => @spec
    else
      @spec_types = SpecType.all
      render :action => 'edit'
    end
  end
  
  #GET /specs/mass_add_view
  def mass_add_view
    @projects = Project.all
    
    # @selected_project_id = params[:projects][:project_id]
    
    if params[:id]
      @parent_id = params[:id]
      @parent = Spec.find(@parent_id)
      
      @print_specs_hash = @parent.to_hash
      # @print_specs_hash = @parent.arrange_serializable do |parent, children|
      #   parent.to_hash.merge({ :children => children})
      # end
    end
  end
  
  #POST /specs/mass_add
  def mass_add
    # @projects = Project.all
    
    
    parent_id = params[:projects][:parent_id]
    @selected_project_id = params[:projects][:project_id]
    
    if parent_id
      parent = Spec.find(parent_id)
      if parent.has_children?
        next_top_order = parent.children.last.spec_order + 1
      else
        next_top_order = 1
      end
    else
      next_top_order = Spec.for_project(@selected_project_id).pluck(:spec_order).max.to_i + 1
    end
    
    Spec.parse_block(params[:text], 
                      @selected_project_id, 
                      parent_id,
                      next_top_order)
    # filter_view
    # @specs = Spec.for_project(params[:project][:id]).roots
    
    # @print_specs_hash = get_spec_hash(Spec.for_project(@current_project_id))
    # redirect_to filter_tag_specs_path(:projects => {:project_id => @selected_project_id})
  end
  
  # POST spec/:id/bookmark
  def bookmark
    @spec = Spec.find(params[:spec_id])
    @bookmarked = @spec.bookmarked
    @spec.update!(:bookmarked => !@bookmarked)
    project_id = @spec.project_id
    @bookmarks = Spec.for_project(project_id).roots.where(:bookmarked => true).order(spec_order: :asc).to_a.map(&:serializable_hash)
    # redirect_to bookmarks_specs_url(:project_id => project_id)
  end
  
  # GET specs/bookmarks
  def bookmarks
    @bookmarks = Spec.for_project(params[:project_id]).roots.where(:bookmarked => true).order(spec_order: :asc).to_a.map(&:serializable_hash)
  end
  
  def delete
    @tag_hash = tag_hash
    @ticket_hash = ticket_hash
    @spec = Spec.find(params[:spec_id])
    
     @deleted_specs = @spec.subtree.arrange_serializable do |parent, children|
      parent.to_hash.merge({ :children => children})
    end
    
  end

  # DELETE /specs/1
  # DELETE /specs/1.json
  def destroy
    @spec = Spec.find(params[:id])
    
    
    deleted_id = params[:id]
    project_id = @spec.project_id
    
    #recompute spec_order
    siblings = @spec.siblings
    if siblings.any?
      siblings.where("spec_order > ?", @spec.spec_order).update_all("spec_order = spec_order - 1")
    end
    
    @spec.destroy
    @bookmarks = Spec.for_project(project_id).roots.where(:bookmarked => true).order(spec_order: :asc).to_a.map(&:serializable_hash)
    
    
    
    respond_to do |format|
      format.html { redirect_to specs_url, notice: 'Spec was successfully destroyed.' }
      format.json { head :no_content }
      format.js   { render :layout => false, 
                    :locals => {:deleted_id => deleted_id} }
    end
  end
  
  def export
    @specs = Spec.find(836).subtree.arrange_serializable
    
    @spec_data = Spec.export_specs_to_protractor(:specs => @specs)
  end
  
  # POST /specs/1
  def move
    @spec = Spec.find(params[:spec_id])
    @old_siblings = @spec.siblings
    @new_parent = (params[:parent_id] != 'nil') ? Spec.find(params[:parent_id]) : nil
    if params[:sibling_id]
      @sibling = Spec.find(params[:sibling_id])
      @new_siblings = @sibling.siblings
      @spec_order = @sibling.spec_order + 1
    else
      if @new_parent
        @new_siblings = @new_parent.children
      else
        @new_siblings = Spec.for_project(@spec.project_id).roots
      end
      @spec_order = 1
    end
    
    
    
    #  moving within the same tree
    if params[:parent_id].to_i == @spec.parent_id.to_i
      puts "same parent"
      if @old_siblings.any?
        if @spec.spec_order > @spec_order
          @old_siblings.where("spec_order >= ? AND spec_order < ?", @spec_order, @spec.spec_order).update_all("spec_order = spec_order + 1")
        elsif @spec.spec_order < @spec_order
          @spec_order = @spec_order - 1
          @old_siblings.where("spec_order > ? AND spec_order <= ?", @spec.spec_order, @spec_order).update_all("spec_order = spec_order - 1")
        end
      end
      
    else
      puts "different parent"
      # if we move from one tree to another tree
      # need to update everything >= @spec.spec_order in new tree
      if @new_siblings && @new_siblings.any?
        @new_siblings.where("spec_order >= ?", @spec_order).update_all("spec_order = spec_order + 1")
      end
      # need to update everything >= @spec.order in previous tree
      if @old_siblings.any?
        @old_siblings.where("spec_order >= ?", @spec.spec_order).update_all("spec_order = spec_order - 1")
      end
    end
    
    @spec.update(:parent => @new_parent, :spec_order => @spec_order) 
    
    render :nothing => true
    # redirect_to bookmarks_specs_url(:project_id => @spec.project_id)
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    # def set_spec
    #   @spec = Spec.find(params[:id])
    # end
    
    def initialize_tags
      @tag_hash = tag_hash
      @ticket_hash = ticket_hash
      # @comment_hash = comment_hash
    end
    
    def can_view
      current_user.can_view?
      # unless current_user.can_view?
      #   render(:file => File.join(Rails.root, 'public/403'), :formats => [:html], :status => 403, :layout => false)
      # end
    end
    
    def can_view_edit_buttons
      @can_edit = current_user.can_edit?
    end
    
    def can_edit
      unless current_user.can_edit?
        raise ActionController::RoutingError.new('Forbidden')
      end
    end
    
    def filter_view
      @can_view = can_view
      if params[:projects]
        @selected_project_id = params[:projects][:project_id]
      else
        @selected_project_id = Project.first.id
      end
      @tag_types = TagType.includes(:tag_type_group).all.group_by(&:tag_type_group)
      @project = Project.find(@selected_project_id)
      
      @bookmarks = Spec.for_project(@selected_project_id).roots.where(:bookmarked => true).order(spec_order: :asc).to_a.map(&:serializable_hash)
      @comment_array = Comment.where.not(:resolved => true, :user_id => current_user.id).select{ |c| (c.root? && c.is_childless?) || (!c.root? && c.created_at == c.siblings.pluck(:created_at).max)}.map(&:spec_id)
      
      @specs = get_spec_hash(Spec.for_project(@selected_project_id))
      
      @projects = Project.all
      
      @filtered_spec_ids_array = []
      
      @requests = Request.all
      @request_count = @requests.any? ? @requests.count : nil
      
      @tag_type_ids = params[:tag_types]
      
      if @tag_type_ids
        @tag_type_ids.each do |tag_type_id|
          # @filtered_spec_ids_array << Spec.filter_by_tag_type(tag_type_id, @project_specs).map(&:id).uniq
          @filtered_spec_ids_array << Spec.all_ancestry_ids(Spec.for_project(@project.id).with_tag_type(tag_type_id))
        end
      end
      
      @ticketed = params[:ticketed]
      if @ticketed
        @filtered_spec_ids_array << Spec.all_ancestry_ids(Spec.for_project(@project.id).has_ticket)
      end
      
      @filtered_spec_ids = @filtered_spec_ids_array.inject(:&)
      
      if @filtered_spec_ids
        @filtered_spec_ids.uniq!
      end
    end
    
    def get_spec_hash(spec_scope)
      hash = spec_scope.arrange_serializable(:order => 'spec_order ASC') do |parent, children|
        parent.to_hash.merge({ :children => children})
      end
      
      hash
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def spec_params
      params.require(:spec).permit(:description, :spec_type_id, :parent_id, :project_id)
    end
  
    def move_params
      params.require(:spec).permit(:id, :parent_id, :sibling_id)
    end
    
    def export_params
      params.require(:specs).permit(:spec_id)
    end
  
    def spec_param
      params.require(:spec).permit(:description, :spec_type_id, :project_id)
    end
    
    def mass_add_params
      params.require(:text, :projects).permit(:project_id)
    end
    
    def filter_params
      filter_params = {}
      if params 
        if params[:tags] && params[:tags][:tag_type_id] != ""
          params.require(:tags).require(:tag_type_id)
          filter_params[:tag_type_id] = params[:tags][:tag_type_id]
        end
        if params[:projects] && params[:projects][:project_id] != ""
          params.require(:projects).require(:project_id)
          filter_params[:project_id] = params[:projects][:project_id]
        end
      end
      
      filter_params
    end
    
    def filter_project_params
      params.require(:projects).permit(:project_id)
    end
    
    def filter_tag_params
      
      params.require(:project_id)
    end
    
    def show_spec_types
      @spec_type = SpecType.find(params[:id])
    end
    
    def tag_hash
      tag_hash = Hash.new { |h,k| h[k] = [] }
      Tag.joins(:tag_type).pluck(:spec_id, :id, :name, :color).map do |tag| 
        if tag_hash[tag.first]
          tag_hash[tag.first] << {
            :id => tag[1],
            :name => tag[2],
            :color => tag[3]
          }
        else
          tag_hash.merge( [tag.first,  {
            :id => tag[1],
            :name => tag[2],
            :color => tag[3]
          } ] ) 
        end
      end
      tag_hash
    end
    
    def ticket_hash
      ticket_hash = Hash.new { |h,k| h[k] = [] }
      Ticket.pluck(:spec_id, :id, :tracker_id, :name).map do |ticket| 
        if ticket_hash[ticket.first]
          ticket_hash[ticket.first] << {
            :id => ticket[1],
            :tracker_id => ticket[2],
            :url => Ticket.get_url(ticket[2]),
            :name => ticket[3]
          }
        else
          ticket_hash.merge( [ticket.first,  {
            :id => ticket[1],
            :tracker_id => ticket[2],
            :url => Ticket.get_url(ticket[2]),
            :name => ticket[3]
          } ] ) 
        end
      end
      ticket_hash
    end
    
    def comment_hash
      comment_hash = Hash.new { |h,k| h[k] = [] }
      Comment.pluck(:spec_id, :id, :text, :user_id, :updated_at).map do |comment| 
        if comment_hash[comment.first]
          comment_hash[comment.first] << {
            :id => comment[1],
            :text => comment[2],
            :user => User.find(comment[3]).email,
            :updated_at => comment[4]
          }
        else
          comment_hash.merge( [comment.first,  {
            :id => comment[1],
            :text => comment[2],
            :user => User.find(comment[3]).email,
            :updated_at => comment[4]
          } ] ) 
        end
      end
      comment_hash
    end
end
