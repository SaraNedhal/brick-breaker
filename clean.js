//canvas info
const gameContainer = document.getElementById("gameContainer");
const context = gameContainer.getContext("2d");
const containerWidth = parseInt(gameContainer.width);
const containerHeight = parseInt(gameContainer.height);

//ball info
const ballRadius = 15;
let ballCoordinateX;
let ballCoordinateY;
let ballDistanceX;
let ballDistanceY;

//paddle info
const paddleWidth = 150;
const paddleHeight = 20;
let paddleCoordinateX;
let paddleCoordinateY;
const paddleHorizontalMovement = 40;

//brick info
let bricksArray;
const numberOfBricks = 40;
const brickWidth = 80;
const brickHeight = 20;
let brickCoordinateX;
let brickCoordinateY;

//boolean value to check if game is on or not
let isGameOn;

//players info
let currentPlayer = 1;
let scorePlayer1 = 0;
let scorePlayer2 = 0;
let playerLives = 2;

// get the elements from html and store them in variables
const score = document.querySelector("#playerScore");
const player = document.querySelector("#currentPlayer");
const lifeAttempts = document.querySelectorAll(".playerLives");

//store the brick breaking and game over audio's in variables
const brickAudio = new Audio("./mixkit-retro-game-notification-212.wav");
const gameOverAudio = new Audio("./mixkit-arcade-retro-background-219.wav");
document.addEventListener("DOMContentLoaded", function(){
//Writing the intro of the game on the canvas
context.font = "80px VT323";
context.fillStyle = "white";
context.fillText("BRICK BREAKER", 200, 200);
context.font = "30px VT323";
context.fillText("Press the 'start game' button to start the game", 125, 300);

// always reset game to original state before starting any game
resetGame();
// add click event listener to the start game button to trigger newGame() function to start a new game
document.querySelector(".btn").addEventListener("click", newGame);
})
//function to reset game to its original state, including the generation of the bricks x,y coordinates and storing them inside an array
function resetGame() {
  //setting back the score to zero and the current player to 1 into the screen
  score.innerText = 0;
  player.innerText = currentPlayer;
  //setting back the number of lives again for the player to 2
  playerLives = 2;
  //ball original state (original coordinates)
  ballCoordinateX = containerWidth / 2;
  ballCoordinateY = containerHeight - 55;
  ballDistanceX = 3;
  ballDistanceY = -4;

  //paddle original state (original coordinates)
  paddleCoordinateX = containerWidth / 2 - paddleWidth / 2;
  paddleCoordinateY = containerHeight - 40;

  //bricks original state (original coordinates)
  brickCoordinateX = 25;
  brickCoordinateY = 40;
  bricksArray = [];
  //data generation for all the bricks x,y coordinates (brick positioning on the canvas), and store the data inside an array (array of objects) through a loop
  for (let i = 0; i < numberOfBricks; i++) {
    const brick = {
      x: brickCoordinateX,
      y: brickCoordinateY,
      broken: false,
    };
    // push (add) the data of x,y coordinates into the array and add 95px to every x coordinate of each brick (to make rows of bricks)
    bricksArray.push(brick);
    brickCoordinateX = brickCoordinateX + 95;

    // only allows 8 bricks on each row, add 45px vertically and 25px horizontally to every new row
    if ((i + 1) % 8 == 0) {
      brickCoordinateY += 45;
      brickCoordinateX = 25;
    }
  }
} //end of resetGame() function

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
  if (ballCoordinateY - ballRadius < 0) {
    ballDistanceY = ballDistanceY * -1;
  }
  //checks collision for bottom border
  if (ballCoordinateY + ballRadius > containerHeight) {
    handleLives();
  }
} // end of detectCollisionBallAndCanvasBorder() function

//function to start a new game
function newGame() {
  //game is on, so start rendering frames for animation and add an event listener on the keys to track keyboard arrows movement to move the paddle right or left
  isGameOn = true;
  requestAnimationFrame(animate);
  document.addEventListener("keydown", movePaddle);
} // end of newGame() function

