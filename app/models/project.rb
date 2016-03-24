class Project < ActiveRecord::Base
    has_many :specs, dependent: :destroy
    belongs_to :user, foreign_key: "created_by_id"
    validates_presence_of :name
    validates_uniqueness_of :name
end
