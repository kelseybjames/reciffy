reciffy.controller('searchResultCtrl',
  [
    'RecipeService',
    'TagService',
    'UserService',
    '$scope',
    '$stateParams',
    '$state',
    function(
      RecipeService,
      TagService,
      UserService,
      $scope,
      $stateParams,
      $state){
        // if the user refreshes page, redirect to recipes all route to reload
        // data for angular services
        if (Object.keys(RecipeService.getRecipes()).length === 0) {
          $state.go('reciffy.recipes.all');
        } else {
          $scope.searchTag = TagService.findTagByName($stateParams.searchString);
          if ($scope.searchTag) {
            TagService.callOneTag($scope.searchTag.id);
            $scope.recipes = RecipeService.getRecipes();
            $scope.users = UserService.getUsers();
            console.log($scope.users, $scope.recipes);
            $scope.noResultsMsg = undefined;
          } else {
            $scope.noResultsMsg = "Sorry! No recipes or users by that tag!"
          }
        }

}]);
