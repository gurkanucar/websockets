// class Bullet {
//   constructor(x, y, velocityX, velocityY) {
//     this.x = x;
//     this.y = y;
//     this.velocityX = velocityX;
//     this.velocityY = velocityY;
//     this.size = 5; // the size of the bullet can be set to a fixed value
//   }

//   update() {
//     this.x += this.velocityX;
//     this.y += this.velocityY;
//   }

//   checkCollision(gamePieces) {
//     for (let i = 0; i < gamePieces.length; i++) {
//       if (this.x > gamePieces[i].x - gamePieces[i].width / 2 &&
//           this.x < gamePieces[i].x + gamePieces[i].width / 2 &&
//           this.y > gamePieces[i].y - gamePieces[i].height / 2 &&
//           this.y < gamePieces[i].y + gamePieces[i].height / 2) {
//             // collision detected
//             console.log("collision detected with game piece: " + i);
//             // remove the game piece from the game pieces array
//             gamePieces.splice(i, 1);
//             // remove the bullet from the game pieces array
//             gamePieces.splice(gamePieces.indexOf(this), 1);
//             break;
//           }
//     }
//   }
// }

// class GamePiece {
//   constructor(width, height, color, x, y) {
//     this.width = width;
//     this.height = height;
//     this.color = color;
//     this.x = x;
//     this.y = y;
//     this.speed = 0;
//     this.angle = 0;
//     this.moveAngle = 0;
//     this.xMin = 0;
//     this.xMax = 480;
//     this.yMin = 0;
//     this.yMax = 270;
//   }

//   update() {
//     const ctx = myGameArea.context;
//     ctx.save();
//     ctx.translate(this.x, this.y);
//     ctx.rotate(this.angle);
//     ctx.fillStyle = this.color;
//     ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
//     ctx.restore();
//   }

//   newPos() {
//     this.angle += (this.moveAngle * Math.PI) / 180;
//     this.x += this.speed * Math.sin(this.angle);
//     this.y -= this.speed * Math.cos(this.angle);

//     // Check if the new x position is within the xMin and xMax bounds
//     if (this.x < this.xMin) {
//       this.x = this.xMin;
//     } else if (this.x > this.xMax) {
//       this.x = this.xMax;
//     }

//     // Check if the new y position is within the yMin and yMax bounds
//     if (this.y < this.yMin) {
//       this.y = this.yMin;
//     } else if (this.y > this.yMax) {
//       this.y = this.yMax;
//     }
//   }
// }

// class GameArea {
//   constructor() {
//     this.canvas = document.createElement("canvas");
//     this.canvas.width = 480;
//     this.canvas.height = 270;
//     this.context = this.canvas.getContext("2d");
//     document.body.insertBefore(this.canvas, document.body.childNodes[0]);
//     this.frameNo = 0;
//     this.keys = {};
//   }

//   start() {
//     updateGameArea();
//     window.addEventListener("keydown", (e) => {
//       e.preventDefault();
//       this.keys[e.keyCode] = e.type === "keydown";
//     });
//     window.addEventListener("keyup", (e) => {
//       this.keys[e.keyCode] = e.type === "keydown";
//     });
//   }

//   stop() {
//     clearInterval(this.interval);
//   }

//   clear() {
//     this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
//   }
// }

// var gamePieces = [];

// const myGameArea = new GameArea();
// const myGamePiece = new GamePiece(30, 30, "red", 225, 225);
// const myGamePiece2 = new GamePiece(30, 30, "blue", 5, 25);

// gamePieces.push(myGamePiece);
// gamePieces.push(myGamePiece2);

// function startGame() {
//   myGameArea.start();
// }

// function updateGameArea() {
//   myGameArea.clear();
//   for (var i = 0; i < gamePieces.length; i++) {
//     gamePieces[i].moveAngle = 0;
//     gamePieces[i].speed = 0;
//     if (myGameArea.keys[37]) {
//       gamePieces[i].moveAngle = -5;
//     }
//     if (myGameArea.keys[39]) {
//       gamePieces[i].moveAngle = 5;
//     }
//     if (myGameArea.keys[38]) {
//       gamePieces[i].speed = 5;
//     }
//     if (myGameArea.keys[40]) {
//       gamePieces[i].speed = -5;
//     }
//     gamePieces[i].newPos();
//     gamePieces[i].update();
//   }
//   requestAnimationFrame(updateGameArea);
// }

class Bullet {
  constructor(userId, x, y, angle) {
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
    const ctx = myGameArea.context;
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

class GamePiece {
  constructor(userId, width, height, color, x, y) {
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

class DummyGamePiece extends GamePiece {
  constructor(width, height, color, x, y) {
    super(null, width, height, color, x, y);
  }

  newPos() {
    // Do not update position when arrow keys are pressed
  }
}

class GameArea {
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

var gamePieces = [];

const myGameArea = new GameArea();
const myGamePiece = new GamePiece("playerMe", 30, 30, "red", 225, 225);
const myGamePiece2 = new GamePiece("playerMe2", 30, 30, "blue", 5, 25);
const dummyGamePiece = new DummyGamePiece(30, 30, "green", 150, 150);
const dummyGamePiece2 = new DummyGamePiece(30, 30, "green", 10, 20);
const dummyGamePiece3 = new DummyGamePiece(30, 30, "green", 420, 180);
const dummyGamePiece4 = new DummyGamePiece(30, 30, "green", 40, 200);

gamePieces.push(myGamePiece);
gamePieces.push(dummyGamePiece,dummyGamePiece2,dummyGamePiece3,dummyGamePiece4);
//gamePieces.push(myGamePiece2);

function startGame() {
  myGameArea.start();
}

function updateGameArea() {
  myGameArea.clear();

  if (myGameArea.keys[32]) {
    const now = new Date().getTime();
    if (now - myGameArea.lastFired > 500) {
      myGameArea.lastFired = now;
      const player = gamePieces.find((p) => p instanceof GamePiece);
      const bullet = new Bullet("playerMe", player.x, player.y, player.angle);
      gamePieces.push(bullet);
    }
  }

  for (let i = 0; i < gamePieces.length; i++) {
    gamePieces[i].moveAngle = 0;
    gamePieces[i].speed = 0;
    if (gamePieces[i] instanceof GamePiece) {
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

    if (gamePieces[i] instanceof Bullet) {
      gamePieces[i].update();
      if (
        gamePieces[i].x > 480 ||
        gamePieces[i].x < 0 ||
        gamePieces[i].y > 270 ||
        gamePieces[i].y < 0
      ) {
        gamePieces.splice(i, 1);
        continue;
      }
      gamePieces[i].checkCollision(gamePieces);
    }
  }

  requestAnimationFrame(updateGameArea);
}
