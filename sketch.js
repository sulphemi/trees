let orbList;
let root;
let MODE;
let drawBackground;
let applyGravity;

const modeC = 3;

const SPRING_CONSTANT = 0.015;
const SPRING_LENGTH = 50;
const SPRING_DAMPEN = 0.995;

function setup() {
  createCanvas(windowWidth, windowHeight);
  orbList = [];
  noStroke(); // prettier this way

  root = new Orb(width / 2, height / 2, 0, 0, 10);
  drawBackground = true;
  applyGravity = true;
}

function addNewOrb(orb, x, y) {
  if (orb.left === null) {
    orb.left = new Orb(x, y);
    orbList.push(orb.left);
  } else if (orb.right === null) {
    orb.right = new Orb(x, y);
    orbList.push(orb.right);
  } else {
    addNewOrb(orb.left, x, y);
  }
}

function mouseClicked() {
  // orbList.push(new Orb(mouseX, mouseY, 5, 0, 20));
  addNewOrb(root, mouseX, mouseY);
}

function draw() {
  if (drawBackground) {
    background(255);
  }

  for (let o of orbList) {
    o.move();
    o.display();
    //o.drawStick();
  }

  root.display();
  dothing(root);

  for (let o of orbList) {
    for (let k of orbList) {
      if (o != k) o.repel(k);
    }
  }

  fill(0);
  text(orbList.length, 20, 40);
  text("GRAVITY " + (applyGravity ? "ON" : "OFF"), 20, 80);
}

function dothing(orb) {
  if (orb === null) return;

  orb.display();

  if (orb.left) {
    orb.attractSpring(orb.left);
    stroke(0);
    line(orb.x, orb.y, orb.left.x, orb.left.y);
    noStroke();
  }
  if (orb.right) {
    orb.attractSpring(orb.right);
    stroke(0);
    line(orb.x, orb.y, orb.right.x, orb.right.y);
    noStroke();
  }

  dothing(orb.left);
  dothing(orb.right);
}

function keyPressed() {
//   switch (key) {
//     case ' ':
//       MODE = (MODE + 1) % modeC;
//       break;
//     case 'b':
//       drawBackground = !drawBackground;
//       break;
//     case 'Backspace':
//       orbList = []; // frees the arraylist from memory and assigns it a new one
//       break;
//     case 'g':
//       applyGravity = !applyGravity;
//       break;
//   }
}

class Orb {
  constructor(x_, y_, xSpeed_=0, ySpeed_=0, radius_=20) {
    this.x = x_;
    this.y = y_;
    this.xSpeed = xSpeed_;
    this.ySpeed = ySpeed_;
    this.radius = radius_;
    // random color... why not.
    this.c = color(random(255), random(255), random(255), random(155) + 100);

    this.left = null;
    this.right = null;
  }

  display() {
    fill(this.c);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }

  move() {

    if (applyGravity) {
      this.applyGravity();
    }

    this.x += this.xSpeed;
    this.y += this.ySpeed;

    this.xSpeed /= 1.1;
    this.ySpeed /= 1.1;
  }

  attract(other) {
    const gConst = 20.0;
    const d = dist(this.x, this.y, other.x, other.y);
    other.xSpeed += (gConst * (this.x - other.x)) / pow(d, 2);
    other.ySpeed += (gConst * (this.y - other.y)) / pow(d, 2);
  }

  repel(other) {
    const gConst = 15.0;
    const d = dist(this.x, this.y, other.x, other.y);
    other.xSpeed -= (gConst * (this.x - other.x)) / pow(d, 2);
    other.ySpeed -= (gConst * (this.y - other.y)) / pow(d, 2);
  }

  attractSpring(other) {
    const d = dist(this.x, this.y, other.x, other.y);
    const force = SPRING_CONSTANT * (d - SPRING_LENGTH);

    other.xSpeed += (force * (-(other.x - this.x))) / d;
    other.xSpeed *= SPRING_DAMPEN;

    other.ySpeed += (force * (-(other.y - this.y))) / d;
    other.ySpeed *= SPRING_DAMPEN;
  }

  drawStick() {
    stroke(this.c);
    line(this.x, this.y, this.x + this.xSpeed * 5, this.y + this.ySpeed * 5);
    noStroke();
  }

  bounceOnEdge() {
    // top edge
    if (this.y - this.radius < 0) {
      this.ySpeed = abs(this.ySpeed);
    }

    // bottom edge
    if (this.y + this.radius > height) {
      this.ySpeed = -abs(this.ySpeed);
    }

    // left edge
    if (this.x - this.radius < 0) {
      this.xSpeed = abs(this.xSpeed);
    }

    // right edge
    if (this.x + this.radius > width) {
      this.xSpeed = -abs(this.xSpeed);
    }
  }

  applyGravity() {
    const gravity = 0.50;
    this.ySpeed += gravity;
  }
}