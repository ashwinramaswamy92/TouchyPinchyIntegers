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
let towerPair = new VisualIntegers();

function setup() {
  createCanvas(800, 600);
  renderBuffer = createGraphics(800, 600);
  
  //Listening for touch events and preventing the default behaviors - scrolling, screenshot, etc.
  preventDefaultTouchEvents();


  //Buttons for testing
  incrementPositiveButton = createButton('+1');
  incrementPositiveButton.position(10, 30);
  incrementPositiveButton.mousePressed(towerPair.initiateIncrementPositive);

  incrementNegativeButton = createButton('-1');
  incrementNegativeButton.position(50, 30);
  incrementNegativeButton.mousePressed(towerPair.initiateIncrementNegative);
  

  pinchInButton = createButton('Pinch In');
  pinchInButton.position(150, 30);
  pinchInButton.mousePressed(towerPair.initiatePinchIn);

  
  pinchOutButton = createButton('Pinch Out');
  pinchOutButton.position(250, 30);
  pinchOutButton.mousePressed(towerPair.initiatePinchOut);

  
  flipButton = createButton('Flip');
  flipButton.position(350, 30);
  flipButton.mousePressed(towerPair.initiateFlip);
}

function draw() {
  background(230);

  //Draw line across screen
  stroke(0);
  strokeWeight(2);
  line(0, height / 2, width, height / 2);

  //Tracking number of units on each side

  //Interaction

  //Drawing on each side

  towerPair.renderPositive();
  towerPair.renderNegative();

  //Animations
  if (currentlyAnimating.INCREMENTING_POSITIVE) {
    console.log("Incrementing Positive")

    towerPair.incrementPositive();
  }
  if (currentlyAnimating.INCREMENTING_NEGATIVE) {
    console.log("Incrementing Negative")
    towerPair.incrementNegative();
  }

  if(currentlyAnimating.FLIPPING){
    towerPair.flip();
  }

  
  if(currentlyAnimating.PINCHING_IN){
    console.log("PINCHING INN")
    towerPair.pinchIn();
  }

  if(currentlyAnimating.PINCHING_OUT){
    console.log("PINCHING OUT")

    towerPair.pinchOut();
  }

}

