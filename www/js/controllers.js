var smokeControllers = angular.module('smokeControllers', [])

// CONTROLLERS
.controller('offlineController', function($scope, $state){
  // Method to reconnect to WP API and radio on click
  $scope.reconnect = function(){
    // Reload current view
    $state.reload()
  }
})

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
    swipable('main.home', 'right', openMenu);
    swipable('main.home', 'left', closeMenu);
    swipable('nav', 'left', closeMenu);
    // pullReload('ul.post-grid', 'main.home', $scope.reload);
  })
  // The reload method
  $scope.reload = function(){
    $scope.loading = true;
    $scope.posts = false;
    wpData.getPosts().then(function(posts) {
      document.querySelector('ul.post-grid').style.transform = "translate(0px) rotate(0deg)";
      $scope.posts = posts;
      $scope.loading = false;
    });
  }
})

// Fetch post by slug from WP
.controller('singleController', function($scope, $http, $stateParams, post){
  $scope.post = post;
  $scope.viewName = 'single';
  // Wait for view to be ready, then make it swipable
  angular.element(document).ready(function(){
    swipable('main.single', 'right', function() {
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
    swipable('main.category', 'right', function() {
      window.history.back();
    });
    // pullReload('ul.post-grid', 'main.category', $scope.reload)
  })
  // The reload method
  $scope.reload = function(){
    $scope.loading = true;
    $scope.posts = null;
    wpData.getCategoryPosts($stateParams.id).then(function(posts) {
      document.querySelector('ul.post-grid').style.transform = "translate(0px)";
      $scope.posts = posts;
      $scope.loading = false;
    });
  }
  $scope.viewName = 'category';
})

// Schedule controllers
.controller('scheduleController', function($scope, $stateParams, schedule, $state, radioData){
  // Make the data available in scope
  $scope.schedule = schedule;
  $scope.viewName = 'schedule';
  // Register swipe gestures when view is ready
  angular.element(document).ready(function(){
    swipable('main.schedule', 'left', function() {
      $state.go('home')
    });
  })
  // The reload method
  $scope.reload = function(){
    $scope.schedule = false;
    radioData.getSchedule().then(function(posts) {
      $scope.schedule = posts;
      $state.reload();
    });
  }
})
.controller('scheduleDayController', function($scope, $stateParams){
  // Get the day as a zero-indexed integer, where 0=Sunday and 6=Saturday
  var date = new Date();
  var day = date.getDay();
  var hour = date.getHours();
  // Function to take an array of shows (one schedule day) and make it a sensible format, with local fallbacks
  function prettify(uglyShows){
    // Blank array to store all the pretty shows
    let prettyShows = new Array;
    // Loop over every show in the given day
    for (var i = 0; i < uglyShows.length; i++) {
      // Object to hold a new pretty show
      let show = new Object;
      // Start adding key-value pairs to the object
      show.title = uglyShows[i].title;
      show.tx_time = uglyShows[i].tx_time.substring(0,5);
      show.short_desc = uglyShows[i].short_desc;
      if (parseInt(uglyShows[i].tx_time.substring(0,2)) == hour) {
        show.on_now = true;
      }
      // Local fallback if no icon
      if (uglyShows[i].icon !== null) {
        show.icon = uglyShows[i].icon;
      } else{
        show.icon = 'assets/smokeradio.png';
      }
      // Add this show to the growing array of pretty shows
      prettyShows.push(show);
    }
    // Pass out the new array of pretty shows
    return prettyShows;
  }
  // Supply the right day of shows based on the current day
  if ($stateParams.day == "tomorrow") {
    $scope.daySchedule = prettify($scope.schedule[day+1]);
  } else {
    $scope.daySchedule = prettify($scope.schedule[day]);
  }
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
