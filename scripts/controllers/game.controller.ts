import { eventBus } from './../eventbus';
import { Food } from './../food';
import { Board } from './../board';
import { Snake } from './../snake';

export class GameController {
    private snake: Snake;
    private board: Board;
    private moveInterval: number; 

    constructor(boardConfig) {
        this.snake = new Snake();
        this.board = new Board(boardConfig);
    }
    
    init() {
        this.board.appendElement(this.snake.getSnake());

        const $gameContainer = document.getElementById('game-container');
        $gameContainer.appendChild(this.board.getInstance());

        let foodPosition = getRandomPosition();
        this.board.appendElement(Food.spawn(foodPosition));

        setTimeout(() =>
            this.moveInterval = setInterval(() => {
                this.snake.start();
                this.snake.move();

                const snakeCurrentPosition = this.snake.getHeadPosition();
                // check if snake is on same place as food
                const isOnSamePosition = foodPosition.top === snakeCurrentPosition.top 
                    && foodPosition.left === snakeCurrentPosition.left;

                if (isOnSamePosition) {
                    this.snake.eat();
                    document.querySelector('.food').remove();
                    foodPosition = getRandomPosition();
                    this.board.appendElement(Food.spawn(foodPosition));
                }
            }, 300), 500);

        eventBus.on('snake-grow', snakePart => {
            console.log('board snake grow')
            this.board.appendElement(snakePart)
        });

        eventBus.on('snake-crash', () => {
           clearInterval(this.moveInterval);
           console.log('game over')
        });
    }
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function randomPosition() {
    return Math.round(getRandomInt(30, 450) / 30) * 30;
}

function getRandomPosition() {
    return { top: randomPosition(), left: randomPosition() };
}
