class AddOrganizationIdToTagType < ActiveRecord::Migration
  def change
    add_column :tag_types, :organization_id, :integer
    
    TagType.all.update_all(:organization_id => 1)
  end
end
