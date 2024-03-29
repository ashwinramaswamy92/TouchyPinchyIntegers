
//---------------------------- TOUCHSCREEN -----------------------------------//

//Tracking Variables
let lastTapTime;
let lastTapSide = 0;  //+1 or -1 depending on which side you tap it
let isPreparingToTap = false; //Boolean set to true when a tap is registered. Falsified if a swipe or pinch is detected thereafter.
let preparedTapIncrements = [0, 0]; //2 element array, first one is for positive taps prepped, second is for negative.

let pinchedInThisCycle;
let pinchedOutThisCycle;
let swipedUpDownThisCycle;
let swipedLeftRightThisCycle;

let lastPinchedTime;    //To prevent multiple simultaneous Pinches
let blockPinch = false; //Boolean that controls whether one ought to pinch
let attemptingSameSidePinch = false;   //Similar to blockPinch, but distinct to avoid unexpected interactions.

let swipeHits = []; //Array of coordinate arrays - stores downsampled swipe trajectory points' XY

//Constants
const tapDelay = 425; //Delay in MS before tap is registered
const hitBoxAccuracy = 0.5;
const swipeHitResolution = 60; //Number of points interpolated between start and end of swipe for which we check hitbox
const pinchThreshold = 0.7;


//----------------------------- GRAPHICS --------------------------------------//

let positiveTowerColor;
let negativeTowerColor;
let newPositiveBlockFill;
let newNegativeBlockFill;
let dividingLineColor;
let theBlockSize = 40;

let expressionTextSize = 28;


//----------------------ANIMATIONS-----------------------------------//

//To keep track of which animation is currently occuring. false for each animation by default - set to true when you need to.
let currentlyAnimating = {
  INCREMENTING_POSITIVE: false,
  INCREMENTING_NEGATIVE: false,
  SUBTRACTING: false,
  FLIPPING: false,
  PINCHING_IN: false,
  PINCHING_OUT: false,
  ZOOMING_OUT: false,
  ZOOMING_IN: false,
  DRAGGING: false
}

const SPEED = {
  incrementing: 25,
  flipping : 0.05,
  disappearing : 25/255,
}


//----------------------OPERATIONS------------------------------------//

let currentSubtrahend = 0;
let numberOfTaps;


let touchesStartCurrent;
let swipeEndCurrent;
