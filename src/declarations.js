
//----------------------------- GRAPHICS --------------------------------------//

let positiveTowerColor;
let negativeTowerColor;
let expressionColor;

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

let SPEED = {
  flipping : 0.05,
  disappearing : 25/255,
}


//----------------------OPERATIONS------------------------------------//

let currentSubtrahend;
let numberOfTaps;