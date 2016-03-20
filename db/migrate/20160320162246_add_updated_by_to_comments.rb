class AddUpdatedByToComments < ActiveRecord::Migration
  def change
    add_column :comments, :updated_by_id, :integer
    
    Comment.all.each do |comment|
      comment.update!(:updated_by_id => comment.user_id)
    end
  end
end
