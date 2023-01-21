class GamePiece {
    constructor(width, height, color, x, y) {
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
      const ctx = myGameArea.context;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;
      ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
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
  
  
  class GameArea {
    constructor() {
      this.canvas = document.createElement("canvas");
      this.canvas.width = 480;
      this.canvas.height = 270;
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
  
  var gamePieces = [];
  
  const myGameArea = new GameArea();
  const myGamePiece = new GamePiece(30, 30, "red", 225, 225);
  const myGamePiece2 = new GamePiece(30, 30, "blue", 5, 25);
  
  gamePieces.push(myGamePiece);
  gamePieces.push(myGamePiece2);
  
  function startGame() {
    myGameArea.start();
  }
  
  function updateGameArea() {
    myGameArea.clear();
    for (var i = 0; i < gamePieces.length; i++) {
      gamePieces[i].moveAngle = 0;
      gamePieces[i].speed = 0;
      if (myGameArea.keys[37]) {
        gamePieces[i].moveAngle = -5;
      }
      if (myGameArea.keys[39]) {
        gamePieces[i].moveAngle = 5;
      }
      if (myGameArea.keys[38]) {
        gamePieces[i].speed = 5;
      }
      if (myGameArea.keys[40]) {
        gamePieces[i].speed = -5;
      }
      gamePieces[i].newPos();
      gamePieces[i].update();
    }
    requestAnimationFrame(updateGameArea);
  }