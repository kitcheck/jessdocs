class Project < ActiveRecord::Base
    has_many :specs, dependent: :destroy
    belongs_to :user, foreign_key: "created_by_id"
    belongs_to :organization
    
    validates_presence_of :name
    validates_uniqueness_of :name
    
    scope :for_user, ->(user) { where('created_by_id = ? OR organization_id = ?', 
                                        user.id, 
                                        user.organization_id) }
end
