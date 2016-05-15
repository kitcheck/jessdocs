class CreateTagTypeGroups < ActiveRecord::Migration
  def change
    create_table :tag_type_groups do |t|

      t.timestamps null: false
      t.column :name, :string
      t.column :color, :string
    end
    
    add_column :tag_types, :tag_type_group_id, :integer
  end
end
