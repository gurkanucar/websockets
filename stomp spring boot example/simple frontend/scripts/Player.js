

export default class Player {
  constructor(myGameArea, userId, width, height, color, x, y) {
    this.myGameArea = myGameArea;
    this.userId = userId;
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.xMin = 0;
    this.xMax = 480;
    this.yMin = 0;
    this.yMax = 270;
  }

  update() {
    const ctx = this.myGameArea.context;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(0, -this.height / 2);
    ctx.lineTo(-this.width / 2, this.height / 2);
    ctx.lineTo(this.width / 2, this.height / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  newPos() {
    this.angle += (this.moveAngle * Math.PI) / 180;
    this.x += this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);

    // Check if the new x position is within the xMin and xMax bounds
    if (this.x < this.xMin) {
      this.x = this.xMin;
    } else if (this.x > this.xMax) {
      this.x = this.xMax;
    }

    // Check if the new y position is within the yMin and yMax bounds
    if (this.y < this.yMin) {
      this.y = this.yMin;
    } else if (this.y > this.yMax) {
      this.y = this.yMax;
    }
  }
}
