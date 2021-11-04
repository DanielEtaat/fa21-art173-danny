const RADIUS = 40;
const OMEGA = 5;
const TIMESTEP = 0.01;

let p;
let t;

function setup() {
  createCanvas(600, 600, WEBGL);
  p = new Pendelum(0, RADIUS, OMEGA);
  t = 0;
}

function draw() {
    background(255, 0, 0);
    rotateX(-0.1);
    rotateY(0.1*t);
    
    push();
    rotateX(PI/2);
    fill(255, 255, 255, 100);
    plane(50, 50);
    pop();

    // push();
    // stroke(0);
    // fill(0, 0, 255);
    // translate(200, 50, 50);
    // box(25, 25);
    // pop();

    p.update();
    p.render(true);
    
    push();
    stroke(255, 0, 0);
    fill(255, 255, 255, 100);
    rotateZ(PI);
    rotateY(PI);
    p.render(false)
    pop();

    t += TIMESTEP;
}

class Pendelum {
  constructor(theta, radius, frequency) {
    this.theta = theta;
    this.radius = radius;
    this.frequency = frequency;
  }

  update() {
    this.theta = Math.cos(this.frequency * t); 
  }

  render(renderString) {
    let x = (height/2 - this.radius) * Math.sin(this.theta);
    let y = (height/2 - this.radius) * Math.cos(this.theta) - (height/2);
    push();
    translate(x, y);
    rotateZ(-this.theta);
    sphere(this.radius);
    if (renderString) {
      translate(0, -height/4);
      cone(1, height/2 - 2*this.radius, 1);
    }
    pop();
  }
}
