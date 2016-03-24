class CreateOrganizations < ActiveRecord::Migration
  def change
    create_table :organizations do |t|
      
      t.add_column :name, :string
      t.add_column :default_role_id, :integer
      t.add_column :domain, :string
      
      
      t.timestamps null: false
    end
    
    view_access = Role.find_by!(:name => 'read_only')
    
    Organization.create!(:name => 'Kit Check',
                          :default_role_id => )
      
      Users.all.each do |user|
        user.update!(:organization_id => 1)
      end
      
  end
end
