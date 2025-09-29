//---------------------------------------- TOUCHSCREEN -------------------------------------------//
document.addEventListener('DOMContentLoaded', function () {
  var element = document.getElementById('swipe-container');
  var hammertime = new Hammer(element);

  element.addEventListener('touchstart', function (event) {
    prepareTap(event.touches, element);
    // console.log(event);
  });

  element.addEventListener('touchend', function (event) {
    //Reset pinch blocking when user removes finger
    blockPinch = false;
  });

  hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

  hammertime.on('swipeup', function (event) {
    // console.log(event);
    swipeEndCurrent = event;
    // printout('flip');
    swipedUpDownThisCycle = true;

    storedTouches.upDownSwipe = event.touches;  // Updating stored touch data, so it could be sent to backend if the action is triggered downstream.
  });
  hammertime.on('swipedown', function (event) {
    swipeEndCurrent = event;
    // printout('flip');
    swipedUpDownThisCycle = true;

    storedTouches.upDownSwipe = event.touches;  // Updating stored touch data, so it could be sent to backend if the action is triggered downstream.
  });

  hammertime.on('swipeleft', function (event) {
    swipeEndCurrent = event;
    // printout('subtract');
    swipedLeftRightThisCycle = true;

    storedTouches.sideSwipe = event.touches;  // Updating stored touch data, so it could be sent to backend if the action is triggered downstream.

  })

  hammertime.on('swiperight', function (event) {
    swipeEndCurrent = event;
    // printout('subtract');
    swipedLeftRightThisCycle = true;

    storedTouches.sideSwipe = event.touches;  // Updating stored touch data, so it could be sent to backend if the action is triggered downstream.

  })

  hammertime.get('pinch').set({ enable: true, threshold: pinchThreshold });

  hammertime.on('pinch', function (event) {
    //Pinching is blocked if a pinch action has already been registered before user removes their fingers, so one pinch can only lead to one action
    if (!blockPinch && !attemptingSameSidePinch) {
      if (event.scale < 1) {
        // printout('pinch in');
        pinchedInThisCycle = true;

        storedTouches.pinchIn = event.touches;  // Updating stored touch data, so it could be sent to backend if the action is triggered downstream.

      } else if (event.scale > 1) {
        // printout('pinch out');
        pinchedOutThisCycle = true;

        storedTouches.pinchOut = event.touches;  // Updating stored touch data, so it could be sent to backend if the action is triggered downstream.
      }
      blockPinch = true;
    }
  });
});

function prepareTap(touches, container) {

  //Set off a 'time bomb' for taps and records the time.
  isPreparingToTap = true;
  lastTapTime = millis();

  //For debugging, 


  //Record the number of taps: OBSELETE, We WISH TO MOVE TO A 2-d REPRESENTATATION.
  numberOfTaps = touches.length;
  // printout('tapped with ' + numberOfTaps + ' finger(s)');
  touchesStartCurrent = touches;

  //Re-initialize tap counter
  preparedTapIncrements = [0, 0];
  let allPositive = true;
  let allNegative = true;
  //Decode from position of each tap the side at which an increment must occur.
  for (let i = 0; i < touches.length; i++) {
    if (touches[i].clientY < (container.offsetHeight / 2)) {
      //This tap detected on top side, so prepare one more positive increment
      preparedTapIncrements[0] += 1;
      allNegative = false;
    } else {
      //This tap detected on bottom side, so prepare one more negative increment
      preparedTapIncrements[1] += 1;
      allPositive = false;
    }
  }

  if (!allNegative && !allPositive) {
    preparedTapIncrements = [0, 0];
    attemptingSameSidePinch = false;
  } else {
    attemptingSameSidePinch = true;
  }
}

function printout(myText) {
  var messageElement = document.getElementById('message');
  messageElement.textContent += myText;
}


