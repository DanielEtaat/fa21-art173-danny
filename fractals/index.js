const numIterations = 80;
let zoom = { x: -0.5, y: 0.65, r: 2 };
let frame = 0;
let drop;
let started = false;

function preload() {
  drop = loadSound('drop.m4a');
}

function setup() {
  createCanvas(500, 500);
  frameRate(20);
}

function draw() {
  if (started) {
    zoom.r *= 0.99;
  }
  background(0);
  mand();

  if (frame == 0) {
    updateZoom();
  }
  frame++;
  frame = frame % 5;
}

function mouseClicked() {
  if (!started) {
    drop.play();
    started = true;
  }
}

/* renders the mandelbrot set. */
const mand = () => {
  loadPixels();
  let d = pixelDensity();
  for (let i = 0; i < pixels.length / 4; i++) {
    let index = 4 * i;
    let x = Math.floor((i % (d*width)) / d);
    let y = Math.floor(Math.floor(i / (d*width)) / d);
    x =  2 * zoom.r * ((x/width)  - 0.5) + zoom.x;
    y = -2 * zoom.r * ((y/height) - 0.5) + zoom.y;
    let c = converges(x, y);
    pixels[index] = c[0];
    // pixels[index + 1] = c[1];
  }
  updatePixels();
}

const TH = 4;
const converges = (x, y) => {
  let zx = 0, zy = 0;
  let tempx = 0, tempy = 0;
  for (let i = 0; i < numIterations; i++) {
    tempx = (zx * zx) - (zy * zy) + x;
    tempy = (2 * zx * zy) + y;
    zx = tempx;
    zy = tempy;
    if (zx**2 + zy**2 > TH) {
      return [0, 0];
    }
  }
  // return 255;
  return [255, 255 * (zx**2 + zy**2) / TH];
}

const updateZoom = () => {
  loadPixels();
  let indexOld = geti(0, 0);
  let index = indexOld;
  let p = pixels[indexOld];
  for (let i = 1; i < width / 2; i++) {
    indexOld = index;
    index = geti(i, 0);
    if (pixels[index] != p) {
      let newP = indexToPoint(indexOld);
      zoom.x = newP[0];
      zoom.y = newP[1];
      return;
    }
  }
}

const geti = (x, y) => {
  x = x + Math.floor(width / 2);
  y = y + Math.floor(height / 2);
  let d = pixelDensity();
  let index = 4 * ((y * d) * width * d + (x * d));
  return index;
}

const indexToPoint = (index) => {
  let d = pixelDensity();
  let i = index / 4;
  let x = Math.floor((i % (d*width)) / d);
  let y = Math.floor(Math.floor(i / (d*width)) / d);
  x =  2 * zoom.r * ((x/width)  - 0.5) + zoom.x;
  y = -2 * zoom.r * ((y/height) - 0.5) + zoom.y;
  return [x, y];
}