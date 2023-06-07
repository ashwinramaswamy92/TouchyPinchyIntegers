




//----------------MISC-------------------------------//

function preventDefaultTouchEvents(){
    window.addEventListener('touchmove', ev => {
    if (true) {  //In case we need to condition it on something
      ev.preventDefault();
      ev.stopImmediatePropagation();
    };
  }, { passive: false });
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

  if (objectList.length >= 10) {
    return;
  }

  let n = touches.length;

  //touch to select then drag finger to move object
  for (let i = 0; i < objectList.length; i++) {
    let object = objectList[i];
    object.tryDrag(mouseX, mouseY);
    if (currentlyAnimating.DRAGGING == true) {
      dragObject = object;
      break;
    }
  }

  //creating object by tapping n fingers above or below line
  if (!currentlyAnimating.DRAGGING) {

    let new_id = objectList.length === 0 ? 0 : objectList[objectList.length - 1].objectId + 1;

    let visualIntegers = new VisualIntegers();
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

