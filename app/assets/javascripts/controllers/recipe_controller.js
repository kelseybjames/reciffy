reciffy.controller('RecipeCtrl', ['$scope', '$state', 'Restangular', 'RecipeService', function($scope, $state, Restangular, RecipeService) {

  $scope.recipes = RecipeService.getRecipeList();

<<<<<<< HEAD
  console.log($scope.recipes);
=======
  console.log($scope.recipes)
>>>>>>> master

}]);
