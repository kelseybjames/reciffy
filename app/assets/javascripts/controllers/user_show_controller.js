reciffy.controller('UserShowCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  'Restangular',
  'UserService',
  'TagService',
  'subscriptionService',
  'currentUser',
  'Upload',
  'UserService',
  function(
    $scope,
    $state,
    $stateParams,
    Restangular,
    UserService,
    TagService,
    subscriptionService,
    currentUser,
    Upload,
    UserService) {

  $scope.user_subscribed = false;

  $scope.getProfileData = function() {
    Restangular.one('users', $stateParams.id).get()
    .then(function(user) {
      $scope.user = user;
      $scope.profile = user.profile;
      $scope.userRecipes = user.recipes;
      $scope.userMadeRecipes = user.recipes_made;
      $scope.userSavedRecipes = user.recipes_saved;
      $scope.received_subscriptions = user.received_subscription_requests;
      $scope.checkSubscriberExists(user);
      $scope.disabledStatus = (currentUser.id != $stateParams.id);
      $scope.tags = user.profile.tags;
      $scope.newTag = { name: "" };
      $scope.avatar = user.photo.url.thumb;
      $scope.avatarChangeEnabled = (currentUser.id == user.id);
      console.log($scope.avatarChangeEnabled);
    })
  };

  $scope.getProfileData();

  $scope.updateUserProfile = function(user) {
    Restangular.one('profiles', $scope.profile.id).patch({
      first_name: $scope.profile.first_name,
      last_name: $scope.profile.last_name,
      bio: $scope.profile.bio,
      tagline: $scope.profile.tagline,
      city: $scope.profile.city,
      state: $scope.profile.state,
    }).then(function(newProfile) {
      
    })
  };

  $scope.addSubscriber = function(user) {
    subscriptionService.create(user);
    $scope.user_subscribed = true;
  }

  $scope.checkSubscriberExists = function(user) {
    if (currentUser.id == user.id ) {
       $scope.user_subscribed = true;
    } else if ($scope.received_subscriptions != null) {
      for (var i = 0; i < $scope.received_subscriptions.length; i++) {
        if ($scope.received_subscriptions[i].subscriber_id == currentUser.id) {
          $scope.user_subscribed = true;
        }
      }
    } else {
       $scope.user_subscribed = false
    }
  }

  $scope.addTag = function() {
    TagService.addTaggingToTag( $scope.newTag.name, $scope.profile.id, "Profile")
    .then( function(response){
      $scope.tags.push(response.tag);
    });

    $scope.newTag = {name: ""};
  };

  // Actually only deletes that particular TAGGING, not the tag itself
  $scope.deleteTag = function(tag_id) {
    TagService.removeTaggingFromTag(tag_id, $scope.profile.id, "Profile")
    .then( function(response) {

      var len = $scope.tags.length;
      for (var i = 0; i < len ; i++) {
        if ($scope.tags[i].id == response.id) {
           $scope.tags.splice(i, 1);
           i = $scope.tags.length + 1 ;
        }
      }
      // var idx = $scope.tags.indexOf(response);
      // $scope.tags.splice(idx, 1);

    });
  };

  $scope.openFileWindow = function () {
    angular.element( document.querySelector( '#fileUpload' ) ).trigger('click');
  };

  $scope.uploadImage = function (path) {
   // if updating profile
    if ($scope.profile.id) {
      // do put request
      Restangular.one('profiles', $scope.profile.id).customPUT({
        profile: {
          avatar: $scope.profile.imageData
        }
      }).then( function (result) {
        $scope.avatar = $scope.avatar + '?' + new Date().getTime();
      }, function (error) {
        console.error('errors', JSON.stringify(errors));
      });
    };
  };

}])