// function used for animation
function animate() {
  //if game isnt on then stop the animation
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

// function to take the coordinates from the array that has added x,y coordinate of each brick inside the resetGame() function and paint the bricks on the canvas
function drawBricks() {
  // loop through the array if broken property equal true dont paint the brick because it has been destroyed via ball
  bricksArray.forEach(function (element) {
    if (element.broken !== false) {
      return "nothing";
    }
    // draw the bricks
    context.beginPath();
    context.fillStyle = "#0366ff ";
    context.fillRect(element.x, element.y, brickWidth, brickHeight);
    context.fill();
    context.closePath();
  });
}
//function used to draw paddle
function drawPaddle() {
  context.fillStyle = "#66ff03";
  context.fillRect(
    paddleCoordinateX,
    paddleCoordinateY,
    paddleWidth,
    paddleHeight
  );
}
//function used to draw the ball
function drawBall() {
  context.fillStyle = "#ff0366";
  context.beginPath();
  // arc() accepts 5 arguments (x coordinate,y coordinate, circle radius, start angel, end angle)
  context.arc(ballCoordinateX, ballCoordinateY, ballRadius, 0, Math.PI * 2);
  context.fill();
}

//function used to move the ball it adds to each x,y coordinated of the ball to the rate of change (dx,dy of the ball)
function moveBall() {
  ballCoordinateX += ballDistanceX;
  ballCoordinateY += ballDistanceY;
}

//function to check if collision occurred between ball and paddle
function detectCollisionBallAndPaddle() {
  // to check left, right, top, bottom collision
  if (
    ballCoordinateX + ballRadius >= paddleCoordinateX &&
    ballCoordinateX - ballRadius <= paddleCoordinateX + paddleWidth &&
    ballCoordinateY + ballRadius >= paddleCoordinateY &&
    ballCoordinateY - ballRadius <= paddleCoordinateY + paddleHeight
  ) {
    // the ball will be inside the paddle, to give it a little push i will subtract the -5 based on dy of the circle -4 from the y coordinate of the ball just to give it a little push out of the paddle
    ballCoordinateY += -5;
    ballDistanceY = ballDistanceY * -1;
  }
}

// function used to check for a collision between ball and brick
function detectCollisionBallAndBrick() {
  // filter the array by storing only the brick that are not broken (broken==false) and loop through the result
  bricksArray
    .filter((brick) => !brick.broken)
    .forEach((brick) => {
      //check collision on the left, right.top ,bottom
      if (
        ballCoordinateX + ballRadius > brick.x &&
        ballCoordinateX - ballRadius < brick.x + brickWidth &&
        ballCoordinateY + ballRadius > brick.y &&
        ballCoordinateY - ballRadius < brick.y + brickHeight
      ) {
        //play brick audio
        brickAudio.play();
        //reverse ball direction
        ballDistanceY *= -1;
        //set the broken property of the brick to true
        brick.broken = true;
        // if the current player is 1
        if (currentPlayer == 1) {
          //add 1 to the score if the brick got hit by the ball
          scorePlayer1++;
          //change the score on the screen and store the value in local storage
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
          // if the current player is 2
          scorePlayer2++;
          //change the score on the screen and store the value in local storage
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
        //once the brick has been hit and propety broken changed to true, clear the brick (erase it from canvas)
        context.clearRect(brick.x, brick.y, brickWidth, brickHeight);
      }
    });
  //loop to check how many bricks are broken, done by counting the number of bricks that has the property of true
  let counter = 0;
  for (let i = 0; i < bricksArray.length; i++) {
    if (bricksArray[i].broken == true) {
      counter++;
    }
  }
  // if the player destroyed all the bricks, call handleLives()
  if (counter == numberOfBricks) {
    handleLives();
  }
}
//function used to move the paddle
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

//function that checks if the paddle is out of border takes the current x coordinate od the paddle as parameter
function isPaddleOutOfCanvas(horizontalCoordinateOfPaddle) {
  return (
    horizontalCoordinateOfPaddle <= 0 ||
    horizontalCoordinateOfPaddle + paddleWidth >= containerWidth
  );
}

//function that handles lives and switching players
function handleLives() {
  //remove the hurts when the ball fall of the paddle
  if (playerLives == 2) {
    lifeAttempts[1].classList.add("livesHidden");
    playerLives--;
  } else {
    lifeAttempts[0].classList.add("livesHidden");
    playerLives--;
  }
  //loop to check how many bricks has been destroyed
  let count = 0;
  for (let i = 0; i < bricksArray.length; i++) {
    if (bricksArray[i].broken == true) {
      count++;
    }
  }
  console.log("the count", count);
  console.log("player lives:", playerLives);
  // if all lives are done or all bricks numbers are destroyed then switch players
  if (playerLives == 0 || count == numberOfBricks) {
    //if player =1 switch to player 2, pause the game and change all related info on the screen
    if (currentPlayer == 1) {
      currentPlayer = 2;
      scorePlayer1 = 0;
      isGameOn = false;
      document.querySelector("#currentPlayer").innerText = 2;
    } else {
      //if player 2 then display score of both players and winner
      checkWinner();
      // switch to player 1 and change all related info on the screen
      currentPlayer = 1;
      scorePlayer2 = 0;
      document.querySelector("#currentPlayer").innerText = 1;
    }
    //for both players switch, reset the game to its original state
    resetGame();
    lifeAttempts[0].classList.remove("livesHidden");
    lifeAttempts[1].classList.remove("livesHidden");
    // localStorage.clear()
  } else {
    //if the lives not equal to zero (there are still some lives left for the player), pause the game and ONLY reset the ball and paddle to its original state
    isGameOn = false;

    ballCoordinateX = containerWidth / 2;
    ballCoordinateY = containerHeight - 55;
    paddleCoordinateX = containerWidth / 2 - paddleWidth / 2;
  }
}

//function to display the score and check who's the winner
function checkWinner() {
  //pause the game after player 2 finishes the game
  isGameOn = false;
  gameOverAudio.play();
  // take the scores from local storage and store them in variables
  let playerScore1 = parseInt(localStorage.getItem("scorePlayer1"));
  let playerScore2 = parseInt(localStorage.getItem("scorePlayer2"));
  //clear canvas
  context.clearRect(0, 0, containerWidth, containerHeight);
  //write the player scores on screen
  context.font = "80px VT323";
  context.fillStyle = "white";
  context.fillText("BRICK BREAKER", 200, 100);
  context.font = "65px VT323";
  context.fillText("Scores", 325, 170);
  context.font = "50px VT323";
  context.fillText("Player 1: " + playerScore1, 100, 250);
  context.fillText("Player 2: " + playerScore2, 480, 250);

  //check who's score is higher to display who won and then clear the players score from the local storage
  if (playerScore1 > playerScore2) {
    // alert("player 1 won");
    context.fillText("PLAYER 1 WINS!", 270, 350);
    localStorage.clear();
  } else if (playerScore2 > playerScore1) {
    // alert("player 2 won");
    context.fillText("PLAYER 2 WINS!", 270, 350);
    localStorage.clear();
  } else {
    context.fillText("TIE!", 370, 350);
    localStorage.clear();
  }
}
