// const backgroundColor = [230,220,190];
const myCanvas = { width: 600, height: 600};
const backgroundColor = [130,120,190];
const lineColor = [0, 0, 0];
const activeLineColor = [90, 20, 110];
const lineWidth = 3;
const activelineWidth = 9;
const sounds = Array.from({ length: 6 });

const ball1 = {
    x: 300,
    y: 300,
    size: 100,
    speed: 1,
    fillColor: [90,80,130],
    strokeColor: [0,120,20],
    ballStrokeWeight: 2,
    rightSound: sounds[0],
    leftSound: sounds[1],
    soundLength: 2000,
    active: false,
}

const ball2 = {
    x: 300,
    y: 100,
    size: 50,
    speed: 2,
    fillColor: [90,80,130],
    strokeColor: [0,120,20],
    ballStrokeWeight: 2,
    rightSound: sounds[2],
    leftSound: sounds[3],
    soundLength: 1000,
    active: false,
}

const ball3 = {
    x: 300,
    y: 200,
    size: 80,
    speed: 2,
    fillColor: [90,80,130],
    strokeColor: [0,120,20],
    ballStrokeWeight: 2,
    rightSound: sounds[4],
    leftSound: sounds[5],
    soundLength: 500,
    active: false,
}

const leftEdge = {
    x1: 110,
    y1: 0,
    x2: 110,
    y2: 600,
    color: lineColor,
    width: lineWidth,

}

const rightEdge = {
    x1: 470,
    y1: 0,
    x2: 470,
    y2: 600,
    color: lineColor,
    width: lineWidth,
}


const balls = [ball1, ball2, ball3];



function preload(){

    sounds.forEach((sound, i) => {
        sounds[i] = loadSound(`sounds/${i}.mp3`)
    })

    console.log(sounds);

    ball1.rightSound = sounds[0];
    ball1.leftSound = sounds[1];
    ball2.rightSound = sounds[2];
    ball2.leftSound = sounds[3];
    ball3.rightSound = sounds[4];
    ball3.leftSound = sounds[5];

    // for(let i = 0; i < sounds.length; i++){
    //     sounds[i] = loadSound(`sounds/${i}.mp3`)
    // }
}

function setup(){
    createCanvas(myCanvas.width, myCanvas.height);
    background(backgroundColor);
}



function draw(){

    background(backgroundColor);

    balls.forEach((ball) => {
        updateBall(ball);
        displayBall(ball);
    })
    drawLine(leftEdge);
    drawLine(rightEdge);
}


function updateBall(ball){
    // console.log(ball.x);
    if (ball.x + ball.size/2 > rightEdge.x1) {
        ball.speed *= -1;
        ball.rightSound.play();
        activateLine(rightEdge);
    } else if (ball.x - ball.size/2 < leftEdge.x1) {
        ball.speed *= -1;
        ball.leftSound.play();
        activateLine(leftEdge);
    } else if (!ball.active && mouseIsPressed && dist(mouseX, mouseY, ball.x, ball.y) <= ball.size / 2) {
        activateBall(ball);
    }
    ball.x += ball.speed;
}

function activateBall(ball) {
    const oldStrokeColor = [...ball.strokeColor]
    const oldFillColor = [...ball.fillColor];
    ball.rightSound.play();
    ball.strokeColor = [255, 255, 255];
    ball.fillColor = [0, 0, 255];
    ball.speed *= 0.5;
    ball.active = true;
    setTimeout(() => resetBall(ball, oldStrokeColor, oldFillColor), 1000);
}

function resetBall(ball, oldStrokeColor, oldFillColor) {
    ball.strokeColor = oldStrokeColor;
    ball.fillColor = oldFillColor;
    ball.speed *= 2;
    ball.active = false;
}

const dist = (a, b, c, d) => {
    return Math.sqrt((a - c) ** 2 + (b - d) ** 2);
}

const displayBall = ({x, y, size, strokeColor, fillColor, ballStrokeWeight}) => {
        stroke(strokeColor);
        fill(fillColor);
        strokeWeight(ballStrokeWeight);
        ellipse(x, y, size);
}

function drawLine({x1, y1, x2, y2, color, width}){
    stroke(color);
    strokeWeight(width);
    line(x1, y1, x2, y2);
}



function activateLine(line){

    line.color = activeLineColor;
    line.width = activelineWidth;

    setTimeout(() => resetLines(line), 500);
}


function resetLines(line){
    line.color = lineColor;
    line.width = lineWidth;
}
