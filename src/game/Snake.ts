import type { Point, Direction } from './types';

export const GRID_SIZE = 8;

export function moveHead(body: Point[], direction: Direction): Point {
    const head = body[0];
    let { x, y } = head;

    switch (direction) {
        case 'UP': y -= 1; break;
        case 'DOWN': y += 1; break;
        case 'LEFT': x -= 1; break;
        case 'RIGHT': x += 1; break;
    }

    return { x, y };
}