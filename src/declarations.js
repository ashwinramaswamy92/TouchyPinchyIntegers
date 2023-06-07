



//----------------------ANIMATIONS-----------------------------------//

//To keep track of which animation is currently occuring. false for each animation by default - set to true when you need to.
let currentlyAnimating = {
  INCREMENTING_POSITIVE: false,
  INCREMENTING_NEGATIVE: false,
  SUBTRACTING_POSITIVE: false,
  SUBTRACTING_NEGATIVE: false,
  PINCHING_IN: false,
  FLIPPING: false,
  PINCHING_OUT: false,
  ZOOMING_OUT: false,
  ZOOMING_IN: false,
  DRAGGING: false
}


//----------------------OPERATIONS------------------------------------//

let currentPositiveSubtrahend;
let currentNegativeSubtrahend;