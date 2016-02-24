class SpecsController < ApplicationController
  # before_action :set_spec, only: [:show, :edit, :update, :destroy]

  # GET /specs
  # GET /specs.json
  def index
    @filtered_spec_ids = Spec.all.map(&:id)
    @projects = Project.all
    
    if filter_params.any?
      @selected_project_id = filter_params[:project_id]
      puts "@selected_project_id = #{@selected_project_id}"
      
      filtered_specs = Spec.filter_by_project(@selected_project_id)
      puts "filtered_specs = #{filtered_specs}"
      
      @selected_tag_type_id = filter_params[:tag_type_id] 
      @filtered_spec_ids = Spec.filter_by_tag_type(@selected_tag_type_id, filtered_specs).map(&:id)
      
    else
     
    end
    @specs = Spec.get_top_level(Spec.find(@filtered_spec_ids))
    puts "filtered_spec_ids = #{@filtered_spec_ids}"
    
    @tag_types = TagType.all
  end

  # GET /specs/1
  # GET /specs/1.json
  def show
     @spec = Spec.find(params[:id])
  end
  
  def list
    @specs = Spec.all
  end

  # GET /specs/new
  def new
    @spec = Spec.new
    @spec_types = SpecType.all
    if params[:id]
      if params[:add_child]
        @parent = Spec.find(params[:id])
      else
        @spec_types = SpecType.where.not(:name => 'it')
        @child = Spec.find(params[:id])
      end
    end
  end

  # GET /specs/1/edit
  def edit
    @spec = Spec.find(params[:id])
    @spec_types = SpecType.all
  end

  # POST /specs
  # POST /specs.json
  def create
    @spec = Spec.new(spec_params)
    if params[:spec][:child_id]
      @child = Spec.find(params[:spec][:child_id])
    end
    
    if @spec.save
      if params[:spec][:child_id]
        @spec.update!(:parent_id => @child.parent_id)
        @spec.children << @child
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
  
  #GET /spec/mass_add_view
  def mass_add_view
    
  end
  
  #POST /spec/mass_add
  def mass_add
    Spec.parse_block(params[:text])
    # redirect_to :action => 'index'
  end

  # DELETE /specs/1
  # DELETE /specs/1.json
  def destroy
    @spec = Spec.find(params[:id])
    
    new_parent_id = @spec.parent_id
    if !new_parent_id.nil?
      @parent = Spec.find(new_parent_id)
    end
    
    deleted_parent_id = @spec.parent_id
    parent_of_parent_id = @spec.parent.nil? ? nil : @spec.parent.parent_id
    has_children = @spec.children.any?
    deleted_id = params[:id]
    child_ids = @spec.children.map(&:id)
    
    #won't somebody please think of the children
    @spec.children.each do |child|
      child.update!(:parent_id => new_parent_id)
    end
    
    @spec.destroy
    
    deleted_parent_children = deleted_parent_id.nil? ? nil : Spec.find(deleted_parent_id).children.map(&:id)
    
    respond_to do |format|
      format.html { redirect_to specs_url, notice: 'Spec was successfully destroyed.' }
      format.json { head :no_content }
      format.js   { render :layout => false, 
                    :locals => {:deleted_parent_id => deleted_parent_id, 
                                :has_children => has_children,
                                :deleted_id => deleted_id,
                                :parent_of_parent_id => parent_of_parent_id,
                                :child_ids => child_ids,
                                :deleted_parent_children => deleted_parent_children
                    } }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    # def set_spec
    #   @spec = Spec.find(params[:id])
    # end

    # Never trust parameters from the scary internet, only allow the white list through.
    def spec_params
      params.require(:spec).permit(:description, :spec_type_id, :parent_id)
    end
  
    
    def spec_param
      params.require(:spec).permit(:description, :spec_type_id)
    end
    
    def mass_add_params
      params.require(:text)
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
    
    def show_spec_types
      @spec_type = SpecType.find(params[:id])
    end
    
end
