const gameContainer = document.getElementById("gameContainer");
const context = gameContainer.getContext("2d");
const containerWidth = parseInt(gameContainer.width);
const containerHeight = parseInt(gameContainer.height);

const ballRadius = 15;
let ballCoordinateX;
let ballCoordinateY;
let ballDistanceX;
let ballDistanceY;

const paddleWidth = 150;
const paddleHeight = 20;
let paddleCoordinateX;
let paddleCoordinateY;
const paddleHorizontalMovement = 15;
let bricksArray;
const numberOfBricks = 30;
const brickWidth = 80;
const brickHeight = 20;
let brickCoordinateX;
let brickCoordinateY;

let isGameOn;
let currentPlayer = 1;
let scorePlayer1 = 0;
let scorePlayer2 = 0;
let playerLives = 2;
const score = document.querySelector("#playerScore");
const player = document.querySelector("#currentPlayer");
const lifeAttempts = document.querySelectorAll(".playerLives");

// if(currentPlayer==2 && playerLives == 0){
//   checkWinner()
//   }
resetGame();
document.querySelector(".btn").addEventListener("click", newGame);

function resetGame() {
  score.innerText = 0;
  player.innerText = currentPlayer;
  //setting back the number of lives again for the user
  playerLives = 2;
  ballCoordinateX = containerWidth / 2;
  ballCoordinateY = containerHeight - 55;
  ballDistanceX = 3;
  ballDistanceY = -4;

  paddleCoordinateX = containerWidth / 2 - paddleWidth / 2;
  paddleCoordinateY = containerHeight - 40;

  brickCoordinateX = 15;
  brickCoordinateY = 40;
  bricksArray = [];
  for (let i = 0; i < numberOfBricks; i++) {
    const brick = {
      x: brickCoordinateX,
      y: brickCoordinateY,
      broken: false,
    };
    bricksArray.push(brick);
    brickCoordinateX = brickCoordinateX + 95;

    if ((i + 1) % 6 == 0) {
      brickCoordinateY += 45;
      brickCoordinateX = 15;
    }
  }
  // document.querySelector(".lives .playerLives").classList.remove("livesHidden");
}

function detectCollisionBallAndCanvasBorder() {
  if (
    ballCoordinateX - ballRadius < 0 ||
    ballCoordinateX + ballRadius > containerWidth
  ) {
    ballDistanceX = ballDistanceX * -1;
  }
  if (ballCoordinateY + ballDistanceY < 0) {
    ballDistanceY = ballDistanceY * -1;
  }

  if (ballCoordinateY + ballRadius > containerHeight) {
    handleLives();
  }

}

function newGame() {
  isGameOn = true;
  requestAnimationFrame(animate);
  document.addEventListener("keydown", movePaddle);
}

function animate() {
  if (!isGameOn) {
    return;
  }
  context.clearRect(0, 0, containerWidth, containerHeight);
  drawBricks();
  drawPaddle();
  drawBall();
  moveBall();
  detectCollisionBallAndCanvasBorder();
  detectCollisionBallAndPaddle();
  detectCollisionBallAndBrick();
  requestAnimationFrame(animate);
}

function drawBricks() {
  bricksArray.forEach(function (element) {
    if (element.broken !== false) {
      return "nothing";
    }
    context.beginPath();
    context.fillStyle = "blue";
    context.fillRect(element.x, element.y, brickWidth, brickHeight);
    context.fill();
    context.closePath();
  });
}
//function used to draw paddle
function drawPaddle() {
  context.fillStyle = "green";
  context.fillRect(
    paddleCoordinateX,
    paddleCoordinateY,
    paddleWidth,
    paddleHeight
  );
}
function drawBall() {
  context.fillStyle = "red";
  context.beginPath();
  // arc() accepts 5 arguments (x coordinate,y coordinate, circle radius, start angel, end angle)
  // x-> ball must be centered horizontally on the x axis (thus, containerWidth/ , and on Y axis i dont want the ball to be placed at the bottom of the canvas so i subtracted the height to value i found it suitable ), for ball radius is stored as a variable and hold the value 15 ,start drawing at angle 0 and do a 360deg meaning a full circle hence Math.PI *2
  context.arc(ballCoordinateX, ballCoordinateY, ballRadius, 0, Math.PI * 2);
  context.fill();
}
function moveBall() {
  ballCoordinateX += ballDistanceX;
  ballCoordinateY += ballDistanceY;
}

// function detectCollisionBallAndCanvasBorder() {
//   if (
//     ballCoordinateX + ballDistanceX < 0 ||
//     ballCoordinateX + ballDistanceX > containerWidth - ballRadius
//   ) {
//     ballDistanceX = ballDistanceX * -1;
//   }
//   if (ballCoordinateY + ballDistanceY < 0) {
//     ballDistanceY = ballDistanceY * -1;
//   }

