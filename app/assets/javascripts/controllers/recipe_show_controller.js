reciffy.controller( 'RecipeShowCtrl',
                    [ '$scope', '$state', '$stateParams', 'Restangular', 'RecipeService', 'madeRecipeService','currentUser', 'allMadeRecipes',
                    function($scope, $state, $stateParams, Restangular, RecipeService, madeRecipeService, currentUser,allMadeRecipes) {


  $scope.disabledStatus   = true;
  $scope.makeRecipe       = false;

  RecipeService.setUnits();
  RecipeService.setIngredients();
  RecipeService.setMadeRecipes(allMadeRecipes);

  RecipeService.setCurrentRecipe( $stateParams.id, currentUser );

  $scope.currentStuff = RecipeService.getCurrentStuff();
  $scope.recipe = RecipeService.getCurrentRecipe();

  $scope.tags = RecipeService.getTags();
  $scope.comments = RecipeService.getComments();
  $scope.units = RecipeService.getUnits();
  $scope.ingredients = RecipeService.getIngredients();

  //Recipe Ingredients Added

  $scope.r_unit = ""
  $scope.r_quantity = ""
  $scope.r_ingredient = ""

  // Star Ratings
  $scope.max = 5;
  $scope.isReadonly = false;

  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
  };

  $scope.ratingStates = [{
    stateOn: 'glyphicon-ok-sign',
    stateOff: 'glyphicon-ok-circle'
  }, {
    stateOn: 'glyphicon-star',
    stateOff: 'glyphicon-star-empty'
  }, {
    stateOn: 'glyphicon-heart',
    stateOff: 'glyphicon-ban-circle'
  }, {
    stateOn: 'glyphicon-heart'
  }, {
    stateOff: 'glyphicon-off'
  }];

  $scope.$watch('rate', function(val) {
    function success(data) {
      console.log(data);
    };

    function error(response) {
      console.log(response)
      alert("Can't post " + response.data + " Error:" + response.status);
    }

    if (val) {
      var data = {
        rating: val,
        user: "userId" // I'm not sure where is your userId

      }

      $http.post("yourUrl", data).then(success, error);
    }
  })

  $scope.getDisabledStatus = function() {
    return RecipeService.getdisabledStatus();
  }

  $scope.makeRecipeIngredient = function() {
    $scope.makeRecipe = !$scope.makeRecipe;
    console.log(!$scope.makeRecipe)
  }

  $scope.getMakeRecipeIngredient = function() {
    return $scope.makeRecipe ;
  }

  $scope.createComment = function() {
    RecipeService.addComment();
  }

  $scope.deleteComment = function(comment_id) {
    RecipeService.removeComment(comment_id);
  }

  $scope.addTag = function() {
    RecipeService.addTag();
  }

  // Actually only deletes that particular TAGGING, not the tag itself
  $scope.deleteTag = function(tag_id) {
    RecipeService.removeTag(tag_id);
  }

  $scope.addMadeRecipe = function(recipe) {
    madeRecipeService.create(recipe)
    $scope.currentStuff.show_recipe_made = true
  }

  $scope.checkMadeRecipeExists = function(recipe) {
    console.log("In here " + RecipeService.getRecipeMadeStatus(recipe,currentUser))
    return RecipeService.getRecipeMadeStatus(recipe,currentUser)  
  }

  $scope.updateMainRecipe = function() {
    if (!RecipeService.getdisabledStatus()) {
      RecipeService.updateRecipe();
    }
  };

  $scope.deleteRecipeIngredient = function(ri) {
    if (!RecipeService.getdisabledStatus()) {
       RecipeService.removeRecipeIngredient(ri);
    }
  };

  $scope.addRecipeIngredient = function() {
    if (!RecipeService.getdisabledStatus()) {
      var ri = {unit_id: $scope.r_unit,
                ingredient_id: $scope.r_ingredient,
                quantity: $scope.r_quantity
      }
      RecipeService.addRecipeIngredient(ri);
    }
  }

  $scope.forkRecipe = function(recipe) {
    RecipeService.forkRecipe(recipe);
  };

  $scope.submitRating = function() {
    RecipeService.rateRecipe();
  };

}]);
