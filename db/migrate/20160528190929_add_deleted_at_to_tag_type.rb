class AddDeletedAtToTagType < ActiveRecord::Migration
  def change
    add_column :tag_types, :deleted_at, :time
    add_column :tag_types, :deleted_by_id, :int
    add_column :tags, :deleted_at, :time
    add_column :tags, :deleted_by_id, :int
    add_column :tickets, :deleted_at, :time
    add_column :tickets, :deleted_by_id, :int
  end
end
