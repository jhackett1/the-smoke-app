var smokeProviders = angular.module('smokeProviders', [])

// Interacting with the radio data API
.service('radioData', function($http, $q){
  // NOW PLAYING METHOD
  this.nowPlaying = function(){
    // Set up the promise
    var deferred = $q.defer();
    // Make the HTTP request
    $http
      .get('http://marconi.smokeradio.co.uk/api/now_playing.php')
      .then(function(res){
        // On success
        deferred.resolve(res.data);
      }, function(data){
        // On error
        console.error(data.status + " Error: couldn't access the Radio Data API");
      });
      return deferred.promise;
  }
})

// Interacting with the Wordpress API
.service('wpData', function($http, $q){
  // HOMEPAGE METHOD
  this.getPosts = function(){
    // Set up promise
    var deferred = $q.defer();
    // Make the request
    $http
      .get(api + '/posts/')
      .then(function(res){
        // On success
        // Resolve the promise
        deferred.resolve(res.data);
      }, function(data){
        // On error
        console.error(data.status + " Error: couldn't access the WP API");
      });
      // Return the promised value
    return deferred.promise;
  }
  // SINGLE ARTICLE METHOD
  this.getSinglePost = function(slug){
    // Set up promise
    var deferred = $q.defer();
    // Make the request
    $http
      .get(api + '/posts?slug=' + slug)
      .then(function(res){
        // On success
        // Resolve the promise
        deferred.resolve(res.data[0]);
      }, function(data){
        // On error
        console.error(data.status + " Error: couldn't access the WP API");
      });
      // Return the promised value
    return deferred.promise;
  }
  // CATEGORY METHOD
  this.getCategoryPosts = function(id){
    // Set up promise
    var deferred = $q.defer();
    // Make the request
    $http
      .get(api + '/posts?per_page=11&categories=' + id)
      .then(function(res){
        // On success
        // Resolve the promise
        deferred.resolve(res.data);
      }, function(data){
        // On error
        console.error(data.status + " Error: couldn't access the WP API");
      });
      // Return the promised value
    return deferred.promise;
  }
})
