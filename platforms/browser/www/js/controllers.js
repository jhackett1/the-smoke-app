var smokeControllers = angular.module('smokeControllers', [])

// CONTROLLERS
.controller('homeController', function($scope, $http, wpData, $state){
  $scope.loading = true;
  // Call the WP service
  wpData.getPosts().then(function(posts) {
    $scope.posts = posts;
    $scope.loading = false;
  });
  $scope.viewName = 'home';
  // Wait for view to be ready, then make it swipable
  angular.element(document).ready(function(){
    // Register swipe gestures
    swipable('main.home', openMenu, closeMenu);
    swipable('nav', null, closeMenu);
    pullToReload('main.home', 3, $scope.reload)
  })
  // The reload method
  $scope.reload = function(){
    $scope.posts = null;
    $scope.loading = true;
    wpData.getPosts().then(function(posts) {
      $scope.posts = posts;
      $scope.loading = false;
    });
  }
})

// Fetch post by slug from WP
.controller('singleController', function($scope, $http, $stateParams, post, $compile){
  $scope.post = post;
  $scope.viewName = 'single';
  // Wait for view to be ready, then make it swipable
  angular.element(document).ready(function(){
    swipable('main.single', function() {
      window.history.back();
    });
  });
  // Sharin'
  var options = {
    message: 'Take a look at this Smoke story: ', // not supported on some apps (Facebook, Instagram)
    subject: $scope.post.title.rendered, // fi. for email
    url: $scope.post.link,
    chooserTitle: 'Share this story' // Android only, you can override the default share sheet title
  }
  $scope.share = function(){
    window.plugins.socialsharing.shareWithOptions(options);
  }

})

// Fetch posts of category from WP
.controller('categoryController', function($scope, $http, $stateParams, wpData){
  $scope.loading = true;
  // Load in JSON file to interpret category names from IDs
  $http.get('js/categories.json').then(function(res){
    $scope.category = res.data[$stateParams.id];
  })
  // Call the WP service
  wpData.getCategoryPosts($stateParams.id).then(function(posts) {
    $scope.posts = posts;
    $scope.loading = false;
  });
  // Register swipe gestures when view is ready
  angular.element(document).ready(function(){
    swipable('main.category', function() {
      window.history.back();
    });
    pullToReload('main.category', 3, $scope.reload)
  })
  // The reload method
  $scope.reload = function(){
    $scope.posts = null;
    $scope.loading = true;
    wpData.getCategoryPosts($stateParams.id).then(function(posts) {
      $scope.posts = posts;
      $scope.loading = false;
    });
  }
  $scope.viewName = 'category';
})

// Fetch now-playing info for the radio player
.controller('radioController', function($scope, $http, radioData){
  // Function to control playback and media notification
  $scope.playPause = function(){
    var audio = document.getElementById('radio-audio');
    var button = document.querySelector('#radio-control i');
    if (!audio.paused){

      audio.pause();
      // Rip out and replace the src attribute to abort the otherwise infinite download
      var tempSrc = audio.src;
      audio.src = '';
      audio.src = tempSrc;
      button.classList = "fa fa-play fa-3x";
      // Destroy the notification
      MusicControls.destroy({});
    } else {
      audio.play();
      button.classList = "fa fa-pause fa-3x";
      // Create the notification
      MusicControls.create({
        track: $scope.radio.title,
        artist: "Smoke Radio",
        cover: $scope.radio.icon,
        isPlaying   : true,
        hasPrev   : false,
        hasNext   : false,
        hasClose  : false,
        ticker	  : "You're listening to Smoke Radio - London's student sound"
      });

      function events(action) {
        const message = JSON.parse(action).message;
      	switch(message) {
      		case 'music-controls-pause':
      			// Do something
            audio.pause();
            var tempSrc = audio.src;
            audio.src = '';
            audio.src = tempSrc;
            button.classList = "fa fa-play fa-3x";
            MusicControls.updateIsPlaying(false);
      			break;
      		case 'music-controls-play':
      			// Do something
            audio.play();
            button.classList = "fa fa-pause fa-3x";
            MusicControls.updateIsPlaying(true);
      			break;
      		case 'music-controls-media-button' :
      			// Do something
      			break;
      		default:
      			break;
      	}
      }
      // Register callback
      MusicControls.subscribe(events);
      // Start listening for events
      MusicControls.listen();
    };






  };






  // Function to grab metadata from radio data API
  $scope.nowPlaying = function(){
    // Call the radio data service
    radioData.nowPlaying().then(function(info) {
      // Set the data in the scope
      if (info.success == 1) {
        $scope.radio = info.show;
      } else {
        // If there is no show, supply dummy data
        $scope.radio = {
          title: "Smoke Jukebox",
          short_desc: "The best tracks from Smoke Radio's catalogue.",
          icon: 'assets/smokeradio.png'
        }
      }
      // If there is no icon, give the dummy icon
      if ($scope.radio.icon == null){
        $scope.radio.icon = 'assets/smokeradio.png';
      }
    });
  }
  // Initial populate
  $scope.nowPlaying();
  // Reload data every ten minutes
  setInterval(function(){
    $scope.nowPlaying();
  },300000)
});
