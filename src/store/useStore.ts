import { create } from 'zustand';
import type { GameState, SnakeState, Point } from '../game/types';
import { moveHead, GRID_SIZE } from '../game/Snake';
import { audioEngine } from '../audio/AudioEngine';
import { getAIAction } from '../ai/AIController';

const initialSnakes: SnakeState[] = [
    { id: 0, role: 'BASS', type: 'AI', body: [{ x: 0, y: 0 }], direction: 'RIGHT', nextDirection: 'RIGHT', color: 'bg-snake-bass', isAlive: true },
    { id: 1, role: 'PAD', type: 'AI', body: [{ x: 7, y: 0 }], direction: 'DOWN', nextDirection: 'DOWN', color: 'bg-snake-pad', isAlive: true },
    { id: 2, role: 'LEAD', type: 'HUMAN', body: [{ x: 0, y: 7 }], direction: 'UP', nextDirection: 'UP', color: 'bg-snake-lead', isAlive: true },
    { id: 3, role: 'PERC', type: 'HUMAN', body: [{ x: 7, y: 7 }], direction: 'LEFT', nextDirection: 'LEFT', color: 'bg-snake-perc', isAlive: true },
];

const initialFood: Point[] = [
    { x: 4, y: 4 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 3, y: 4 }
];

export const useGameStore = create<GameState>((set, get) => ({
    isPlaying: false,
    bpm: 120,
    snakes: JSON.parse(JSON.stringify(initialSnakes)),
    food: JSON.parse(JSON.stringify(initialFood)),
    gridSize: GRID_SIZE,

    togglePlay: () => set((state) => {
        if (!state.isPlaying) {
            audioEngine.init();
        }
        return { isPlaying: !state.isPlaying };
    }),

    reset: () => set({
        snakes: JSON.parse(JSON.stringify(initialSnakes)),
        food: JSON.parse(JSON.stringify(initialFood)),
        isPlaying: false
    }),

    setDirection: (id, dir) => set((state) => {
        const newSnakes = [...state.snakes];
        const snake = newSnakes[id];

        // 180도 회전 방지 (자살 방지)
        const isOpposite = (dir === 'UP' && snake.direction === 'DOWN') ||
            (dir === 'DOWN' && snake.direction === 'UP') ||
            (dir === 'LEFT' && snake.direction === 'RIGHT') ||
            (dir === 'RIGHT' && snake.direction === 'LEFT');

        if (!isOpposite && snake.isAlive) {
            snake.nextDirection = dir;
        }
        return { snakes: newSnakes };
    }),

    tick: () => {
        const { snakes, food } = get();

        // 1. AI 연산 및 이동 방향 결정
        const processedSnakes = snakes.map(snake => {
            if (snake.type === 'AI' && snake.isAlive) {
                // 현재 상태를 기반으로 다음 행동 예측
                const aiDir = getAIAction(snake, food[snake.id], snakes);
                return { ...snake, nextDirection: aiDir };
            }
            return snake;
        });

        // 2. 물리 엔진 업데이트 (이동 및 충돌)
        const movedSnakes = processedSnakes.map((snake, index) => {
            if (!snake.isAlive) return snake;

            const newHead = moveHead(snake.body, snake.nextDirection);
            const newBody = [newHead, ...snake.body];

            // 사과 섭취 판정
            const myFood = food[index];

            if (newHead.x === myFood.x && newHead.y === myFood.y) {
                // 사과 재배치 (뱀 몸통 제외한 랜덤 위치 - 간단 구현)
                food[index] = {
                    x: Math.floor(Math.random() * GRID_SIZE),
                    y: Math.floor(Math.random() * GRID_SIZE)
                };
            } else {
                newBody.pop(); // 꼬리 자르기
            }

            return { ...snake, body: newBody, direction: snake.nextDirection };
        });

        // 3. 오디오 트리거 (Musical Mapping)
        movedSnakes.forEach(snake => {
            if (!snake.isAlive) return;

            const head = snake.body[0];

            // ==========================================
            // Grid-to-Music Mapping
            // ==========================================

            if (snake.role === 'BASS') {
                // Y축 좌표를 피치로 매핑
                const scale = [36, 39, 41, 43, 46, 48, 51, 53];
                const index = Math.min(Math.max(GRID_SIZE - 1 - head.y, 0), scale.length - 1);
                audioEngine.playBass(scale[index]);
            }
            else if (snake.role === 'PAD') {
                // X축 좌표에 따라 코드 진행 변경
                const chords = [
                    [48, 51, 55],
                    [44, 48, 51],
                    [41, 44, 48],
                    [43, 46, 50]
                ];
                const chordIdx = Math.floor(head.x / 2) % 4;
                audioEngine.playPad(chords[chordIdx]);
            }
            else if (snake.role === 'LEAD') {
                // 리드는 멜로디. X+Y를 조합하여 넓은 음역대 사용
                const note = 60 + head.x + (GRID_SIZE - head.y);
                audioEngine.playLead(note);
            }
            else if (snake.role === 'PERC') {
                // 특정 구역 진입 시 드럼 연주
                if (head.y === GRID_SIZE - 1) audioEngine.playPerc(0); // Kick
                if (head.y === 0) audioEngine.playPerc(1); // Snare
            }
        });

        set({ snakes: movedSnakes, food: [...food] });
    }
}));