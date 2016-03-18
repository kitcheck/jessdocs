class Comment < ActiveRecord::Base
    belongs_to :spec
    belongs_to :user
    
    validates_presence_of :spec_id
    validates_presence_of :user_id
    validates_presence_of :text
end
