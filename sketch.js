

//hand tracking done using ml5.js Handpose library 
// ^^ https://learn.ml5js.org/#/reference/handpose

//sprites made with p5.play library
// ^^ https://p5play.org/index.html

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

let coins;
let coinCount;

function setup() {
  
  roadLines=[];
  predictions=[];
  coinCount=0;

  /*
  bears=new Group();
  bears.color='red';
  */

  createCanvas(900,680);
  video=createCapture(VIDEO);
  video.hide();

  // ^^ set up video

  textSize(24);
  textAlign(CENTER);

  // ^^ set up text preferences

  car=new Sprite(0,0,100,25);
  car.color=color(80,100,255);

  carLoc=createVector(0,0);

  // ^^create p5.js car sprite, location vector


  bears=new Group();
  bears.color='red';
  bears.y=height/2;
  bears.width=1.5;
  bears.height=0.75;
  //bears.overlaps(bears);
  //bears.overlaps(car);

  // ^^ create bear group, set universal initial properties
  // (color, starting position, dimensions, etc)

  coins=new Group();
  coins.color='yellow';
  coins.diameter=4;
  coins.x=width/2;
  coins.y=height/2;
  //coins.life=60;

  // ^^ create coin group, set universal initial properties
  // (color, starting position, dimensions, etc.)


  gameStarted=false;
  gameEnded=false;

  handpose = ml5.handpose(video, gameStart); 

  // ^^ start looking for hands on video
  // start game when tracking is ready
  
  handpose.on("predict", results => {
    predictions=results;
  });

  // ^^ when hand is found, send data to predictions array

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

  // ^^ create road line every two seconds, add to roadLines array


  if((round(random(125))==4 || round(timer%2,1)<=0.1) && gameStarted==true){
    bear=new bears.Sprite();
        
    bear.overlaps(bears);

    bear.x = width*round(random(0,1));
    bear.vel.y = random(0.25,0.75);
    if(bear.x==0){
      bear.vel.x = random(0.25,0.75);
    }
    else if(bear.x==width){
      bear.vel.x  = random(-0.75,-0.25);
    }
    console.log("Bear created");
  }

  // ^^ use RNG to create "bears" (red obstacles), either come in from left or right
  // bears cannot collide with each other


  if(round(random(100))==4 && gameStarted==true){
      let coin =new coins.Sprite();
          
      coin.overlaps(coins);
      coin.speed=random(1,8);
      coin.direction=random(55,125);

      console.log("Coin created");
  }

  // ^^ use RNG to create coins, move along random line on road


  if(gameStarted==false){
    fill(0);
    text("Loading...",width/2,150);
  }

  // ^^ loading screen


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

  // ^^ if there is tracking data, move car accordingly
  // if not, give message


  noStroke();
  fill(75,125,75);
  rect(0,height/2,width,height/2);
  fill(60);
  triangle(width/2,height/2,width/8,height,7*width/8,height);

  // create basic setting (road, grass)
    
  
  for(let i=0;i<roadLines.length;i++){
    roadLines[i].display();
    roadLines[i].update();

    if(roadLines[i].y>height){
      roadLines.splice(roadLines[i],1);
    }

  }

  // ^^ update and display all road lines, remove those offscreen


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

  // ^^ update all bears, check collision with car (game over if so), remove if offscreen

  for (let i=0;i<coins.length;i++){
    coins[i].speed*=1.11;
    coins[i].diameter*=1.11;
    
    if(car.overlapping(coins[i])){
      coinCount++;
      console.log("Coin collected!");
    }
    
    if(coins[i].y>height || car.overlapping(coins[i])){
      coins[i].remove();

    }

  }

  // ^^ update all coins, check collision with car (increment counter if so)
  // remove if offscreen or after collision
  

}


function gameStart(){
    gameStarted=true;
    //text("Begin!",width/2,150);
    console.log("Begin!");

}

// ^^ function to start game

function gameEnd(){
    gameStarted=false;
    fill(0,100);
    rect(0,0,width,height);
    fill(255);
    textSize(50);
    text("Game Over!",width/2, 150);
    textSize(18);
    text("Score: "+str(floor((timer/2)-8)+coinCount*5),width/2, 250);
    noLoop();
}

// ^^ function to end game, show game over screen, stop draw() loop




function updateCar(str){ //move car to hand position
  carLoc.set(0,0); //reset carLoc

    for (let j = 0; j < predictions[0].landmarks.length; j += 1) { // search tracking data
      
      const keypoint = predictions[0].landmarks[j];
      
      carLoc.add(floor(keypoint[0]),floor(keypoint[1]));
      
      // ^^ extract x and y values from data, add to carLoc

      //console.log("x: "+floor(keypoint[0])+", y: "+floor(keypoint[1]));

  }

  carLoc.div(20); //average out data for different fingers, etc.
  carLoc.x=map(carLoc.x,180,500,width*7/8,width/8,true);
  carLoc.y=map(carLoc.y,220,380,height*3/4,height,true);

  // ^^ map hand position to stick within box at bottom of screen

  str.x=carLoc.x;
  str.y=carLoc.y;

  // ^^ set car location values to carLoc values

}




