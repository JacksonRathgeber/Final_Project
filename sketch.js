

//hand tracking done using ml5.js Handpose library 
// ^^ https://learn.ml5js.org/#/reference/handpose

//sprites made with p5.play library
// ^^ https://p5play.org/index.html

let video;
let handpose;
let timer;
let car;
let gameStarted;
let gameEnded;
let roadLines;
let predictions;
let carLoc;
let score;
let modelReady;
let calib;
let introHand;
let startCount=15;

let ghostCount=0;
let ghosted=false;

let bears;

let coins;
let coinCount;

let ghosts;

let deer;
let deerModes;

let screenCenter;

let musicFolder;

let bgm;

p5.disableFriendlyErrors = true;




function preload(){
  musicFolder=[
    "libraries/music/a tiny spaceship\'s final mission.mp3",
    "libraries/music/big blue.mp3",
    "libraries/music/midnight highway.mp3",
    "libraries/music/mute city.mp3",
    "libraries/music/red canyon.mp3",
    "libraries/music/splash wave.mp3",
    "libraries/music/white land 1.mp3",
    "libraries/music/white land 2.mp3"
    ];
  bgm=loadSound(floor(random(musicFolder.length)));
}





function setup() {

  createCanvas(900,680);
  video=createCapture(VIDEO);
  video.hide();

  // ^^ set up video

  frameRate(12);

  roadLines=[];
  predictions=[];
  coinCount=0;
  startCount=0;

  screenCenter=createVector(width/2,height/2);


  textSize(24);
  textAlign(CENTER);

  // ^^ set up text preferences

  car=new Sprite(0,0,100,25);
  car.color=color(80,100,255);
  car.rotationLock=true;

  carLoc=createVector(0,0);

  // ^^create p5.js car sprite, location vector


  bears=new Group();
  bears.color='red';
  bears.y=height/2;
  bears.width=1.5;
  bears.height=0.75;
  bears.rotationLock=true;
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

  ghosts=new Group();
  ghosts.x=width/2;
  ghosts.y=height/2;
  ghosts.width=3;
  ghosts.height=3;
  ghosts.color=color(255,100);
  ghosts.rotationSpeed=10;

  // ^^ create ghost group, set universal initial properties
  // (color, starting position, dimensions, etc.)

  deer=new Group();
  deer.x=width/2;
  deer.y=height/2;
  deer.width=1;
  deer.height=.75;
  deer.color='pink';
  deer.rotationLock=true;

  deerModes=[];

  // ^^ create deer group, set universal initial properties
  // (color, starting position, dimensions, etc.)


  gameStarted=false;
  gameEnded=false;
  modelReady=false;

  score=0;

  //handpose = ml5.handpose(video, gameStart); 

  handpose = ml5.handpose(video, startTracking); 

  // ^^ start looking for hands on video
  // start game when tracking is ready
  
  handpose.on("predict", results => {
    predictions=results;
  });

  // ^^ when hand is found, send data to predictions array


  calib=new Sprite();
  calib.width=200;
  calib.heght=40;
  calib.x=width/2;
  calib.y=625;
  calib.color='yellow';
  calib.static=true;

  introHand=new Sprite();
  introHand.diameter=50;
  introHand.color=color(255,255,100,100);
  introHand.x=0;
  introHand.y=0;
  introHand.visible=false;
  introHand.overlaps(calib);

}





