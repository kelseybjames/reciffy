reciffy.controller('SubscriptionCtrl', [
  'Restangular',
  'Auth',
  'subscriptionService',
  '$scope',
  '$stateParams',
  '$state',
  'currentUser',
  function(
    Restangular,
    Auth,
    subscriptionService,
    $scope,
    $stateParams,
    $state,
    currentUser){

  $scope.currentUser = currentUser;
  subscriptionService.getAllSubscriptions()
  $scope.subscriptions = subscriptionService.getSubscriptions();

  $scope.removeSubscription = function(subscriptionObj) {
  	subscriptionService.destroy(subscriptionObj)
  }
}]);
