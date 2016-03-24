class ChangeOrganizationColumn < ActiveRecord::Migration
  def change
    rename_column :organizations, :default_role_id, :role_id
  end
end
