reciffy.factory('horizontalScrollService', ['Restangular', function(Restangular) {

  var obj = {};
  var page = {};

  obj.setCategoryPages = function (category_array) {
    for (var i = 0; i < category_array.length; i++) {
       page[category_array[i]] = 0;
    }
  }

  //Gets the array/object length of the recipe category
  obj.getCategoryLength = function(categoryObj) {
    if (typeof eval(categoryObj) == "object") {
      return Object.keys(categoryObj).length;
    } else {
      return eval(categoryObj).length;
    }
  }

  //Gets the current page of the recipe category
  obj.getThisPage = function(category) {
    return page[category];
  }

  obj.getPageEnd = function(category,max) {
    return (obj.getThisPage(category) * max) + max;
  }

  obj.getPageBegin = function(category,max) {
    var pagebegin = obj.getThisPage(category) * max;
    return pagebegin;
  }

  //Sets the next page of the recipe category
  obj.setNextPage = function(category,pageIncrementBy) {
    page[category] += pageIncrementBy;
  }

  obj.moveRight = function(categoryObj,category,max) {
    var len = obj.getCategoryLength(categoryObj);
    var page = obj.getThisPage(category);
    var lastRec = (page * max) + max;
    if (lastRec < len) {
      obj.setNextPage(category, 1);
    }
  }

  obj.moveLeft = function(category,max) {
    var thisPage = obj.getThisPage(category);
    var firstRec = (thisPage * max);
    if (firstRec > 0) {
      obj.setNextPage(category, -1);
    }
  }

  obj.disableLeftScrollButton = function(category,max) {
    return obj.getPageBegin(category,max) === 0 ? true : false;
  };

  obj.disableRightScrollButton = function(categoryObj,category,max) {
    var len = obj.getCategoryLength(categoryObj);
    var page = obj.getThisPage(category);
    var lastRec = (page * max) + max;
    return lastRec >= len ? true : false;
  };

  //------------------------------------
  //Taggings
  // Horizontal scrolling for tags
  obj.getTaggingsLength = function(taggings) {
    var recipesForTag = 0;
    for (var tagging in taggings) {
      if (taggings[tagging].taggable_type == "Recipe") {
        recipesForTag++;
      }
    }
    return recipesForTag;
  };

 obj.taggingsMoveRight = function(taggings,taggingName,max) {
    var len = obj.getTaggingsLength(taggings);
    var thisPage = obj.getThisPage(taggingName);
    var lastRec = (thisPage *max) + max;
    if (lastRec < len) {
      obj.setNextPage(taggingName, 1);
    }
  };

  obj.taggingsMoveLeft = function(taggingName,max) {
    var thisPage = obj.getThisPage(taggingName);
    var firstRec = (thisPage * max);
    if (firstRec > 0) {
      obj.setNextPage(taggingName -1);
    }
  };

  obj.taggingsDisableLeftButton = function(taggingName) {
    return obj.getPageBegin(taggingName) === 0 ? true : false;
  };

  obj.taggingsDisableRightButton = function(taggings,taggingName,max) {
    var len = $scope.getTaggingsLength(taggings);
    var thisPage = $scope.getThisPage(taggingName);
    var lastRec = (thisPage * max) + max;
    return lastRec >= len ? true : false;
  };
  //Taggigs
//------------------------------------

  return obj;
}]);
