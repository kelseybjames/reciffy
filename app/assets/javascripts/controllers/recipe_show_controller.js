reciffy.controller( 'RecipeShowCtrl',
  [
    '$scope',
    '$state',
    '$stateParams',
    'Restangular',
    'RecipeService',
    'madeRecipeService',
    'savedRecipeService',
    'currentUser',
    'TagService',
    function(
      $scope,
      $state,
      $stateParams,
      Restangular,
      RecipeService,
      madeRecipeService,
      savedRecipeService,
      currentUser,
      TagService) {

  $scope.disabledStatus   = true;
  $scope.makeRecipe       = false;

  RecipeService.setUnits();
  RecipeService.setIngredients();
  RecipeService.setMadeRecipes();
  savedRecipeService.callAllSavedRecipes();
  $scope.currentStuff = RecipeService.getCurrentStuff();
  $scope.currentUser = currentUser;
  RecipeService.setCurrentRecipe($stateParams.id, currentUser).then(
    function(recipe) {
      $scope.recipe = recipe;
    },
    function() {
      console.log("error in setting current recipe");
    }
  );

  $scope.units = RecipeService.getUnits();
  $scope.ingredients = RecipeService.getIngredients();
  $scope.photo = {};

  //Recipe Ingredients Added

  $scope.r_unit = ""
  $scope.r_quantity = ""
  $scope.r_ingredient = ""

  TagService.callAllTags();
  $scope.tags = TagService.getTags();
  $scope.newTag = {name: ""};

  $scope.getDisabledStatus = function() {
    return RecipeService.getdisabledStatus();
  }

  $scope.makeRecipeIngredient = function() {
    $scope.makeRecipe = !$scope.makeRecipe;
  }

  $scope.getMakeRecipeIngredient = function() {
    return $scope.makeRecipe ;
  }

  $scope.createComment = function() {
    RecipeService.addComment();
  }

  $scope.commentDeletable = function(comment) {
    return comment.user_id == currentUser.id;
  }

  $scope.deleteComment = function(comment) {
    if ( $scope.commentDeletable(comment) ) {
      RecipeService.removeComment(comment);
    }
  }

  $scope.addTag = function() {
    // RecipeService.addTag();
    TagService.addTaggingToTag( $scope.newTag.name, $scope.currentStuff.recipe.id, "Recipe")
    .then( function(response){
      $scope.currentStuff.recipe.taggings.push(response.tagging)
    });
    $scope.newTag = {name: ""};
  }

  // Actually only deletes that particular TAGGING, not the tag itself
  $scope.deleteTag = function(tag_id) {
    // RecipeService.removeTag(tag_id);
    TagService.removeTaggingFromTag(tag_id, $scope.currentStuff.recipe.id, "Recipe")
    .then( function(response) {
      var idx = $scope.currentStuff.recipe.taggings.indexOf(response.taggings)
      $scope.currentStuff.recipe.taggings.splice(idx, 1)
    });
  }

  $scope.addMadeRecipe = function(recipe) {
    madeRecipeService.create(recipe)
    $scope.currentStuff.show_recipe_made = true
  }

  $scope.checkMadeRecipeExists = function(recipe) {
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

      $scope.r_unit = "";
      $scope.r_quantity = "";
      $scope.r_ingredient = "";
    }
  };

  $scope.addRecipeIngredient = function() {
    if (!RecipeService.getdisabledStatus()) {
      if ($scope.r_unit.title) {
          $scope.r_unit = $scope.r_unit.title
      } else {
          $scope.r_unit = $scope.r_unit.originalObject
      }

      if ($scope.r_ingredient.title) {
          $scope.r_ingredient = $scope.r_ingredient.title
      } else {
          $scope.r_ingredient = $scope.r_ingredient.originalObject
      }

      var ri = {
        //unit_id: $scope.r_unit,
        ingredient_name: $scope.r_ingredient,
        unit_type: $scope.r_unit,
        quantity: $scope.r_quantity
      }
      RecipeService.addRecipeIngredient(ri);

      $scope.r_unit = {};
      $scope.r_quantity = "";
      $scope.r_ingredient = "";
    }
  };

  $scope.deleteRecipe = function() {
    RecipeService.deleteRecipe();
  };

  $scope.forkRecipe = function(recipe) {
    RecipeService.forkRecipe(recipe,currentUser);
  };

  $scope.submitRating = function() {
    RecipeService.rateRecipe();
  };

  $scope.openFileWindow = function () {
    angular.element( document.querySelector( '#fileUpload' ) ).trigger('click');
  };

  $scope.uploadImage = function () {
    if ($scope.recipe.id) {
      Restangular.all('photos').post({
        photo: {
          photo: $scope.photo.imageData,
          recipe_id: $scope.recipe.id
        }
      }).then(
      function (newPhoto) {
        $scope.currentStuff.recipe.photos.push(newPhoto);
      }, function (error) {
        // Error
        console.error(error);
      });
    };
  };


 // Here is a naive implementation for matching first name, last name, or full name
  $scope.localUnitSearch = function(str) {
    var matches = [];

    $scope.units.forEach(function(unit) {
      if ((unit.unit_type.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0))  {
        matches.push(unit.unit_type);
      }
    });
    if (matches.length == 0) {
       matches.push(str);
    }
    return matches;
  };

  $scope.createSavedRecipe = function(recipeId, userId) {
    savedRecipeService.createSavedRecipe(recipeId, userId);
  }

  $scope.showSaveButton = function(recipeId, userId) {
    return !savedRecipeService.savedRecipeStatus(recipeId, userId);
  }

}]);
