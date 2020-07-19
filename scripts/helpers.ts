import { Position } from './interfaces/position.interface';

export function comparePositionSame(pos1: Position, pos2: Position): boolean {
    return (pos1.top === pos2.top && pos1.left === pos2.left);
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

export function randomPosition() {
    return Math.round(getRandomInt(30, 450) / 30) * 30;
}

export function getRandomPosition() {
    return { top: randomPosition(), left: randomPosition() };
}
