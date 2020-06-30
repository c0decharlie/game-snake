import { eventBus } from './eventbus';
import { Snake } from './snake';

export class Board {
    private $instance: HTMLElement;

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

        eventBus.on('snake-grow', snakePart => {
            console.log('board snake grow')
            this.$instance.appendChild(snakePart)
        });
    }
}