function triggerTouchEvents() {
  //To trigger touch events if any detected in this cycle;
  if (pinchedInThisCycle) {
    //Defuse Bomb: Falsify the tapping flag to prevent that event
    isPreparingToTap = false;

    // printout("PINCHED IN");
    //Initiate operation
    if (towerPair.canPinchIn())  //check if there's at least one unit each side
      towerPair.initiatePinchIn();

    // sendTouchDataToBackend(storedTouches.pinchIn);
  }

  if (pinchedOutThisCycle) {
    //Defuse Bomb: Falsify the tapping flag to prevent that event
    isPreparingToTap = false;

    // printout("PINCHED OUT");
    //Initiate operation
    towerPair.initiatePinchOut();

    // sendTouchDataToBackend(storedTouches.pinchOut);
  }

  if (swipedUpDownThisCycle) {
    //Defuse Bomb: Falsify the tapping flag to prevent that event
    isPreparingToTap = false;

    // printout("SWIPED TO FLIP");
    //Initiate operation
    towerPair.initiateFlip(); //NOTE THIS HAS TO BE REWRITTEN TO ACCOUNT FOR DIFFERENT SWIPING ACTIONS.

    
    // sendTouchDataToBackend(storedTouches.upDownSwipe);
  }

  if (swipedLeftRightThisCycle) {

    //Defuse Bomb: Falsify the tapping flag to prevent that event
    isPreparingToTap = false;

    //Get the subtrahend based on swiping data
    currentSubtrahend = computeSubtrahend();  //defaults to 0 if no hit detected

    //Initiate operation
    if (currentSubtrahend != 0) {
      towerPair.initiateSubtract();
    }

    // sendTouchDataToBackend(storedTouches.sideSwipe);
  }

  //After all checks are done if tap preparation is still ongoing AND enough time has passed, BOOM 
  if (isPreparingToTap && (millis() - lastTapTime >= tapDelay)) {

    //Perform operation, ie do increments as needed
    if (preparedTapIncrements[0] > 0) {
      towerPair.initiateIncrementPositive();
    }
    if (preparedTapIncrements[1] > 0) {
      towerPair.initiateIncrementNegative();
    }

    //Bomb defuses after exploding
    isPreparingToTap = false;
    
    // sendTouchDataToBackend(storedTouches.taps);
  }

}

function resetTouchEvents() {
  //Reset touch variables 
  pinchedInThisCycle = false;
  pinchedOutThisCycle = false;
  swipedUpDownThisCycle = false;
  swipedLeftRightThisCycle = false;
}


function showTapAndSwipe() {
  //Visualise Tapping and Swiping Coordinates
  if (typeof (touchesStartCurrent) != 'undefined')
    for (let i = 0; i < touchesStartCurrent.length; i++) {
      ellipse(touchesStartCurrent[i].clientX, touchesStartCurrent[i].clientY, 20, 20)
    }

  //To see swipe coords FOR DEBUGGING
  if (typeof (swipeEndCurrent) != 'undefined') {
    //swipe end
    fill(120, 50, 140);
    ellipse(swipeEndCurrent.srcEvent.clientX, swipeEndCurrent.srcEvent.clientY, 20, 20);

    //Draw a line from start to end
    stroke(0);
    strokeWeight(1);
    // line(touchesStartCurrent[0].clientX, touchesStartCurrent[0].clientY, swipeEndCurrent.srcEvent.clientX, swipeEndCurrent.srcEvent.clientY)
  }

  //Show downsampled swipe points: For optimising swipeHitResolution, pick the lowest value such that
  //the points you see being traced with the loop below still fall within the appropriate hitboxes.
  for (let i = 0; i < swipeHits.length; i++) {
    fill(0);
    ellipse(swipeHits[i][0], swipeHits[i][1], 1, 1)
  }


  //Show the centers of hitboxes for subtraction
  let targets = towerPair.getBlockHeadTargetPositions();
  let radius = towerPair.getHitBoxRadius();
  for (let i = 0; i < targets.positive.length; i++) {
    ellipse(targets.positive[i].x, targets.positive[i].y, radius, radius);
  }

  for (let i = 0; i < targets.negative.length; i++) {
    ellipse(targets.negative[i].x, targets.negative[i].y, radius, radius);
  }
}



function computeSubtrahend() {
  //Use the swiping data to estimate which block is being cut across

  let swipeStartXY = [touchesStartCurrent[0].clientX, touchesStartCurrent[0].clientY];
  let swipeEndXY = [swipeEndCurrent.srcEvent.clientX, swipeEndCurrent.srcEvent.clientY];

  //Downsampling the idealized line between start and end according to swipeHitResolution
  swipeHits = [];
  for (let i = 0; i < swipeHitResolution; i++) {
    //Split the horizontal and vertical swipe distance into equal intervals
    let x = swipeStartXY[0] + i * (swipeEndXY[0] - swipeStartXY[0]) / swipeHitResolution;
    let y = swipeStartXY[1] + i * (swipeEndXY[1] - swipeStartXY[1]) / swipeHitResolution;

    swipeHits.push([x, y]);
  }

  //For each registered swipe point in swipeHits, check if it falls within any of the hitboxes.
  let targets = towerPair.getBlockHeadTargetPositions();
  let radius = towerPair.getHitBoxRadius();
  for (let i = 0; i < targets.positive.length; i++) {
    for (let j = 0; j < swipeHits.length; j++) {
      let dartXY = swipeHits[j];
      let targetXY = [targets.positive[i].x, targets.positive[i].y];

      //Check if the dart is within the target using distance formula and circle interior relationship
      if (sq(dartXY[0] - targetXY[0]) + sq(dartXY[1] - targetXY[1]) <= sq(radius)) {
        //HIT!

        // console.log("MUST SUBTRACT " + (i + 1));
        return i + 1;
      }
    }
  }

  for (let i = 0; i < targets.negative.length; i++) {
    for (let j = 0; j < swipeHits.length; j++) {
      let dartXY = swipeHits[j];
      let targetXY = [targets.negative[i].x, targets.negative[i].y];

      //Check if the dart is within the target using distance formula and circle interior relationship
      if (sq(dartXY[0] - targetXY[0]) + sq(dartXY[1] - targetXY[1]) <= sq(radius)) {
        //HIT!

        // console.log("MUST SUBTRACT " + (i + 1));
        return -1 * (i + 1);
      }
    }
  }
  return 0;   //If no luck, go home
}