function draw() {
  background(150,200,255);
  timer=round(millis()/1000,2);

  score+=1/12;

  textAlign(CENTER);

  car.visible=gameStarted && !gameEnded;

  if(round(timer%2,1)<=0.1 && gameStarted && !gameEnded){
    let roadLine=new RoadLine();
    roadLines.push(roadLine);
    //console.log("Roadline created");
  }

  // ^^ create road line every two seconds, add to roadLines array


  if((round(random(300))==4 || round(timer%4,1)<=0.1) && gameStarted && !gameEnded){
    let bear=new bears.Sprite();
        
    bear.overlaps(bears);
    bear.overlaps(deer);

    bear.x = width*round(random(0,1));
    bear.vel.y = random(0.25,0.75);
    if(bear.x==0){
      bear.vel.x = random(0.25,0.75);
    }
    else if(bear.x==width){
      bear.vel.x  = random(-0.75,-0.25);
    }
    //console.log("Bear created");
  }

  // ^^ use RNG to create "bears" (red obstacles), either come in from left or right
  // bears cannot collide with each other


  if(round(random(250))==4 && gameStarted && !gameEnded){
      let coin =new coins.Sprite();
          
      coin.overlaps(coins);
      coin.speed=random(3,8);
      coin.direction=random(55,125);

      //console.log("Coin created");
  }

  // ^^ use RNG to create coins, move along random line on road


  if(round(random(500))==4 && gameStarted && !gameEnded){
      let ghost = new ghosts.Sprite();
          
      ghost.overlaps(ghosts);
      ghost.speed=random(4,10);
      ghost.direction=random(55,125);


  }

  // ^^ use RNG to create ghosts, move along random line on road



  if((round(random(200))==4 || round(timer%5,1)<=0.1) && gameStarted && !gameEnded){
    let d=new deer.Sprite();
        
    d.overlaps(deer);

    d.x = width*round(random(0,1));
    d.vel.y = random(0.05,0.1);
    if(d.x==0){
      d.vel.x = random(0.5,1.25);
    }
    else if(d.x==width){
      d.vel.x  = random(-1.25,-0.5);
    }
    
    deerModes.push("moving");
  }




  if (predictions.length>0){
    followHand(car);
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

  
  if(gameStarted && !gameEnded){
    fill(0);
    text("Score: "+ floor(score), 800,50);
  }
    
  
  for(let i=0;i<roadLines.length;i++){
    roadLines[i].display();
    roadLines[i].update();

    if(roadLines[i].y>height){
      roadLines.splice(roadLines[i],1);
    }

  }

  // ^^ update and display all road lines, remove those offscreen


  for (let i=0;i<bears.length;i++){
    bears[i].vel.y*=1.1;
    bears[i].vel.x*=1.1;
    bears[i].width*=1.1;
    bears[i].height*=1.1;
    
    if(car.overlapping(bears[i]) && !ghosted){
      //console.log("Game Over!");
      gameEnd();
    }

    if(bears[i].y>height){
      bears[i].remove();
    }

  }

  // ^^ update all bears, check collision with car (game over if so), remove if offscreen

  for (let i=0;i<coins.length;i++){
    coins[i].speed*=1.1;
    coins[i].diameter*=1.1;
    
    if(car.overlapping(coins[i])){
      coinCount++;
      score+=5;
      //console.log("Coin collected!");
    }
    
    if(coins[i].y>height || car.overlapping(coins[i])){
      coins[i].remove();

    }

  }

  // ^^ update all coins, check collision with car (increment counter if so)
  // remove if offscreen or after collision


  for (let i=0;i<ghosts.length;i++){
    ghosts[i].speed*=1.25;
    ghosts[i].width*=1.25;
    ghosts[i].height*=1.25;
    
    if(car.overlapping(ghosts[i])){
      ghosted=true;

    }
    
    if(ghosts[i].y>height || car.overlapping(ghosts[i])){
      ghosts[i].remove();

    }

  }

  // ^^ update all ghosts, check collision with car (activate "ghosted" if so)
  // remove if offscreen or after collision


  for (let i=0;i<deer.length;i++){
    if(deerModes[i]=="moving"){
      deer[i].vel.x*=1.05;
      deer[i].vel.y*=1.05;
      deer[i].width*=1.05;
      deer[i].height*=1.05;
      
    } else{

      deer[i].width*=1.05;
      deer[i].height*=1.05;
      deer[i].vel*=1.1;
    }
    
    if(car.overlapping(deer[i]) && !ghosted){
      //console.log("Game Over!");
      gameEnd();
    }

    if(round(atan2(deer[i].y-car.y,deer[i].x-car.x)/10)*10 ==round(atan2(
      screenCenter.y-car.y,screenCenter.x-car.x)/10)*10 && deerModes[i]=="moving"){

      deerModes[i]=="stopped";
      deer[i].vel.x/=2;
      deer[i].direction=round(atan2(car.y-screenCenter.y,car.x-screenCenter.x)/10)*10;
      console.log("Deer stopped!");
    }

    
    if(deer[i].y>height){
      deer[i].remove();
      deerModes.splice(deerModes[i],1);
    }
    

  }

  // ^^ update all deer, check collision with car (game over if so), remove if offscreen



  if(ghosted){
    ghostCount++;
    car.color=color(80,100,255,100);

  } else{
    car.color=color(80,100,255);
  }
  if(ghostCount>80){
    ghosted=false;
    ghostCount=0;
  }



  if(!gameStarted && !gameEnded){
    preGame();
  }
  
  //console.log(frameRate());



  if(gameStarted && !gameEnded){
    bgm.play();
  }



}








function startTracking(){
  modelReady=true;
}




function preGame(){
    fill(0,175);
    rect(0,0,width,height);
    textSize(75);
    textAlign(CENTER);
    fill(255);
    text("Welcome to Hand Racer!", width/2, 100);

    textSize(35);
    text("Rules:", width/2, 175);

    textSize(15);
    textAlign(LEFT);
    text("This is your car. Move it around by moving your hand around in "+
      "front of your camera.", width/2,200,425,100);

    text("This is a bear. They appear from offscreen, move in straight lines, "+
      "and appear to grow as you approach. "+
      "You'll crash if you hit them.", width/2,263,425,100);

    text("This is a duck. It's like a smaller bear, but it'll appear in a group with "+
      "a mother at the head. It's also a bit sluggish, "+
      "but it's doing it's best.", width/2,343,425,100);

    text("This is a deer. Also like a bear, but it'll stop dead the "+
      "second it sees you coming.", width/2,420,425,100);

    text("This is a coin. They'll appear occasionally on the road. Collect"+
    " them to boost your score.", width/2,475,425,100);

    text("This is a ghost. Collecting one from the road "+
      "will \"ghost\" you, making you temporarily invincble.", width/2,525,425,100);

    fill(80,100,255);
    rect(215,205,100,25);

    fill(255,0,0);
    rect(215,260,100,50);


    //insert duck and deer shapes here


    fill(255,255,0);
    ellipse(265,490,25,25);


    fill(255,100);
    rect(245,520,40,40);



    fill(255,255,0);
    if(modelReady==true){
      if (predictions.length>0){
        introHand.visible=true;
        followHand(introHand);


        if(introHand.overlapping(calib)){
          startCount--;
          textSize(18);
          text("Hold it!   "+startCount,200,625);
        } else{
          startCount=15;
          text("Move the yellow sphere to the yellow box to begin -->",75,610,250,100);
        }
      }
      else{
        text("Move your hand in front of your computer camera.",75,610,250,100);
      }
    } else{
      textSize(18);
      text("Loading...",200,625);
    }

    if(startCount<0){
      gameStart();
    }

}






function gameStart(){
    score-=score;
    gameStarted=true;
    gameEnded=false;
    calib.remove();
    introHand.remove();
    //text("Begin!",width/2,150);
    //console.log("Begin!");

}

// ^^ function to start game





function gameEnd(){
    gameStarted=false;
    gameEnded=true;
    fill(0,150);
    rect(0,0,width,height);
    fill(255);
    textSize(50);
    text("You Crashed!",width/2, 150);
    textSize(18);
    text("Final Score: "+round(score),width/2, 250);
    noLoop();
}

// ^^ function to end game, show game over screen, stop draw() loop





function followHand(str){ //move car to hand position
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




