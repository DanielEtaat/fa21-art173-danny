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
  'const float NUM_ITERATIONS = 256.0;' +
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
  '  focus = 0.7885 * exp_i(r);' +
  '  vec2 c = transformCoord(vPos);' +
  '  float i = iter(c);' +
  '  vec3 colh = vec3(time / 10.0, 1.0, 0.5 - 0.5*cos(time / 5.0));' +
  '  vec3 col = 0.5 + 0.5 * cos(1.2 + 0.25 * i + colh);' +
  '  gl_FragColor = vec4(col, 1.0);' +
  '}';

let mic;
let mandel;
let spectrumOld;

function setup() {
  let size = Math.min(windowWidth, windowHeight) / 1.25;
  createCanvas(size, size, WEBGL);

  // Create an Audio input
  mic = new p5.AudioIn();
  fft = new p5.FFT();
  fft.setInput(mic);

  // create and initialize the shader
  mandel = createShader(vs, fs);
  shader(mandel);
  noStroke();

  mic.start();
  spectrumOld = fft.analyze();
}

let acc = 0.0;

function draw() {
  // 'r' is the size of the image in Mandelbrot-space
  let inp = 0.0;
  let spectrum = fft.analyze();
  
  for (i = 0; i < spectrum.length; i++) {
    inp += Math.sqrt(Math.abs(spectrum[i] - spectrumOld[i]));
  }
  spectrumOld = spectrum;
  console.log(inp);

  inp = inp * mic.getLevel() / (spectrum.length);

  if (inp < 0.001) {
      inp = 0.0;
  }

  acc *= 0.9;
  acc += inp;

  mandel.setUniform('r', acc * Math.PI + 2.5 + sin(millis() / 50000));
  mandel.setUniform('time', (millis() / 1000) % 100);

  quad(-1, -1, 1, -1, 1, 1, -1, 1);
}

function mousePressed() {
    userStartAudio();
}