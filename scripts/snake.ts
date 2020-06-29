import { SNAKE_CONFIG, BOARD_DIMENSIONS } from './config';

export class Snake {
    private $instance: HTMLElement;
    private direction: 'top' | 'right' | 'down' | 'left' = 'down';
    private moveInterval: number;
    private moveListener;

    constructor() {}

    create(): void {
        const $snake = document.createElement('div');
        $snake.classList.add('snake');
        $snake.style.top = '0px';
        $snake.style.left = '0px';
        this.$instance = $snake;
    }

    getSnake(): HTMLElement {
        return this.$instance;
    }

    getPosition(): { top: number, left: number } {
        return {
            top: parseInt(this.$instance.style.top),
            left: parseInt(this.$instance.style.left)
        }
    }

    move(): void {
        let newPosition: number;
        switch(this.direction) {
            case 'top':
                newPosition = (this.getPosition().top - SNAKE_CONFIG.DIMENSIONS.HEIGHT);
                if (newPosition < 0) {
                    return this.crash();
                }
                this.$instance.style.top = newPosition + 'px';
                break;
                case 'right': 
                newPosition = (this.getPosition().left + SNAKE_CONFIG.DIMENSIONS.WIDTH);
                // increase new position by snake width
                if ((newPosition + SNAKE_CONFIG.DIMENSIONS.WIDTH) > BOARD_DIMENSIONS.WIDTH) {
                    return this.crash();
                }
                this.$instance.style.left =  newPosition + 'px';
                break;
            case 'down':
                newPosition = (this.getPosition().top + SNAKE_CONFIG.DIMENSIONS.HEIGHT);
                // increase new position by snake height
                if ((newPosition + SNAKE_CONFIG.DIMENSIONS.HEIGHT) > BOARD_DIMENSIONS.HEIGHT) {
                    return this.crash();
                }
                this.$instance.style.top = newPosition + 'px';
                break;
            case 'left': 
                newPosition = (this.getPosition().left - SNAKE_CONFIG.DIMENSIONS.WIDTH);
                if (newPosition < 0) {
                    return this.crash();
                }
                this.$instance.style.left = newPosition + 'px';
                break;
        }
    }

    crash(): void {
        clearInterval(this.moveInterval);
        console.log('game over');
    }

    setupDirectionListener(): void {
        window.addEventListener('keydown', ({ code }) => {
            console.log(code)
            switch(code) {
                case 'ArrowUp':
                    if (this.direction === 'down') {
                        return;
                    }
                    this.direction = 'top';
                    break;
                case 'ArrowLeft':
                    if (this.direction === 'right') {
                        return;
                    }
                    this.direction = 'left';
                    break;
                case 'ArrowRight':
                    if (this.direction === 'left') {
                        return;
                    }
                    this.direction = 'right';
                    break;
                case 'ArrowDown':
                    if (this.direction === 'top') {
                        return;
                    }
                    this.direction = 'down';
                    break;
            }
        })
    }

    start(): void {
        this.setupDirectionListener();
        this.moveInterval = setInterval(this.move.bind(this), 300);
    }
}