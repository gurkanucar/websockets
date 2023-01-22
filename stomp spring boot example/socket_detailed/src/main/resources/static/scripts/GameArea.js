import { updateGameArea } from "./main.js";

export default class GameArea {
  constructor(width = 500, height = 500) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.lastFired = 0;
    this.context = this.canvas.getContext("2d");
    this.frameNo = 0;
    this.keys = {};

    //add to body
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    document.body.appendChild(container);
    container.appendChild(this.canvas);
  }

  start() {
    updateGameArea();
    window.addEventListener("keydown", (e) => {
      //e.preventDefault();
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
