
import { SnakePart } from './interfaces/snake.interface';
import { SNAKE_CONFIG, BOARD_DIMENSIONS } from './config';
import { eventBus } from './eventbus';

import cloneDeep from 'lodash.clonedeep';

export class Snake {
    private $instance: HTMLElement;
    private direction: 'top' | 'right' | 'down' | 'left' = 'down';
    private moveInterval: number;
    private parts: SnakePart[] = [];

    constructor() {}

    create(): void {
        const $snake = document.createElement('div');

        $snake.classList.add('snake');
        $snake.style.top = SNAKE_CONFIG.STARTING_POINT.TOP + 'px';
        $snake.style.left = SNAKE_CONFIG.STARTING_POINT.LEFT + 'px';

        this.parts.push({
            $element: $snake,
            position: {
                top: SNAKE_CONFIG.STARTING_POINT.TOP,
                left: SNAKE_CONFIG.STARTING_POINT.LEFT
            }
        });

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
                this.updatePartPosition('top', newPosition);
                break;
                case 'right': 
                newPosition = (this.getPosition().left + SNAKE_CONFIG.DIMENSIONS.WIDTH);
                // increase new position by snake width
                if ((newPosition + SNAKE_CONFIG.DIMENSIONS.WIDTH) > BOARD_DIMENSIONS.WIDTH) {
                    return this.crash();
                }
                this.updatePartPosition('left', newPosition);
                break;
            case 'down':
                newPosition = (this.getPosition().top + SNAKE_CONFIG.DIMENSIONS.HEIGHT);
                // increase new position by snake height
                if ((newPosition + SNAKE_CONFIG.DIMENSIONS.HEIGHT) > BOARD_DIMENSIONS.HEIGHT) {
                    return this.crash();
                }
                this.updatePartPosition('top', newPosition);
                break;
            case 'left': 
                newPosition = (this.getPosition().left - SNAKE_CONFIG.DIMENSIONS.WIDTH);
                if (newPosition < 0) {
                    return this.crash();
                }
                this.updatePartPosition('left', newPosition);
                break;
        }
    }

    updatePartPosition(direction: 'top' | 'left', value: number): void {
        
        this.parts = this.parts.reduce((acc, part, i) => {
            if (!acc[i - 1]) {
                const partClone = cloneDeep(part);
                partClone.$element.style[direction] = value + 'px';
                partClone.position[direction] = value;
                acc.push(partClone);
            } else {
                const prevPartPosition = this.parts[i - 1].position;
                const partClone = cloneDeep(part);
                partClone.$element.style.top = prevPartPosition.top + 'px';
                partClone.$element.style.left = prevPartPosition.left + 'px';
                partClone.position = prevPartPosition;
                acc.push(partClone);
            }
            return acc
        }, []);
    }

    grow(): void {
        const $snakePart = document.createElement('div');
        $snakePart.classList.add('snake-part');

        const position = this.parts[this.parts.length - 1].position;
        $snakePart.style.top = position.top + 'px';
        $snakePart.style.left = position.left + 'px';

        this.parts.push({
            $element: $snakePart,
            position 
        });

        eventBus.emit('snake-grow', $snakePart);
    }

    crash(): void {
        clearInterval(this.moveInterval);
        console.log('game over');
    }

    setupDirectionListener(): void {
        window.addEventListener('keydown', ({ code }) => {
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
        setTimeout(() => 
            this.moveInterval = setInterval(this.move.bind(this), 300), 500);
    }
}