//--------------------- SCOREKEEPING/EXPRESSION RENDERING -----------------------------------------//

function showDynamicExpression(x = width * 14 / 20, y = height / 2 - 2 * theBlockSize) {
  stroke(150)
  strokeWeight(1)
  // noStroke()
  // textFont('Helvetica');

  textFont(fancyFont)
  textSize(expressionTextSize);
  textAlign(LEFT, BOTTOM);

  let expressionString = towerPair.currentPositiveUnits + " + (-" + towerPair.currentNegativeUnits + ") "
  text(expressionString, x, y);
}





//----------------------- GRAPHICS--------------------------------------------------//
function renderDividingLine() {
  rectMode(CORNER);
  let dividerSize = 2;  //pixels of width (vertical) of dividing rod
  let startY = height / 2 - dividerSize / 2;

  //Main rod
  noStroke();
  fill(dividingLineColor)
  // line(0, height / 2, width, height / 2);
  rect(0, startY, width, dividerSize);
}

function renderGrid() {

  let numberOfGridLines = Math.ceil((height / 2) / theBlockSize);
  let numberFontSize = expressionTextSize / 2;
  let textX = towerPair.position[0] - theBlockSize;

  stroke(0);
  fill(0);
  strokeWeight(0.1);
  textSize(numberFontSize);
  textAlign(CENTER, CENTER);

  for (i = 1; i <= numberOfGridLines; i++) {
    //Draw grid lines on positive side of the dividing line
    let positiveLineY = height / 2 - i * theBlockSize;
    line(0, positiveLineY, width, positiveLineY);
    //Now write the number
    text(i, textX, positiveLineY);


    //Draw grid lines on negative side of the dividing line
    let negativeLineY = height / 2 + i * theBlockSize;
    line(0, negativeLineY, width, negativeLineY);
    //Now write the number
    text(-i, textX, negativeLineY);
  }

  //MARKING NUMBERS

  // let textX = width/2 - theBlockSize;

  stroke(0);
  textSize(numberFontSize);
  textAlign(CENTER, CENTER);

  //Mark the zero
  text(0, textX, height / 2);

  // //Mark until currentPositiveUnits or currentNegativeUnits on each side

  // for(i = 1; i <= towerPair.currentPositiveUnits; i++){

  // }

  // for(i = 1; i <= towerPair.currentNegativeUnits; i++){

  // }

}





//----------------MISC-------------------------------//


function preventDefaultTouchEvents() {
  window.addEventListener('touchmove', ev => {
    if (true) {  //In case we need to condition it on something
      ev.preventDefault();
      ev.stopImmediatePropagation();
    };
  }, { passive: false });
}

function setupColors() {
  positiveTowerColor = color(255, 175, 204);
  negativeTowerColor = color(189, 224, 254);

  newPositiveBlockFill = color(255, 175, 204);
  newNegativeBlockFill = color(189, 224, 254);

  // dividingLineColor = color(131, 105, 83);
  dividingLineColor = color(0, 100);
}


function setupOperatorButtons() {

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

  subtractPInput = createInput(0)
  subtractPButton = createButton('Subtract +');
  subtractPButton.position(20, 70);
  subtractPInput.position(100, 70);
  subtractPButton.mousePressed(setPositiveSubtrahend);

  subtractNInput = createInput(0)
  subtractNButton = createButton('Subtract -');
  subtractNButton.position(220, 70);
  subtractNInput.position(300, 70);
  subtractNButton.mousePressed(setNegativeSubtrahend);


}


//numberOfTaps <- global variable
//When we tap with n fingers, we need to (a) set numberOfTaps = n; (b) initateIncrement
//in draw(), under if(currentlyAnimating.incrementblah) { increment(numberOfTaps) }


