// the 'varying's are shared between both vertex & fragment shaders
let varying = 'precision highp float; varying vec2 vPos;';

// the vertex shader is called for each vertex
let vs =
  varying +
  'attribute vec3 aPosition;' +
  'void main() { vPos = (gl_Position = vec4(aPosition, 1.0)).xy; }';

// the fragment shader is called for each pixel
let fs =
  varying +
  'uniform float r;' +
  'uniform float time;' +
  'uniform float param;' +
  'const float NUM_ITERATIONS = 512.0;' +
  'const float width = 1.6;' +
  'vec2 focus = vec2(0.0, 0.0);' + 
  'vec2 center = vec2(0.0, 0.0);' +
  
  'vec2 f(vec2 z) {' + 
  '  return vec2(z.x * z.x - z.y * z.y, 2.0 * z.y * z.x) + focus;' + 
  '}' +

  'vec2 exp_i(float a) {' +
  '  return vec2(cos(a), sin(a));' +
  '}' +

  'float iter(vec2 z) {' +
  '  float i = 0.0;' +
  '  for (float k = 0.0; k < NUM_ITERATIONS; k += 1.0) {' +
  '    i += 1.0;' +
  '    z = f(z);' +
  '    if (dot(z, z) > 4.0) break;' +
  '  }' +

  '  if (i >= NUM_ITERATIONS)' +
  '    return 0.0;' +

  '  float si = i - log2(log2(dot(z,z))) + 4.0;' +
  '  float ai = smoothstep(-0.1, 0.0, 0.0);' +
  '  i = mix(i, si, ai);' +
  '  return i;' +
  '}' +

  'vec2 transformCoord(vec2 fragCoord) {' +
  '  vec2 uv = fragCoord;' +
  '  return uv * width + center;' +
  '}' +

  'void main() {' +
  '  focus = param * exp_i(r);' +
  '  vec2 c = transformCoord(vPos);' +
  '  float i = iter(c);' +
  '  vec3 colh = vec3(time / 10.0, 1.0, 0.5 - 0.5*cos(time / 5.0));' +
  '  vec3 col = 0.5 + 0.5 * cos(1.2 + 0.25 * i + colh);' +
  '  gl_FragColor = vec4(col, 1.0);' +
  '}';

let mic;
let micOn = false;
let mandel;
let spectrumOld;
let slider;
let songs = {};

function setup() {
  let size = Math.min(windowWidth, windowHeight) / 1.4;
  createCanvas(size, size, WEBGL);

  // Load Songs
  songs["Last Christmas"] = loadSound('songs/LastChristmas.mp3');
  songs["All I Want for Christmas Is You"] = loadSound('songs/All I Want for Christmas Is You.mp3');
  songs["Snowman"] = loadSound('songs/Snowman.mp3');
  songs["Piano Man"] = loadSound('songs/Piano Man.mp3');
  songs["Four Seasons, Winter"] = loadSound('songs/Four Seasons, Winter.mp3');
  songs["We Will Rock You"] = loadSound('songs/We Will Rock You.mp3');
  songs["DNA"] = loadSound('songs/DNA.mp3');
  songs["Moon"] = loadSound('songs/Moon.mp3');
  songs["Time in a Bottle"] = loadSound('songs/Time in a Bottle.mp3');

  // Create an Audio input
  mic = new p5.AudioIn();
  fft = new p5.FFT();
  fft.setInput(mic);

  // create and initialize the shader
  mandel = createShader(vs, fs);
  shader(mandel);
  noStroke();

  spectrumOld = fft.analyze();

  // create a slider
  slider = createSlider(0, 10000, 7885);
  slider.position(10, 10);
  slider.style('width', '80px');
}

let acc = 0.0;

function draw() {
  let inp = 0.0;
  let spectrum = fft.analyze();
  
  for (i = 0; i < spectrum.length; i++) {
    inp += Math.sqrt(Math.abs(spectrum[i] - spectrumOld[i]));
  }
  spectrumOld = spectrum;

  if (micOn) {
    inp = inp * mic.getLevel() / (spectrum.length);
  } else {
    inp = inp * 0.025 / (spectrum.length);
  }

  if (inp < 0.001) {
      inp = 0.0;
  }

  acc *= 0.9;
  acc += inp;

  mandel.setUniform('r', acc * Math.PI + 2.5 + sin(millis() / 50000));
  mandel.setUniform('time', (millis() / 1000) % 100);
  mandel.setUniform('param', slider.value() / 10000);
  quad(-1, -1, 1, -1, 1, 1, -1, 1);
}

function mousePressed() {
  userStartAudio();
}

function toggleMic(button) {
  stopCurrentSong();
  fft.setInput(mic);
  if (micOn) {
    mic.stop();
    button.classList.remove("on");
  } else {
    mic.start();
    button.classList.add("on");
    document.getElementById("playb").classList.add("play");
    document.getElementById("playb").classList.remove("pause");
  }
  micOn = !micOn;
}

let currentSong = null;
function playSong(songName) {
  stopCurrentSong();
  currentSong = songName;
  songs[songName].play();
  fft.setInput(songs[songName]);
  if (micOn) {
    mic.stop();
    document.getElementById("micb").classList.remove("on");
  }
}

function stopCurrentSong() {
  if (currentSong != null) {
    songs[currentSong].stop();
    currentSong = null;
  }
}

function pauseCurrentSong() {
  if (currentSong != null) {
    songs[currentSong].stop();
  }
}

function toggleSong(button) {
  if (button.classList.contains("play")) {
    playSong(document.getElementById("songs").value);
    button.classList.remove("play");
    button.classList.add("pause");
  } else {
    pauseCurrentSong();
    button.classList.add("play");
    button.classList.remove("pause");
  }
}