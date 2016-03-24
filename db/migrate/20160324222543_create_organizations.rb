class CreateOrganizations < ActiveRecord::Migration
  def change
    create_table :organizations do |t|
      
      t.column :name, :string
      t.column :default_role_id, :integer
      t.column :domain, :string
      
      
      t.timestamps null: false
    end
    
    add_column :users, :name, :string
    add_column :users, :organization_id, :integer
    
    add_column :projects, :created_by_id, :integer
    
    view_access_id = Role.view_only.id
    
    Organization.create!(:name => 'Kit Check',
                          :default_role_id => view_access_id,
                          :domain => "kitcheck.com")
      
    User.all.each do |user|
      user.update!(:organization_id => 1)
    end
    
    jess = User.find_by!(:email => 'jessrrobins@gmail.com')
    
    Project.all.each do |project|
      project.update!(:created_by_id => jess.id)
    end
      
  end
end
