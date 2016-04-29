reciffy.controller('MadeCtrl', [
  'Restangular',
  'Auth',
  'madeRecipeService',
  'RecipeService',
  '$scope',
  '$stateParams',
  '$state',
  'currentUser',
  function(
    Restangular,
    Auth,
    madeRecipeService,
    RecipeService,
    $scope,
    $stateParams,
    $state,
    currentUser){

  $scope.recipes = RecipeService.getRecipes();

  $scope.currentUser = currentUser;
  madeRecipeService.getAllMadeRecipes()
  $scope.madeRecipes = madeRecipeService.getMadeRecipes();

  $scope.removeMadeRecipe = function(madeRecipeObj) {
  	madeRecipeService.destroy(madeRecipeObj)
  }

}]);
