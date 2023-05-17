/*
To do:
1. Pinch should only decrease each side by one.
2. Flip is a single operation -> multiplies entire expression by -1.
3. Flipping animation -> flip via third axis, simultaneously. Swap colors after.
4. Auto-zoom to accomodate larger integers -> grid lines to show magnitudes - with checkbox to toggle.



*/



function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(220);
  
  //Draw line across screen
  stroke(0);
  strokeWeight(2);
  line(0, height/2, width, height/2);

  //Tracking number of units on each side



  //Interaction



  //Drawing on each side
  VisualIntegers.renderPositive();
  VisualIntegers.renderNegative();



}

function mousePressed(){
  if(mouseY <= height/2)
    VisualIntegers.addPositive(1);
  else
    VisualIntegers.addNegative(1);

}