reciffy.controller('UserIndexCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  'Restangular',
  'UserService',
  'topUserService',
  'topUserCooksService',
  'bestCooksService',
  'horizontalScrollService',
  function(
    $scope,
    $state,
    $stateParams,
    Restangular,
    UserService,
    topUserService,
    topUserCooksService,
    bestCooksService,
    horizontalScrollService) {

  topUserService.callTopUsers();
  topUserCooksService.callTopUserCooks();
  bestCooksService.callBestCooks();

  $scope.topUsers =  topUserService.getTopUsers();
  $scope.topCooks =  topUserCooksService.getTopUserCooks();
  $scope.bestCooks = bestCooksService.getBestCooks();

  //Display max images in the row for category
  $scope.max = 4;

  //User categories (to set up page tracking per category)
  horizontalScrollService.setCategoryPages(["topUsers","topCooks","bestCooks"]);

  $scope.getPageBegin = function(category) {
  	var pagebegin = horizontalScrollService.getPageBegin(category,$scope.max);
    return pagebegin;
  }

  $scope.moveRight = function(category) {
    horizontalScrollService.moveRight($scope[category],category,$scope.max);
  }

  $scope.moveLeft = function(category) {
    horizontalScrollService.moveLeft(category,$scope.max);
  }

  $scope.disableLeftScrollButton = function(category) {
    return horizontalScrollService.disableLeftScrollButton(category,$scope.max);
  };

  $scope.disableRightScrollButton = function(category) {
    return horizontalScrollService.disableRightScrollButton(
    	   $scope[category],category,$scope.max);
  };

}]);
