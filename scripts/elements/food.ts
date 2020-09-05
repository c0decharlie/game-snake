export class Food {
    public  static spawn(position): HTMLElement {
        const $food = document.createElement('div');
        $food.classList.add('food');
        $food.style.top = position.top + 'px';
        $food.style.left = position.left + 'px';
        return $food;
    }
}
