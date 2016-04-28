reciffy.factory('TagService', ['Restangular', 'RecipeService', 'UserService', function(Restangular, RecipeService, UserService) {

  // An object to hold the tags which have been retrieved from the API
  var _tags = {};

  // Get the tag storage object
  var getTags = function() {
    return _tags;
  }

  // API call all the tags (for index page)
  var callAllTags = function() {
    Restangular
    .all('tags')
    .getList()
    .then( function(tags) {
      for ( var t = 0; t < tags.length; t++ ) {
        _tags[tags[t].id] = tags[t];
      }
    })
  }

  // API call one tag, if not already loaded
  var callOneTag = function(tag_id) {
    if ( !_tags[tag_id] ) {
      Restangular
      .one('tags', tag_id)
      .get()
      .then( function(tag) {
        _tags[tag.id] = tag;
        _loadAssociations(tag);
      });
    } else {
      _loadAssociations(_tags[tag_id])
    }
  };

  // Find one tag by the name (among loaded tags, for search)
  var findTagByName = function(tagName) {
    var temp;
    for (var tag in _tags) {
      temp = _tags[tag];
      if (temp) {
        if (tagName == temp.name) {
          return temp;
        }
      }
    }
  };

  // Load associated recipes, to ensure they are loaded for display
  var _loadAssociations = function(tag) {
    for ( var t = 0; t < tag.taggings.length; t++ ) {
      var type = tag.taggings[t].taggable_type
      var id = tag.taggings[t].taggable_id

      if (type === "Recipe") {
        RecipeService.setOneRecipe(id);
      }
      if (type == "Profile") {
        UserService.setOneUser(id);
      }
    }
  }

  var addTaggingToTag = function(name, taggable_id, taggable_type) {
    var promise = Restangular
    .all('tags')
    .post({   name: name,
              taggable_id: taggable_id,
              taggable_type: taggable_type });

    promise.then( function(response) {
      var newTag = response.tag;
      var newTagging = response.tagging;
      if ( _tags[newTag.id] ) {
        _tags[newTag.id].taggings.push(newTagging);
      } else {
        _tags[newTag.id] = newTag;
      }
    });

    return promise;
  };

  var removeTaggingFromTag = function(tag_id, taggable_id, taggable_type) {
    var promise = Restangular
    .one("tags", tag_id)
    .remove({ taggable_id: taggable_id,
              taggable_type: taggable_type });

    promise.then(function(response) {
      if (_tags[tag_id]) {

        var deletedTag = response.tag;
    
        var idx = _tags[tag_id].taggings.indexOf(response.tagging);

        _tags[tag_id].taggings.splice(idx, 1);

        if ( _tags[tag_id].taggings.length < 1 ) {
          delete _tags[tag_id];
        }
      }
    });

    return promise;
  };

  return {
    callAllTags: callAllTags,
    callOneTag: callOneTag,
    findTagByName: findTagByName,
    getTags: getTags,
    addTaggingToTag: addTaggingToTag,
    removeTaggingFromTag: removeTaggingFromTag,
  }

}]);
