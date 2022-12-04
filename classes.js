class Thing {
	constructor(x_){
		this.x=x_;
		this.y=height/2;
		this.yspeed=0;
		this.xspeed=0;
		this.size=.05;
		this.x=0;
		this.xspeed=1;
	}

	update(){
		this.size*=1.05;
		this.y+=this.yspeed;
		this.yspeed+=0.01;
		this.x+=this.xspeed;
		this.xspeed+=0.01;
	}


}

class Obstacle extends Thing {
	constructor(x_){
		super(x_);
	}

}

class Bear extends Obstacle {
	constructor(x_){
		super(x_);
	}

	display(){
		fill(255,0,0);
		rect(this.x,this.y,this.size*2,this.size);
	}

}


class Car {
	constructor(){
		this.palmLoc=createVector(0,0);
		this.predictions=[];
	}

	display(){
		fill(255,204,0);
  		stroke(255,150,0);
  		rect(this.palmLoc.x,this.palmLoc.y,200,50,10);
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