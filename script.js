// get button 
// function newGame
// add click event listener
document.querySelector('.btn').addEventListener("click" , newGame);


let isGameOn

// get the canvas tag with an id of gameContainer using getElementById
const gameContainer = document.getElementById('gameContainer');

// to get access to the object that allows for javascript to draw graphics (this feature only available with using canvas)
const context = gameContainer.getContext('2d');
// console.log(context);

//define some variables
// get the width and height of the container and store them in variables respectively
const containerWidth = parseInt(gameContainer.width);
const containerHeight = parseInt(gameContainer.height);





function newGame(){
  isGameOn = true


  //ball
// the radius of the circle, used inside a function that draw a circle -> context.arc()
const ballRadius = 15;
//define the x and y coordinate of the ball 
let ballCoordinateX = containerWidth/2;
let ballCoordinateY = containerHeight-55;
//add vertical movement (positioning) and horizontal ->
let ballDistanceX = 3;
let ballDistanceY = -4;

//paddle
// define the width and height of the paddle 
const paddleWidth = 150;
const paddleHeight = 20;
//define the x and y coordinate of the paddle
let paddleCoordinateX = containerWidth/2 - paddleWidth/2;
let paddleCoordinateY = containerHeight-40;
//define a variable for the difference in the x-axis position of the paddle (basically setting a value for the paddle horizontal movement so if the paddle moves to the right it will move according to the specified value and same goes for the left)
const paddleHorizontalMovement = 15;

//bricks
// define the width and height of each brick
const brickWidth = 80;
const brickHeight = 20;

// define variables for the x and y coordinates of the starting brick 
let brickCoordinateX = 15;
let brickCoordinateY = 20; 

//define array for bricks generation to store its x,y, and if they r broken or not
let bricksArray= [];

  // first draw the ball 
function drawBall() {
  context.fillStyle = "red";
  context.beginPath();
  // arc() accepts 5 arguments (x coordinate,y coordinate, circle radius, start angel, end angle)
  // x-> ball must be centered horizontally on the x axis (thus, containerWidth/ , and on Y axis i dont want the ball to be placed at the bottom of the canvas so i subtracted the height to value i found it suitable ), for ball radius is stored as a variable and hold the value 15 ,start drawing at angle 0 and do a 360deg meaning a full circle hence Math.PI *2
  context.arc(ballCoordinateX,ballCoordinateY,ballRadius,0, Math.PI *2);
  context.fill()
}
// call the drawBall() function to draw the ball
// drawBall();

//function used to draw paddle
function drawPaddle(){
context.fillStyle = "green"
// fillRect() is a function inside the context object , it accepts 4 arguments (x coordinate,y coordinate,width,height)
// so for the x coordinate i want the paddle to be placed horizontally at center -> take the whole canvas width and divide it over 2 and for the height i want at the bottom of the container but i want a padding so i will set the height to the canvas height and subtract it from a specific number of px to move it up, in this case subtract 40px from canvas height. And for the third and fourth argument which are paddle width , and paddle height these values are already specified the width and height of the rectangle (paddle) respectively
// with all these values the fillRect will draw the rectangle (paddle)
// but there is an issue with the paddle placement the (x,y) coordinates starts at the center of the page and draw the rectangle but the rectangle must be centered so the ball in top of it must be in the middle of the paddle so in x coordinate subtract paddleWidth/2 from containerWidth/2 to move the paddle half of its width to the left and with that the paddle is exactly centred and the ball sits perfectly at the top of the paddle
context.fillRect(paddleCoordinateX ,paddleCoordinateY,paddleWidth,paddleHeight);
}

generate(30);

// drawPaddle();

 requestAnimationFrame(animate);
// animate()
document.addEventListener("keydown", paddleMovement);
// function used to move ball and paddle
function animate() {
  if(!isGameOn) return
  requestAnimationFrame(animate);
  context.clearRect(0,0,containerWidth,containerHeight)
  drawBricks();
  drawPaddle();
  drawBall();
  moveBall()
  detectCollisionBallAndCanvasBorder()
  detectCollisionBallAndPaddle()
  detectCollisionBallAndBrick()

}
// setInterval(animate(), 10);
//function that checks if paddle is out of the container 
// it takes the new x coordinate of the paddle which is (the original paddle coordinate which is placed in the middle of the page subtracted (if paddle moved to left) from the paddleHorizontalMovement or added (if paddle moved to right) to the paddleHorizontalMovement the value that comes of either of these operations are considered to be the new x coordinate for the paddle (new position) )
// to check if the paddle out of the container boundary -> need to check the top left point of the paddle and the top right of the paddle 
//if the top left point of the paddle which is the  x coordinate of the paddle (the value given in the parameter) is less than zero (where zero is the starting point at the canvas) then the paddle is out of bounds from the left side
// or also check for the top right corner of the paddle which is the x coordinate of the paddle plus the paddle's width (x+paddle width) this value give us x coordinate of the top right corner of the paddle. if it is greater than the container width (which is the right side of canvas , full canvas width)
function isPaddleOutOfCanvas(horizontalCoordinateOfPaddle){
  return(horizontalCoordinateOfPaddle<0 ||horizontalCoordinateOfPaddle+ paddleWidth > containerWidth);
} 
function paddleMovement(event) {
  //left button is pressed
  if(event.keyCode == '37') {
    // take the original x coordinate of the paddle (which is in the middle of the container) and subtract it from the horizontal movement (distance) store the value inside the variable newPaddleXCoordinate and then pass this value to the isPaddleOutOfCanvas function if it returns false, store the new x coordinate of the paddle inside paddleCoordinateX variable which is the paddle x coordinate in the canvas
    let newPaddleXCoordinate = paddleCoordinateX - paddleHorizontalMovement;
    if(!isPaddleOutOfCanvas(newPaddleXCoordinate)) {
        paddleCoordinateX = newPaddleXCoordinate;
    }

  }
  //right button is pressed
  else if (event.keyCode == '39') {
      // take the original x coordinate of the paddle (which is in the middle of the container) and add it to the horizontal movement (distance) store the value inside the variable newPaddleXCoordinate and then pass this value to the isPaddleOutOfCanvas function if it returns false, store the new x coordinate of the paddle inside paddleCoordinateX variable which is the paddle x coordinate in the canvas
    let newPaddleXCoordinate = paddleCoordinateX + paddleHorizontalMovement;
    if(!isPaddleOutOfCanvas(newPaddleXCoordinate)) {
      paddleCoordinateX = newPaddleXCoordinate;
  }
  }
}
// generate bricks
function generate(numberOfBricks){

  for(let i = 0 ; i < numberOfBricks ; i++) {
    const brick = 
    {
      x: brickCoordinateX,
      y: brickCoordinateY,
      broken: false
    }
    bricksArray.push(brick);
    brickCoordinateX = brickCoordinateX + 95
    

    if((i+1)%6==0){
      brickCoordinateY += 40;
      brickCoordinateX = 15
      }
  }
}

// draw bricks
function drawBricks(){
  // // // create 40 bricks 
  // // // loop 40 times
  // for(let i = 0 ; i < 30 ; i++) {
  //       //calc x/y of brick
  //       // let brickX = brickCoordinateX + brickWidth
    
       
  //         //create brick
  //         //in this loop, im going change the x and y coordinate of the bricks (DONT TOUCH THE WIDTH OR THE HEIGHT THEY R CONSTANT values)
  //         context.beginPath();
  //         context.fillStyle = "blue";
  //        context.fillRect(brickCoordinateX,brickCoordinateY,brickWidth,brickHeight);
  //         // console.log("this is a brick", context.bricks);s
  //         // console.log(gameContainer.getBoundingClientRect());
  //         //  console.log(brickCoordinateY)
  //         context.fill();
  //         context.closePath();


  //         const brick = 
  //         {
  //           x: brickCoordinateX,
  //           y: brickCoordinateY,
  //           broken: false
  //         }
  //         bricksArray.push(brick);
  //         brickCoordinateX = brickCoordinateX + 95
  //         // brickCoordinateY = brickCoordinateY + 20

  //         // console.log("brickCoordinateY", brickCoordinateY)

  //         if((i+1)%6==0){
  //           brickCoordinateY += 40;
  //           brickCoordinateX = 15
  //         }
       
  // }
  bricksArray.forEach(function(element){
    if(element.broken !== false ) {return "nothing"};
    context.beginPath();
    context.fillStyle = "blue";
    context.fillRect(element.x,element.y,brickWidth,brickHeight);
    context.fill();
    context.closePath();

  }) 
  // console.log(bricksArray);
    
  

}
// drawBricks();
// function used to detect any Collision between the ball and the brick
// function detectCollision(){

// }

// function used to move the ball on the canvas
// inside the function it takes both the original x and y coordinates of the ball and add to it ballDistanceX and ballDistanceY respectively which is the new x and y coordinates of the ball  
function moveBall(){
  ballCoordinateX+= ballDistanceX;
  ballCoordinateY+= ballDistanceY;

}

// function used to detect the collision between the ball and the top, right, and left container
function detectCollisionBallAndCanvasBorder(){
  // first condition: right border / second condition: left border
  if(ballCoordinateX + ballDistanceX < 0 ||  ballCoordinateX + ballDistanceX > containerWidth-  ballRadius) {
    // ballDistanceY= ballDistanceY * -1;
    ballDistanceX= ballDistanceX *-1;
  }
  // top border
  if(ballCoordinateY + ballDistanceY < 0 ) {
    ballDistanceY= ballDistanceY *-1;
  }
// if the ball y coordinate + the change of y coordinate is greater than the height of the container minus the ball radius because the edge of the ball need to touch the bottom border not half of the ball 
//bottom border
  if(ballCoordinateY + ballRadius > containerHeight ) {
gameOver()
    
  }

  

}
// console.log(paddleCoordinateX + paddleWidth)
function detectCollisionBallAndPaddle() {
  
  if(
    // if the x coordinate of the ball + the ball radius (so means the entire ball/circle) is greater or equal than paddle x coordinate (top left corner) then reverse/flip the y coordinate  of the ball (left side of paddle)
     ballCoordinateX + ballRadius >= paddleCoordinateX  &&
     //if the x coordinate of the ball - the ball radius (checking right side of the paddle) is less than x paddle coordinate + paddle's width (checking the paddle width and the paddle top right corner) than flip y coordinate of the ball (right side of paddle)
     ballCoordinateX - ballRadius  <= paddleCoordinateX + paddleWidth && 
     //if the ball 
     ballCoordinateY + ballRadius >=  paddleCoordinateY &&
     ballCoordinateY - ballRadius  <= paddleCoordinateY + paddleHeight
     ) {
    ballCoordinateY += -5
      ballDistanceY  = ballDistanceY*-1;
    console.log("Y rate",ballDistanceY < 0);

  }
}

// function for detecting the collision between ball and brick
function detectCollisionBallAndBrick(){

  // const filteredBrickArray = bricksArray.filter(function(theBrick) {
  //   return theBrick.broken == false;
  // });
  bricksArray.filter(brick => !brick.broken).forEach(brick =>{
    // if(ballCoordinateY + ballRadius > brick.y && ballCoordinateY - ballRadius < brick.y + brickHeight) {
    //   console.log(brick);
    //   ballDistanceY*=-1;
    //   brick.broken = true;
    //   console.log("update broken", brick);
    //   context.clearRect(brick.x,brick.y,brickWidth, brickHeight);
    // }

    // right and left 
    if(
      ballCoordinateX + ballRadius > brick.x && 
      ballCoordinateX - ballRadius < brick.x + brickWidth && 
      ballCoordinateY + ballRadius > brick.y && 
      ballCoordinateY - ballRadius < brick.y + brickHeight) {
      console.log(brick);
      ballDistanceY*=-1;
      // ballDistanceX*=-1;
      brick.broken = true;
      context.clearRect(brick.x,brick.y,brickWidth, brickHeight);
      console.log("update broken", brick);  
    }
   
    
  })
let counter =0
for(let i = 0; i < bricksArray.length ; i++) {
 if(bricksArray[i].broken == true) {
    counter++;
 }

}
if(counter == 30) {
  gameOver()
}



// left collision 
// if(ballCoordinateX + ballRadius > brickCoordinateX && ballCoordinateX - ballRadius > brickCoordinateX + brickWidth) {
//   ballDistanceX*=-1;
//   // bricksArray.broken = true;
//   // if(bricksArray.broken == true) {
//   //   context.clearRect(bricksArray[0].x,bricksArray[1],y,0,0)
//   // }

// }

// // right collision 
// if() {
//   ballDistanceX*=-1;
// }
  // console.log(filteredBrickArray);

}
function gameOver() {
  isGameOn = false
  // alert("game over");
    // cancelAnimationFrame(animation)

}


}