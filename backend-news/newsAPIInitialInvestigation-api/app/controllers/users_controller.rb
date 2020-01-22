class UsersController < ApplicationController

    def create 
        user = User.create(new_user_params)
        render json: user
    end

    def update
        @user = User.find(params[:id])
        @user.saveforlater.push(params[:add_to_saveforlater])
        @user.save
        render json: @user
    end

    private

    def new_user_params
        params.require(:user).permit(:username, :password, :password_confirmation)
    end 

end