//   if (ballCoordinateY + ballRadius > containerHeight) {
//     console.log("player life before start: ", playerLives);
//     // playerLives--;
//     console.log("player life after start: ", playerLives);
//     //   // document.querySelector(".lives .playerLives").classList.add("livesHidden");
//     //   let count = 0;
//     //   for (let i = 0; bricksArray.length; i++) {
//     //     if (bricksArray[i].broken == true) {
//     //       count++;
//     //     }
//     //   }
//     //   if (playerLives == 0 || count == numberOfBricks) {
//     //     gameOver();
//     //     setUp();
//     //     newGame();
//     //   }
//     // } else {
//       handleLives();
//   }
// }
function detectCollisionBallAndPaddle() {
  if (
    ballCoordinateX + ballRadius >= paddleCoordinateX &&
    ballCoordinateX - ballRadius <= paddleCoordinateX + paddleWidth &&
    ballCoordinateY + ballRadius >= paddleCoordinateY &&
    ballCoordinateY - ballRadius <= paddleCoordinateY + paddleHeight
  ) {
    ballCoordinateY += -5;
    ballDistanceY = ballDistanceY * -1;
  }
}

function detectCollisionBallAndBrick() {
  bricksArray
    .filter((brick) => !brick.broken)
    .forEach((brick) => {
      if (
        ballCoordinateX + ballRadius > brick.x &&
        ballCoordinateX - ballRadius < brick.x + brickWidth &&
        ballCoordinateY + ballRadius > brick.y &&
        ballCoordinateY - ballRadius < brick.y + brickHeight
      ) {
        ballDistanceY *= -1;
        brick.broken = true;
        if (currentPlayer == 1) {
          scorePlayer1++;
          document.querySelector("#playerScore").innerText = scorePlayer1;
          localStorage.setItem("scorePlayer1", scorePlayer1);
          //for testing
         console.log("local storage");
      for (i = 0; i < localStorage.length; i++)   {
          console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
      }
        } else {
          scorePlayer2++;
          document.querySelector("#playerScore").innerText = scorePlayer2;
         localStorage.setItem("scorePlayer2", scorePlayer2);
        //for testing
         for (i = 0; i < localStorage.length; i++)   {
          console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
      }
        }
        context.clearRect(brick.x, brick.y, brickWidth, brickHeight);
      }
    });
  context.font = "20px VT323";

  let counter = 0;
  for (let i = 0; i < bricksArray.length; i++) {
    if (bricksArray[i].broken == true) {
      counter++;
    }
  }

  // if (counter == numberOfBricks) {
  //   gameOver();
  // }
}

function movePaddle(event) {
  //left button is pressed
  if (event.keyCode == "37") {
    // take the original x coordinate of the paddle (which is in the middle of the container) and subtract it from the horizontal movement (distance) store the value inside the variable newPaddleXCoordinate and then pass this value to the isPaddleOutOfCanvas function if it returns false, store the new x coordinate of the paddle inside paddleCoordinateX variable which is the paddle x coordinate in the canvas
    let newPaddleXCoordinate = paddleCoordinateX - paddleHorizontalMovement;
    if (!isPaddleOutOfCanvas(newPaddleXCoordinate)) {
      paddleCoordinateX = newPaddleXCoordinate;
    }
  }
  //right button is pressed
  else if (event.keyCode == "39") {
    // take the original x coordinate of the paddle (which is in the middle of the container) and add it to the horizontal movement (distance) store the value inside the variable newPaddleXCoordinate and then pass this value to the isPaddleOutOfCanvas function if it returns false, store the new x coordinate of the paddle inside paddleCoordinateX variable which is the paddle x coordinate in the canvas
    let newPaddleXCoordinate = paddleCoordinateX + paddleHorizontalMovement;
    if (!isPaddleOutOfCanvas(newPaddleXCoordinate)) {
      paddleCoordinateX = newPaddleXCoordinate;
    }
  }
}

function isPaddleOutOfCanvas(horizontalCoordinateOfPaddle) {
  return (
    horizontalCoordinateOfPaddle < 0 ||
    horizontalCoordinateOfPaddle + paddleWidth > containerWidth
  );
}

function handleLives() {
  if(playerLives==2){
  lifeAttempts[1].classList.add("livesHidden");
  playerLives--;                                                                       
  }else{
    lifeAttempts[0].classList.add("livesHidden");
    playerLives--; 
  }
  let count = 0;
  for (let i = 0; i < bricksArray.length; i++) {
    if (bricksArray[i].broken == true) {
      count++;
    }
  }
  console.log("the count",count)
  console.log("player lives:", playerLives)
  if (playerLives == 0 || count == numberOfBricks) {
    if (currentPlayer == 1) {
      currentPlayer = 2;
      scorePlayer1=0;
      document.querySelector('#currentPlayer').innerText = 2;
    } else {
        checkWinner()
      currentPlayer = 1;
      // scorePlayer2=0;
      document.querySelector('#currentPlayer').innerText = 1;
    }
    resetGame();
    lifeAttempts[0].classList.remove("livesHidden");
    lifeAttempts[1].classList.remove("livesHidden");
    // localStorage.clear()
    
  } else {
   
    isGameOn = false;


    ballCoordinateX = containerWidth / 2;
    ballCoordinateY = containerHeight - 55;
    paddleCoordinateX = containerWidth / 2 - paddleWidth / 2;
  }
}


function checkWinner() {
let playerScore1= parseInt(localStorage.getItem("scorePlayer1"));
let playerScore2= parseInt(localStorage.getItem("scorePlayer2"));
if(playerScore1 > playerScore2){
 alert("player 1 won");
}else if(playerScore2> playerScore1){
  alert("player 2 won");
}else{
  alert("ita a tie !");
}
}
