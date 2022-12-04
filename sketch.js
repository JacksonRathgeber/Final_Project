let video;
let handpose;
let car;


function setup() {
  createCanvas(900,680);
  video=createCapture(VIDEO);
  video.hide();

  car=new Car();

  handpose = ml5.handpose(video);
  
  handpose.on("predict", results => {
    car.getData(results);
  });

  console.log("width: "+windowWidth+", height: "+windowHeight);
}

function draw() {
  background(150,200,255);

  if(car.predictions.length>0){
    car.update()
      
    } else{
      //console.log("not running");
    }

  noStroke();
  fill(75,125,75);
  rect(0,height/2,width,height/2);
  fill(60);
  triangle(width/2,height/2,width/8,height,7*width/8,height);

  car.display();
  
}

