// const socket = new WebSocket("ws://localhost:8080/ws");

// // Handle the 'open' event
// socket.onopen = function (event) {
//   console.log("WebSocket connection established");
//   socket.send("Hello Server!");
// };

// // Handle the 'message' event
// socket.onmessage = function (event) {
//   console.log("Received message: ", event.data);

//   const data = JSON.parse(event.data);
//   if (data.event === "/queue/events") {
//     console.log("Received event:", data.data);
//   }
// };

// // Handle the 'close' event
// socket.onclose = function (event) {
//   console.log("WebSocket connection closed: ", event);
// };

// // Handle the 'error' event
// socket.onerror = function (error) {
//   console.error("WebSocket error: ", error);
// };

// const onSendClick = () => {
//   console.log("onSendClick");
//   socket.send("event", { message: "hello!" });
// };




//OLD SOCKET CODE!!!!

// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");

// const height = 500,
//   width = 500;

// const charHeight = 30,
//   charWidth = 30;

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

// const incomingData = [];
// let clientID = "";

// let stompClientGlobal = undefined;

// const messageInput = document.getElementById("message");
// const roomValue = document.getElementById("room");

// const connect = () => {
//   const socket = new SockJS("http://192.168.0.27:8080/ws");
//   const stompClient = Stomp.over(socket);
//   //stompClient.debug = null;
//   stompClientGlobal = stompClient;
//   stompClient.connect({}, (frame) => {
//     clientID = frame.headers["user-name"];
//     document.getElementById("send_btn").removeAttribute("disabled");

//     // Subscribe to a destination
//     stompClient.subscribe("/topic/game/" + roomValue.value, function (message) {
//       let data = JSON.parse(message.body);
//       // incomingData.push(event);
//       let client = clients.find((c) => c.clientID === data.clientID);
//       if (!client) {
//         client = { clientID: data.clientID, x: data.x, y: data.y };
//         clients.push(client);
//       }
//       clients.forEach((temp) => {
//         if (temp.clientID == data.clientID) {
//           temp.x = data.x;
//           temp.y = data.y;
//         }

//         return temp;
//       });
//       document.getElementById("incomingData").innerText = JSON.stringify(data);
//       //   document.getElementById("incomingDataList").innerText =
//       //     JSON.stringify(incomingData);
//     });

//     stompClient.subscribe(
//       "/topic/sendYourPosition/" + roomValue.value,
//       function (message) {
//         stompClientGlobal.send(
//           "/app/game/" + roomValue.value,
//           {},
//           JSON.stringify({ clientID, x, y })
//         );
//       }
//     );

//     stompClient.subscribe("/topic/disconnected", function (data) {
//       const disconnectedUser = JSON.parse(data.body).message;
//       clients = clients.filter((x) => x.clientID != disconnectedUser);
//     });
//   });
// };

// const update = () => {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   // Iterate over the array of clients and render each one
//   ctx.fillStyle = "black";
//   clients.forEach((client) => {
//     if (client.clientID != clientID) {
//       ctx.fillRect(client.x, client.y, charWidth, charHeight);
//     }
//   });

//   ctx.fillStyle = "white";
//   ctx.fillRect(x, y, charWidth, charHeight);
//   move();
//   if (xOld != x || yOld != y) {
//     //   socket.emit("stateUpdate", { clientID, x, y });
//     sendPosition();
//   }
//   requestAnimationFrame(update);
// };

// const sendPosition = () => {
//   if (stompClientGlobal == undefined) return;
//   stompClientGlobal.send(
//     "/app/game/" + roomValue.value,
//     {},
//     JSON.stringify({ clientID, x, y })
//   );
// };

// const onSendClick = () => {
//   if (stompClientGlobal == undefined) return;
//   stompClientGlobal.send(
//     "/app/room/" + roomValue.value,
//     {},
//     JSON.stringify({ message: messageInput.value })
//   );
// };

// update();
