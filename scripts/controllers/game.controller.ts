import { eventBus } from './../eventbus';
import { Food } from '../elements/food';
import { Board } from '../elements/board';
import { Snake } from '../elements/snake';

export class GameController {
    private snake: Snake;
    private board: Board;
    private moveInterval: number; 

    constructor(private config) {
        this.snake = new Snake();
        this.board = new Board(config);
    }
    
    public createGame() {
        this.board.appendElement(this.snake.getSnake());

        const $gameContainer = document.getElementById(this.config.container);
        $gameContainer.appendChild(this.board.getInstance());

        const foodPosition = this.generateFoodPosition();
        this.board.appendElement(Food.spawn(foodPosition));

        this.setupGameListeners();
    }

    public startGame() {
        this.startMovement();
    }

    private startMovement() {
        setTimeout(() =>
            this.moveInterval = setInterval(() => {
                this.snake.start();
                this.snake.move();

                const snakeCurrentPosition = this.snake.getHeadPosition();
                // check if snake is on same place as food
                let foodPosition = this.board.getElementPosition('.food');
                const isOnSamePosition = foodPosition.top === snakeCurrentPosition.top 
                    && foodPosition.left === snakeCurrentPosition.left;

                if (isOnSamePosition) {
                    this.snake.eat();
                    document.querySelector('.food').remove();
                    foodPosition = this.generateFoodPosition();
                    this.board.appendElement(Food.spawn(foodPosition));
                }
            }, 300), 500);
    }

    private generateFoodPosition() {
        const generatedPosition = getRandomPosition();
        const snakePartsPosition = this.snake.getPosition();

        const isPositionSame = snakePartsPosition.some(partPosition => 
            partPosition.top === generatedPosition.top 
            && partPosition.left === generatedPosition.left
        );
        
        if (isPositionSame) {
            return this.generateFoodPosition();
        }

        return generatedPosition;
    }

    private setupGameListeners() {
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
