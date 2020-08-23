import { CreateHTMLElementInterface } from './interfaces/create-html-element.interface';
import { Position } from './interfaces/position.interface';

export function comparePositionSame(pos1: Position, pos2: Position): boolean {
    return (pos1.top === pos2.top && pos1.left === pos2.left);
}

export function getRandomInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

export function randomPosition(): number {
    return Math.round(getRandomInt(30, 450) / 30) * 30;
}

export function getRandomPosition(): Position {
    return { top: randomPosition(), left: randomPosition() };
}

export function createHTMLElement(element: CreateHTMLElementInterface): HTMLElement {
    const $element = document.createElement(element.tagName);

    const elementClasses = element.classList.split(' ');
    elementClasses.forEach(elementClass => $element.classList.add(elementClass));

    if (element.innerHTML) {
        $element.innerHTML = element.innerHTML;
    }
    
    return $element;
}

export function createHTMLElements(elements: CreateHTMLElementInterface[]): HTMLElement[] {
    return elements.map(createHTMLElement);
}
