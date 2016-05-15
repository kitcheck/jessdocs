class Organization < ActiveRecord::Base
    has_many :users
    belongs_to :role
    
    has_many :projects
    has_many :tag_types
end
