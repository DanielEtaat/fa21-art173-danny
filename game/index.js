const canvas = { width: 500, height: 500 };

let map;
let engine;
let p;

function setup() {
  createCanvas(canvas.width, canvas.height);
  Map.SQUARES = loadSquares();
  map = new Map(basicMapInput.m, basicMapInput.w, basicMapInput.h);
  p = new Avatar(0, 400, {
    "init": new Animation("imgs/aang", "init", 1), 
    "runRight":  new Animation("imgs/aang", "runRight", 6),
    "runLeft":  new Animation("imgs/aang", "runLeft", 6),
  }, 22, 30);
  engine = new Engine(map, gameEntities=[p], cameraWidth=400, cameraHeight=400);
  engine.attachCameraTo(p);

  frameRate(32);
}

function draw() {
  engine.render();
  if (keyIsPressed) {
    moveP(); }
}

function loadSquares() {
  return [
      loadImage("squares/sky.png"),
      loadImage("squares/grass.jpeg"),
      loadImage("squares/flag.png"),
  ];
}

const step = 4;
function moveP() {
  if (key === "ArrowLeft") {
    p.moveLeft(step);
  } else if (key === "ArrowRight") {
    p.moveRight(step);
  } 
}

function keyPressed() {
  if (key == "ArrowUp") {
    p.moveUp(5*step);
  }
}