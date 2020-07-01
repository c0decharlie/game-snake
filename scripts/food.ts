export class Food {
    constructor(private position) {}

    spawn(): HTMLElement {
        const $food = document.createElement('div');
        $food.classList.add('food');
        // TODO: make this values random
        $food.style.top = this.position.top + 'px';
        $food.style.left = this.position.left + 'px';
        return $food;
    }

    public getPosition() {
        return this.position;
    }
}
