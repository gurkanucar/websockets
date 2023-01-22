import Player from "./Player.js";
import GameArea from "./GameArea.js";
import DummyPlayer from "./DummyPlayer.js";
import Bullet from "./Bullet.js";

let clientID = "";
const messageInput = document.getElementById("message");
const roomValue = document.getElementById("room");

let gameObjects = [];
let clients = [];
let stompClientGlobal = undefined;

const gameWidth = 500;
const gameHeight = 400;

const myGameArea = new GameArea(gameWidth, gameHeight);
// const myPlayer = new Player(myGameArea, "playerMe", 30, 30, "red", 225, 225);
// const dummyPlayer = new DummyPlayer(myGameArea, 30, 30, "green", 150, 150);
// const dummyPlayer2 = new DummyPlayer(myGameArea, 30, 30, "green", 10, 20);
// const dummyPlayer3 = new DummyPlayer(myGameArea, 30, 30, "green", 420, 180);
// const dummyPlayer4 = new DummyPlayer(myGameArea, 30, 30, "green", 40, 200);

// gameObjects.push(myPlayer);
// gameObjects.push(dummyPlayer, dummyPlayer2, dummyPlayer3, dummyPlayer4);
//gameObjects.push(gameObject);

const connect = () => {
  const socket = new SockJS("http://192.168.0.27:8080/ws");
  const stompClient = Stomp.over(socket);
  //stompClient.debug = null;
  stompClientGlobal = stompClient;
  stompClient.connect({}, (frame) => {
    clientID = frame.headers["user-name"];

    const myPlayer = new Player(myGameArea, clientID, 30, 30, "red", 225, 225);
    gameObjects.push(myPlayer);
    document.getElementById("connect").setAttribute('disabled', 'disabled');
    document.getElementById("room").setAttribute('disabled', 'disabled');

    // Subscribe to a destination
    stompClient.subscribe("/topic/game/" + roomValue.value, function (message) {
      //document.getElementById("incomingData").innerText = JSON.stringify(data);
      //   document.getElementById("incomingDataList").innerText =
      //     JSON.stringify(incomingData);
    });

    stompClient.subscribe("/user/queue/player", (message) => {
      handlePlayerEvents(message);
    });

    stompClient.subscribe("/user/queue/bullet", (message) => {
      handleBulletEvents(message);
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
  if (stompClientGlobal == undefined) {
    return;
  }
  stompClientGlobal.send(
      "/app/game/" + roomValue.value,
      {},
      JSON.stringify({
        type: "PLAYER",
        clientID: clientID,
        x: player.x,
        y: player.y,
        angle: player.angle,
      })
  );
};

const sendBullet = (player) => {
  if (stompClientGlobal == undefined) {
    return;
  }
  stompClientGlobal.send(
      "/app/game/" + roomValue.value,
      {},
      JSON.stringify({
        type: "BULLET",
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
    if (now - myGameArea.lastFired > 100) {
      myGameArea.lastFired = now;
      const player = gameObjects.find((p) => p instanceof Player);
      const bullet = new Bullet(
          myGameArea,
          clientID,
          player.x,
          player.y,
          player.angle
      );
      gameObjects.push(bullet);
      sendBullet(player);
    }
  }

  processGameObjectsArray(gameObjects);
  processGameObjectsArray(clients, true);

  requestAnimationFrame(updateGameArea);
};

document.getElementById("connect").addEventListener("click", connect);

const handlePlayerEvents = (message) => {
  let data = JSON.parse(message.body);
  let client = clients.find((c) => c.userId == data.clientID);
  if (client) {
    client.x = data.x;
    client.y = data.y;
    client.angle = data.angle;
  } else {
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
};

const processGameObjectsArray = (gameObjects, isClient = false) => {
  for (let i = 0; i < gameObjects.length; i++) {
    //processClients
    if (isClient) {
      if (gameObjects[i] instanceof Player) {
        gameObjects[i].update();
      } else if (gameObjects[i] instanceof Bullet) {
        gameObjects[i].update();
        if (
            gameObjects[i].x > gameWidth ||
            gameObjects[i].x < 0 ||
            gameObjects[i].y > gameHeight ||
            gameObjects[i].y < 0
        ) {
          gameObjects.splice(i, 1);
          continue;
        }
        gameObjects[i].checkCollision(gameObjects);
      }
      continue;
    }

    //process player objects
    gameObjects[i].moveAngle = 0;
    gameObjects[i].speed = 0;
    if (gameObjects[i] instanceof Player) {
      if (myGameArea.keys[37] || myGameArea.keys[65]) {
        gameObjects[i].moveAngle = -5;
      }
      if (myGameArea.keys[39] || myGameArea.keys[68]) {
        gameObjects[i].moveAngle = 5;
      }
      if (myGameArea.keys[38] || myGameArea.keys[87]) {
        gameObjects[i].speed = 5;
      }
      if (myGameArea.keys[40] || myGameArea.keys[83]) {
        gameObjects[i].speed = -5;
      }

      gameObjects[i].newPos();
      gameObjects[i].update();
      if (gameObjects[i].hasPositionChanged()) {
        sendPosition(gameObjects[i]);
      }
    }

    if (gameObjects[i] instanceof Bullet) {
      gameObjects[i].update();
      if (
          gameObjects[i].x > gameWidth ||
          gameObjects[i].x < 0 ||
          gameObjects[i].y > gameHeight ||
          gameObjects[i].y < 0
      ) {
        gameObjects.splice(i, 1);
        continue;
      }
      gameObjects[i].checkCollision(gameObjects);
    }
  }
};

const handleBulletEvents = (message) => {
  let data = JSON.parse(message.body);
  clients.push(
      new Bullet(myGameArea, data.clientID, data.x, data.y, data.angle)
  );
};
