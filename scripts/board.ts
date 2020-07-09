import { eventBus } from './eventbus';
import { Snake } from './snake';
import { Food } from './food';

export class Board {
    private $instance: HTMLElement;

    constructor(private config) {
        this.create();
    }

    getInnerOffset() {
        return { 
            top: this.$instance.offsetTop + this.config.borderWidth,
            left: this.$instance.offsetLeft + this.config.borderWidth
        }
    }

    create(): void {
        this.$instance = document.createElement('div');
        this.$instance.classList.add('board');
        this.$instance.style.borderWidth = this.config.borderWidth + 'px';
    }

    appendElement(element: HTMLElement): void {
        this.$instance.appendChild(element);
    }

    getInstance(): HTMLElement {
        return this.$instance;
    }
}
