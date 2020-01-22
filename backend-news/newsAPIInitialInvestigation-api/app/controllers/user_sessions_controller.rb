class UserSessionsController < ApplicationController
    def create
        user = User.find_by(username:params[:user][:username])
        if user.try(:authenticate, params[:user][:password])
            render json: user
        else
            session[:error] = "Some error"
            render json: session
        end
        
    end 

end
