const canvas = { width: 500, height: 500 };

let gameMenu = true;
let gameOver = false;
let gameWon = false;

let hover1, hover2, hover3, hover4;

let chargingUp = 0;

let map;
let engine;
let p;

function setup() {
  createCanvas(canvas.width, canvas.height);
  Map.SQUARES = loadSquares();
  startLevelOne();
  frameRate(32);
}

function draw() {
  if (gameMenu) {
    hover1 = hover2 = hover3 = hover4 = false;
    if (mouseX > canvas.width/2 - 50 && mouseX < canvas.width/2 + 50) {
      if (mouseY > 100 - 25 && mouseY < 100 + 25) {
        hover1 = true;
      } else if (mouseY > 150 - 25 && mouseY < 150 + 25) {
        hover2 = true;
      } else if (mouseY > 200 - 25 && mouseY < 200 + 25) {
        hover3 = true;
      } else if (mouseY > 250 - 25 && mouseY < 250 + 25) {
        hover4 = true;
      }
    }

    background(255);
    fill(0);
    noStroke();
    rect(0, 0, canvas.width, 420);

    fill(0, 255, 255);
    textSize(30);
    textAlign(CENTER, CENTER);
    text("Choose a level to begin.", canvas.width / 2, 50);
    
    textSize(25);

    if (hover1) {
      fill(255, 0, 255);
    } else {
      fill(0, 0, 255);
    }
    text("Level 1.", canvas.width / 2, 100);

    if (hover2) {
      fill(255, 0, 255);
    } else {
      fill(0, 0, 255);
    }
    text("Level 2.", canvas.width / 2, 150);

    if (hover3) {
      fill(255, 0, 255);
    } else {
      fill(0, 0, 255);
    }
    text("Level 3.", canvas.width / 2, 200);

    if (hover4) {
      fill(255, 0, 255);
    } else {
      fill(0, 0, 255);
    }
    text("Level 4.", canvas.width / 2, 250);

    fill(0, 255, 255);
    textSize(20);
    text("Get to the flag before the zombies kill you.", canvas.width / 2, 300);
    text("Move around with the arrow keys and", canvas.width / 2, 330);
    text("use the space bar to shoot fireballs.", canvas.width / 2, 360);

    if (mouseIsPressed) {
      if (hover1) {
        startLevelOne();
        gameMenu = false;
      } else if (hover2) {
        startLevelTwo();
        gameMenu = false;
      } else if (hover3) {
        startLevelThree();
        gameMenu = false;
      } else if (hover4) {
        startLevelFour();
        gameMenu = false;
      }
    }


  } else if (gameOver) {
    background(0);
    stroke(255, 0, 0);
    fill(255, 0, 0);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("Game Over", canvas.width / 2, canvas.height / 2);

    textSize(20);
    text("Click anywhere to return to main menu.", canvas.width / 2, 3 * canvas.height / 4);

    if (mouseIsPressed) {
      gameOver = false;
      gameMenu = true;
    }
  } else if (gameWon) {
    background(0);
    stroke(0, 255, 0);
    fill(0, 255, 0);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("You Won!", canvas.width / 2, canvas.height / 2);

    textSize(20);
    text("Click anywhere to return to main menu.", canvas.width / 2, 3 * canvas.height / 4);

    if (mouseIsPressed) {
      gameWon = false;
      gameMenu = true;
    }
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


function startLevelOne() {
  map = new Map(map1.m, map1.w, map1.h);
  p = new Avatar(60, 700, {
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
}

function startLevelTwo() {
  map = new Map(map2.m, map2.w, map2.h);
  p = new Avatar(60, 700, {
    "init": new Animation("imgs/aang", "init", 1), 
    "runRight":  new Animation("imgs/aang", "runRight", 6),
    "runLeft":  new Animation("imgs/aang", "runLeft", 6),
    "right":  new Animation("imgs/aang", "right", 1),
    "left":  new Animation("imgs/aang", "left", 1),
  }, 22, 30);
  engine = new Engine(map, gameEntities=[p], cameraWidth=400, cameraHeight=400);
  engine.attachCameraTo(p);
  for (let i = 0; i < 40; i++) {
    engine.addEntity(createEnemy(random(100, map.dim.pw), 400, p));
  }
}

function startLevelThree() {
  map = new Map(map3.m, map3.w, map3.h);
  p = new Avatar(60, 700, {
    "init": new Animation("imgs/aang", "init", 1), 
    "runRight":  new Animation("imgs/aang", "runRight", 6),
    "runLeft":  new Animation("imgs/aang", "runLeft", 6),
    "right":  new Animation("imgs/aang", "right", 1),
    "left":  new Animation("imgs/aang", "left", 1),
  }, 22, 30);
  engine = new Engine(map, gameEntities=[p], cameraWidth=400, cameraHeight=400);
  engine.attachCameraTo(p);
  for (let i = 0; i < 60; i++) {
    engine.addEntity(createEnemy(random(100, map.dim.pw), 400, p));
  }
}

function startLevelFour() {
  map = new Map(map4.m, map4.w, map4.h);
  p = new Avatar(60, 700, {
    "init": new Animation("imgs/aang", "init", 1), 
    "runRight":  new Animation("imgs/aang", "runRight", 6),
    "runLeft":  new Animation("imgs/aang", "runLeft", 6),
    "right":  new Animation("imgs/aang", "right", 1),
    "left":  new Animation("imgs/aang", "left", 1),
  }, 22, 30);
  engine = new Engine(map, gameEntities=[p], cameraWidth=400, cameraHeight=400);
  engine.attachCameraTo(p);
  for (let i = 0; i < 60; i++) {
    engine.addEntity(createEnemy(random(100, map.dim.pw), 400, p));
  }
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