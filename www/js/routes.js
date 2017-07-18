var smokeRoutes = angular.module('smokeRoutes', [])

// WP api endpoint
var api = 'http://smoke.media/wp-json/wp/v2'

// ROUTES
smokeRoutes.config(function($stateProvider, $urlRouterProvider){
  // Send us back to the home route if we get lost
  $urlRouterProvider.otherwise('/home');
  $stateProvider
    // Home route
    .state('home', {
      url: '/home',
      templateUrl: 'views/home.html',
      controller: 'homeController'
    })
    // Single article view
    .state('single', {
      url: '/post/:slug',
      templateUrl: 'views/single.html',
      controller: 'singleController',
      // Get the data before displaying the view
      resolve: {
        post: function($stateParams, wpData){
          return wpData.getSinglePost($stateParams.slug);
        }
      }
    })
    // Category view
    .state('category', {
      url: '/category/:id',
      templateUrl: 'views/category.html',
      controller: 'categoryController',
    });
})
