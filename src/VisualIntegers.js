class VisualIntegers {
  constructor() {
    this.objectId = 0;
    this.currentPositiveUnits = 0;
    this.currentNegativeUnits = 0;
    this.blockSize = [20, 80];
    this.position = [0, 0];    
    this.newBlockAlpha = 0;
    this.time = 0;
    this.dragOffset = [0,0];
  }


  initiateIncrementPositive(){
    //Call this when you want to add one to positive side, and this will call addPositive() while taking care of the animation timing
    currentlyAnimating.INCREMENTING_POSITIVE = true;
  }
  
  incrementPositive() {
    //To be called continuously in draw under a control structure. While the primary purpose of this function is to increment this.currentPositiveUnits, we could transition into this state via an animation.

    //Animation part: animates appearance of a single block:
        let startXY = [width/2 - this.blockSize[0], height/2 - this.blockSize[1]];
        this.newBlockAlpha += 25;
        stroke(0, this.newBlockAlpha);
        strokeWeight(2);
        fill(255, 0, 0, this.newBlockAlpha);
        rect(startXY[0], startXY[1] - ((this.currentPositiveUnits) * this.blockSize[1]), this.blockSize[0], this.blockSize[1]);
    
    //Once animation termination is reached, perform the function's primary action, and then reset termination criteria for animations
        if(this.newBlockAlpha >= 255){
          
          //Changes to state variables required of the function
            this.currentPositiveUnits += 1;

          //Reset termination criteria
            currentlyAnimating.INCREMENTING_POSITIVE = false;
            this.newBlockAlpha = 0;
        }
  }

  initiateIncrementNegative(){
    //Call this when you want to add one to positive side, and this will call addPositive() while taking care of the animation timing
    currentlyAnimating.INCREMENTING_NEGATIVE = true;
  }

  incrementNegative() {    //To be called continuously in draw under a control structure. While the primary purpose of this function is to increment this.currentNegativeUnits, we could transition into this state via an animation.

    //Animation part: animates appearance of a single block:
        let startXY = [width/2 - this.blockSize[0], height/2];
        this.newBlockAlpha += 25;
        stroke(0, this.newBlockAlpha);
        strokeWeight(2);
        fill(255, 0, 0, this.newBlockAlpha);
        rect(startXY[0], startXY[1] + ((this.currentNegativeUnits) * this.blockSize[1]), this.blockSize[0], this.blockSize[1]);
    
    //Once animation termination is reached, perform the function's primary action, and then reset termination criteria for animations
        if(this.newBlockAlpha >= 255){
          
          //Changes to state variables required of the function
            this.currentNegativeUnits += 1;

          //Reset termination criteria
            currentlyAnimating.INCREMENTING_POSITIVE = false;
            this.newBlockAlpha = 0;
        }
  }

  initiateFlip(){
    currentlyAnimating.FLIPPING = true;
  }
  
  flip() {
    //This multiplies the whole expression by -1

    //First we need an animation to flip these along z-axis
    

    let temp = this.currentPositiveUnits;
    this.currentPositiveUnits = this.currentNegativeUnits;
    this.currentNegativeUnits = temp;

  }

  pinchIn() {
    //Nullifies the basemost (closest to baseline) pair of positive and negative units, if such a pair exists

    //First animate the pinch
    




  }

  simplify() {
    //This simplifies the whole expression. Basically pinches in as many times as possible all at once

    let difference = this.currentPositiveUnits - this.currentNegativeUnits;

    if (difference >= 0) {
      this.currentPositiveUnits = difference;
      this.currentNegativeUnits = 0;
    } else {
      this.currentNegativeUnits = Math.abs(difference);
      this.currentPositiveUnits = 0;
    }
  }



  multiplyPositive(multiplicand) {
    // Implement the multiplication logic for positive units
  }

  multiplyNegative(multiplicand) {
    // Implement the multiplication logic for negative units
  }

  renderPositive() {
    let startXY = this.position;
    stroke(0);
    strokeWeight(2);
    fill(255, 0, 0);

    for (let i = 0; i < this.currentPositiveUnits; i++) {
      rect(startXY[0], startXY[1] - i * this.blockSize[1], this.blockSize[0], this.blockSize[1]);
    }
  }

  renderNegative() {
    let startXY = this.position;
    stroke(0);
    strokeWeight(2);
    fill(0, 0, 255);
    for (let i = 0; i < this.currentNegativeUnits; i++) {
      rect(startXY[0], startXY[1] + i * this.blockSize[1], this.blockSize[0], this.blockSize[1]);
    }
  }

  tryDrag(mouseX, mouseY){
    let minX = this.position[0];
    let maxX = this.position[0] + this.blockSize[0];
    let minY = this.position[1];
    let maxY = this.position[1] + this.blockSize[1];
    if ((mouseX >= minX - 15 && mouseX <= maxX + 15 && mouseY >= minY - 15 && mouseY <= maxY + 15)){
      this.dragOffset[0] = mouseX - this.position[0];
      this.dragOffset[1] = mouseY - this.position[1];
      currentlyAnimating.DRAGGING = true;
    }
  }
  drag(mouseX,mouseY){
    if(currentlyAnimating.DRAGGING){
    this.position[0] = mouseX - this.dragOffset[0];
    this.position[1] = mouseY - this.dragOffset[1];
    }
  }
}
