reciffy.factory('myRecipeService', ['Restangular','RecipeService', function(Restangular, RecipeService) {

  var _myRecipes = {};

  var setRecipes = function() {
    Restangular
    .all('recipes')
    .getList()
    .then( function(recipes) {
      populateMy(recipes);
      populateRecipes(recipes)
    });
  };

  var getRecipes = function() {
    return _myRecipes;
  };

  var populateMy = function(rawData) {
    rawData.forEach(function(myRecipe) {
      _myRecipes[myRecipe.id] = myRecipe;
    });
  };

  var populateRecipes = function(rawData) {
    rawData.forEach( function(mR) {
      RecipeService.setOneRecipe(mR.id);
    });
  };

  var createEmptyRecipe = function( currentUser ) {
    var newRecipe = {
      name: "Untitled Recipe",
      description: "Describe your recipe...",
      instructions: "How do you make it?",
      prep_time: 0,
      cook_time: 0,
    };

    Restangular
    .all('recipes')
    .post(newRecipe)
    .then( function(recipe) {
      _myRecipes[recipe.id] = recipe;
      RecipeService.addRecipe(recipe);
    });
  };

  return {
    setRecipes: setRecipes,
    getRecipes: getRecipes,
    populateMy: populateMy,
    populateRecipes: populateRecipes,
    createEmptyRecipe: createEmptyRecipe,
  };
}]);
