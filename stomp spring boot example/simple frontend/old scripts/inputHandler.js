addEventListener("keydown", (e) => {
  switch (e.code) {
    case "KeyW":
      velocityYUp = -speed;
      break;
    case "KeyS":
      velocityYDown = speed;
      break;
    case "KeyA":
      velocityXLeft = -speed;
      break;
    case "KeyD":
      velocityXRight = speed;
      break;
  }
});

addEventListener("keyup", (e) => {
  switch (e.code) {
    case "KeyW":
      yOld = y;
      velocityYUp = 0;
      break;
    case "KeyS":
      yOld = y;
      velocityYDown = 0;
      break;
    case "KeyA":
      xOld = x;
      velocityXLeft = 0;
      break;
    case "KeyD":
      xOld = x;
      velocityXRight = 0;
      break;
  }
});
