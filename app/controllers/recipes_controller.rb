class RecipesController < ApplicationController

  def index
  end

  def new
    @recipe  = current_user.recipes.build
    @recipe.recipeingredients.build
    @recipe.recipeingredients.build
  end  

  def create

    @recipe = current_user.recipes.build(recipe_params)
    @ri = @recipe.recipeingredients.build
    @ri.ingredient_id = params["recipe"]["recipeingredient"]["ingredient_id"]
    @ri.unit_id = params["recipe"]["recipeingredient"]["unit_id"]
    @ri.quantity = params["recipe"]["recipeingredient"]["quantity"]
    # @recipe.recipeingredients.build
    # @recipe.recipeingredients.build

    if @recipe.save
      
      flash[:success] = "Recipe was saved!"

      respond_to do |format|

        format.html {redirect_to new_recipe_path}

        format.js {render :none}
      end  
    else
      respond_to do |format|
        flash[:alert] = "Recipe not saved!"
        redirect_to new_recipe_path
      end
    end  
  end  

  
  def recipe_params

    params.require(:recipe).permit(
      :user_id,
      :name,
      :description,
      :instructions,
      :cook_time,
      :prep_time,
      { :recipeingredients_attributes => [
        :recipe_id,
        :ingredient_id,
        :unit_id,
        :quantity ] }
    )

  end

end

