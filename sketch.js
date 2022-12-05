

//hand tracking done using ml5.js Handpose library 
// ^^ https://learn.ml5js.org/#/reference/handpose

let video;
let handpose;
let timer;
let car;
let gameStarted;
let roadLines;
let key;
let finalScore;
let gameEnded;

let bears;

function setup() {
  createCanvas(900,680);
  video=createCapture(VIDEO);
  video.hide();

  textSize(24);
  textAlign(CENTER);

  car=new Car();

  roadLines=[];
  bears=[];

  gameStarted=false;
  gameEnded=false;

  handpose = ml5.handpose(video);
  
  handpose.on("predict", results => {
    car.getData(results);
  });

  //console.log("width: "+windowWidth+", height: "+windowHeight);
}

function draw() {
  background(150,200,255);
  timer=round(millis()/1000,2);

  if(round(timer%2,1)<=0.2 && gameStarted==true){
    let line=new RoadLine();
    roadLines.push(line);
  }

  if((round(timer%5,1)<=0.15 || random(200)==69) && gameStarted==true){
    key=round(random(0,1));
    let bear=new Bear(key);
    bears.push(bear);

    //console.log(key);
  }


  if(gameStarted==false){
    fill(0);
    text("Loading...",width/2,150);
  }

  if (car.predictions.length>0){
    if(gameStarted==false){
      gameStart();
    }
    car.update()
      
  } else{
      if(gameStarted==true){
        fill(255,0,0);
        text("No hand detected.",width/2,150);
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

  for(let i=0;i<bears.length;i++){
    bears[i].display();
    bears[i].update();
    bears[i].move();

    //console.log(bears[i].mode);

    let bearX=int(bears[i].x);
    let bearY=int(bears[i].y);

    
    if(bears.length>=1){
      if(abs(car.palmLoc.x-bearX)<bears[i].xSize*map(bears[i].mode,0,1,1,0)+car.xSize &&
      abs(car.palmLoc.y-bearY)<bears[i].ySize+car.ySize){
        console.log("Collision!");
        gameEnded=true;
        finalScore=round(millis()/10000);
      }
    }
    if(bears[i].y>=height){
      bears.splice(i,1);
    }
  }
    
  if(gameEnded==true){
    gameEnd();
  }
  car.display();
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
    text("Score: "+finalScore,width/2, 250);
    noLoop();
}




