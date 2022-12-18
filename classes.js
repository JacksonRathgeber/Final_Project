
class RoadLine { // all-inclusive object for everything but player's car
	constructor(mode){
		this.x=width/2;
		this.y=height/2;
		this.yspeed=0;
		this.size=.05;
		this.sizeInc=1;
		this.sizeInc2=0.5;
		this.yInc=1;

		// properties detail how the object moves, grows, etc.
	}

	update(){ // move object down and increase size to mimic coming closer in perspective
		this.size+=this.sizeInc;
		this.y+=this.yspeed;
		this.yspeed+=this.yInc;
		this.sizeInc+=this.sizeInc2;

		//console.log("x: "+this.x+", y: "+this.y);
	}

	display(){ 
		// draw trapezoid shape, grow and move down over time
		// works hand-in-hand with superclass update() function
		
		fill(255,204,0);
		beginShape();
		vertex(this.x+this.size*-0.25,this.y);
		vertex(this.x+this.size*.25,this.y);
		vertex(this.x+this.size*0.5,this.y+this.size*1.5);
		vertex(this.x+this.size*-0.5,this.y+this.size*1.5);
		endShape();
	}


}