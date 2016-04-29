reciffy.controller( 'RecipeShowCtrl', [
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
      console.error("error in setting current recipe");
    }
  );

  $scope.units = RecipeService.getUnits();

  $scope.ingredients = RecipeService.getIngredients();
  $scope.photo = {};

  //Recipe Ingredients Added
  $scope.blank_value = ""

  $scope.r_quantity = "";
  $scope.r_unit = {
    name: ""
  };
  $scope.r_ingredient = {
    name: ""
  };

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
    TagService.addTaggingToTag( $scope.newTag.name, $scope.currentStuff.recipe.id, "Recipe")
    .then( function(response){
      $scope.currentStuff.recipe.taggings.push(response.tagging)
    });
    $scope.newTag = {name: ""};
  }

  // Actually only deletes that particular TAGGING, not the tag itself
  $scope.deleteTag = function(tag_id) {
    TagService.removeTaggingFromTag(tag_id, $scope.currentStuff.recipe.id, "Recipe")
    .then( function(response) {
      var len = $scope.currentStuff.recipe.taggings.length;
      for (var i = 0; i < len ; i++) {
        if ($scope.currentStuff.recipe.taggings[i].tag_id == response.id) {
            $scope.currentStuff.recipe.taggings.splice(i, 1);
            i = $scope.currentStuff.recipe.taggings.length + 1 ;
        }
      }
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

      $scope.r_unit.name = "";
      $scope.r_quantity = "";
      $scope.r_ingredient.name = "";
    }
  };

  $scope.addRecipeIngredient = function() {
    if (!RecipeService.getdisabledStatus()) {
      if ($scope.r_unit.title) {
        var r_unit = $scope.r_unit.title
      } else {
        var r_unit = $scope.r_unit.originalObject
      }

      if ($scope.r_ingredient.title) {
        var r_ingredient = $scope.r_ingredient.title
      } else {
        var r_ingredient = $scope.r_ingredient.originalObject
      }

      if (!r_ingredient || !r_unit || !$scope.r_quantity) {
        alert("Ensure recipe ingredient, quantity and units are not empty!")
      } else {
        var ri = {
          ingredient_name: r_ingredient,
          unit_type: r_unit,
          quantity: $scope.r_quantity
        }
        RecipeService.addRecipeIngredient(ri);
      }
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

  $scope.createSavedRecipe = function(recipeId, userId) {
    savedRecipeService.createSavedRecipe(recipeId, userId);
  }

  $scope.showSaveButton = function(recipeId, userId) {
    return !savedRecipeService.savedRecipeStatus(recipeId, userId);
  }

}]);
