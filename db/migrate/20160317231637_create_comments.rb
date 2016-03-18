class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      
      t.string  :text,      null: false
      t.boolean :resolved,  null: false, default: false
      t.integer :user_id,   null: false
      t.integer :spec_id,   null: false
      
      t.timestamps null: false
    end
  end
end
