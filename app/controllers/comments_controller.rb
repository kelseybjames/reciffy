class CommentsController < ApplicationController
  before_action :set_current_recipe


  def index
    @comment = Comment.new
  end


  def create
    @comment = current_user.comments.create(comment_params)
    @comment.user_id = current_user.id
    respond_to do |format|
      if @comment.save
        flash[:success] = 'Comment created'
        format.html { redirect_to recipe_path(@recipe) }
        format.json { render json: @comment.to_json(include: :profile) }
      else
        flash[:error] = 'Comment failed to create'
        format.html { redirect_to request_referrer }
        format.json
      end
    end
  end


  def destroy
    @comment = Comment.find(params[:id])
    respond_to do |format|
      if @comment.destroy
        flash[:success] = 'Comment deleted'
        format.html { redirect_to recipe_path(@recipe) }
        format.json { render json: @comment.to_json }
      else
        flash[:error] = 'Comment failed to delete'
        format.html { redirect_to recipe_path(@recipe) }
        format.json { render json: @comment.to_json }
      end
    end
  end


  private

  def comment_params
    params.require(:comment).permit(:comment_description, :recipe_id)
  end

  def set_current_recipe
    @recipe = Recipe.find(params[:recipe_id])
  end
end
