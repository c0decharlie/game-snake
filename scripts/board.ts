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

        const food = new Food({ top: 60, left: 120 });
        this.$instance.appendChild(food.spawn());

        setTimeout(() =>
            this.moveInterval = setInterval(() => {
                snake.move();

                // check if snake is on same place as food
                const foodCurrentPosition = food.getPosition();
                const snakeCurrentPosition = snake.getHeadPosition();
                const isOnSamePosition = foodCurrentPosition.top === snakeCurrentPosition.top 
                    && foodCurrentPosition.left === snakeCurrentPosition.left;

                if (isOnSamePosition) {
                    snake.eat();
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