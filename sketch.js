
// time for the beginning of the animation and for the current moment
var start, now;

// A slider for the duration in seconds
var durationSlider;

// Control points for bézier
var p = [[10,10], [50,500], [500,500], [250,250]];

// Encapsulates a moving object
function MovingObject() {
  var self = this;
  self.xfunc = linear;
  self.yfunc = linear;
  self.x = 0;
  self.y = 0;
  self.update = function (t) {
    self.x = self.xfunc(t);
    self.y = self.yfunc(t);
  }
  self.draw = function () {
    push();
    translate (self.x, self.y);
    rect (-10,-10,20,20);
    pop();
  }
}

// Encapsulates a moving and rotating object
function MovingRotatingObject() {
  MovingObject.call(this);
  var self = this;
  self.angle = 0;
  self.rotFunc = constant(0);
  var superUpdate = self.update;
  self.update = function (t) {
    superUpdate(t);
    self.angle = self.rotFunc(t);
  }
  self.draw = function () {
    push();
    translate (self.x, self.y);
    rotate(self.angle);
    rect (-10,-10,20,20);
    pop();
  }
}

// A moving object that moves according to the curve given by control points in p
function BezierObject (p) {
  MovingRotatingObject.call(this);
  var self = this;
  self.xfunc = bezierFunc(p[0][0],p[1][0],p[2][0],p[3][0]);
  self.yfunc = bezierFunc(p[0][1],p[1][1],p[2][1],p[3][1]);
  self.rotFunc = function (t) {
    var tx = bezierTangent(p[0][0],p[1][0],p[2][0],p[3][0], t);
    var ty = bezierTangent(p[0][1],p[1][1],p[2][1],p[3][1], t);
    return atan2(ty,tx);    
  }
}

// A moving object that starts at a certain position (px,py) with a given velocity (vx,vy)
// and subject to gravity acceleration g (10 units per second by default) 
function GravityObject (px,py,vx,vy,g) {
  if (typeof g == 'undefined') g = 10;
  MovingRotatingObject.call(this);
  var self = this;
  self.xfunc = phys(px,vx,0.0);
  self.yfunc = phys(py,vy,g);
  self.rotFunc = mapRange(linear,0,2*TWO_PI);
}


// Setup
function setup() {
  createCanvas (600,600);

  duration = 5;
  durationSlider = createSlider(0.1, 5, duration, 0.1);
  durationSlider.size(100);
  durationSlider.position (10,10);
  durationSlider.changed(function () {
    duration = durationSlider.value();
  });

  start = new Date();
}

// Pick one of the control points if mouse is close enough
function mousePressed() {
  selected = null;
  for (var i = 0; i < 4; i++) {
    var q = p[i];
    if (dist (mouseX,mouseY,q[0],q[1]) < 5) selected = q; 
  }
}

// Move selected control point if any
function mouseDragged() {
  if (selected !== null) {
    selected[0] += mouseX-pmouseX;
    selected[1] += mouseY-pmouseY;
  }  
}

// Draw
function draw() {

  background (200);

  fill(0);
  text (duration,120,10);

  now = new Date();
  var seconds = (now.getTime() - start.getTime())/1000;
  if (seconds > duration) {
    seconds = 0;
    start = new Date();
  }

  // Draw the moving objects
  fill('white');
  var obj = new BezierObject (p);
  obj.update(seconds/duration);
  obj.draw();

  obj = new GravityObject(250,250,100,-500,500);
  obj.update(seconds/duration);
  obj.draw();

  // Draw the bezier curve and its control points
  fill ('blue');
  for (var i = 0; i < 4; i++) {
    rect(p[i][0]-5,p[i][1]-5,10,10);
  }
  noFill();
  bezier (p[0][0],p[0][1],p[1][0],p[1][1],p[2][0],p[2][1],p[3][0],p[3][1]);
}