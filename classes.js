class Thing {
	constructor(x_){
		this.x=x_;
		this.y=height/2;
		this.yspeed=0;
		this.xspeed=0;
		this.size=.05;
	}

	update(){
		this.size*=1.05;
		this.y+=this.yspeed;
		this.yspeed+=0.25;
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
		this.x=0;
		this.xspeed=1;
	}

	display(){
		fill(255,0,0);
		rect(this.x,this.y,this.size*2,this.size);
	}

	update(){
		this.size*=1.05;
		this.y+=this.yspeed;
		this.yspeed+=0.01;
		this.x+=this.xspeed;
		this.xspeed+=0.01;
	}

}