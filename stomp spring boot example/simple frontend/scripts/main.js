import Player from "./Player.js";
import GameArea from "./GameArea.js";
import DummyPlayer from "./DummyPlayer.js";
import Bullet from "./Bullet.js";

let clientID = "";
const messageInput = document.getElementById("message");
const roomValue = document.getElementById("room");

let gamePieces = [];
let clients = [];
let stompClientGlobal = undefined;

const gameWidth = 500;
const gameHeight = 500;

const myGameArea = new GameArea(gameWidth, gameHeight);
// const myPlayer = new Player(myGameArea, "playerMe", 30, 30, "red", 225, 225);
// const dummyPlayer = new DummyPlayer(myGameArea, 30, 30, "green", 150, 150);
// const dummyPlayer2 = new DummyPlayer(myGameArea, 30, 30, "green", 10, 20);
// const dummyPlayer3 = new DummyPlayer(myGameArea, 30, 30, "green", 420, 180);
// const dummyPlayer4 = new DummyPlayer(myGameArea, 30, 30, "green", 40, 200);

// gamePieces.push(myPlayer);
// gamePieces.push(dummyPlayer, dummyPlayer2, dummyPlayer3, dummyPlayer4);
//gamePieces.push(myGamePiece2);

const connect = () => {
  const socket = new SockJS("http://192.168.0.27:8080/ws");
  const stompClient = Stomp.over(socket);
  stompClient.debug = null;
  stompClientGlobal = stompClient;
  stompClient.connect({}, (frame) => {
    clientID = frame.headers["user-name"];

    const myPlayer = new Player(myGameArea, clientID, 30, 30, "red", 225, 225);
    gamePieces.push(myPlayer);

    document.getElementById("send_btn").removeAttribute("disabled");

    // Subscribe to a destination
    stompClient.subscribe("/topic/game/" + roomValue.value, function (message) {
      let data = JSON.parse(message.body);
      // incomingData.push(event);

      console.log(clients);
      let client = clients.find((c) => c.userId == data.clientID);

      if (client) {
        client.x = data.x;
        client.y = data.y;
        client.angle = data.angle;
      } else if (data.clientID != clientID) {
        clients.push(
          new Player(
            myGameArea,
            data.clientID,
            30,
            30,
            "black",
            data.x,
            data.y,
            data.angle
          )
        );
      }

      document.getElementById("incomingData").innerText = JSON.stringify(data);
      //   document.getElementById("incomingDataList").innerText =
      //     JSON.stringify(incomingData);
    });

    stompClient.subscribe(
      "/topic/sendYourPosition/" + roomValue.value,
      function (message) {
        sendPosition(myPlayer);
      }
    );

    stompClient.subscribe("/topic/disconnected", function (data) {
      const disconnectedUser = JSON.parse(data.body).message;
      clients = clients.filter((x) => x.clientID != disconnectedUser);
    });
  });
};

const sendPosition = (player) => {
  if (stompClientGlobal == undefined) return;
  stompClientGlobal.send(
    "/app/game/" + roomValue.value,
    {},
    JSON.stringify({
      clientID: clientID,
      x: player.x,
      y: player.y,
      angle: player.angle,
    })
  );
};

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
    if (now - myGameArea.lastFired > 400) {
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
      if (myGameArea.keys[37] || myGameArea.keys[65]) {
        gamePieces[i].moveAngle = -5;
      }
      if (myGameArea.keys[39] || myGameArea.keys[68]) {
        gamePieces[i].moveAngle = 5;
      }
      if (myGameArea.keys[38] || myGameArea.keys[87]) {
        gamePieces[i].speed = 5;
      }
      if (myGameArea.keys[40] || myGameArea.keys[83]) {
        gamePieces[i].speed = -5;
      }

      gamePieces[i].newPos();
      gamePieces[i].update();
      if (gamePieces[i].hasPositionChanged()) {
        sendPosition(gamePieces[i]);
      }
    }

    if (gamePieces[i] instanceof Bullet) {
      gamePieces[i].update();
      if (
        gamePieces[i].x > gameWidth ||
        gamePieces[i].x < 0 ||
        gamePieces[i].y > gameHeight ||
        gamePieces[i].y < 0
      ) {
        gamePieces.splice(i, 1);
        continue;
      }
      gamePieces[i].checkCollision(gamePieces);
    }
  }

  clients.forEach((x) => x.update());

  requestAnimationFrame(updateGameArea);
};

document.getElementById("connect").addEventListener("click", connect);
// document.getElementById('send_btn').addEventListener("click", signup)
