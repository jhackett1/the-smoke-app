// Grab the element to become swipe sensitive, the proportion of the element's height that the user needs to cover to activate the callback, and the callback action
function swipable(draggableArea, directionTo, actionCallback){
  // Keep track of these vars
  var touchstartX;
  var touchstartY;
  // Grab the DOM element
  var draggable = document.querySelector(draggableArea);
  // Calculate critical distances to trigger action
  var criticalX = draggable.clientWidth/3;
  var criticalY = draggable.clientHeight/4;
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

      // If the swipe exceeds critical distance in the specified direction, AND desired motion greater than transverse motion, fire callback and stop the event listener
      if (directionTo == "right") {
        if ((touchposX-touchstartX) > criticalX && (touchposX-touchstartX) > (Math.abs(touchposY-touchstartY))) {
          actionCallback();
          draggable.removeEventListener('touchmove', onMove);
        }
      } else if(directionTo == "left"){
        if ((touchstartX-touchposX) > criticalX && (touchstartX-touchposX) > (Math.abs(touchposY-touchstartY))) {
          actionCallback();
          draggable.removeEventListener('touchmove', onMove);
        }
      } else if (directionTo == "down") {
        if ((touchposY-touchstartY) > criticalY  && (touchposY-touchstartY) > (Math.abs(touchposX-touchstartX))) {
          actionCallback();
          draggable.removeEventListener('touchmove', onMove);
        }
      } else if(directionTo == "up"){
        if ((touchstartY-touchposY) > criticalY  && (touchstartY-touchposY) > (Math.abs(touchposX-touchstartX))) {
          actionCallback();
          draggable.removeEventListener('touchmove', onMove);
        }
      }

      function cleanUp(){
        draggable.removeEventListener('touchmove', onMove);
        draggable.removeEventListener('touchend', cleanUp);
      }
      draggable.addEventListener('touchend', cleanUp);
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
  var spinner = document.querySelector('#loader')
  // Key variable to keep track of
  var touchStart;
  var criticalDist = draggable.clientHeight/3;
  // Listen out for a touch event
  draggable.addEventListener('touchstart', function(event) {
    // Record the starting position of a touch
    touchStart = event.touches[0].clientY;
    // Don't do anything unless we're at the top of the element
    if(draggable.scrollTop == 0){
      // On move
      var swipeDist;
      // Animation functions
      function stepAnim(){
        loader.style.transform = "translate3d(0px," + swipeDist/2 + "px,0px) rotate3d(1,0,0," + (swipeDist/criticalDist) + "deg)";
        spinner.style.opacity = (swipeDist/criticalDist);
        spinner.style.setProperty ("display", "block", "important");
        draggable.style.overflow = 'hidden';
      }
      function resetAnim(){
        loader.style.transform = "translate3d(0px,0px,0px) rotate3d(1,0,0,0deg)";
        spinner.style.opacity = "";
        spinner.style.display = "";
        draggable.style.overflow = '';
      }
      function onMove(event){
        // Record current position
        touchPos = event.touches[0].clientY;
        // Calculate the distance of the swipe
        swipeDist = touchPos-touchStart;
        // Animate if swipeDist is between zero and critical distance
        if (swipeDist < criticalDist && swipeDist > 0) {
          window.requestAnimationFrame(stepAnim);
        }
      }
      draggable.addEventListener('touchmove', onMove);

      // On release
      function onEnd(event){
        touchEnd = event.changedTouches[0].clientY;
        finalSwipe = touchEnd-touchStart;
        // Trigger event if we pulled far enough
        if (finalSwipe > criticalDist) {
          finalAction();
        }
        // Reset animation
        window.requestAnimationFrame(resetAnim);
        // Clear up
        draggable.removeEventListener('touchend', onEnd);
        draggable.removeEventListener('touchmove', onMove);
      }
      draggable.addEventListener('touchend', onEnd);
    }
  });
};
