function swipable(swipableElement, actionLeft, actionRight, actionDown, actionUp){
  // Initial variables
  var touchstartX = 0;
  var touchstartY = 0;
  var touchendX = 0;
  var touchendY = 0;
  var touchdifX = 0;
  var touchdifY = 0;
  // Grab the DOM element so we can make it magic
  var gesturedZone = document.querySelector(swipableElement);
  // Grab coordinates of touch start event
  gesturedZone.addEventListener('touchstart', function(event) {
      touchstartX = event.touches[0].pageX;
      touchstartY = event.touches[0].pageY;
  }, false);
  // When the touch ends
  gesturedZone.addEventListener('touchend', function(event) {
      // Grab coordinates of touch end event
      touchendX = event.changedTouches[0].pageX;
      touchendY = event.changedTouches[0].pageY;
      // Calculate the degree of motion along each axis
      touchdifX = Math.abs(touchendX-touchstartX);
      touchdifY = Math.abs(touchendY-touchstartY);
      // Work out the action
      handleGesture();
  }, false);

  // Work out which direction the swipe was in and act accordingly
  function handleGesture() {
      // On swipe from left
      if (
        // Was there leftward motion in the swipe?
        touchendX > touchstartX && actionLeft &&
        // Was the primary motion greater than any motion on the transverse axis
        parseInt(touchdifX) > parseInt(touchdifY)) {
          actionLeft();
      }
      // On swipe from right
      if (
        touchendX < touchstartX && actionRight &&
        // Was the primary motion greater than any motion on the transverse axis
        parseInt(touchdifX) > parseInt(touchdifY)) {
          actionRight();
      }
      if (
        touchendY > touchstartY && actionUp &&
        // Was the primary motion greater than any motion on the transverse axis
        parseInt(touchdifX) < parseInt(touchdifY)) {
          actionUp();
      }
      if (
        touchendY < touchstartY && actionDown &&
        // Was the primary motion greater than any motion on the transverse axis
        parseInt(touchdifX) < parseInt(touchdifY)) {
          actionDown();
      }
  }
}



// Grab the element to become swipe sensitive, the proportion of the element's height that the user needs to cover to activate the callback, and the callback action
function pullToReload(element, criticalPercent, callbackAction){
  // Vars to keep track
  var touchstartY = 0;
  var willFire = false;
  // Grab the DOM element
  var draggable = document.querySelector(element);
  // When the user touches the screen, listen up
  draggable.addEventListener('touchstart', function(event) {
    // Record the starting position of a touch
    touchstartY = event.touches[0].clientY;
    // See if the user is swiping with the touchmove event
    draggable.addEventListener('touchmove', function(event) {
      // If we're not at the top of the scrollable container, do nothing
      if (draggable.scrollTop > 0){return;}
      // Grab the touch coordinates object
      touchPos = event.touches[0].clientY;
      // How far must the user drag for the action to trigger, as a proportion of the element height
      criticalDist = (draggable.clientHeight)/criticalPercent;
      // Work out how far the user has dragged
      if (touchPos > (touchstartY+criticalDist)) {
        willFire = true;
      } else {
        willFire = false;
      }
    });
    // When the touch ends, check if the user's finger travelled far enough to trigger the callback
    draggable.addEventListener('touchend', function(event) {
      if (willFire) {
        callbackAction();
        // Reset the var for next time
        willFire = false;
      }
    });
  });
};
