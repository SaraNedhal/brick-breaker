
//ball
// the radius of the circle, used inside a function that draw a circle -> context.arc()
const ballRadius = 15;
//define the x and y coordinate of the ball
let ballCoordinateX;
let ballCoordinateY;
//add vertical movement (positioning) and horizontal ->
let ballDistanceX;
let ballDistanceY;

//paddle
// define the width and height of the paddle
const paddleWidth = 150;
const paddleHeight = 20;
//define the x and y coordinate of the paddle
let paddleCoordinateX;
let paddleCoordinateY;
//define a variable for the difference in the x-axis position of the paddle (basically setting a value for the paddle horizontal movement so if the paddle moves to the right it will move according to the specified value and same goes for the left)
const paddleHorizontalMovement = 15;

//bricks
//set number of bricks
const numberOfBricks = 30;
// define the width and height of each brick
const brickWidth = 80;
const brickHeight = 20;
// define variables for the x and y coordinates of the starting brick
let brickCoordinateX;
let brickCoordinateY;

//define variable for players lives
let playerLives = 2;

// get button
// function newGame
// add click event listener
document.querySelector(".btn").addEventListener("click", newGame);

//functions

// first draw the ball
function drawBall() {
  context.fillStyle = "red";
  context.beginPath();
  // arc() accepts 5 arguments (x coordinate,y coordinate, circle radius, start angel, end angle)
  // x-> ball must be centered horizontally on the x axis (thus, containerWidth/ , and on Y axis i dont want the ball to be placed at the bottom of the canvas so i subtracted the height to value i found it suitable ), for ball radius is stored as a variable and hold the value 15 ,start drawing at angle 0 and do a 360deg meaning a full circle hence Math.PI *2
  context.arc(ballCoordinateX, ballCoordinateY, ballRadius, 0, Math.PI * 2);
  context.fill();
}

//function used to draw paddle
function drawPaddle() {
  context.fillStyle = "green";
  // fillRect() is a function inside the context object , it accepts 4 arguments (x coordinate,y coordinate,width,height)
  // so for the x coordinate i want the paddle to be placed horizontally at center -> take the whole canvas width and divide it over 2 and for the height i want at the bottom of the container but i want a padding so i will set the height to the canvas height and subtract it from a specific number of px to move it up, in this case subtract 40px from canvas height. And for the third and fourth argument which are paddle width , and paddle height these values are already specified the width and height of the rectangle (paddle) respectively
  // with all these values the fillRect will draw the rectangle (paddle)
  // but there is an issue with the paddle placement the (x,y) coordinates starts at the center of the page and draw the rectangle but the rectangle must be centered so the ball in top of it must be in the middle of the paddle so in x coordinate subtract paddleWidth/2 from containerWidth/2 to move the paddle half of its width to the left and with that the paddle is exactly centred and the ball sits perfectly at the top of the paddle
  context.fillRect(
    paddleCoordinateX,
    paddleCoordinateY,
    paddleWidth,
    paddleHeight
  );
}

//add eventlistener when the keyboard is clicked, execute the movePaddle function to move the paddle
document.addEventListener("keydown", movePaddle);

//function responsible for moving the paddle right or left based on which arrow key is clicked
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

//function that checks if paddle is out of the container
// it takes the new x coordinate of the paddle which is (the original paddle coordinate which is placed in the middle of the page subtracted (if paddle moved to left) from the paddleHorizontalMovement or added (if paddle moved to right) to the paddleHorizontalMovement the value that comes of either of these operations are considered to be the new x coordinate for the paddle (new position) )
// to check if the paddle out of the container boundary -> need to check the top left point of the paddle and the top right of the paddle
//if the top left point of the paddle which is the  x coordinate of the paddle (the value given in the parameter) is less than zero (where zero is the starting point at the canvas) then the paddle is out of bounds from the left side
// or also check for the top right corner of the paddle which is the x coordinate of the paddle plus the paddle's width (x+paddle width) this value give us x coordinate of the top right corner of the paddle. if it is greater than the container width (which is the right side of canvas , full canvas width)
function isPaddleOutOfCanvas(horizontalCoordinateOfPaddle) {
  return (
    horizontalCoordinateOfPaddle < 0 ||
    horizontalCoordinateOfPaddle + paddleWidth > containerWidth
  );
}

