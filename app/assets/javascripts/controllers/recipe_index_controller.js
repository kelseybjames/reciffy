reciffy.controller( 'RecipeIndexCtrl', [
  'Auth',
  '$scope',
  '$state',
  '$stateParams',
  'Restangular',
  'RecipeService',
  'madeRecipeService',
  'topRecipeService',
  'trendingRecipeService',
  'RecommendationService',
  'TagService',
  'UserService',
  'currentUser',
  'RecentRecipeService',
  '$filter',
  '$rootScope',
  function(
    Auth,
    $scope,
    $state,
    $stateParams,
    Restangular,
    RecipeService,
    madeRecipeService,
    topRecipeService,
    trendingRecipeService,
    RecommendationService,
    TagService,
    UserService,
    currentUser,
    RecentRecipeService,
    $filter,
    $rootScope) {

  $scope.currentUser = currentUser;

  topRecipeService.callTopRecipes();
  trendingRecipeService.callTrendingRecipes();
  RecommendationService.populateRecommendations();
  UserService.setUsers();

  $scope.recipes = $rootScope.recipes || RecipeService.getRecipes();
  $scope.topRecipes =  topRecipeService.getTopRecipes();
  $scope.trendingRecipes =  trendingRecipeService.getTrendingRecipes();
  $scope.recentRecipes = RecentRecipeService.getRecipes();
  $scope.recdRecipes = RecommendationService.getRecommendations();

  TagService.callAllTags();
  $scope.tags = TagService.getTags();

  $scope.$on('$routeChangeSuccess', function (event, current, previous) {
    console.log(previous);
    console.log(current);
    console.log('route changed');
    $scope.recipes = RecipeService.getRecipes();
    $scope.topRecipes =  topRecipeService.getTopRecipes();
    $scope.trendingRecipes =  trendingRecipeService.getTrendingRecipes();
    $scope.recentRecipes = RecentRecipeService.getRecipes();
    $scope.recdRecipes = RecommendationService.getRecommendations();
  });

  //Display max images in the row for category
  $scope.max = 4;

  // Horizontal Scrolling for Main Categories
  //The current page of the category (horizontal scrolling)
  $scope.page = {};
  $scope.page["recentRecipes"] = 0;
  $scope.page["topRecipes"] = 0;
  $scope.page["recdRecipes"] = 0;
  $scope.page["trendingRecipes"] = 0;

  //Max displays per category page (horizontal scrolling)
  $scope.max = 4;

  //Gets the array/object length of the recipe category
  $scope.getCategoryLength = function(category) {
    category = $scope[category];
    if (typeof eval(category) == "object") {
      return Object.keys(category).length;
    } else {
      return eval(category).length;
    }
  }

  //Gets the current page of the recipe category
  $scope.getThisPage = function(category) {
    return $scope.page[category];
  }

  $scope.getPageEnd = function(category) {
    return ($scope.getThisPage(category) * $scope.max) + $scope.max
  }

  $scope.getPageBegin = function(category) {
    return $scope.getThisPage(category) * $scope.max
  }

  //Sets the next page of the recipe category
  $scope.setNextPage = function(category,page) {
    $scope.page[category] += page;
  }

  $scope.moveRight = function(category) {
    var len = $scope.getCategoryLength(category);
    var page = $scope.getThisPage(category);
    var lastRec = (page * $scope.max) + $scope.max;
    if (lastRec < len) {
      $scope.setNextPage(category, 1);
    }
  }

  $scope.moveLeft = function(category) {
    var page = $scope.getThisPage(category);
    var firstRec = (page * $scope.max);
    if (firstRec > 0) {
      $scope.setNextPage(category, -1);
    }
  }

  $scope.disableLeftScrollButton = function(category) {
    return $scope.getPageBegin(category) === 0;
  };

  $scope.disableRightScrollButton = function(category) {
    var len = $scope.getCategoryLength(category);
    var page = $scope.getThisPage(category);
    var lastRec = (page * $scope.max) + $scope.max;
    return lastRec >= len;
  };

  // Horizontal scrolling for tags
  $scope.taggingsMoveRight = function(tag) {
    var taggings = $filter('filter')(tag.taggings, { taggable_type: "Recipe" })
    var len = taggings.length;
    var page = $scope.getThisPage(tag.name);
    var lastRec = (page * $scope.max) + $scope.max;
    if (lastRec < len) {
      $scope.setNextPage(tag.name, 1);
    }
  };

  $scope.taggingsMoveLeft = function(tag) {
    var page = $scope.getThisPage(tag.name);
    var firstRec = (page * $scope.max);
    if (firstRec > 0) {
      $scope.setNextPage(tag.name, -1);
    }
  };

  $scope.taggingsDisableLeftButton = function(tag) {
    return $scope.getPageBegin(tag.name) === 0;
  };

  $scope.taggingsDisableRightButton = function(tag) {
    var taggings = $filter('filter')(tag.taggings, { taggable_type: "Recipe" })
    var len = taggings.length;
    var page = $scope.getThisPage(tag.name);
    var lastRec = (page * $scope.max) + $scope.max;
    return lastRec >= len;
  };

  $scope.numLoaded = 0;
  $scope.tagLimit = 0;

  $scope.loadMore = function() {
    var idList = Object.keys( $scope.tags );
    if ($scope.tagLimit < idList.length) {
      var loadedTag = $scope.tags[ idList[ $scope.tagLimit ] ];
      $scope.page[ loadedTag.name ] = 0;
      $scope.tagLimit += 1;
    }
  };

  $scope.recipeTagging = function(tagging) {
    return tagging.taggable_type === "Recipe";
  }

  $scope.anyTaggings = function(tag) {
    taggingsNoUsers = [];

    for ( var t = 0; t < tag.taggings.length; t++ ) {
      if ( tag.taggings[t].taggable_type === "Recipe" ) {
        taggingsNoUsers.push(tag.taggings[t]);
      }
    }

    return taggingsNoUsers.length > 0;
  }

}]);
