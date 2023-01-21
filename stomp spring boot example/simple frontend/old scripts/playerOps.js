// var socket = io(":3000");

// let clientID = ""; //prompt("Please enter your name", "");

// socket.on("connect", () => {
//   console.log(socket.id);
//   clientID = socket.id;
// });

// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");

// const height = 500,
//   width = 500;

// const charHeight = 50,
//   charWidth = 50;

// canvas.width = width;
// canvas.height = height;

// let clients = [];
// let x = 0,
//   y = 0,
//   xOld = 0,
//   yOld = 0;

// let speed = 5;

// let velocityXLeft = 0,
//   velocityXRight = 0,
//   velocityYUp = 0,
//   velocityYDown = 0;

// const move = () => {
//   if (!(x - (speed + velocityXRight) < 0)) {
//     x += velocityXLeft;
//   }
//   if (!(x + (speed + velocityXLeft + charWidth) > width)) {
//     x += velocityXRight;
//   }

//   if (!(y - (speed + velocityYDown) < 0)) {
//     y += velocityYUp;
//     velocityYDown;
//   }
//   if (!(y + (speed + velocityYUp + charHeight) > height)) {
//     y += velocityYDown;
//   }
// };

// const update = () => {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   // Iterate over the array of clients and render each one
//   ctx.fillStyle = 'black';
//   clients.forEach((client) => {
//     if (client.clientID != clientID) {
//       ctx.fillRect(client.x, client.y, charWidth, charHeight);
//     }
//   });

  
//   ctx.fillStyle = 'white';
//   ctx.fillRect(x, y, charWidth, charHeight);
//   move();
//   if (xOld != x || yOld != y) {
//     socket.emit("stateUpdate", { clientID, x, y });
//   }
//   requestAnimationFrame(update);
// };

// update();

// socket.on("removePlayer", function (data) {
//   clients = clients.filter((c) => c.clientID !== data.clientID);
// });

// socket.on("stateUpdateForwardedByServer", function (data) {
//   // Update the client's state in the array of clients
//   let client = clients.find((c) => c.clientID === data.clientID);
//   if (!client) {
//     client = { clientID: data.clientID, x: data.x, y: data.y };
//     clients.push(client);
//   }
//   clients.forEach((temp) => {
//     if (temp.clientID == data.clientID) {
//       temp.x = data.x;
//       temp.y = data.y;
//     }

//     return temp;
//   });
// });

// socket.on("sendYourPosition", () => {
//   socket.emit("stateUpdate", { clientID, x, y });
// });
