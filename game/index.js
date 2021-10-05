const canvas = { width: 600, height: 240 };

let map;
let engine;
let p;

function setup() {
  createCanvas(canvas.width, canvas.height);
  Map.SQUARES = loadSquares();
  map = new Map(basicMapInput.m, basicMapInput.w, basicMapInput.h);
  p = new Avatar(0, 170, {
    "init": new Animation("imgs/aang", "init", 1), 
    "run": new Animation("imgs/aang", "run", 6),
  });
  engine = new Engine(map);
  engine.addEntity(p);
  engine.attachCameraTo(p);

  frameRate(32);
}

function draw() {
  engine.render();
  if (keyIsPressed) {
    move();
  }
}

function loadSquares() {
  return [
      loadImage("squares/sky.png"),
      loadImage("squares/grass.jpeg"),
  ];
}

function move() {
  const step = 5;
  if (keyCode === LEFT_ARROW) {
    p.pos.x -= step;
  } else if (keyCode === RIGHT_ARROW) {
    if (p.currentAnimation == p.animations["init"]) {
      p.startAnimation("run");
    }
    p.pos.x += step;
  }
  if (keyCode === UP_ARROW) {
    p.pos.y -= step;
  } else if (keyCode === DOWN_ARROW) {
    p.pos.y += step;
  }
}