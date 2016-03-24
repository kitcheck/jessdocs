class Organization < ActiveRecord::Base
    has_many :users
    belongs_to :role
    
    has_many :projects, through: :users
end
