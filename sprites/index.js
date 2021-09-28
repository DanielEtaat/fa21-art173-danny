const canvas = { width: 600, height: 600};
const stepSize = 10;

const TheAvatar = {
  name: "Aang",
  age: 112,
  mastered: ["air"],
  toMaster: ["water", "earth", "fire"],
  wantedByTheFireNation: true,
  animations: {
    run: new Animation("run", "aang", 6)
  },
  pos: { x: 0, y: 0 }
}

function preload() {
  TheAvatar.animations.run.loadImages();
}

function setup() {
    createCanvas(canvas.width, canvas.height);
    frameRate(12);
}

function draw(){
  background((255, 255, 255));
  TheAvatar.animations.run.next(TheAvatar.pos);
  TheAvatar.pos.x = (TheAvatar.pos.x + stepSize) % canvas.width;
}
