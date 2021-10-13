const canvas = { width: 500, height: 500 };
let gameOver = false;
let gameWon = false;
let chargingUp = 0;

let map;
let engine;
let p;

function createEnemy(x, y, p) {
  let z;
  z = new Enemy(x, y, {
    "init": new Animation("imgs/zombie", "init", 1), 
    "runRight":  new Animation("imgs/zombie", "walkRight", 6),
    "runLeft":  new Animation("imgs/zombie", "walkLeft", 6),
    "right":  new Animation("imgs/zombie", "right", 1),
    "left":  new Animation("imgs/zombie", "left", 1),
  }, 33, 39, p);
  return z;
}

function setup() {
  createCanvas(canvas.width, canvas.height);
  Map.SQUARES = loadSquares();
  map = new Map(basicMapInput.m, basicMapInput.w, basicMapInput.h);
 
  p = new Avatar(0, 700, {
    "init": new Animation("imgs/aang", "init", 1), 
    "runRight":  new Animation("imgs/aang", "runRight", 6),
    "runLeft":  new Animation("imgs/aang", "runLeft", 6),
    "right":  new Animation("imgs/aang", "right", 1),
    "left":  new Animation("imgs/aang", "left", 1),
  }, 22, 30);

  engine = new Engine(map, gameEntities=[p], cameraWidth=400, cameraHeight=400);
  engine.attachCameraTo(p);

  for (let i = 0; i < 20; i++) {
    engine.addEntity(createEnemy(random(100, map.dim.pw), 400, p));
  }

  frameRate(32);
}

function draw() {

  if (gameOver) {
    background(0);
    stroke(255, 0, 0);
    fill(255, 0, 0);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("Game Over", canvas.width / 2, canvas.height / 2);
  } else if (gameWon) {
    background(0);
    stroke(0, 255, 0);
    fill(0, 255, 0);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("You Won!", canvas.width / 2, canvas.height / 2);
  } else {
    engine.render();
    
    stroke(0);
    fill(255 * (1 - p.health), 255 * p.health, 0);
    rect(10, 10, 100 * p.health, 10);  

    if (chargingUp <= 0) {
      fill(255, 165, 0);
      rect(10, 30, 10, 10);
    }

    if (keyIsPressed)
      moveP(); 
    if (p.health < 0)
      gameOver = true;  
    if (p.hasFlag) {
      gameWon = true;
    }
    chargingUp--;
  }

}

function loadSquares() {
  return [
      loadImage("squares/sky.png"),
      loadImage("squares/grass.jpeg"),
      loadImage("squares/dirt.jpeg"),
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
    p.moveUp(5 * step);
  } else if (key == " ") {   
    if (chargingUp <= 0) {
      chargingUp = 100;
      let speed = 10;
      let animationName = "right";
      if (!p.facingRight) {
        speed *= -1;
        animationName = "left";
      }
      engine.addEntity(new Fireball(p.pos.x, p.pos.y, { "init": new Animation("imgs/fireball", animationName, 1) }, 25, 19, speed))
    }
  }

}