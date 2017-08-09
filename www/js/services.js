var smokeProviders = angular.module('smokeProviders', [])

// Interacting with the radio data API
.service('radioData', function($http, $q, $rootScope){
  // NOW PLAYING METHOD
  this.nowPlaying = function(){
    // Set up the promise
    var deferred = $q.defer();
    // Make the HTTP request
    $http
      .get('http://smoke.media/wp-json/shows/now_playing')
      .then(function(res){
        // On success
        deferred.resolve(res.data);
      }, function(data){
        // On error
        console.error(data.status + " Error: couldn't access the Radio Data API");
      });
      return deferred.promise;
  }
  // Method to grab the schedule
  this.getSchedule = function(){
    var deferred = $q.defer();
    $http
      .get('http://smoke.media/wp-json/shows/schedule')
      .then(function(res){
        // On success
        var schedule = res.data;
        // Pass out the schedule data
        deferred.resolve(schedule);
        // Save the data to local storage
        window.localStorage.setItem('schedule', JSON.stringify(schedule));
      }, function(data){
        // On error
        console.error(data.status + " Error: couldn't access the Radio Data API");
        // Retrieve local data instead
        if (window.localStorage.getItem('schedule')) {
          deferred.resolve(JSON.parse(window.localStorage.getItem('schedule')));
          console.log('Cached data returned');
        };
      });
      return deferred.promise;
  }

})

// Interacting with the Wordpress API
.service('wpData', function($http, $q, $rootScope){

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
        $rootScope.offline = false;
        // Save the data to local storage
        window.localStorage.setItem('home-posts', JSON.stringify(res.data));
      }, function(data){
        // On error
        console.error(data.status + " Error: couldn't access the WP API");
        // Attempt to show cached data
        if (window.localStorage.getItem('home-posts')) {
          deferred.resolve(JSON.parse(window.localStorage.getItem('home-posts')));
          console.log('Cached data returned');
          $rootScope.offline = true;
        };

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
        $rootScope.offline = false;
      }, function(data){
        // On error
        console.error(data.status + " Error: couldn't access the WP API");
        // Attempt to show cached data
        if (window.localStorage.getItem('home-posts')) {
          var allPosts = JSON.parse(window.localStorage.getItem('home-posts'));
          // Get the right post from the cached data
          var thisPost = allPosts.filter(function(post){
            return post.slug == slug;
          })
          // Return the cached post
          deferred.resolve(thisPost[0]);
          $rootScope.offline = true;
        };
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
        $rootScope.offline = false;
      }, function(data){
        // On error
        console.error(data.status + " Error: couldn't access the WP API");
        $rootScope.offline = true;
      });
      // Return the promised value
    return deferred.promise;
  }
})
