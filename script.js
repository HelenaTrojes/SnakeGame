// Define HTML elements needed with the IDs
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
const gameOverSound = new Audio('gameOver.mp3');
const eatSound = new Audio('eatFood.mp3');

// Define variables needed in one place
const gridSize = 20;
let snake = [{x: 10, y: 10}];   // The snake is represented as an array of objects, each containing x and y coordinates
let food = generateFood();    // The food is also an object that has x and y coordinates
let highScore = 0;
let direction = 'right';   // The direction the snake is moving in
let gameInterval;
let gameSpeedDelay = 200;   // The delay between each move in milliseconds
let gameStarted = false;    // A flag to check if the game has started

// Draw function
function draw() {
    board.innerHTML = '';    // Clear the board before drawing
    drawSnake();
    drawFood();
    updateScore();
}

// Draw Snake
function drawSnake() {  
    snake.forEach((segment) => {     // Loop through each segment of the snake
        const snakeElement = createGameElement('div', 'snake');   // Create a new div element for the snake segment
        snakeElement.style.backgroundColor = 'green';   // Set the background color 
        setPosition(snakeElement, segment);   // Set the position
        board.appendChild(snakeElement);   // Add the snake segment to the board
    });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);  // Add the snake segment to the board
    element.className = className;
    return element;
}

// Set the position for the elemnts like food or snake
function setPosition(element, position) {
    element.style.gridColumn = position.x;   // Set the x position
    element.style.gridRow = position.y;  // Set the y position
}

// Draw food 
function drawFood() {
    if(gameStarted){   // Only draw the food if the game has started
    const foodElement = createGameElement('div', 'food');   // Create a new div element for the food
    foodElement.style.backgroundColor = 'red';  
    foodElement.style.border = '1px solid red';   
    setPosition(foodElement, food);  
    board.appendChild(foodElement); // Add the food to the board
    }
}

// Generate food with Math.random in random places
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};  // Return the food object with the generated x and y positions
}

// Move the snake with the arrow keys
function move() {
    console.log(snake)
    const head = {...snake[0]};   // Create a new object for the head of the snake which is nr 0
    switch(direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    snake.unshift(head);  // Add the new head to the beginning of the snake array

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();  // If the snake eats the food, generate a new food object
        increaseSpeed();  // Increase the speed of the snake
        clearInterval(gameInterval);  // clear the interval to prevent the game from moving too fast
        gameInterval = setInterval(() => {  // Set a new interval to move the snake
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
        eatSound.playbackRate = 1.3;
        eatSound.play();
    } else {
        snake.pop(); // If the snake does not collide with the food, remove the last segment of the snake
    }
}

// Start game function
function startGame() {
    gameStarted  = true;  // Set the gameStarted flag to true
   // Hide the instruction text and logo
    instructionText.style.display = 'none'; 
    logo.style.display = 'none'; 
    // Set an interval to move the snake, check for collisions, and redraw the board
    gameInterval = setInterval(()=> {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Keypress event listener => game starts when you press space
function handleKeyPress(event) {
    if ((!gameStarted  && event.code === 'Space') ||(!gameStarted  && event.key === ' ') ) {
        startGame();
    } else {
        switch (event.key) {   // If the game has started, update the direction of the snake based on the arrow keys
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

// Setting up an event listener for keydown events
document.addEventListener('keydown', handleKeyPress);


function increaseSpeed(){
// Decrease the gameSpeedDelay by different amounts based on its current value
   if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;  
} else if (gameSpeedDelay > 100) {
    gameSpeedDelay -=3;
} else if (gameSpeedDelay > 50) {
    gameSpeedDelay -=2;
} else if (gameSpeedDelay > 25) {
    gameSpeedDelay -=1;
}
}

// checkCollision function => game ends when the snake touches itself or the border
function checkCollision(){
    const head = snake[0];  // Get the head of the snake
     // Check if the head is out of bounds or has collided with itself
    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame(); // If there is a collision, reset the game
        gameOverSound.playbackRate = 1;
    }

    // Helps to checks if the snake is colliding with itself
    for (let i = 1; i < snake.length; i++){
       if (head.x === snake[i].x && head.y === snake[i].y) {
       resetGame();
       gameOverSound.play();
       }
    }
}

// Resets the game into the prior state
function resetGame(){
    gameOverSound.play();
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

// Update the score display with the current score 
function updateScore(){
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
  // toString converts numeric values to string & padStart pads the current string with a given string (repeated)
}

function stopGame(){
    // Clear the game interval and reset the gameStarted flag
    clearInterval(gameInterval);
    gameStarted = false;
    // Show the instruction text and logo
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore(){
    // Update the high score if the current score is higher
    const currentScore = snake.length - 1;
    if (currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    // Show the high score display
    highScoreText.style.display = 'block';
}


// Set the icon '?' to display the game rules
document.getElementById('info-icon').addEventListener('click', function() {
    let rules = document.getElementById('game-rules');
    rules.style.display = rules.style.display === 'none' ? 'block' : 'none'; 
});