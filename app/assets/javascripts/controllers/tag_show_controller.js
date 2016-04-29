reciffy.controller('TagCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  'Restangular',
  'RecipeService',
  'TagService',
  'UserService',
  function(
    $scope,
    $state,
    $stateParams,
    Restangular,
    RecipeService,
    TagService,
    UserService ){

  $scope.tagId = $stateParams.id;

  TagService.callOneTag( $scope.tagId );
  RecipeService
  UserService.setUsers();

  $scope.tags = TagService.getTags();
  $scope.recipes = RecipeService.getRecipes();
  $scope.users = UserService.getUsers();
}]);
