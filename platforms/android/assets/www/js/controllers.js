var smokeControllers = angular.module('smokeControllers', [])

// CONTROLLERS
.controller('offlineController', function($scope, $state){
  // Method to reconnect to WP API and radio on click
  $scope.reconnect = function(){
    // Reload current view
    $state.reload()
  }
})

.controller('homeController', function($scope, $http, wpData, $state, $rootScope){
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
    pullReload('ul.post-grid', 'main.home', $scope.reload);

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
.controller('singleController', function($scope, $http, $stateParams, post, $sce){
  $scope.post = post;
  $scope.content = $sce.trustAsHtml(post.content.rendered);
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
    pullReload('ul.post-grid', 'main.category', $scope.reload);
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
    var prettyShows = new Array;
    // Loop over every show in the given day
    for (var i = 0; i < uglyShows.length; i++) {
      // Object to hold a new pretty show
      var show = new Object;
      // Start adding key-value pairs to the object
      show.title = uglyShows[i].title;
      show.tx_time = uglyShows[i].tx_time.substring(0,2) + ":" + uglyShows[i].tx_time.substring(2,4);
      show.desc = uglyShows[i].desc;
      if (parseInt(uglyShows[i].tx_time.substring(0,2)) == hour && $stateParams.day == "today") {
        show.on_now = true;
      }
      // Local fallback if no icon
      if (uglyShows[i].icon_thumb !== false) {
        show.icon_thumb = uglyShows[i].icon_thumb;
      } else{
        show.icon_thumb = 'assets/noicon.jpg';
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
.controller('radioController', function($scope, $http, radioData, $rootScope){
  $scope.loading = false;


  $scope.playPause = function(){
    var audio = document.getElementById('radio-audio');
    var button = document.querySelector('#radio-control i');

    if (audio.paused) {
      // Turn on the loading spinner
      $scope.loading = true;
      // Change the icon
      button.classList.remove('fa-play');
      button.classList.add('fa-pause');
      // Make the play request
      audio.play();

      // On successful play
      audio.addEventListener('playing', function playSuccess(){
        // Turn off the spinner
        $scope.loading = false;
        // Remove the listener
        audio.removeEventListener('playing', playSuccess);
        // Make sure the app knows we're ONLINE
        $rootScope.offline = false;
        // Force the view to update
        $scope.$applyAsync();
        // Create notification
        MusicControls.create({
          track: $scope.radio.title,
          artist: "Smoke Radio",
          cover: $scope.radio.icon_thumb,
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
              button.classList.remove('fa-pause');
              button.classList.add('fa-play');
              MusicControls.updateIsPlaying(false);
              break;
            case 'music-controls-play':
              // Do something
              audio.play();
              button.classList.remove('fa-play');
              button.classList.add('fa-pause');
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
      })

    } else {
      // On pause
      audio.pause();
      // Rip out and replace source attribute, "stopping" the player
      var tempSrc = audio.src;
      audio.src = '';
      audio.src = tempSrc;
      // Change icon
      button.classList.remove('fa-pause');
      button.classList.add('fa-play');
      // Destroy notification
      MusicControls.destroy({});
    }
  }





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
          desc: "The best tracks from Smoke Radio's catalogue.",
          icon_thumb: 'assets/smokeradio.png'
        }
      }
      // If there is no icon, give the dummy icon
      if ($scope.radio.icon_thumb == false){
        $scope.radio.icon_thumb = 'assets/smokeradio.png';
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
