reciffy.factory('RecipeService', ['Restangular', '$state', '$stateParams', function(Restangular, $state, $stateParams) {
  var _recipes = {};
  var _units = [];
  var _ingredients = [];
  var _made_recipes = {};
  var _photos = [];

  var _current = {
    recipe: {},
    tag: {name: "", recipe_id: null},
    comment: {comment_description: "", recipe_id: null},
    disabledStatus: true,
    show_recipe_made: false,
    rating: {rating: 0, recipe_id: null},
  };

  var checkRecipeMade = function(recipe) {
    _current.show_recipe_made = false;
    if (_made_recipes[recipe.id]) {
        _current.show_recipe_made = true;
    }
  };

  var setOneRecipe = function(recipe_id) {
    if ( !_recipes[recipe_id] ) {
      Restangular
      .one('recipes', recipe_id)
      .get()
      .then( function(recipe) {
        _recipes[recipe.id] = recipe;
      })
    }
  };

  var setMadeRecipes = function() {
    Restangular
    .all('made_recipes')
    .getList()
    .then( function(allMadeRecipes) {
      for( var i = 0; i < allMadeRecipes.length; i++ ) {
        _made_recipes[allMadeRecipes[i].recipe_id] = allMadeRecipes[i].user_id
      }
    });
  };

  var setIngredients = function() {
    Restangular
    .all('ingredients')
    .getList()
    .then( function(ingredients) {
      _ingredients.length = 0;
      for( var i = 0; i < ingredients.length; i++ ) {
        _ingredients.push(ingredients[i]);
      }
    });
  };

  var setUnits = function() {
    _units = [];
    return Restangular
    .all('units')
    .getList()
    .then( function(units) {
      for( var u = 0; u < units.length; u++ ) {
        _units.push(units[u]);
      }
    });
  };

  var setPhotos = function(recipe_id) {
    Restangular
    .one('recipes', recipe_id)
    .all('photos')
    .getList()
    .then( function(photos) {
      _photos = photos;
    })
  };

  var getPhotos = function() {
    return _photos;
  };

  var newRecipe = function() {
    _current.recipe = {};
  };

  var getRecipes = function() {
    return _recipes;
  };

  var getUnits = function() {
    return _units;
  };

  var getIngredients = function() {
    return _ingredients;
  };

  var getMadeRecipes = function() {
    return _made_recipes;
  };

  var getComment = function() {
    return _current.comment;
  };

  var addRecipe = function(recipe) {
    _recipes.push(recipe);
  };

  var _setCurrents = function(recipe_id, currentUser) {
    _current.recipe = _recipes[recipe_id];

    _current.disabledStatus = ( currentUser.id != _recipes[recipe_id].user_id );
     checkRecipeMade(_recipes[recipe_id])

    _current.comment.recipe_id = recipe_id;
    _current.tag.recipe_id = recipe_id;
    _current.rating.recipe_id = recipe_id;

    if ( _current.recipe.ratings ) {
      for ( var r = 0; r < _current.recipe.ratings.length; r++) {
        if ( _current.recipe.ratings[r].user_id === currentUser.id ) {
          _current.rating.rating = _current.recipe.ratings[r].rating;
          _current.rating.id = _current.recipe.ratings[r].id;
          break;
        }
      }
    }
  };

  var setCurrentRecipe = function( recipe_id, currentUser ) {
    _clearSubLists();

      return _requestSingleRecipe(recipe_id, currentUser).then(
        function() {
          return getCurrentRecipe();
        }
      );

  };

  var _clearSubLists = function() {
    _current.rating.rating = 0;
    _current.rating.recipe_id = null;
    _current.rating.id = null;
  }

  var _requestSingleRecipe = function(recipe_id, currentUser) {
    return Restangular
    .one('recipes', recipe_id)
    .get()
    .then( function(recipe) {
      _recipes[recipe.id] = recipe;
      _setCurrents(recipe.id, currentUser);
      setMadeRecipes(currentUser);
    });
  };

  var addRecipe = function(recipe) {
    _recipes[recipe.id] = recipe;
  };

  var deleteRecipe = function() {
    if ( !_current.disabledStatus ) {
      Restangular
      .one( 'recipes', _current.recipe.id )
      .remove()
      .then( function(recipe) {
        delete _recipes[ recipe.id ];
        $state.go('reciffy.recipes.all');
      }, function(error) {
        console.error(error);
      })
    }
  };

  var getCurrentRecipe = function() {
    return _current.recipe;
  };

  var getdisabledStatus = function() {
    return _current.disabledStatus;
  };

  var getCurrentStuff = function() {
    return _current;
  };

  var addComment = function() {
    Restangular
    .one("recipes", _current.recipe.id)
    .all("comments")
    .post(_current.comment)
    .then( function(comment) {
      _current.recipe.comments.unshift(comment);
      _current.comment.comment_description = "";
    });
  };

  var removeComment = function(comment) {
    Restangular
    .one("recipes", _current.recipe.id)
    .one("comments", comment.id)
    .remove()
    .then(function(deletedComment) {

      var len = _current.recipe.comments.length;
      for (var i = 0; i < len ; i++) {
        if (_current.recipe.comments[i].id == deletedComment.id) {
            _current.recipe.comments.splice(i, 1);
            break;
        }
      }
      console.log(_current.recipe.comments);
    });
  };

  var addTag = function() {
    Restangular
    .all('tags')
    .post(_current.tag, {  taggable_id: _current.recipe.id,
                            taggable_type: "Recipe" })
    .then( function(newTag) {
      _current.recipe.tags.unshift(newTag);
      _current.tag.name = "";
    });
  };

  // Actually only deletes that particular TAGGING, not the tag itself, but goes through the tag controller
  var removeTag = function(tag_id) {
    Restangular
    .one("tags", tag_id)
    .remove({ taggable_id: _current.recipe.id,
              taggable_type: "Recipe"})
    .then(function(deletedTag) {
      var idx = _current.recipe.tags.indexOf(deletedTag);
      _current.recipe.tags.splice(idx, 1);
    });
  };

  var rateRecipe = function() {
    if ( _current.rating.id ) {
      Restangular.one("ratings", _current.rating.id)
      .patch({rating: _current.rating})
      .then(function(response) {
        _current.rating = response;
      }, function(error) {
        console.error(error);
      });
    } else {
      Restangular.all("ratings")
      .post({rating: _current.rating})
      .then(function(response) {
        _current.rating = response;
      }, function(error) {
        console.error(error);
      });
    }

  }

  var updateRecipe = function() {
    recipe = getCurrentRecipe()
    Restangular
     .one('recipes', recipe.id)
     .patch({recipe})
     .then(function(newRecipe) {
        // Success
    })
  };

  var makeRecipeIngredient = function() {

  };

  var addRecipeIngredient = function(recipe_ingredient) {
    recipe = getCurrentRecipe()
    recipe_ingredient["recipe_id"] = recipe.id

    var fractQuant = new Fraction( recipe_ingredient['quantity'] );
    recipe_ingredient["quantity"] = fractQuant.n / fractQuant.d;

    return Restangular.all('recipe_ingredients')
          .post(recipe_ingredient)
          .then(
             function(response)  {
               recipe.recipe_ingredients.unshift(response);
             },
             function(response)  {
               alert("Recipe Ingredient not added! Please fill out required Quantity, Units and Ingredient");
             }
          );
    }

  var removeRecipeIngredient = function(ri) {
    Restangular
    .one("recipe_ingredients", ri.id)
    .remove()
    .then(function(deletedRecipeIngredient) {
      var length = _current.recipe.recipe_ingredients.length
      for ( var i = 0; i < length; i++ ) {
        if ( _current.recipe.recipe_ingredients[i]
          && deletedRecipeIngredient
          && _current.recipe.recipe_ingredients[i].id === deletedRecipeIngredient.id ) {
          _current.recipe.recipe_ingredients.splice(i, 1);
        }
      }
    })
  };

  var forkRecipe = function(recipe, currentUser) {
    var newRecipe = {
      name: recipe.name,
      description:  recipe.description,
      instructions: recipe.instructions,
      prep_time:    recipe.prep_time,
      cook_time:    recipe.cook_time,
      original_id:  recipe.user_id,
      user_id: currentUser.id
    };

    ingredients = recipe.recipe_ingredients;

    Restangular
    .all('recipes')
    .post(newRecipe)
    .then( function(forkedRecipe) {

      _recipes[forkedRecipe.id] = forkedRecipe;
      _setCurrents(forkedRecipe.id, currentUser );
      _recipes[forkedRecipe.id].recipe_ingredients = [];

      for(var i = 0;i < ingredients.length; i++) {
        var ri = {unit_id: ingredients[i].unit_id,
                  ingredient_id: ingredients[i].ingredient_id,
                  quantity: ingredients[i].quantity,
        };
        addRecipeIngredient(ri)
      }

       $state.go('reciffy.recipes.show', {id: forkedRecipe.id});
    });
  }

  return {
    setOneRecipe: setOneRecipe,
    getRecipes: getRecipes,
    setUnits:   setUnits,
    setMadeRecipes: setMadeRecipes,
    getUnits:   getUnits,
    getMadeRecipes: getMadeRecipes,
    setIngredients: setIngredients,
    getIngredients: getIngredients,
    setCurrentRecipe: setCurrentRecipe,
    getCurrentRecipe: getCurrentRecipe,
    addComment: addComment,
    removeComment: removeComment,
    addTag: addTag,
    removeTag: removeTag,
    getComment: getComment,
    getCurrentStuff: getCurrentStuff,
    getdisabledStatus: getdisabledStatus,
    rateRecipe: rateRecipe,
    updateRecipe: updateRecipe,
    removeRecipeIngredient: removeRecipeIngredient,
    makeRecipeIngredient: makeRecipeIngredient,
    addRecipeIngredient: addRecipeIngredient,
    forkRecipe: forkRecipe,
    deleteRecipe: deleteRecipe,
    addRecipe: addRecipe,
    setPhotos: setPhotos,
    getPhotos: getPhotos
  };
}]);
