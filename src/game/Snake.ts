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

    if (x < 0) x = GRID_SIZE - 1;
    if (x >= GRID_SIZE) x = 0;
    if (y < 0) y = GRID_SIZE - 1;
    if (y >= GRID_SIZE) y = 0;

    return { x, y };
}