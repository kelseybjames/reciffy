var reciffy = angular.module('reciffy', [
  'ui.router',
  'restangular',
  'Devise',
  'xeditable',
  'ui.bootstrap',
  'angular.filter',
  'angular-input-stars',
  'ngFileUpload',
  'angucomplete-alt',
  'infinite-scroll'])
.config([ 'AuthProvider', function(AuthProvider) {
    // Configure Auth service with AuthProvider
}])
.controller('myCtrl', ['Auth', function(Auth) {
    // Use your configured Auth service.
}]);

// Underscore
reciffy.factory('_', ['$window', function($window) {
  return $window._; // assumes underscore has already been loaded on the page
}]);

// Restangular Configuration
reciffy.config( ['RestangularProvider', function(RestangularProvider) {
  RestangularProvider.setBaseUrl('/api/v1');
  RestangularProvider.setRequestSuffix('.json');
  RestangularProvider.setDefaultHttpFields({
    "content-type": "application/json"
  });
}]);

// UI Router
reciffy.config(['$urlRouterProvider', '$stateProvider',
  function($urlRouterProvider, $stateProvider){
    $stateProvider
    // Top level route
    .state("reciffy", {
      url: "",
      templateUrl: "templates/reciffy.html",
      controller: "ReciffyCtrl",
    })
    // Recipe umbrella route
    .state("reciffy.recipes", {
      url: "/recipes",
      template: "<div ui-view></div>",
      controller: "RecipeCtrl",
      resolve: {
        currentUser: ['Auth', function(Auth) {
          return Auth.currentUser();
        }]
      },
    })
    // Shows all recipes, sorted into categories
    .state("reciffy.recipes.all", {
      url: "/all",
      templateUrl: "templates/recipes.html",
      controller: "RecipeIndexCtrl",
      resolve: {
        currentUser: ['Auth', function(Auth) {
          return Auth.currentUser();
        }]
      },
    })
    // Shows recipes directly owned by current user
    .state("reciffy.recipes.my", {
      url: "/my",
      templateUrl: '/templates/my_recipe_layout.html',
      controller: 'MyRecipeCtrl',
      resolve: {
        currentUser: ['Auth', function(Auth) {
          return Auth.currentUser();
        }]
      },
    })
    // Shows recipes marked as "made" by current user
    .state("reciffy.recipes.made", {
      url: "/made",
      templateUrl: '/templates/made_recipe_layout.html',
      controller: 'MadeCtrl',
      resolve: {
        currentUser: ['Auth', function(Auth) {
          return Auth.currentUser();
        }]
      },
    })
    // All recipes saved by the current user
    .state("reciffy.recipes.saved", {
      url: "/saved",
      controller: "savedRecipeCtrl",
      templateUrl: "templates/saved.html"
    })
    // All recipes rated by the current user
    .state("reciffy.recipes.rated", {
      url: "/rated",
      controller: "ratedRecipeCtrl",
      templateUrl: "templates/rated.html"
    })
    // Shows a single recipe
    .state("reciffy.recipes.show", {
      url: "/:id",
      templateUrl: "templates/recipe.html",
      controller: "RecipeShowCtrl",
      resolve: {
        currentUser: ['Auth', function(Auth) {
          return Auth.currentUser();
        }]
      },
    })
    // Tags top level route
    .state("reciffy.tags", {
      url: "/tags",
      template: "<div ui-view></div>",
    })
    // Show recipes and user associated with a tag
    .state("reciffy.tags.show", {
      url: "/:id",
      templateUrl: "templates/tag.html",
      controller: "TagCtrl",
    })
    // Users
    .state("reciffy.users", {
      url: "/users",
      template: "<div ui-view></div>"
    })
    .state("reciffy.users.all", {
      url: '/all',
      templateUrl: "templates/users.html",
      controller: "UserIndexCtrl"
    })
    // Profile Page for Users
    .state("reciffy.users.show", {
      url: "/:id/profile",
      templateUrl: "templates/user_profile.html",
      controller: "UserShowCtrl",
      resolve: {
        currentUser: ['Auth', function(Auth) {
          return Auth.currentUser();
        }]
      },
    })
    // Subscriptions
    .state("reciffy.subscriptions", {
      url: "/subscriptions",
      templateUrl: '/templates/subscription_layout.html',
      controller: 'SubscriptionCtrl',
      resolve: {
        currentUser: ['Auth', function(Auth) {
          return Auth.currentUser();
        }],
        allSubscriptions: ['Restangular', function(Restangular){
          return Restangular.all("subscriptions").getList().then(function(data){
              data;
          });
        }]
      },
    })
    // Search Results Route
    .state("reciffy.search", {
      url: "/search/:searchString",
      templateUrl: "/templates/search.html",
      controller: "searchResultCtrl"
    })
    $urlRouterProvider.otherwise('/recipes/all');
  }]);

// Xeditable in-place editing

reciffy.run(['editableOptions', function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}]);

// Infinite Scroll
angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 250);

// Show errors in the console
reciffy.run([ '$rootScope', '$location', 'Auth', function($rootScope, $location, Auth){
$rootScope.$on("$stateChangeError", console.error.bind(console));
}]);
