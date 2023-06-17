//---------------------------------------- TOUCHSCREEN -------------------------------------------//
  document.addEventListener('DOMContentLoaded', function() {
    var element = document.getElementById('swipe-container');
    var hammertime = new Hammer(element);

    element.addEventListener('touchstart', function(event) {
      prepareTap(event.touches, element);
    });

    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

    hammertime.on('swipeup', function(event) {
      printout('flip');
      // towerPair.initiateFlip();
      swipedThisCycle = true;
    });
    hammertime.on('swipedown', function(event) {
      printout('flip');
      // towerPair.initiateFlip();
      swipedThisCycle = true;
    });
});

function prepareTap(touches, container){

  //Set off a 'time bomb' for taps and records the time.
  isPreparingToTap = true;
  lastTapTime = millis();

  //For debugging, 


  //Record the number of taps: OBSELETE, We WISH TO MOVE TO A 2-d REPRESENTATATION.
  numberOfTaps = touches.length;
  printout('taped with ' + numberOfTaps + ' finger(s)');

  //Re-initialize tap counter
  preparedTapIncrements = [0, 0];
  //Decode from position of each tap the side at which an increment must occur.
  for(let i = 0; i < touches.length; i++){
    if (touches[i].clientY < (container.offsetHeight / 2)) {
      //This tap detected on top side, so prepare one more positive increment
      preparedTapIncrements[0] += 1;
    } else{
      //This tap detected on bottom side, so prepare one more negative increment
      preparedTapIncrements[1] += 1;
    }
  }
}

function printout(myText) {
  var messageElement = document.getElementById('message');
  messageElement.textContent = myText;
}


function triggerTouchEvents(){
  //To trigger touch events if any detected in this cycle;
  if(pinchedThisCycle){
    printout("PINCHED");
    //Defuse Bomb: Falsify the tapping flag to prevent that event
    isPreparingToTap = false;
  }
  if(swipedThisCycle){
    printout("SWIPED");
    //Defuse Bomb: Falsify the tapping flag to prevent that event
    isPreparingToTap = false;
  }


  //After all checks are done if tap preparation is still ongoing AND enough time has passed, BOOM 
  if(isPreparingToTap && (millis() - lastTapTime >= tapDelay)){
    
    //do increments as needed
    if(preparedTapIncrements[0] > 0){
      towerPair.initiateIncrementPositive();
    }
    if(preparedTapIncrements[1] > 0){
      towerPair.initiateIncrementNegative();
    }

    //Bomb defuses after exploding
    isPreparingToTap = false;
  }
}

function resetTouchEvents(){
  //Reset touch variables 
  pinchedThisCycle = false;
  swipedThisCycle = false;
}




//--------------------- SCOREKEEPING/EXPRESSION RENDERING -----------------------------------------//

function showDynamicExpression(x = width*1/20, y = height*1/3){
  textSize(expressionTextSize);
  let expressionString = towerPair.currentPositiveUnits + " + (-" + towerPair.currentNegativeUnits + ") = ?"
  text(expressionString, x, y);
}





//----------------------- GRAPHICS--------------------------------------------------//
function renderDividingLine(){
  rectMode(CORNER);
  let dividerSize = 2;  //pixels of width (vertical) of dividing rod
  let  startY = height/2 - dividerSize/2;
  
  //Main rod
  noStroke();
  fill(110, 50, 50)
  // line(0, height / 2, width, height / 2);
  rect(0, startY, width, dividerSize);

  // //gratings
  // n = 4;
  // let intervalSize = dividerSize/n;
  // for(let i = 0; i < n; i++){
  //   strokeWeight(1)
  //   stroke(0);
  //   let thisLineY = startY + i*intervalSize;
  //   line(0, thisLineY, width, thisLineY);
  // }
}





//----------------MISC-------------------------------//


function preventDefaultTouchEvents(){
    window.addEventListener('touchmove', ev => {
    if (true) {  //In case we need to condition it on something
      ev.preventDefault();
      ev.stopImmediatePropagation();
    };
  }, { passive: false });
}

function setupColors(){
  positiveTowerColor = color(255, 0, 0);
  negativeTowerColor = color(0, 0, 255);

  expressionColor = color(0, 255, 0);
}


function setupOperatorButtons(){
  
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


function setPositiveSubtrahend(){
  currentSubtrahend = int(subtractPInput.value());
  towerPair.initiateSubtract();
}

function setNegativeSubtrahend(){
  currentSubtrahend = -1*int(subtractNInput.value());
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

function touchMoved() {
  dragObject.drag(mouseX, mouseY);
}

function touchEnded() {
  currentlyAnimating.DRAGGING = false;
}

function moveObject() {

}

