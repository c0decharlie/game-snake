import { BOARD_DIMENSIONS } from './../config';

export class Board {
    private $instance: HTMLElement;

    constructor() {
        this.create();
    }

    getInnerOffset() {
        return { 
            top: this.$instance.offsetTop + BOARD_DIMENSIONS.BORDER_WIDTH,
            left: this.$instance.offsetLeft + BOARD_DIMENSIONS.BORDER_WIDTH
        }
    }

    create(): void {
        this.$instance = document.createElement('div');
        this.$instance.classList.add('board');
        this.$instance.style.borderWidth = BOARD_DIMENSIONS.BORDER_WIDTH + 'px';
    }

    appendElement(element: HTMLElement): void {
        this.$instance.appendChild(element);
    }

    getInstance(): HTMLElement {
        return this.$instance;
    }

    getElementPosition(selector: string): { top: number, left: number} {
        const element: HTMLElement = this.$instance.querySelector(selector);
        return {
            top: parseInt(element.style.top),
            left: parseInt(element.style.left)        
        }
    }
}
