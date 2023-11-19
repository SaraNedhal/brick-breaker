// get the canvas tag with an id of gameContainer using getElementById
const gameContainer = document.getElementById('gameContainer');
// to get access to the object that allows for javascript to draw graphics (this feature only available with using canvas)
const context = gameContainer.getContext('2d');
console.log(context);
//define some variables
// the radius of the circle, used inside a function that draw a circle -> context.arc()
const ballRadius = 15;
// get the width and height of the container and store them in variables respectively
const containerWidth = parseInt(gameContainer.width);
const containerHeight = parseInt(gameContainer.height);
// define the width and height of the paddle 
const paddleWidth = 150;
const paddleHeight = 20;

// define the width and height of each brick
const brickWidth = 90;
const brickHeight = 30;

// define variables for the x and y coordinates of the starting brick 
let brickHorizontal = 15;
let brickVertical = 20; 

// first draw the ball 
function drawBall() {
  context.fillStyle = "red";
  context.beginPath();
  // arc() accepts 5 arguments (x coordinate,y coordinate, circle radius, start angel, end angle)
  // x-> ball must be centered horizontally on the x axis (thus, containerWidth/ , and on Y axis i dont want the ball to be placed at the bottom of the canvas so i subtracted the height to value i found it suitable ), for ball radius is stored as a variable and hold the value 15 ,start drawing at angle 0 and do a 360deg meaning a full circle hence Math.PI *2
  context.arc(containerWidth/2,containerHeight-55,ballRadius,0, Math.PI *2);
  context.fill()
}
// call the drawBall() function to draw the ball
drawBall();

//function used to draw paddle
function drawPaddle(){
context.fillStyle = "green"
// fillRect() is a function inside the context object , it accepts 4 arguments (x coordinate,y coordinate,width,height)
// so for the x coordinate i want the paddle to be placed horizontally at center -> take the whole canvas width and divide it over 2 and for the height i want at the bottom of the container but i want a padding so i will set the height to the canvas height and subtract it from a specific number of px to move it up, in this case subtract 40px from canvas height. And for the third and fourth argument which are paddle width , and paddle height these values are already specified the width and height of the rectangle (paddle) respectively
// with all these values the fillRect will draw the rectangle (paddle)
// but there is an issue with the paddle placement the (x,y) coordinates starts at the center of the page and draw the rectangle but the rectangle must be centered so the ball in top of it must be in the middle of the paddle so in x coordinate subtract paddleWidth/2 from containerWidth/2 to move the paddle half of its width to the left and with that the paddle is exactly centred and the ball sits perfectly at the top of the paddle
context.fillRect(containerWidth/2 - paddleWidth/2 ,containerHeight-40,paddleWidth,paddleHeight);
}


drawPaddle();

// function used to move ball and paddle
// function animate() {

// }
// setInterval(animate(), 10);

// generate bricks
function drawBricks(){
  // create 40 bricks 
  // loop 40 times
  for(let i = 0 ; i < 30 ; i++) {
        //calc x/y of brick
        // let brickX = brickHorizontal + brickWidth
    
       
          //create brick
          //in this loop, im going change the x and y coordinate of the bricks (DONT TOUCH THE WIDTH OR THE HEIGHT THEY R CONSTANT values)
          context.fillStyle = "blue";
          context.fillRect(brickHorizontal,brickVertical,brickWidth,brickHeight);

          console.log(brickVertical)

          brickHorizontal = brickHorizontal + 95
          // brickVertical = brickVertical + 20

          console.log("brickVertical", brickVertical)


          if((i+1)%6==0){
            brickVertical += 40;
            brickHorizontal = 15
          }
       
  }

}
drawBricks();

// function used to detect any Collision between the ball and the brick
function detectCollision(){

}