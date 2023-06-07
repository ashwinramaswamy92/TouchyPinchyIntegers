/*
To do:
1. Pinch should only decrease each side by one.
2. Flip is a single operation -> multiplies entire expression by -1.
3. Flipping animation -> flip via third axis, simultaneously. Swap colors after.
4. Auto-zoom to accomodate larger integers -> grid lines to show magnitudes - with checkbox to toggle.

*/

let currentObjectIndex = -1;
let objectList = [];
let lastTouchTime = 0;
let dragObject = null;

function setup() {
  createCanvas(800, 600);
  renderBuffer = createGraphics(800, 600);
  
  //Listening for touch events and preventing the default behaviors - scrolling, screenshot, etc.
  preventDefaultTouchEvents();
}

function draw() {
  background(220);

  //Draw line across screen
  stroke(0);
  strokeWeight(2);
  line(0, height / 2, width, height / 2);

  //Tracking number of units on each side

  //Interaction

  //Drawing on each side
  for (let i = 0; i < objectList.length; i++) {
    let object = objectList[i];
    object.renderPositive();
    object.renderNegative();
  }

  console.log(objectList);

  //Animations
  if (currentlyAnimating.INCREMENTING_POSITIVE) {
    objectList[0].incrementPositive();
  }
  if (currentlyAnimating.INCREMENTING_NEGATIVE) {

  }

  if(currentlyAnimating.FLIPPING){
    
  }
}

