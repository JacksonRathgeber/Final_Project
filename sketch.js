

//hand tracking done using ml5.js Handpose library 
// ^^ https://learn.ml5js.org/#/reference/handpose

let video;
let handpose;
let timer;
let car;
let gameStarted;
let roadLines;
let finalScore;
let predictions;
let carLoc;

let bears;
let bear;

function setup() {
  
  roadLines=[];

  /*
  bears=new Group();
  bears.color='red';
  */

  createCanvas(900,680);
  video=createCapture(VIDEO);
  video.hide();

  textSize(24);
  textAlign(CENTER);

  predictions=[];

  car=new Sprite(0,0,100,25);
  car.color=color(80,100,255);

  carLoc=createVector(0,0);


  bears=new Group();
  bears.color='red';
  bears.y=height/2;
  bears.width=1.5;
  bears.height=0.75;
  //bears.overlaps(bears);
  //bears.overlaps(car);

  gameStarted=false;
  gameEnded=false;

  handpose = ml5.handpose(video, gameStart);
  
  handpose.on("predict", results => {
    getData(results);
  });

  //console.log("width: "+windowWidth+", height: "+windowHeight);
}

function draw() {
  background(150,200,255);
  timer=round(millis()/1000,2);

  if(round(timer%2,1)<=0.1 && gameStarted==true){
    let roadLine=new RoadLine();
    roadLines.push(roadLine);
    console.log("Roadline created");
  }


  if((round(random(125))==4 || round(timer%2,1)<=0.1) && gameStarted==true){
    bear=new bears.Sprite();
        
    bear.overlaps(bears);

    bear.x = width*round(random(0,1));
    bear.vel.y = random(0.1,0.75);
    if(bear.x==0){
      bear.vel.x = random(0.1,0.75);
    }
    else if(bear.x==width){
      bear.vel.x  = random(-0.75,-0.1);
    }
    console.log("Bear created");
  }


  if(gameStarted==false){
    fill(0);
    text("Loading...",width/2,150);
  }

  if (predictions.length>0){
    updateCar(car);
    /*
    car.x=carLoc.x;
    car.y=carLoc.y;
    */
      
  } else{
      if(gameStarted==true){
        fill(255,0,0);
        text("Move hand into frame",width/2,150);
      }
  }

  noStroke();
  fill(75,125,75);
  rect(0,height/2,width,height/2);
  fill(60);
  triangle(width/2,height/2,width/8,height,7*width/8,height);
    
  
  for(let i=0;i<roadLines.length;i++){
    roadLines[i].display();
    roadLines[i].update();

    if(roadLines[i].y>height){
      roadLines.splice(roadLines[i],1);
    }

  }


  for (let i=0;i<bears.length;i++){
    bears[i].vel.y*=1.11;
    bears[i].vel.x*=1.11;
    bears[i].width*=1.11;
    bears[i].height*=1.11;
    
    if(car.overlapping(bears[i])){
      console.log("Game Over!");
      gameEnd();
    }

    if(bears[i].y>height){
      bears[i].remove();
    }

  }
  

}


function gameStart(){
    gameStarted=true;
    //text("Begin!",width/2,150);
    console.log("Begin!");

}

function gameEnd(){
    gameStarted=false;
    fill(0,100);
    rect(0,0,width,height);
    fill(255);
    textSize(50);
    text("Game Over!",width/2, 150);
    textSize(18);
    text("Score: "+floor(timer/2)-8,width/2, 250);
    noLoop();
}




function getData(data){
    predictions=data;
}




function updateCar(str){ //move car to hand position
//console.log("running");
  carLoc.set(0,0);

  for (let i = 0; i < predictions.length; i += 1){  
    const prediction=predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      carLoc.add(floor(keypoint[0]),floor(keypoint[1]));
      //console.log("x: "+floor(keypoint[0])+", y: "+floor(keypoint[1]));

      //ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }

  carLoc.div(20);
  carLoc.x=map(carLoc.x,180,500,width*7/8,width/8,true);
  carLoc.y=map(carLoc.y,220,380,height*3/4,height,true);

  // ^^ map hand position to stick within box at bottom of screen

  str.x=carLoc.x;
  str.y=carLoc.y;

}




