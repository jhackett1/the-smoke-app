// Grab the element to become swipe sensitive, the proportion of the element's height that the user needs to cover to activate the callback, and the callback action
function swipable(draggableArea, directionTo, actionCallback){
  // Keep track of these vars
  let touchstartX;
  let touchstartY;
  // Grab the DOM element
  var draggable = document.querySelector(draggableArea);
  // Calculate critical distances to trigger action
  var criticalX = draggable.clientWidth/2;
  var criticalY = draggable.clientHeight/2;
  // When the user touches the screen, listen for a touch event to begin
  draggable.addEventListener('touchstart', function(event) {
    // Record the starting position of a touch
    touchstartX = event.touches[0].clientX;
    touchstartY = event.touches[0].clientY;
    // Listen for touch movements
    function onMove(event){
      // Record current touch position
      touchposX = event.touches[0].clientX;
      touchposY = event.touches[0].clientY;
      // If the swipe exceeds critical distance in the specified direction, fire callback and stop the event listener
      if (directionTo == "right") {
        if ((touchposX-touchstartX) > criticalX) {
          actionCallback();
          draggable.removeEventListener('touchmove', onMove);
        }
      } else if(directionTo == "left"){
        if ((touchstartX-touchposX) > criticalX) {
          actionCallback();
          draggable.removeEventListener('touchmove', onMove);
        }
      }
    }
    draggable.addEventListener('touchmove', onMove);
  // End touchstart listener
  });
// End function
};



// PULL TO TRIGGER RELOAD

function pullReload(loaderElement, draggableElement, finalAction){
  // Get the loader
  var loader = document.querySelector(loaderElement);
  var draggable = document.querySelector(draggableElement);
  // Key variable to keep track of
  let touchStart;
  let criticalDist = draggable.clientHeight/3;
  // Listen out for a touch event
  draggable.addEventListener('touchstart', function(event) {
    // Record the starting position of a touch
    touchStart = event.touches[0].clientY;

    if(draggable.scrollTop == 0){
      // See if the user is swiping with the touchmove event
      draggable.addEventListener('touchmove', function(event) {
        // Record the current position of the touch
        touchPos = event.touches[0].clientY;
        swipeDist = touchPos-touchStart;
        // Move the loader under swipe
        if (swipeDist < criticalDist && swipeDist > 0) {
          if (draggable.style.overflow !== 'hidden') {
            draggable.style.overflow = 'hidden';
          }
          loader.style.transform = "translate3d(0px, " + (swipeDist/2) + "px, 0px) rotate3d(1,0,0," + (swipeDist/criticalDist) + "deg)"
        }
      });
      // See if the user is swiping with the touchmove event
      draggable.addEventListener('touchend', function(event) {
        // Record the current position of the touch
        touchPos = event.changedTouches[0].clientY;
        swipeDist = touchPos-touchStart;
        // If the swipe has pulled far enough, trigger the action function
        if (swipeDist>criticalDist) {
          finalAction();
        } else {
              loader.style.transform = "translate3d(0px, 0px, 0px) rotate3d(0,0,0,1deg)"
        }
        draggable.style.overflow = '';
        draggable.removeEventListener('touchmove', arguments.callee);
        draggable.removeEventListener('touchend', arguments.callee);
      });
    }




  });
};
