import Player from "./Player.js";
import GameArea from "./GameArea.js";
import DummyPlayer from "./DummyPlayer.js";
import Bullet from "./Bullet.js";

var gamePieces = [];

const myGameArea = new GameArea();
const myPlayer = new Player(myGameArea, "playerMe", 30, 30, "red", 225, 225);
const dummyPlayer = new DummyPlayer(myGameArea, 30, 30, "green", 150, 150);
const dummyPlayer2 = new DummyPlayer(myGameArea, 30, 30, "green", 10, 20);
const dummyPlayer3 = new DummyPlayer(myGameArea, 30, 30, "green", 420, 180);
const dummyPlayer4 = new DummyPlayer(myGameArea, 30, 30, "green", 40, 200);

gamePieces.push(myPlayer);
gamePieces.push(dummyPlayer, dummyPlayer2, dummyPlayer3, dummyPlayer4);
//gamePieces.push(myGamePiece2);

window.onload = function () {
  startGame();
};

const startGame = () => {
  myGameArea.start();
};

export const updateGameArea = () => {
  myGameArea.clear();

  if (myGameArea.keys[32]) {
    const now = new Date().getTime();
    if (now - myGameArea.lastFired > 500) {
      myGameArea.lastFired = now;
      const player = gamePieces.find((p) => p instanceof Player);
      const bullet = new Bullet(
        myGameArea,
        "playerMe",
        player.x,
        player.y,
        player.angle
      );
      gamePieces.push(bullet);
    }
  }

  for (let i = 0; i < gamePieces.length; i++) {
    gamePieces[i].moveAngle = 0;
    gamePieces[i].speed = 0;
    if (gamePieces[i] instanceof Player) {
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
};
