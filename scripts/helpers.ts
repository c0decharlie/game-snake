import { Position } from './interfaces/position.interface';

export function comparePositionSame(pos1: Position, pos2: Position): boolean {
    return (pos1.top === pos2.top && pos1.left === pos2.left);
}
