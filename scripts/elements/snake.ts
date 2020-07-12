import cloneDeep from 'lodash.clonedeep';

import { Position } from './../interfaces/position.interface';
import { SnakePart } from '../interfaces/snake.interface';

import { SNAKE_CONFIG, BOARD_DIMENSIONS } from '../config';
import { eventBus } from '../eventbus';
import { comparePositionSame } from '../helpers';

export class Snake {
    private $instance: HTMLElement;
    private direction: 'top' | 'right' | 'down' | 'left' = 'down';
    private parts: SnakePart[] = [];

    constructor() {
        this.create();
    }

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

    getHeadPosition(): Position {
        return this.parts[0].position;
    }

    getPosition(): Position[] {
        return this.parts.map(part => part.position);
    }

    public move(): void {
        let newPosition: number;
        let isCollisionWithPart: boolean;
        let newHeadPosition: Position;
        switch(this.direction) {
            case 'top':
                newPosition = (this.getHeadPosition().top - SNAKE_CONFIG.DIMENSIONS.HEIGHT);
                newHeadPosition = { top: newPosition, left: this.getHeadPosition().left }
                isCollisionWithPart = this.checkIsCollisionWithPart(newHeadPosition);
                if (newPosition < 0 || isCollisionWithPart) {
                    return this.crash();
                }
                this.updatePartPosition('top', newPosition);
                break;
                case 'right': 
                newPosition = (this.getHeadPosition().left + SNAKE_CONFIG.DIMENSIONS.WIDTH);
                newHeadPosition = { left: newPosition, top: this.getHeadPosition().top }
                isCollisionWithPart = this.checkIsCollisionWithPart(newHeadPosition);
                // increase new position by snake width
                if ((newPosition + SNAKE_CONFIG.DIMENSIONS.WIDTH) > BOARD_DIMENSIONS.WIDTH || isCollisionWithPart) {
                    return this.crash();
                }
                this.updatePartPosition('left', newPosition);
                break;
            case 'down':
                newPosition = (this.getHeadPosition().top + SNAKE_CONFIG.DIMENSIONS.HEIGHT);
                newHeadPosition = { top: newPosition, left: this.getHeadPosition().left }
                isCollisionWithPart = this.checkIsCollisionWithPart(newHeadPosition);
                // increase new position by snake height
                if ((newPosition + SNAKE_CONFIG.DIMENSIONS.HEIGHT) > BOARD_DIMENSIONS.HEIGHT || isCollisionWithPart) {
                    return this.crash();
                }
                this.updatePartPosition('top', newPosition);
                break;
            case 'left': 
                newPosition = (this.getHeadPosition().left - SNAKE_CONFIG.DIMENSIONS.WIDTH);
                newHeadPosition = { left: newPosition, top: this.getHeadPosition().top }
                isCollisionWithPart = this.checkIsCollisionWithPart(newHeadPosition);
                if (newPosition < 0 || isCollisionWithPart) {
                    return this.crash();
                }
                this.updatePartPosition('left', newPosition);
                break;
        }
    }

    private checkIsCollisionWithPart(position: Position): boolean {
        return this.parts
            .map(part => part.position)
            .some(partPosition => comparePositionSame(position, partPosition));
    }

    eat(): void {
        this.grow();
    }

    private updatePartPosition(direction: 'top' | 'left', value: number): void {
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
        eventBus.emit('snake-crash');
    }

    private setupDirectionListener(): void {
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
        // setTimeout(() => 
        //     this.moveInterval = setInterval(this.move.bind(this), 300), 500);
    }
}
