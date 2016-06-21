class TagTypeGroupsController < ApplicationController
  before_action :set_tag_type_group, only: [:show, :edit, :update, :destroy]

  # GET /tag_type_groups
  # GET /tag_type_groups.json
  def index
    @tag_type_groups = TagTypeGroup.all
    
    render :json => @tag_type_groups
  end

  # GET /tag_type_groups/1
  # GET /tag_type_groups/1.json
  def show
  end

  # GET /tag_type_groups/new
  def new
    @tag_type_group = TagTypeGroup.new
  end

  # GET /tag_type_groups/1/edit
  def edit
  end

  # POST /tag_type_groups
  # POST /tag_type_groups.json
  def create
    @tag_type_group = TagTypeGroup.new(tag_type_group_params)
    
    if @tag_type_group.save
      # @tag_types = TagType.includes(:tag_type_group).all.group_by(&:tag_type_group)
      render :json => @tag_type_group
    else
      render :json => 'uh oh'
    end
  end

  # PATCH/PUT /tag_type_groups/1
  # PATCH/PUT /tag_type_groups/1.json
  def update
      if @tag_type_group.update(tag_type_group_params)
        TagType.where(:tag_type_group => @tag_type_group).update_all(:color => @tag_type_group.color)
        @tag_types = TagType.by_group
        render :json => @tag_type_group
      else
        render :json => 'something has gone horribly wrong'
      end
  end

  # DELETE /tag_type_groups/1
  # DELETE /tag_type_groups/1.json
  def destroy
    @tag_type_group.destroy
    
    TagType.where(:tag_type_group => @tag_type_group).update_all(:tag_type_group_id => nil)
    
    @tag_types= TagType.by_group
    
    respond_to do |format|
      format.html { redirect_to tag_type_groups_url, notice: 'Tag type group was successfully destroyed.' }
      format.json { head :no_content }
      format.js   { render :layout => false }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tag_type_group
      @tag_type_group = TagTypeGroup.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def tag_type_group_params
      params.require(:tag_type_group).permit(:color, :name)
    end
end
