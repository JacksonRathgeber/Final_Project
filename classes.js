

//class inheritance, subclasses, etc. done with help of p5.js reference
// ^^ https://p5js.org/examples/objects-inheritance.html

class Thing {
	constructor(mode){
		this.x=mode*width;
		this.y=height/2;
		this.yspeed=0;
		this.xspeed=0;
		this.size=.05;
		this.xspeed=1;
		this.sizeInc=1;
		this.sizeInc2=0.5;
		this.mode=mode;
		this.yInc=1;
		this.xInc=0.01;
	}

	update(){
		this.size+=this.sizeInc;
		this.y+=this.yspeed;
		this.yspeed+=this.yInc;
		this.sizeInc+=this.sizeInc2;

		//console.log("x: "+this.x+", y: "+this.y);
	}

	move(){
		if(this.mode==0){
			this.x+=this.xspeed;
			this.xspeed+=this.xInc;
		}
		else if(this.mode==1){
			this.x+=this.xspeed;
			this.xspeed-=this.xInc;
		}
		else{
			console.log("Invalid mode");
		}


	}


}


class RoadLine extends Thing {
	constructor(x_){
		super(x_);
		this.x=width/2;
		this.y=height/2;
	}

	display(){
		fill(255,204,0);
		beginShape();
		vertex(this.x+this.size*-0.25,this.y);
		vertex(this.x+this.size*.25,this.y);
		vertex(this.x+this.size*0.5,this.y+this.size*1.5);
		vertex(this.x+this.size*-0.5,this.y+this.size*1.5);
		endShape();
	}

}


class Obstacle extends Thing {
	constructor(x_, mode){
		super(x_, mode);
		this.xSize=0;
		this.ySize=0;
	}

}

class Bear extends Obstacle {
	constructor(x_, mode, yInc, sizeInc, sizeInc2, xInc){
		super(x_, mode, yInc, sizeInc, sizeInc2, xInc);
		this.yInc=random(0.025, 0.250);
		this.xSize=2*this.size;
		this.ySize=this.size;
		this.sizeInc=0.025;
		this.sizeInc2=0.025;
		this.xInc=random(0,0.5);
	}

	display(){
		fill(255,0,0);
		
		this.xSize=2*this.size;
		this.ySize=this.size;

		rect(this.x,this.y,this.xSize,this.ySize);

	}

		

}



class Car {
	constructor(){
		this.palmLoc=createVector(0,0);
		this.predictions=[];
		this.xSize=100;
		this.ySize=25;
	}

	display(){
		fill(80,100,255);
  		noStroke();
  		rect(this.palmLoc.x,this.palmLoc.y,this.xSize,this.ySize,10);
	}


	update(){
		//console.log("running");
	    this.palmLoc.set(0,0);
	  
	    for (let i = 0; i < this.predictions.length; i += 1) {
	        const prediction = this.predictions[i];
	        for (let j = 0; j < prediction.landmarks.length; j += 1) {
	          const keypoint = prediction.landmarks[j];
	          this.palmLoc.add(floor(keypoint[0]),floor(keypoint[1]));
	          //console.log(keypoint[0],keypoint[1]);
	          //ellipse(keypoint[0], keypoint[1], 10, 10);
	        }
	      }
	    this.palmLoc.div(this.predictions.length*20);
	    this.palmLoc.x=map(this.palmLoc.x,180,500,width*7/8,width/8,true);
	    this.palmLoc.y=map(this.palmLoc.y,220,380,height*3/4,height,true);
	}


	getData(data){
		this.predictions=data;
	}
}