import type { SnakeState, Point, Direction } from '../game/types';
import * as tf from '@tensorflow/tfjs';

// ==========================================
// AI Model Loading
// ==========================================

let model: tf.LayersModel | null = null;
const MODEL_PATH = '/models/snake-rl-model.json';

// 모델 비동기 로드 함수
export async function loadModel() {
    try {
        model = await tf.loadLayersModel(MODEL_PATH);
        console.log("RL Model loaded successfully");
    } catch (e) {
        console.warn("Model not found. Running in Heuristic Mode.");
    }
}

// 메인 의사결정 함수
// [Fix]: Removed unused 'allSnakes' parameter
export function getAIAction(snake: SnakeState, target: Point, _allSnakes: SnakeState[]): Direction {
    if (model) {
        // RL Model Logic (Placeholder)
        return 'UP';
    } else {
        return getHeuristicAction(snake, target);
    }
}

// 휴리스틱 알고리즘 (Greedy Best-First Search)
function getHeuristicAction(snake: SnakeState, target: Point): Direction {
    // [Fix]: snake.body is an array, so head is snake.body[0]
    const head = snake.body[0];
    const { x, y } = head;

    // 사과와의 거리 계산
    const dx = target.x - x;
    const dy = target.y - y;

    // 현재 진행 방향 (반대 방향 금지용)
    const current = snake.direction;

    // 수평 이동 우선
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && current !== 'LEFT') return 'RIGHT';
        if (dx < 0 && current !== 'RIGHT') return 'LEFT';
    }

    // 수직 이동
    if (dy > 0 && current !== 'UP') return 'DOWN';
    if (dy < 0 && current !== 'DOWN') return 'UP';

    // 막혔을 경우 기본값
    if (current === 'UP') return 'RIGHT';
    return 'UP';
}