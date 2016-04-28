class SavedRecipesController < ApplicationController
  include RecipeJsonConverter

  def index
    @saved_recipes = current_user.saved_recipes
    respond_to do |format|
      format.json { render json: @saved_recipes.to_json(
        include: [:recipe]
      )}
    end
  end

  def create
    @saved_recipe = current_user.saved_recipes.build(recipe_id: params[:recipe_id])
    p @saved_recipe
    respond_to do |format|
      if @saved_recipe.save
        format.html { redirect_to request.referrer }
        format.json { render json: @saved_recipe.to_json(include: [:recipe]) }
      else
        format.html { redirect_to request.referrer }
        format.json { render json: @saved_recipe.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @saved_recipe = SavedRecipe.find_by_id(params[:id])
    respond_to do |format|
      if @saved_recipe.destroy
        format.html { redirect_to request.referrer }
        format.json { render json: @saved_recipe.to_json(include: [:recipe]) }
      else
        format.html { redirect_to request.referrer }
        format.json { render json: @saved_recipe.to_json(include: [:recipe]), status: :unprocessable_entity }
      end
    end
  end

  private

  def saved_recipe_params
    params.permit(:recipe_id, :user_id)
  end
end
