export default class Bullet {
  constructor(myGameArea, userId, x, y, angle) {
    this.myGameArea = myGameArea;
    this.userId = userId;
    this.x = x;
    this.y = y;
    this.velocityX = 10 * Math.sin(angle);
    this.velocityY = -10 * Math.cos(angle);
    this.size = 5;
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    const ctx = this.myGameArea.context;
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  checkCollision(gamePieces) {
    for (let i = 0; i < gamePieces.length; i++) {
      if (gamePieces[i].userId != this.userId) {
        if (
          this.x > gamePieces[i].x - gamePieces[i].width / 2 &&
          this.x < gamePieces[i].x + gamePieces[i].width / 2 &&
          this.y > gamePieces[i].y - gamePieces[i].height / 2 &&
          this.y < gamePieces[i].y + gamePieces[i].height / 2
        ) {
          gamePieces.splice(i, 1);
          gamePieces.splice(gamePieces.indexOf(this), 1);
          break;
        }
      }
    }
  }
}
