import { eventBus } from './../eventbus';
import { Food } from '../elements/food';
import { Board } from '../elements/board';
import { Snake } from '../elements/snake';
import { getRandomPosition, comparePositionSame } from '../helpers';
import { ScoreBoard } from './../elements/score-board';
import { Alert } from './../elements/alert';

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
    private scoreBoard: ScoreBoard;
    private alert: Alert;
    private moveInterval: number;
    private direction = DIRECTIONS.DOWN;

    constructor(private config) {
        this.snake = new Snake();
        this.board = new Board(config);
        this.setupWindowListeners();
    }
    
    public createGame(): void {
        this.board.appendElement(this.snake.getSnake());

        const $gameContainer = document.getElementById(this.config.container);
        $gameContainer.appendChild(this.board.getInstance());

        this.scoreBoard = new ScoreBoard();
        $gameContainer.appendChild(this.scoreBoard.getElement());

        const foodPosition = this.generateFoodPosition();
        this.board.appendElement(Food.spawn(foodPosition));

        this.alert = new Alert();
        this.alert.setContent({
            title: 'Press space to start game'
        });
        this.alert.open();

        this.setupEventBusListeners();
    }

    public startGame(): void {
        this.startMovement();
        this.isGameStarted = true;
    }

    private startMovement(): void {
        this.moveInterval = setInterval(() => {
            this.snake.move(this.direction);

            const snakeCurrentPosition = this.snake.getHeadPosition();
            // check if snake is on same place as food
            let foodPosition = this.board.getElementPosition('.food');
            const isOnSamePosition = comparePositionSame(foodPosition, snakeCurrentPosition);

            if (isOnSamePosition) {
                this.snake.eat();
                this.scoreBoard.updateScore(10);
                document.querySelector('.food').remove();
                foodPosition = this.generateFoodPosition();
                this.board.appendElement(Food.spawn(foodPosition));
            }
        }, 200);
    }

    private generateFoodPosition(): {left: number, top: number} {
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

    private setupEventBusListeners(): void {
        eventBus.on('snake-grow', snakePart => {
            console.log('board snake grow')
            this.board.appendElement(snakePart)
        });

        eventBus.on('snake-crash',this.endGame.bind(this));
    }

    private endGame(): void {
        clearInterval(this.moveInterval);
           this.alert.setContent({
               title: 'Game over!',
               message: 'Refresh the page to try again.'
           });
           this.alert.open();
    }

    private setupWindowListeners(): void {
        window.addEventListener('keydown', ({code}: KeyboardEvent) => {
            if (code === 'Space' && !this.isGameStarted) {
                console.log('space')
                this.alert.close();
                this.startGame();
            }
            this.setDirection(code);
        });
    }

    private setDirection(keyCode: string): void {
        switch(keyCode) {
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
    }
}
