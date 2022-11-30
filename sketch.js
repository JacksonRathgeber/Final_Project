let testBear;

function setup() {
  createCanvas(windowWidth,windowHeight);
  testBear=new Bear();
}

function draw() {
  background(150,200,255);
  noStroke();
  fill(75,125,75);
  rect(0,height/2,width,height/2);
  fill(60);
  triangle(width/2,height/2,width/8,height,7*width/8,height);
  testBear.display();
  testBear.update();
}