let VisualIntegers = {
    //State variables
    currentPositiveUnits : 0,
    currentNegativeUnits : 0,

    //Rendering Constants
    blockSize : [10, 80],

    //Methods
    addPositive : function(addend){
        this.currentPositiveUnits += addend;
    },
    addNegative : function(addend){
        this.currentNegativeUnits += addend;
    },
    flipPositiveToNegative : function(){
        this.currentNegativeUnits += this.currentPositiveUnits;
        this.currentPositiveUnits = 0;
    },
    flipNegativeToPositive : function(){
        this.currentPositiveUnits += this.currentNegativeUnits;
        this.currentNegativeUnits = 0;
    },
    simplify : function(){
        let difference = this.currentPositiveUnits - this.currentNegativeUnits;

        if(difference >= 0){
            this.currentPositiveUnits = difference;
            this.currentNegativeUnits = 0;
        } else{
            this.currentNegativeUnits = abs(difference);
            this.currentPositiveUnits = 0;
        }
    },
    multiplyPositive : function(multiplicand) {

    },
    multiplyNegative : function(multiplicand){

    },
    renderPositive : function(){
        let startXY = [width/2 - this.blockSize[0], height/2 - this.blockSize[1]];
        stroke(0);
        strokeWeight(2);
        fill(255, 0, 0);
        for(let i = 0; i < this.currentPositiveUnits; i++){
            rect( startXY[0], startXY[1] - i*this.blockSize[1], this.blockSize[0], this.blockSize[1])
        }
    },
    renderNegative : function(){
        // console.log(this.currentNegativeUnits);
        let startXY = [width/2 - this.blockSize[0], height/2];
        stroke(0);
        strokeWeight(2);
        fill(0, 0, 255);
        for(let i = 0; i < this.currentNegativeUnits; i++){
            rect(startXY[0], startXY[1] + i*this.blockSize[1], this.blockSize[0], this.blockSize[1])
        }

    },


}