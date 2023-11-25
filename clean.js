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
const paddleHorizontalMovement = 18;

let bricksArray;
const numberOfBricks = 40;
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
const brickAudio = new Audio('./mixkit-retro-game-notification-212.wav');


// always reset game to original state before starting any game
resetGame();
// add click event listener to the start game button to trigger newGame() function to start a new game
document.querySelector(".btn").addEventListener("click", newGame);

//function to reset game to its original state, including the generation of the bricks x,y coordinates and storing them inside an array
function resetGame() {
  score.innerText = 0;
  player.innerText = currentPlayer;
  //setting back the number of lives again for the user
  playerLives = 2;
  //ball  
  ballCoordinateX = containerWidth / 2;
  ballCoordinateY = containerHeight - 55;
  ballDistanceX = 3;
  ballDistanceY = -4;

  //paddle
  paddleCoordinateX = containerWidth / 2 - paddleWidth / 2;
  paddleCoordinateY = containerHeight - 40;

  //bricks
  brickCoordinateX = 25;
  brickCoordinateY = 40;
  bricksArray = [];
  //data generation for all the bricks x,y coordinates (block positioning on the canvas), and store the data inside an array
  for (let i = 0; i < numberOfBricks; i++) {
    const brick = {
      x: brickCoordinateX,
      y: brickCoordinateY,
      broken: false,
    };
    bricksArray.push(brick);
    brickCoordinateX = brickCoordinateX + 95;

    if ((i + 1) % 8 == 0) {
      brickCoordinateY += 45;
      brickCoordinateX = 25;
    }
  }
}//end of resetGame() function

//function that checks if collision happened between the ball and the canvas border, to ensure the ball doesn't get out of the canvas and moves inside of it
function detectCollisionBallAndCanvasBorder() {
  //checks collision for left and right border
  if (
    ballCoordinateX - ballRadius < 0 ||
    ballCoordinateX + ballRadius > containerWidth
  ) {
    ballDistanceX = ballDistanceX * -1;
  }
  //checks collision for top border
  if (ballCoordinateY + ballDistanceY < 0) {
    ballDistanceY = ballDistanceY * -1;
  }
  //checks collision for bottom border
  if (ballCoordinateY + ballRadius > containerHeight) {
    handleLives();
  }
}// end of detectCollisionBallAndCanvasBorder() function

//function to start a new game 
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
        brickAudio.play();
        ballDistanceY *= -1;
        brick.broken = true;
        if (currentPlayer == 1) {
          scorePlayer1++;
          document.querySelector("#playerScore").innerText = scorePlayer1;
          localStorage.setItem("scorePlayer1", scorePlayer1);
          //for testing
          console.log("local storage");
          for (i = 0; i < localStorage.length; i++) {
            console.log(
              localStorage.key(i) +
                "=[" +
                localStorage.getItem(localStorage.key(i)) +
                "]"
            );
          }
        } else {
          scorePlayer2++;
          document.querySelector("#playerScore").innerText = scorePlayer2;
          localStorage.setItem("scorePlayer2", scorePlayer2);
          //for testing
          for (i = 0; i < localStorage.length; i++) {
            console.log(
              localStorage.key(i) +
                "=[" +
                localStorage.getItem(localStorage.key(i)) +
                "]"
            );
          }
        }
        context.clearRect(brick.x, brick.y, brickWidth, brickHeight);
      }
    });

  let counter = 0;
  for (let i = 0; i < bricksArray.length; i++) {
    if (bricksArray[i].broken == true) {
      counter++;
    }
  }

  if (counter == numberOfBricks) {
    handleLives();
  }
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
  if (playerLives == 2) {
    lifeAttempts[1].classList.add("livesHidden");
    playerLives--;
  } else {
    lifeAttempts[0].classList.add("livesHidden");
    playerLives--;
  }
  let count = 0;
  for (let i = 0; i < bricksArray.length; i++) {
    if (bricksArray[i].broken == true) {
      count++;
    }
  }
  console.log("the count", count);
  console.log("player lives:", playerLives);
  // if all lives are done or all bricks numbers are finished then switch players
  if (playerLives == 0 || count == numberOfBricks) {
    if (currentPlayer == 1) {
      currentPlayer = 2;
      scorePlayer1 = 0;
      document.querySelector("#currentPlayer").innerText = 2;
    } else {
      checkWinner();
      currentPlayer = 1;
      scorePlayer2=0;
      document.querySelector("#currentPlayer").innerText = 1;
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
  isGameOn = false;

  let playerScore1 = parseInt(localStorage.getItem("scorePlayer1"));
  let playerScore2 = parseInt(localStorage.getItem("scorePlayer2"));
  context.clearRect(0, 0, containerWidth, containerHeight);
  context.font = "80px VT323";
  context.fillStyle = "white";
  context.fillText("BRICK BREAKER",  200, 100);
  context.font = "65px VT323";
  context.fillText("Scores",  325, 170);
  context.font = "50px VT323";
  context.fillText("Player 1: " + playerScore1, 100, 250);
  context.fillText("Player 2: " +playerScore2, 480, 250);
  if (playerScore1 > playerScore2) {
    // alert("player 1 won");
    context.fillText("PLAYER 1 WINS!", 270, 350);
    localStorage.clear();

  } else if (playerScore2 > playerScore1) {
    // alert("player 2 won");
    context.fillText("PLAYER 2 WINS!", 270, 350);   
    localStorage.clear();
  } else {
    context.fillText("TIE!", 360, 350);  
    localStorage.clear();  
  }

}
