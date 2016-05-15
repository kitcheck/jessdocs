class AddOrganizationIdToProjects < ActiveRecord::Migration
  def change
    add_column :projects, :organization_id, :integer
    
    Project.all.update_all(:organization_id => 1)
  end
end
