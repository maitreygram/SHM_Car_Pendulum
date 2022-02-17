// "use strict ";
var MS_PER_UPDATE = 60;
function updateFrameRate(newFrameRate)
{
  MS_PER_UPDATE = newFrameRate;
  document.getElementById("FrameRateLabel").innerHTML=MS_PER_UPDATE;
}
var frameCount = 0; //count total number of frames rendered

var keysdown = {};

window.addEventListener("keydown", function (event) {
//   console.log(event.key);
  if (event.defaultPrevented) {
    return;
  }
  keysdown[event.key] = true;
  event.preventDefault();
}, true);

window.addEventListener("keyup", function (event) {
  if (event.defaultPrevented) {
    return;
  }
  keysdown[event.key] = false;
  event.preventDefault();
}, true);

window.onload = function() {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var G = 1.0; // Gravity
  var shm = 0.001; // shm frequency
  var p_freq = 0.01; // frequency of pendulum
  
  var car = new Car(canvas.height/4, shm);
  
  var fps = 0; //this is the fps that is displayed to the user
  var framesThisSecond = 0; //this is a counter that counts how many frames we draw every second

  //the following line sets a timer to go off every 1000ms (1s) which
  //copies over the value of framesThisSecond to fps and then resets
  //framesThisSecond to zero. Note this is an example of an anonymous function
  //You can read more about anonymous functions here: https://en.wikibooks.org/wiki/JavaScript/Anonymous_functions
  setInterval(function() { fps = framesThisSecond; framesThisSecond = 0; }, 1000);

  var lastFrameTimeMs = 0; //last time the loop was run
  var lag = 0.0;
  
//   requestAnimationFrame(mainLoop_d);
  requestAnimationFrame(mainLoop_d_smooth);
  
  function mainLoop_d(timestamp) {
    var delta = timestamp - lastFrameTimeMs;
    lastFrameTimeMs = timestamp;
    lag += delta;
    
    processInput();
    
    while (lag >= MS_PER_UPDATE) {
      update();
      lag -= MS_PER_UPDATE;
    }
    
    draw(lag);
    requestAnimationFrame(mainLoop_d);
  }
  
  function mainLoop_d_smooth(timestamp) {
    var delta = timestamp - lastFrameTimeMs;
    lastFrameTimeMs = timestamp;
    lag += delta;
    
    processInput();
    
    while (lag >= MS_PER_UPDATE) {
      update();
      lag -= MS_PER_UPDATE;
    }
    
    draw(lag);
    requestAnimationFrame(mainLoop_d_smooth);
  }
  
  function processInput() 
  {
    if(keysdown.h) {
      car.hold = true;
  }
    if(keysdown.r) {
      car.hold = false;
  }
    if(keysdown.ArrowLeft) {
      if (car.hold) {
        --car.x;
      }
  }       
  if (keysdown.ArrowRight) {
      if (car.hold) {
        ++car.x;
      }
  }
    if(keysdown.ArrowUp) {
      if (car.hold) {
        car.pendulum.w = car.pendulum.w + 1/100;
      }
  }       
  if (keysdown.ArrowDown) {
      if (car.hold) {
        car.pendulum.w = car.pendulum.w - 1/100;
      }
  }
  }
  
  function update() {
    updateCar();
    updatePendulum();
    
    if (frameCount < 10) {
      console.log("car.center: " + car.center);
      console.log("car.v: " + car.v);
      console.log("car.pendulum.theta: " + car.pendulum.theta);
      console.log("car.pendulum.w: " + car.pendulum.w);
    }
  }
  
  function updateCar() {
    car.center = car.center + car.v;
    car.x = car.center - car.size[0]/2;
    car.a = shm * (canvas.width/2 - car.center);
    if(car.hold) {
      car.v = 0;
    }
    else {
      car.v = car.v + car.a;
    }
  }
  
  function updatePendulum() {
    car.pendulum.theta = car.pendulum.theta + car.pendulum.w;
    eff_a = car.a * Math.cos(car.pendulum.theta) - G * Math.sin(car.pendulum.theta);
    car.pendulum.w = car.pendulum.w + p_freq * eff_a;
  }
  
  function draw(lag) {     
    //clear our drawing
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    //Draw a circle with fill and stroke
    context.save();
    context.translate(canvas.width/2, canvas.height/4);
    context.beginPath();
    context.arc(0, 25, 5, 0, 2 * Math.PI, false);
    context.fillStyle = "red";
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = "red";
    context.stroke();
    context.restore();
    
//     lag = 0;
    x_ = car.x + car.v * (lag / MS_PER_UPDATE);
    theta_ = car.pendulum.theta + car.pendulum.w * (lag / MS_PER_UPDATE);
    
    context.save();
    context.translate(x_, car.y);
    context.beginPath();
    context.rect(0,0,car.size[0],car.size[1]);
    context.fillStyle = "#800";
    context.fill();
    
      context.save();
      context.translate(car.size[0]/2, car.size[1]);
      context.rotate(theta_);
      drawPendulum();
      context.restore();
    context.restore();
    
    //draw the fps counter
    context.fillText("FPS: " + fps, 10, 10);

    //count a frame as drawn
    ++framesThisSecond;

    ++frameCount;
    if (frameCount < 10) {
      console.log("frame: " + frameCount);
    }
  }
  
  function drawPendulum() {
    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(0, car.pendulum.L);    
    context.strokeStyle = "black";
    context.lineWidth = 4;
    context.stroke();
    
    context.moveTo(0,0);
    context.arc(0, car.pendulum.L, 10, 0, 2 * Math.PI, false);
    context.fillStyle = "black";
    context.fill();
  }
}

function Car(y, shm) {
  this.size = [100, 50];
  this.center = canvas.width * 3 / 4;
  this.x = this.center - this.size[0]/2;
  this.y = y;
  this.v = 0;
  this.a = shm * (canvas.width / 2 - this.center);
  this.pendulum = new Pendulum();
  this.hold = false;
}

function Pendulum() {
  this.L = Math.random() * 50 + 50;
  this.theta = Math.PI / 4;
  this.w = 0;
}


