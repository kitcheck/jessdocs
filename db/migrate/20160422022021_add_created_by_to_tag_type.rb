class AddCreatedByToTagType < ActiveRecord::Migration
  def change
    add_column :tag_types, :created_by_id, :integer
    
    created_by_id = User.first.id
    TagType.all.update_all(:created_by_id => created_by_id)
  end
end
