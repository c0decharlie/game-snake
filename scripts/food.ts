export class Food {
    public  static spawn(position): HTMLElement {
        const $food = document.createElement('div');
        $food.classList.add('food');
        // TODO: make this values random
        $food.style.top = position.top + 'px';
        $food.style.left = position.left + 'px';
        return $food;
    }
}
