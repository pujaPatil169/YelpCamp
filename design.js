// Background animation
let canvasBg = document.getElementById('canvas');
let ctxBg = canvasBg.getContext('2d');
let wBg = canvasBg.width = window.innerWidth;
let hBg = canvasBg.height = window.innerHeight;
let hueBg = 235;
let starsBg = [];
let countBg = 0;
let maxStarsBg = 1400;
var canvas2 = document.createElement('canvas'),
  ctx2 = canvas2.getContext('2d');
canvas2.width = 100;
canvas2.height = 100;
var half = canvas2.width / 2,
  gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
gradient2.addColorStop(0.025, '#fff');
gradient2.addColorStop(0.1, 'hsl(' + hueBg + ', 61%, 53%)');
gradient2.addColorStop(0.25, 'hsl(' + hueBg + ', 64%, 6%)');
gradient2.addColorStop(1, 'transparent');

ctx2.fillStyle = gradient2;
ctx2.beginPath();
ctx2.arc(half, half, half, 0, Math.PI * 2);
ctx2.fill();

function randomBg(min, max) {
  if (arguments.length < 2) {
    max = min;
    min = 0;
  }

  if (min > max) {
    var hold = max;
    max = min;
    min = hold;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function maxOrbitBg(x, y) {
  var max = Math.max(x, y),
    diameter = Math.round(Math.sqrt(max * max + max * max));
  return diameter / 2;
}

var StarBg = function () {
  this.orbitRadius = randomBg(maxOrbitBg(wBg, hBg));
  this.radius = randomBg(60, this.orbitRadius) / 12;
  this.orbitX = wBg / 2;
  this.orbitY = hBg / 2;
  this.timePassed = randomBg(0, maxStarsBg);
  this.speed = randomBg(this.orbitRadius) / 60000;
  this.alpha = randomBg(2, 10) / 10;

  countBg++;
  starsBg[countBg] = this;
}

StarBg.prototype.draw = function () {
  var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
    y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
    twinkle = randomBg(10);

  if (twinkle === 1 && this.alpha > 0) {
    this.alpha -= 0.05;
  } else if (twinkle === 2 && this.alpha < 1) {
    this.alpha += 0.05;
  }

  ctxBg.globalAlpha = this.alpha;
  ctxBg.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
  this.timePassed += this.speed;
}

for (var i = 0; i < maxStarsBg; i++) {
  new StarBg();
}

function animationBg() {
  ctxBg.globalCompositeOperation = 'source-over';
  ctxBg.globalAlpha = 0.8;
  ctxBg.fillStyle = 'hsla(' + hueBg + ', 64%, 6%, 1)';
  ctxBg.fillRect(0, 0, wBg, hBg)

  ctxBg.globalCompositeOperation = 'lighter';
  for (var i = 1, l = starsBg.length; i < l; i++) {
    starsBg[i].draw();
  };

  window.requestAnimationFrame(animationBg);
}

animationBg();

// Foreground animation
let canvasFg = document.getElementById('canvas-fg');
let ctxFg = canvasFg.getContext('2d');
let wFg = canvasFg.width = window.innerWidth;
let hFg = canvasFg.height = window.innerHeight;
let starsFg = [];
let spiralsFg = [];
let tickFg = 0;

class StarFg {
  constructor(opt) {
    Object.assign(this, opt);
    this.angle = randFg(0, 10 * Math.PI);
    this.radius = randFg(200, 30);
    this.speed = randFg(0.001, 0.013);
  }
  update() {
    this.angle += this.speed;
    this.x = wFg / 2 + this.radius * Math.cos(this.angle);
    this.y = hFg / 2 + this.radius * Math.sin(this.angle);
  }
  draw() {
    ctxFg.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`;
    ctxFg.beginPath();
    ctxFg.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctxFg.fill();
  }
}


function randFg(min, max) {
  return Math.random() * (max - min) + min;
}

function initFg() {
  starsFg = [];
  spiralsFg = [];
  tickFg = 0;
  resetFg();
  loopFg();
}

function resetFg() {
  starsFg.length = 0;
  for (let i = 0; i < 300; i++) {
    let hue = randFg(200, 240); // Blue to white range
    let saturation = randFg(50, 100); // High saturation for brightness
    let lightness = randFg(80, 100); // Light colors for stars
    starsFg.push(new StarFg({
      size: randFg(1, 3),
      hue: hue,
      saturation: saturation,
      lightness: lightness,
      alpha: randFg(0.7, 1)
    }));
  }
}

function stepFg() {
  starsFg.forEach(star => star.update());
  spiralsFg.forEach(spiral => spiral.update());
}

// function drawFg() {
//   ctxFg.clearRect(0, 0, wFg, hFg); // Clear previous frame
//   starsFg.forEach(star => star.draw());
//   spiralsFg.forEach(spiral => spiral.draw());
// }
function drawFg() {
  // Draw the image for the eye background
  let eyeImage = new Image();
  eyeImage.src = 'https://i.ibb.co/hRmgpJY/eye.png'; 
  eyeImage.onload = function() {
    let eyeWidth = 120;
    let eyeHeight = 120;
    let eyeX = (wFg - eyeWidth) / 2;
    let eyeY = (hFg - eyeHeight) / 2;

    ctxFg.save();
    // Create a circular clipping mask
    ctxFg.beginPath();
    ctxFg.arc(wFg / 2, hFg / 2, 50, 0, Math.PI * 2); // Define a circle centered at the canvas center
    ctxFg.closePath();
    ctxFg.clip();

    // Draw the image within the clipping mask
    ctxFg.drawImage(eyeImage, eyeX, eyeY, eyeWidth, eyeHeight);
    ctxFg.restore();

    // Draw stars and spirals
    starsFg.forEach(star => star.draw());
  };

  // Fill background
  ctxFg.fillRect(255, 0, 0, 255);
}

function loopFg() {
  requestAnimationFrame(loopFg);
  stepFg();
  drawFg();
}

initFg();
