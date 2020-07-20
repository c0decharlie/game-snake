import { eventBus } from './../eventbus';
import { Food } from '../elements/food';
import { Board } from '../elements/board';
import { Snake } from '../elements/snake';
import { getRandomPosition } from '../helpers';

enum DIRECTIONS {
    TOP,
    RIGHT,
    DOWN,
    LEFT
}

const KEY_CODES = {
    ARROW_UP: 'ArrowUp',
    ARROW_RIGHT: 'ArrowRight',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft'
}

export class GameController {
    public isGameStarted = false;
    private snake: Snake;
    private board: Board;
    private moveInterval: number;
    private direction = DIRECTIONS.DOWN;

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
        this.setupDirectionListener();
        this.startMovement();
        this.isGameStarted = true;
    }

    private startMovement() {
        this.moveInterval = setInterval(() => {
            this.snake.move(this.direction);

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
        }, 200);
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
           this.isGameStarted = false;
           console.log('game over')
        });
    }


    private setupDirectionListener(): void {
        window.addEventListener('keydown', ({ code }) => {
            switch(code) {
                case KEY_CODES.ARROW_UP:
                    if (this.direction === DIRECTIONS.DOWN) {
                        return;
                    }
                    this.direction = DIRECTIONS.TOP;
                    break;
                case KEY_CODES.ARROW_LEFT:
                    if (this.direction === DIRECTIONS.RIGHT) {
                        return;
                    }
                    this.direction = DIRECTIONS.LEFT;
                    break;
                case KEY_CODES.ARROW_RIGHT:
                    if (this.direction === DIRECTIONS.LEFT) {
                        return;
                    }
                    this.direction = DIRECTIONS.RIGHT;
                    break;
                case KEY_CODES.ARROW_DOWN:
                    if (this.direction === DIRECTIONS.TOP) {
                        return;
                    }
                    this.direction = DIRECTIONS.DOWN;
                    break;
            }
        })
    }
}
