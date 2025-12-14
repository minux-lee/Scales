import type { SnakeState, Point, Direction } from '../game/types';
import * as tf from '@tensorflow/tfjs';
import { GRID_SIZE } from '../game/Snake';

let model: tf.GraphModel | tf.LayersModel | null = null;
const MODEL_PATH = './models/snake-rl/model.json';

export async function loadModel() {
    try {
        model = await tf.loadLayersModel(MODEL_PATH);
        console.log("RL Model loaded (Layers Model)");
    } catch (e) {
        console.warn("Standard LayersModel load failed, trying GraphModel...", e);
        try {
            model = await tf.loadGraphModel(MODEL_PATH);
            console.log("RL Model loaded (Graph Model)");
        } catch (e2) {
            console.warn("AI Model not found or incompatible. Using Enhanced Heuristic Mode. Error:", e2);
        }
    }
}

export function getAIAction(snake: SnakeState, target: Point, allSnakes: SnakeState[]): Direction {
    if (model) {
        return getModelAction(snake, target);
    } else {
        return getHeuristicAction(snake, target, allSnakes);
    }
}

function getModelAction(snake: SnakeState, target: Point): Direction {
    return tf.tidy(() => {
        const state = getGameState(snake, target);
        const inputTensor = tf.tensor2d([state], [1, 11]);

        const prediction = model!.predict(inputTensor) as tf.Tensor;
        const actionIdx = prediction.argMax(1).dataSync()[0];

        const clockwiseDirections: Direction[] = ['LEFT', 'UP', 'RIGHT', 'DOWN'];
        const currentDirIdx = clockwiseDirections.indexOf(snake.direction);

        let newDirIdx = currentDirIdx;

        if (actionIdx === 0) {
            newDirIdx = currentDirIdx;
        } else if (actionIdx === 1) {
            newDirIdx = (currentDirIdx + 1) % 4;
        } else if (actionIdx === 2) {
            newDirIdx = (currentDirIdx - 1 + 4) % 4;
        }

        return clockwiseDirections[newDirIdx];
    });
}

function getGameState(snake: SnakeState, food: Point): number[] {
    const head = snake.body[0];

    const point_l = { x: head.x - 1, y: head.y };
    const point_r = { x: head.x + 1, y: head.y };
    const point_u = { x: head.x, y: head.y - 1 };
    const point_d = { x: head.x, y: head.y + 1 };

    const dir_l = snake.direction === 'LEFT';
    const dir_r = snake.direction === 'RIGHT';
    const dir_u = snake.direction === 'UP';
    const dir_d = snake.direction === 'DOWN';

    const isCollision = (pt: Point) => {
        if (pt.x < 0 || pt.x >= GRID_SIZE || pt.y < 0 || pt.y >= GRID_SIZE) return true;

        for (let i = 1; i < snake.body.length; i++) {
            if (pt.x === snake.body[i].x && pt.y === snake.body[i].y) return true;
        }
        return false;
    };

    const state = [

        (dir_r && isCollision(point_r)) ||
            (dir_l && isCollision(point_l)) ||
            (dir_u && isCollision(point_u)) ||
            (dir_d && isCollision(point_d)) ? 1.0 : 0.0,


        (dir_u && isCollision(point_r)) ||
            (dir_d && isCollision(point_l)) ||
            (dir_l && isCollision(point_u)) ||
            (dir_r && isCollision(point_d)) ? 1.0 : 0.0,


        (dir_d && isCollision(point_r)) ||
            (dir_u && isCollision(point_l)) ||
            (dir_r && isCollision(point_u)) ||
            (dir_l && isCollision(point_d)) ? 1.0 : 0.0,

        dir_l ? 1.0 : 0.0,
        dir_r ? 1.0 : 0.0,
        dir_u ? 1.0 : 0.0,
        dir_d ? 1.0 : 0.0,

        food.x < head.x ? 1.0 : 0.0,
        food.x > head.x ? 1.0 : 0.0,
        food.y < head.y ? 1.0 : 0.0,
        food.y > head.y ? 1.0 : 0.0
    ];

    return state;
}

function getHeuristicAction(snake: SnakeState, target: Point, allSnakes: SnakeState[]): Direction {
    const head = snake.body[0];
    const possibleMoves: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

    const safeMoves = possibleMoves.filter(dir => {
        let nextX = head.x;
        let nextY = head.y;

        if (dir === 'UP') nextY -= 1;
        if (dir === 'DOWN') nextY += 1;
        if (dir === 'LEFT') nextX -= 1;
        if (dir === 'RIGHT') nextX += 1;

        if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) return false;
        if (snake.body.some(p => p.x === nextX && p.y === nextY)) return false;

        const hitOther = allSnakes.some(s =>
            s.id !== snake.id && s.isAlive && s.body.some(b => b.x === nextX && b.y === nextY)
        );
        if (hitOther) return false;

        return true;
    });

    if (safeMoves.length === 0) return snake.direction;

    let bestMove = safeMoves[0];
    let minDist = 9999;

    for (const move of safeMoves) {
        let nextX = head.x;
        let nextY = head.y;
        if (move === 'UP') nextY -= 1;
        if (move === 'DOWN') nextY += 1;
        if (move === 'LEFT') nextX -= 1;
        if (move === 'RIGHT') nextX += 1;

        const dist = Math.abs(target.x - nextX) + Math.abs(target.y - nextY);

        if (dist < minDist) {
            minDist = dist;
            bestMove = move;
        }
    }

    return bestMove;
}