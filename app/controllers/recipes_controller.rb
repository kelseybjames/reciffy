class RecipesController < ApplicationController
  include RecipeJsonConverter

  def index
    @r = current_user.recipes
    puts "Current  user is #{current_user.email}"
    puts "Current user recipes are #{@r[0]} ***"
    @recipes = current_user.recipes.includes(
      :recipe_ingredients,
      :ingredients,
      :units,
      :comments,
      :taggings,
      :tags,
      :user,
      :profile,
      :photos,
      :ratings )

    if params[:page]
      @recipes = @recipes.page(params[:page]).per(10)
    end
    puts "HERE #{@recipes[0]} INDEX"
    respond_to do |format|
      format.html
      format.json { render json: index_recipe_json(@recipes) }
    end
  end

  def top
    @recipes = Recipe.get_top_recipes
    respond_to do |format|
      format.json { render json: index_recipe_json(@recipes), status: 200 }
    end
  end

  def trending
    @recipes = Recipe.get_trending_recipes(current_user)
    respond_to do |format|
      format.json { render json: index_recipe_json(@recipes) }
    end
  end

  def new
    @recipe  = current_user.recipes.build

    respond_to do |format|
      format.html
      format.json { render json: show_recipe_json(@recipe) }
    end
  end

  def create
    @recipe = current_user.recipes.build(recipe_params)

    if @recipe.save

      if !!params[:recipe] && !!params[:recipe][:tag]
        tag = Tag.find_or_create_by( name: params[:recipe][:tag][:name].downcase)
        @recipe.taggings.create( tag_id: tag.id )
      end

      if params[:recipe][:photo]
        photo_uploads = params[:recipe][:photo][:photos]
        if photo_uploads && photo_uploads.length > 0
          photo_uploads.each do |photo|
            @recipe.photos.create(photo: photo)
          end
        end
      end

      flash[:success] = "Recipe was saved!"

      respond_to do |format|

        format.html {redirect_to recipe_path(@recipe)}

        format.json { render json: show_recipe_json(@recipe) }
      end
    else
      respond_to do |format|
        format.html {
          flash[:alert] = "Recipe not saved!"
          redirect_to new_recipe_path
        }
      end
    end
  end

  def show
    @recipe = Recipe.find(params[:id])
    @comment = Comment.new
    @rating = Rating.find_by(user_id: current_user.id, recipe_id: params[:id]) || Rating.new
    respond_to do |format|
      format.html
      format.json { render json: show_recipe_json(@recipe) }
    end
  end

  def edit
    @recipe  = Recipe.includes(:recipe_ingredients).find(params[:id])
    @tag = @recipe.tags.build
  end

  def update
    @recipe  = Recipe.find(params[:id])

    if !!params[:recipe] && !!params[:recipe][:tag]
      tag = Tag.find_or_create_by( name: params[:recipe][:tag][:name].downcase)
      @recipe.taggings.build( tag_id: tag.id )
    end

    respond_to do |format|
      if @recipe.update(recipe_params)
        format.html { redirect_to request.referrer }
        format.json { render json: @recipe.as_json }
      else
        format.html { redirect_to request.referrer }
        format.json { render json: @recipe.as_json }
      end
    end
  end

  def destroy
    if @recipe = Recipe.find_by_id(params[:id])
      respond_to do |format|
        if @recipe.destroy
          flash[:success] = "Recipe Deleted"
        else
          flash[:danger] = "Could not delete recipe!"
        end
        format.json { render json: @recipe.as_json }
        format.html { redirect_to :back }
      end
    else
      flash[:danger] = "Invalid recipe removal! - Unauthorized?"
      respond_to do |format|
        format.html { redirect_to :back }
        format.json { render nothing: true }
      end
    end
  end

  private

  def recipe_params

    params.require(:recipe).permit(
      :user_id,
      :name,
      :description,
      :instructions,
      :cook_time,
      :prep_time,
      :original_id,
      :recipe_ingredients_attributes => [
        :recipe_id,
        :ingredient_id,
        :unit_id,
        :quantity ],
      :photo_attributes => [:photo],
      :tag_attributes => [:name]
    )
  end
end