function setPositiveSubtrahend() {
  currentSubtrahend = int(subtractPInput.value());
  towerPair.initiateSubtract();
}

function setNegativeSubtrahend() {
  currentSubtrahend = -1 * int(subtractNInput.value());
  towerPair.initiateSubtract();
}

// ---------------FOR MULTIPLE TOWERS-----------------------//
function cleanSameObjects(currentObject, lastObject) {
  if (
    currentObject.position[0] === lastObject.position[0] &&
    currentObject.position[1] === lastObject.position[1]
  ) {
    objectList.splice(objectList.length - 1, 1);
  }
}


function touchStarted() {

  if (objectList.length >= 2) {
    return;
  }

  let n = touches.length;

  // //touch to select then drag finger to move object
  // for (let i = 0; i < objectList.length; i++) {
  //   let object = objectList[i];
  //   object.tryDrag(mouseX, mouseY);
  //   if (currentlyAnimating.DRAGGING == true) {
  //     dragObject = object;
  //     break;
  //   }
  // }

  //creating object by tapping n fingers above or below line
  if (!currentlyAnimating.DRAGGING) {

    let new_id = objectList.length === 0 ? 0 : objectList[objectList.length - 1].objectId + 1;

    let visualIntegers = new TowerPair();
    visualIntegers.objectId = new_id;
    visualIntegers.time = millis();

    if (mouseY <= height / 2) {
      visualIntegers.currentPositiveUnits = n;
      visualIntegers.position = [mouseX, height / 2 - visualIntegers.blockSize[1]];
    }
    else {
      visualIntegers.currentNegativeUnits = n;
      visualIntegers.position = [mouseX, height / 2];
    }

    if (objectList.length >= 1) {
      cleanSameObjects(visualIntegers, objectList[objectList.length - 1]);
    }
    objectList.push(visualIntegers);
  }


}

// function touchMoved() {
//   dragObject.drag(mouseX, mouseY);
// }

// function touchEnded() {
//   currentlyAnimating.DRAGGING = false;
// }

// function moveObject() {

// }


// ---------------BACKEND INTEGRATION-----------------------//


function sendActionDataToBackend(action) {
  const isLocal = !(window.location.hostname == "ashwinramaswamy92.github.io"); // Don't call it local if its at the known deployment

  const environment = isLocal ? 'development' : 'production';

  if (!window.db || !window.collection || !window.addDoc) {
    console.error("Firestore not initialized.");
    return;
  }

  window.addDoc(window.collection(window.db, "actions"), {
    event: action,
    timestamp: new Date().toISOString(),
    username: username,
    afterActionPositiveUnits: towerPair.currentPositiveUnits,
    afterActionNegativeUnits: towerPair.currentNegativeUnits,
    environment: environment,
    schoolID: schoolID,
    dayID: dayID,
    currentProblem: currentProblemNumber
  }).then(() => {
    console.log("Action data logged successfully!");
  }).catch(error => {
    console.error("Error logging action data:", error);
  });
}


// function sendTouchDataToBackend(touches_) {
//   const isLocal = !(window.location.hostname == "ashwinramaswamy92.github.io"); // Don't call it local if its at the known deployment

//   const environment = isLocal ? 'development' : 'production';

//   let touches = extractTouchPoints(touches_)

//   if (!window.db || !window.collection || !window.addDoc) {
//     console.error("Firestore not initialized.");
//     return;
//   }

//   window.addDoc(window.collection(window.db, "touch"), {
//     ...touches,
//     timestampUTC: new Date().toISOString(),
//     username: username,
//     afterActionPositiveUnits: towerPair.currentPositiveUnits,
//     afterActionNegativeUnits: towerPair.currentNegativeUnits,
//     environment: environment
//   }).then(() => {
//     console.log("Touchata logged successfully!");
//   }).catch(error => {
//     console.error("Error logging touch data:", error);
//   });
// }



function resetUserData() {
  // Add any code for resetting the user's data here

}



// --------------- RECORDING TOUCH DATA -----------------------//

function extractTouchPoints(touchList) {
  //Gives an array of Key-value pairs.
  const points = [];
  for (let i = 0; i < touchList.length; i++) {
    points.push({
      identifier: touchList[i].identifier,
      clientX: touchList[i].clientX,
      clientY: touchList[i].clientY,
      screenX: touchList[i].screenX,
      screenY: touchList[i].screenY,
      radiusX: touchList[i].radiusX,
      radiusY: touchList[i].radiusY,
      rotationAngle: touchList[i].rotationAngle,
      force: touchList[i].force
    });
  }
  return points;
}