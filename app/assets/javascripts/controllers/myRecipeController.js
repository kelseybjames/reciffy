reciffy.controller('MyRecipeCtrl', [
    'RecipeService',
    'myRecipeService',
    '$scope',
    '$stateParams',
    '$state',
    'currentUser',
    function(
      RecipeService,
      myRecipeService,
      $scope,
      $stateParams,
      $state,
      currentUser){

      myRecipeService.setRecipes();
      $scope.recipes = RecipeService.getRecipes();
      $scope.myRecipes = myRecipeService.getRecipes();

      $scope.createRecipe = function() {
        myRecipeService.createEmptyRecipe( currentUser );
      }
}]);
