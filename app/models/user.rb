class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  
  devise :omniauthable
  
  belongs_to :role
  has_one :request, dependent: :destroy
  has_many :comments, dependent: :destroy
  
  before_create :set_default_role
  
  def can_view?
    self.role_id != Role.none.id
  end
  
  def can_edit?
    self.role_id != Role.view_only.id && self.role_id != Role.none.id
  end
  
  def admin?
    self.role_id == Role.admin.id
  end
  
  private
    def set_default_role
      self.role ||= Role.none
    end
    
  def self.find_for_google_oauth2(access_token, signed_in_resource=nil)
    data = access_token.info
    user = User.where(:provider => access_token.provider, :uid => access_token.uid ).first
    if user
      return user
    else
      registered_user = User.where(:email => access_token.info.email).first
      if registered_user
        return registered_user
      else
        user = User.create(name: data["name"],
          provider:access_token.provider,
          email: data["email"],
          uid: access_token.uid ,
          password: Devise.friendly_token[0,20],
        )
      end
    end
  end
  
end