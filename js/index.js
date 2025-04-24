// Game Constants & Variables
let inputDir = {x: 0, y: 0}; 
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 10;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{x: 13, y: 15}];
let food = {x: 6, y: 7};

// Get updated scoreboard elements
const scoreSpan = document.getElementById('score');
const hiscoreSpan = document.getElementById('hiscore');

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if((ctime - lastPaintTime)/1000 < 1/speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    // Wall collision
    return (
        snake[0].x >= 18 || snake[0].x <= 0 || 
        snake[0].y >= 18 || snake[0].y <= 0
    );
}

function gameEngine(){
    // Collision check
    if(isCollide(snakeArr)){
        gameOverSound.play();
        musicSound.pause();
        inputDir = {x: 0, y: 0}; 
        alert("Game Over. Press any key to play again!");
        snakeArr = [{x: 13, y: 15}];
        musicSound.play();
        score = 0;
        scoreSpan.textContent = score;
    }

    // Food eaten
    if(snakeArr[0].x === food.x && snakeArr[0].y === food.y){
        foodSound.play();
        score++;
        if(score > hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreSpan.textContent = hiscoreval;
        }
        scoreSpan.textContent = score;

        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        let a = 2, b = 16;
        food = {
            x: Math.floor(a + (b - a) * Math.random()),
            y: Math.floor(a + (b - a) * Math.random())
        };
    }

    // Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = {...snakeArr[i]};
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Display snake and food
    board.innerHTML = "";
    snakeArr.forEach((e, i) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(i === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main logic
musicSound.play();
let hiscore = localStorage.getItem("hiscore");
let hiscoreval = hiscore ? JSON.parse(hiscore) : 0;
localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
hiscoreSpan.textContent = hiscoreval;
scoreSpan.textContent = score;

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    inputDir = {x: 0, y: 1}; // Start movement
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDir = {x: 0, y: -1};
            break;
        case "ArrowDown":
            inputDir = {x: 0, y: 1};
            break;
        case "ArrowLeft":
            inputDir = {x: -1, y: 0};
            break;
        case "ArrowRight":
            inputDir = {x: 1, y: 0};
            break;
    }
});
