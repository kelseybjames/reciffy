reciffy.controller('ratedRecipeCtrl', [
  'ratedRecipeService',
  'RecipeService',
  '$scope',
  '$stateParams',
  '$state',
  function(
    ratedRecipeService,
    RecipeService,
    $scope,
    $stateParams,
    $state){

  $scope.recipes = RecipeService.getRecipes();

  // Use Service Method to make API call to get saved recipes
  ratedRecipeService.callAllRatedRecipes();

  // Get Angular's version of all saved recipes
  $scope.ratedRecipes = ratedRecipeService.getRatedRecipes();

}]);
