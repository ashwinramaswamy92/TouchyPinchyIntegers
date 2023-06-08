/*
CONCEPTS AND TERMS:

1. A 'Tower Pair' is one coupled pair of positive tower and negative tower - we so far 
are writing operations to act on a single tower pair.

2. A 'Block' represents either a +1 or a -1. The number of blocks on each side of a tower pair is
stored in TowerPair.currentPostitiveUnits and TowerPair.currentNegativeUnits.

3. The 'State' of the system can be represented by the number of units on each side, as long as
there is only a single tower pair representing the whole equation. 
So conceptually (not necessarily implemented in code, but useful to think of it this way): 
  a. State(towerPair) = {towerPair.currentPostitiveUnits, towerPair.currentNegativeUnits}
  b. State(whole system) = {State(towerPair) for all towerPairs}

4. The 'Division Line' is the visual line that separates positive and negative sides of the screen.

5. An 'Operation' is a leads to a change of state of the system.
Therefore, if there is a single tower pair, the operation is applied to the tower pair.
But if there are multiple tower pair, a single operation might have to operate on multiple tower pairs.

OPERATIONS
The following operations are to be built:
  a. Increment(n, side): increment positive or negative side by n. So adds either a +n or -n to the expression.
  This is implemented with unit increments via initiateIncrementPositive or initiateIncrementNegative.
  Called by touching with n fingers.
  b. Flip(): Multiplies expression by -1.
  all positive blocks across all towers switch to negative and vice versa.
  Called by swiping across division line.
  c. Subtract(n, side): removes n blocks from either the positive or negative side.
  d. Neutralize(): Removes a +1 and a -1 from the system. Does nothing to the overall expression.
  Called by pinching in.
  e. ReverseNeutralize(): Adds a +1 and a -1 to the system. Does nothing to the overall expression.
  Called by pinching out.




5. Animations represent transitions between states.


ANIMATION FLOW CONTROL LOGIC:
Most animations are associated with a mathematical operation on the integer expression.
This means that there needs to be a change of state at the end of the animation.



TOUCH FUNCTIONS:

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

