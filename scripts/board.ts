import { eventBus } from './eventbus';
import { Snake } from './snake';
import { Food } from './food';

export class Board {
    private $instance: HTMLElement;
    private moveInterval: number; 

    constructor(private config) {}

    getInnerOffset() {
        return { 
            top: this.$instance.offsetTop + this.config.borderWidth,
            left: this.$instance.offsetLeft + this.config.borderWidth
        }
    }

    // TODO: Move the game control stuff to game controller later
    create() {
        this.$instance = document.createElement('div');
        this.$instance.classList.add('board');
        this.$instance.style.borderWidth = this.config.borderWidth + 'px';

        const snake = new Snake();
        snake.create();
        this.$instance.appendChild(snake.getSnake());
        snake.start();

        const $gameContainer = document.getElementById(this.config.container);
        $gameContainer.appendChild(this.$instance);

        let foodPosition = getFoodPosition();
        this.$instance.appendChild(Food.spawn(foodPosition));

        setTimeout(() =>
            this.moveInterval = setInterval(() => {
                snake.move();

                // check if snake is on same place as food
                const snakeCurrentPosition = snake.getHeadPosition();
                const isOnSamePosition = foodPosition.top === snakeCurrentPosition.top 
                    && foodPosition.left === snakeCurrentPosition.left;

                if (isOnSamePosition) {
                    snake.eat();
                    document.querySelector('.food').remove();
                    foodPosition = getFoodPosition();
                    this.$instance.appendChild(Food.spawn(foodPosition));
                }
            }, 300), 500);

        eventBus.on('snake-grow', snakePart => {
            console.log('board snake grow')
            this.$instance.appendChild(snakePart)
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
    return Math.round(getRandomInt(30, 480) / 30) * 30;
}

function getFoodPosition() {
    return { top: randomPosition(), left: randomPosition() };
}
