reciffy.factory('UserService', ['Restangular', '$state', function(Restangular, $state) {

  var _users = {};

  var setUsers = function() {
    Restangular.all('users').getList()
    .then(function(users) {
      for (var u = 0; u < users.length; u++ ) {
        _users[users[u].id] = users[u];
      }
    })
  };

  var setOneUser = function(userId) {
    if ( !_users[userId] ) {
      Restangular
      .one('users', userId)
      .get()
      .then( function(user) {
        _users[user.id] = user;
      })
    }
  }

  var getUsers = function() {
    return _users;
  };

  var getOneUser = function(userId) {
    return _users[userId];
  };

  return {
    getUsers: getUsers,
    setUsers: setUsers,
    setOneUser: setOneUser,
    getOneUser: getOneUser
  };
}])
