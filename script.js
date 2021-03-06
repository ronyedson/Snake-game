const board_border = 'black';
const board_background = 'white';
const snake_col = '#41caf0';
const snake_border = 'darkblue';

var maxScore = 0;

var wallColision = true;

const scoreboard = document.getElementsByClassName("scoreboard")[0];
const snakeboard = document.getElementById('gameCanvas');
const snakeboard_ctx = snakeboard.getContext('2d');

const startMenu = document.getElementsByClassName("startMenu")[0];
const gameOverMenu = document.getElementsByClassName("gameOverMenu")[0];

snakeboard_ctx.strokeStyle = board_border;
snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);

clearBoard()

//Defines where the fly will be and the starts the game
function start() {
    resetValues();
    startMenu.style.display = "none";
    scoreboard.style.display = "flex";
    createFly();
    drawnFly();
    mainGame();
};


//Event listener to catch the player's inputs
document.addEventListener('keydown', changeDirection);

function mainGame() {
    //Checks if the player has lost the game
    if (has_game_ended()){
        popGamerOverMenu();
        return;
    }
    //Defines that the player can input a move
    changing_direction = false;

    setTimeout(function onTick() {
        clearBoard();
        checkPoint();
        moveSnake();
        drawnSnake();
        drawnFly();

        mainGame();
    }, 80)

}

function toggleWallColision() {
    if (wallColision) {
        wallColision = false;
        document.getElementById("colision").innerHTML = "WALL COLISION: OFF"
    } else {
        wallColision = true;
        document.getElementById("colision").innerHTML = "WALL COLISION: ON"
    }
}

function clearBoard() {
    snakeboard_ctx.fillStyle = board_background;
    snakeboard_ctx.strokeStyle = board_border;
    snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
    snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

function drawnSnake() {
    snake.forEach(drawnSnakePart);
}

function drawnFly(){
    snakeboard_ctx.fillStyle = "red";
    snakeboard_ctx.strokeStyle = "black";

    snakeboard_ctx.fillRect(fly.x, fly.y, 10, 10);
    snakeboard_ctx.strokeRect(fly.x, fly.y, 10, 10);
}

function drawnSnakePart(snakePart) {
    snakeboard_ctx.fillStyle = snake_col;
    snakeboard_ctx.strokeStyle = snake_border;

    snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function moveSnake() {
    if (snake[0].x > 390) {
        snake[0].x = 0;
    }
    if (snake[0].x < 0) {
        snake[0].x = 390;

    }if (snake[0].y > 390) {
        snake[0].y = 0;
    }if (snake[0].y < 0) {
        snake[0].y = 390;
    }
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    snake.unshift(head);
    snake.pop();
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    var keyPressed = event.keyCode;

    //Checks if the player is able to inoput a move and then checks if he isn't moving in the oposite direction
    if (!changing_direction) {
        if (keyPressed === LEFT_KEY && dx === 0) {
            dx = -10;
            dy = 0;
        }
    
        if (keyPressed === RIGHT_KEY && dx === 0) {
            dx = 10;
            dy = 0;
        }
    
        if (keyPressed === UP_KEY && dy === 0) {
            dx = 0;
            dy = -10;
        }
    
        if (keyPressed === DOWN_KEY && dy === 0) {
            dx = 0;
            dy = 10;
        }

        //Defines that the player has already inputted a direction and can't input another move
        changing_direction = true

    }
    
}

function has_game_ended() {
    //Checks if the snake has collided with it's own body
    if(wallColision){
        for (let i = 3; i < snake.length; i++) {
            if (snake[0].x === snake[i].x && snake[0].y === snake[i].y){
                return true;
            }
        }
        
        //Checks if the snake has collided with the walls
        return snake[0].x < 0 || snake[0].y < 0 || snake[0].x == snakeboard.width || snake[0].y == snakeboard.height 
    } else {
        for (let i = 3; i < snake.length; i++) {
            if (snake[0].x === snake[i].x && snake[0].y === snake[i].y){
                return true;
            }
        }
    }
    
}

function checkPoint() {
    //Checks if the snake has catch the fly and then adds one more point to the score
    if (snake[0].x === fly.x && snake[0].y === fly.y){
        snake.unshift({x:fly.x, y:fly.y});
        createFly();
        score++;
        if (score > maxScore) { 
            maxScore = score;
            document.getElementById("maxScore").innerHTML = `MAX SCORE: ${maxScore}`;
        }

        document.getElementById("score").innerHTML = `SCORE: ${score}`;
    }
}

function createFly() {
    //Defines a random value for the coordinates of the fly
    
    fly.x = Math.round(Math.random() * (39 - 0) + 0) * 10;
    fly.y = Math.round(Math.random() * (39 - 0) + 0) * 10;
    

    //Checks if the fly has been generated inside the snake's body and if it is, calls the function again
    for (let i = 0; i < snake.length ; i++) {
        if (fly.x === snake[i].x && fly.y === snake[i].y){
            createFly();
        }
    }
}

function resetValues() {

    //Initial body of the snake
    snake = [
        { x: 200, y: 200 },
        { x: 190, y: 200 },
        { x: 180, y: 200 },
        { x: 170, y: 200 },
        { x: 160, y: 200 },
    ];

    //Initial position of the fly
    fly = { x : 0, y : 0};

    //Initial direction that the snake is heading
    //dx = horizontal velocity and dy = vertical velocity
    dx = 10;
    dy = 0;

    score = 0;

    document.getElementById("score").innerHTML = `SCORE: ${score}`;

    gameOverMenu.style.display = "none";

}

function popGamerOverMenu() {
    gameOverMenu.style.display = "flex";
    
    snakeboard_ctx.fillStyle = '#f5f5f5';
    snakeboard_ctx.strokeStyle = 'black';
    snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
    snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

function goBackMainMenu() {
    clearBoard();
    resetValues();
    scoreboard.style.display = 'none';
    gameOverMenu.style.display = 'none';
    startMenu.style.display = "flex";
    
}