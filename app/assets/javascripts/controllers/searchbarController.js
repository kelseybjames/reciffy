reciffy.controller('searchbarCtrl', [
  '$scope',
  '$stateParams',
  '$state',
  function(
    $scope,
    $stateParams,
    $state){

  $scope.searchByTag = function(searchString) {
    $state.go('reciffy.search', { searchString: searchString });
  };

}]);