function gameOver() {
  isGameOn = false;
  if (currentPlayer == 1) {
    currentPlayer = 2;
  } else {
    currentPlayer = 1;
  }
  return isGameOn;
}

//setup function to reset the game
function setUp() {
  drawBall();
  drawPaddle();
  movePaddle();
} // end of setUp() function

//function to start the game
function newGame() {
  //set score for both players to 0
  // console.log()
  scorePlayer1 = 0;
  scorePlayer2 = 0;
  document.querySelector("#playerScore").innerText = 0;

  if (currentPlayer == 1) {
    document.querySelector("#currentPlayer").innerText = 1;
  } else {
    document.querySelector("#currentPlayer").innerText = 2;
  }
  isGameOn = true;

  //define the x and y coordinate of the ball
  ballCoordinateX = containerWidth / 2;
  ballCoordinateY = containerHeight - 55;
  //add vertical movement (positioning) and horizontal ->
  ballDistanceX = 3;
  ballDistanceY = -4;

  //define the x and y coordinate of the paddle
  paddleCoordinateX = containerWidth / 2 - paddleWidth / 2;
  paddleCoordinateY = containerHeight - 40;

  // define variables for the x and y coordinates of the starting brick
  brickCoordinateX = 15;
  brickCoordinateY = 40;

  //define array for bricks generation to store its x,y, and if they r broken or not
  let bricksArray = [];

  // generate bricks with its coordinates
  generateBricksCoordinate(numberOfBricks);

  //adding animation (kinda like a loop)
  requestAnimationFrame(animate);
  // animate()

  // function used to move ball and paddle
  function animate() {
    if (!isGameOn) {
      return;
    }
    requestAnimationFrame(animate);
    context.clearRect(0, 0, containerWidth, containerHeight);
    drawBricks();
    drawPaddle();
    drawBall();
    moveBall();
    detectCollisionBallAndCanvasBorder();
    detectCollisionBallAndPaddle();
    detectCollisionBallAndBrick();
  }

  // function to generate Bricks Coordinate
  function generateBricksCoordinate(bricksNumber) {
    for (let i = 0; i < bricksNumber; i++) {
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
  }

  // draw bricks
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

  // function used to move the ball on the canvas
  // inside the function it takes both the original x and y coordinates of the ball and add to it ballDistanceX and ballDistanceY respectively which is the new x and y coordinates of the ball
  function moveBall() {
    ballCoordinateX += ballDistanceX;
    ballCoordinateY += ballDistanceY;
  }

  // function used to detect the collision between the ball and the top, right, and left container
  function detectCollisionBallAndCanvasBorder() {
    // first condition: right border / second condition: left border
    if (
      ballCoordinateX + ballDistanceX < 0 ||
      ballCoordinateX + ballDistanceX > containerWidth - ballRadius
    ) {
      // ballDistanceY= ballDistanceY * -1;
      ballDistanceX = ballDistanceX * -1;
    }
    // top border
    if (ballCoordinateY + ballDistanceY < 0) {
      ballDistanceY = ballDistanceY * -1;
    }
    // if the ball y coordinate + the change of y coordinate is greater than the height of the container minus the ball radius because the edge of the ball need to touch the bottom border not half of the ball

    // bottom border
    //   if(!detectBottomBorderCollisionBallAndCanvas(ballCoordinateY) ) {
    // // gameOver()

    if (ballCoordinateY + ballRadius > containerHeight) {
      console.log("player life before start: ", playerLives);
      playerLives--;
      console.log("player life after start: ", playerLives);
      document
        .querySelector(".lives .playerLives")
        .classList.add("livesHidden");
      let count = 0;
      for (let i = 0; bricksArray.length; i++) {
        if (bricksArray[i].broken == true) {
          count++;
        }
      }
      if (playerLives == 0 || count == numberOfBricks) {
        gameOver();
        setUp();
        newGame();
      }
    } else {
      handleLives();
    }

    //   }
    //for bottom border call this function (testing this)
  }
  // console.log(paddleCoordinateX + paddleWidth)
  function detectCollisionBallAndPaddle() {
    if (
      // if the x coordinate of the ball + the ball radius (so means the entire ball/circle) is greater or equal than paddle x coordinate (top left corner) then reverse/flip the y coordinate  of the ball (left side of paddle)
      ballCoordinateX + ballRadius >= paddleCoordinateX &&
      //if the x coordinate of the ball - the ball radius (checking right side of the paddle) is less than x paddle coordinate + paddle's width (checking the paddle width and the paddle top right corner) than flip y coordinate of the ball (right side of paddle)
      ballCoordinateX - ballRadius <= paddleCoordinateX + paddleWidth &&
      //if the ball
      ballCoordinateY + ballRadius >= paddleCoordinateY &&
      ballCoordinateY - ballRadius <= paddleCoordinateY + paddleHeight
    ) {
      ballCoordinateY += -5;
      ballDistanceY = ballDistanceY * -1;
      // console.log("Y rate",ballDistanceY < 0);
    }
  }

  // function for detecting the collision between ball and brick
  function detectCollisionBallAndBrick() {
    // const filteredBrickArray = bricksArray.filter(function(theBrick) {
    //   return theBrick.broken == false;
    // });
    bricksArray
      .filter((brick) => !brick.broken)
      .forEach((brick) => {
        // if(ballCoordinateY + ballRadius > brick.y && ballCoordinateY - ballRadius < brick.y + brickHeight) {
        //   console.log(brick);
        //   ballDistanceY*=-1;
        //   brick.broken = true;
        //   console.log("update broken", brick);
        //   context.clearRect(brick.x,brick.y,brickWidth, brickHeight);
        // }

        // collision for all sides of brick (top,bottom, left, right)
        if (
          ballCoordinateX + ballRadius > brick.x &&
          ballCoordinateX - ballRadius < brick.x + brickWidth &&
          ballCoordinateY + ballRadius > brick.y &&
          ballCoordinateY - ballRadius < brick.y + brickHeight
        ) {
          ballDistanceY *= -1;
          // ballDistanceX*=-1;
          brick.broken = true;
          //increase score by one
          // if the current player is 1 then increase player 1 score by 1
          if (currentPlayer == 1) {
            scorePlayer1++;
            // console.log(scorePlayer1);
            document.querySelector("#playerScore").innerText = scorePlayer1;
            localStorage.setItem("score player 1", scorePlayer1);
            // scorePlayer2=0;
          }
          // else if the current player is 2 then increase player 2 score by 1
          else {
            // scorePlayer1=0;
            scorePlayer2++;
            document.querySelector("#playerScore").innerText = scorePlayer2;
            localStorage.setItem("score player 2", scorePlayer2);
          }
          context.clearRect(brick.x, brick.y, brickWidth, brickHeight);
        }
      }); //end of forEach loop

    //draw score on canvas
    context.font = "20px VT323";

    // context.fillText("Score: "+scorePlayer1, 10, 30);
    // localStorage.setItem('score player1', score);
    //check if all the bricks have been hit, then the game ends
    let counter = 0;
    for (let i = 0; i < bricksArray.length; i++) {
      if (bricksArray[i].broken == true) {
        counter++;
      }
    }
    // if all bricks has been hit end the game
    if (counter == numberOfBricks) {
      gameOver();
    }
  }

  // function to calculate the score of the current player
  function calculateScore() {}

  // function to end the game (stop game from running)
  // function gameOver() {
  //   isGameOn = false
  //   currentPlayer =2;

  // }

  //function to detect when ball hit bottom
  // function detectBottomBorderCollisionBallAndCanvas(ballYCoordinate){
  //   return(ballYCoordinate + ballRadius > containerHeight );
  //   }

  //     if(detectBottomBorderCollisionBallAndCanvas(ballCoordinateY)) {
  //       console.log("player life before start: ", playerLives);
  //       playerLives--;
  //       console.log("player life after start: ", playerLives);
  //       document.querySelector('.lives .playerLives').classList.add("livesHidden");
  //       if(currentPlayer==0||bricksArray.broken==true){
  //         gameOver();
  //         setUp();
  //         newGame();
  //       }
  //     }else{
  //       handleLives();
  //     }

  // }
}
function handleLives() {
  drawBall();
  drawPaddle();
  // detectCollisionBallAndBrick()
  // detectCollisionBallAndCanvasBorder();
  // detectCollisionBallAndPaddle();
  // detectBottomBorderCollisionBallAndCanvas()
}
