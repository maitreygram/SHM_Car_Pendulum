"use strict ";
window.onload = function() {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var G = 1.0; // Gravity
  var shm = 0.001; // shm frequency
  var p_freq = 0.01; // frequency of pendulum
  
  var car = new Car(canvas.height/4, shm);
  
  requestAnimationFrame(mainLoop);
  
  function mainLoop() {
    update();
  draw();
  requestAnimationFrame(mainLoop);
  }
  
  function update() {
    updateCar();
    updatePendulum();
  }
  
  function updateCar() {
    car.x = car.x + car.v;
    car.center = car.center + car.v;
    car.a = shm * (canvas.width/2 - car.center);
    car.v = car.v + car.a;
  }
  
  function updatePendulum() {
    car.pendulum.theta = car.pendulum.theta + car.pendulum.w;
    eff_a = car.a * Math.cos(car.pendulum.theta) - G * Math.sin(car.pendulum.theta);
    car.pendulum.w = car.pendulum.w + p_freq * eff_a;
  }
  
  function draw() {     
    //clear our drawing
  context.clearRect(0, 0, canvas.width, canvas.height);
    
    //draw the ball (notice the ball is always drawn at (0,0), what we change
    //is the ball's coordinate system!)
    context.save();
    context.translate(car.x, car.y);
    context.beginPath();
    context.rect(0,0,car.size[0],car.size[1]);
    context.fillStyle = "#800";
    context.fill();
    
      context.save();
      context.translate(car.size[0]/2, car.size[1]);
      context.rotate(car.pendulum.theta);
      drawPendulum();
      context.restore();
    context.restore();
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
  this.center = Math.random() * canvas.width;
  this.x = this.center - this.size[0]/2;
  this.y = y;
  this.v = 0;
  this.a = shm * (canvas.width / 2 - this.center);
  this.pendulum = new Pendulum();
}

function Pendulum() {
  this.L = Math.random() * 50 + 50;
  this.theta = Math.random() * Math.PI - Math.PI/2;
  this.w = 0;
}