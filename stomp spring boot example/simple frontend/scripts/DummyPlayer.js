import Player from "./Player.js";

export default class DummyPlayer extends Player {
  constructor(myGameArea, width, height, color, x, y) {
    super(myGameArea, null, width, height, color, x, y);
  }

  update() {
    const ctx = this.myGameArea.context;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
    ctx.restore();
  }

  newPos() {
    // Do not update position when arrow keys are pressed
  }
}
