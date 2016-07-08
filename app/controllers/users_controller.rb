class UsersController < ApplicationController
    before_action :set_user, only: [:show, :edit, :update, :destroy]
    def index
        if current_user.admin?
            @users = User.order(email: :asc)
            @requests = Request.order(created_at: :asc)
        end
    end
    
    def current_user_info
        @user = current_user
        
        render :json => @user
    end
    
    def edit
        @roles = Role.all
    end
    
    def destroy
        @user.destroy
    end
    
    def update
        
        if @user.update(user_params)
            @user.request.destroy if @user.request
        
        end
    end
  
    private
        def set_user
            if current_user.admin?
                @user = User.find(params[:id])
            end
        end
        
        def user_params
          params.require(:user).permit(:role_id)
        end
end
