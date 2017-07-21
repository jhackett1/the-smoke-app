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
    // See if the user is swiping with the touchmove event
    draggable.addEventListener('touchmove', function(event) {
      // Record the current position of the touch
      touchPos = event.touches[0].clientY;
      swipeDist = touchPos-touchStart;
      // Move the loader under swipe
      if (swipeDist < criticalDist && swipeDist > 0) {
            loader.style.transform = "translateY(" + (swipeDist/2) + "px)"
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
        draggable.removeEventListener('touchmove', arguments.callee);
      } else {
            loader.style.transform = "translateY(0px)"
      }
      draggable.removeEventListener('touchend', arguments.callee);
    });
  });
};
