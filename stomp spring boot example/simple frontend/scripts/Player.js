export default class Player {
  constructor(
    myGameArea,
    userId,
    width,
    height,
    color,
    x,
    y,
    angle = 0,
    moveAngle = 0
  ) {
    this.myGameArea = myGameArea;
    this.userId = userId;
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.angle = angle;
    this.prevX = x;
    this.prevY = y;
    this.prevAngle = 0;
    this.prevMoveAngle = 0;
    this.moveAngle = moveAngle;
    this.xMin = 0;
    this.xMax = myGameArea.canvas.width;
    this.yMin = 0;
    this.yMax = myGameArea.canvas.height;
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
    this.prevX = this.x;
    this.prevY = this.y;
    this.prevAngle = this.angle;

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
  hasPositionChanged() {
    return (
      this.x != this.prevX ||
      this.y != this.prevY ||
      this.angle != this.prevAngle
    );
  }
}
