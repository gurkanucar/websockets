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

const incomingData = [];

let stompClientGlobal = undefined;

const messageInput = document.getElementById("message");
const roomValue = document.getElementById("room");

const connect = () => {
  const socket = new SockJS("http://localhost:8080/ws");
  const stompClient = Stomp.over(socket);
  //stompClient.debug = null;
  stompClientGlobal = stompClient;
  stompClient.connect({}, (frame) => {
    console.log("Connected: " + frame);

    // Subscribe to a destination
    stompClient.subscribe("/topic/room/" + roomValue.value, function (message) {
      var event = JSON.parse(message.body);
      incomingData.push(event);

      document.getElementById("incomingData").innerText = JSON.stringify(event);
      document.getElementById("incomingDataList").innerText =
        JSON.stringify(incomingData);
    });
  });
};

const onSendClick = () => {
  if (stompClientGlobal == undefined) return;
  stompClientGlobal.send(
    "/app/room/" + roomValue.value,
    {},
    JSON.stringify({ message: messageInput.value })
  );
};
