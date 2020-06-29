export class Snake {
    private $instance: HTMLElement;
    private direction: 'top' | 'right' | 'down' | 'left' = 'down';
    private moveInterval: number;

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
        switch(this.direction) {
            case 'top':
                this.$instance.style.top = (this.getPosition().top - 30) + 'px';
                break;
            case 'right': 
                this.$instance.style.left = (this.getPosition().left + 30) + 'px';
                break;
            case 'down': 
                this.$instance.style.top = (this.getPosition().top + 30) + 'px';
                break;
            case 'left': 
                this.$instance.style.left = (this.getPosition().left - 30) + 'px';
                break;
        }
    }

    setupDirectionListener(): void {
        window.addEventListener('keydown', ({ code }) => {
            console.log(code)
            switch(code) {
                case 'ArrowUp':
                    this.direction = 'top';
                    break;
                case 'ArrowLeft':
                    this.direction = 'left';
                    break;
                case 'ArrowRight':
                    this.direction = 'right';
                    break;
                case 'ArrowDown':
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