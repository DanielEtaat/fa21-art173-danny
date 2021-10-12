const canvas = { width: 500, height: 500 };
const innerCircleRadius = 50;
const circleX = canvas.width / 2;
const circleY = canvas.height / 2;
const whiteColor = [255, 255, 255];
const yellowColor = [255, 255, 0];

const dist = (x1, y1, x2, y2) => {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}
 
var param = 0.5;
var step = 0.001;
var circleColor = whiteColor;

function setup() {
    createCanvas(canvas.width, canvas.height);
}

function draw() {
    background(0);
    
    // draw circles
    stroke(circleColor);
    fill(circleColor.concat(5));
    for (let i = 1000; i > innerCircleRadius; i *= param) {
        circle(circleX, circleY, i);
    }
    fill(circleColor);
    circle(circleX, circleY, innerCircleRadius);

    // update the param
    param += step;
    if (param >= 1) {
        param = 1 - step;
        step *= -1;
    } else if (param <= 0) {
        param = -step;
        step *= -1;
    }
    
}

function mousePressed() {
    if (dist(mouseX, mouseY, circleX, circleY) < innerCircleRadius/2) {
        if (circleColor == whiteColor) {
            circleColor = yellowColor;
        } else {
            circleColor = whiteColor;
        }
    }
    
}