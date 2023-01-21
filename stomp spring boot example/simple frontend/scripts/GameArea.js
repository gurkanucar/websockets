import { updateGameArea } from "./main.js";

export default class GameArea {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.lastFired = 0;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.keys = {};
  }

  start() {
    updateGameArea();
    window.addEventListener("keydown", (e) => {
      e.preventDefault();
      this.keys[e.keyCode] = e.type === "keydown";
    });
    window.addEventListener("keyup", (e) => {
      this.keys[e.keyCode] = e.type === "keydown";
    });
  }

  stop() {
    clearInterval(this.interval);
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
