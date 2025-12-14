import { create } from 'zustand';
import type { GameState, SnakeState, Role, Point, Direction } from '../game/types';
import { moveHead, GRID_SIZE } from '../game/Snake';
import { audioEngine } from '../audio/AudioEngine';
import { getAIAction } from '../ai/AIController';

const getRandomPoint = (excludeBody: Point[] = []): Point => {
    let point = { x: 0, y: 0 };
    let isValid = false;
    while (!isValid) {
        point = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        const onBody = excludeBody.some(b => b.x === point.x && b.y === point.y);
        if (!onBody) isValid = true;
    }
    return point;
};

const createSnake = (role: Role, idOverride?: number): SnakeState => {
    const id = idOverride ?? Date.now() + Math.random();
    const startPos = getRandomPoint();

    let color = 'bg-slate-400';
    if (role === 'BASS') color = 'bg-snake-bass';
    if (role === 'PAD') color = 'bg-snake-pad';
    if (role === 'LEAD') color = 'bg-snake-lead';
    if (role === 'PERC') color = 'bg-snake-perc';

    return {
        id,
        role,
        type: 'AI',
        body: [startPos],
        direction: 'RIGHT',
        nextDirection: 'RIGHT',
        color,
        isAlive: true,
        respawnTimer: 0,
        food: getRandomPoint([startPos])
    };
};

const getInitialSnakes = (): SnakeState[] => [
    createSnake('BASS', 100),
    createSnake('PAD', 101),
    createSnake('LEAD', 102),
    createSnake('PERC', 103),
];

export const useGameStore = create<GameState>((set, get) => ({
    isPlaying: false,
    bpm: 120,
    snakes: getInitialSnakes(),
    gridSize: GRID_SIZE,
    humanOrderIdQueue: [],

    togglePlay: () => set((state) => {
        if (!state.isPlaying) audioEngine.init();
        return { isPlaying: !state.isPlaying };
    }),

    reset: () => set({
        snakes: getInitialSnakes(),
        isPlaying: false,
        humanOrderIdQueue: []
    }),

    addSnake: (role: Role) => set((state) => ({
        snakes: [...state.snakes, createSnake(role)]
    })),

    removeSnake: (targetId: number) => set((state) => {
        const newSnakes = state.snakes.filter(s => s.id !== targetId);
        const newQueue = state.humanOrderIdQueue.filter(id => id !== targetId);
        return { snakes: newSnakes, humanOrderIdQueue: newQueue };
    }),

    setDirection: (id, dir) => set((state) => {
        const newSnakes = state.snakes.map(snake => {
            if (snake.id !== id || !snake.isAlive) return snake;
            const isOpposite = (dir === 'UP' && snake.direction === 'DOWN') ||
                (dir === 'DOWN' && snake.direction === 'UP') ||
                (dir === 'LEFT' && snake.direction === 'RIGHT') ||
                (dir === 'RIGHT' && snake.direction === 'LEFT');
            if (!isOpposite) return { ...snake, nextDirection: dir };
            return snake;
        });
        return { snakes: newSnakes };
    }),

    togglePlayerType: (targetId: number) => set((state) => {
        const newSnakes = [...state.snakes];
        const snakeIndex = newSnakes.findIndex(s => s.id === targetId);
        if (snakeIndex === -1) return {};

        const targetSnake = { ...newSnakes[snakeIndex] };
        let newQueue = [...state.humanOrderIdQueue];

        if (targetSnake.type === 'HUMAN') {
            targetSnake.type = 'AI';
            newQueue = newQueue.filter(id => id !== targetId);
        } else {
            if (newQueue.length >= 2) {
                const victimId = newQueue.shift();
                const victimIndex = newSnakes.findIndex(s => s.id === victimId);
                if (victimIndex !== -1) {
                    newSnakes[victimIndex] = { ...newSnakes[victimIndex], type: 'AI' };
                }
            }
            targetSnake.type = 'HUMAN';
            newQueue.push(targetId);
        }
        newSnakes[snakeIndex] = targetSnake;
        return { snakes: newSnakes, humanOrderIdQueue: newQueue };
    }),

    tick: () => {
        const { snakes } = get();

        const movedSnakes = snakes.map(snake => {
            let currentSnake = { ...snake };

            if (currentSnake.type === 'AI' && currentSnake.isAlive) {
                const aiDir = getAIAction(currentSnake, currentSnake.food, snakes);
                currentSnake.nextDirection = aiDir;
            }

            if (!currentSnake.isAlive) {
                if (currentSnake.respawnTimer > 0) {
                    return { ...currentSnake, respawnTimer: currentSnake.respawnTimer - 1 };
                } else {
                    const startPos = getRandomPoint();
                    return {
                        ...currentSnake,
                        body: [startPos],
                        isAlive: true,
                        respawnTimer: 0,
                        food: getRandomPoint([startPos]),
                        direction: 'RIGHT' as Direction,
                        nextDirection: 'RIGHT' as Direction
                    };
                }
            }

            const newHead = moveHead(currentSnake.body, currentSnake.nextDirection);

            const isWallCollision = newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE;
            const isSelfCollision = currentSnake.body.some((segment, idx) => {
                if (idx === currentSnake.body.length - 1) return false;
                return segment.x === newHead.x && segment.y === newHead.y;
            });

            if (isWallCollision || isSelfCollision) {
                return { ...currentSnake, isAlive: false, respawnTimer: 2 };
            }

            let newBody = [newHead, ...currentSnake.body];
            let newFood = currentSnake.food;

            if (newHead.x === currentSnake.food.x && newHead.y === currentSnake.food.y) {
                newFood = getRandomPoint(newBody);
            } else {
                newBody.pop();
            }

            return { ...currentSnake, body: newBody, direction: currentSnake.nextDirection, food: newFood };
        });

        movedSnakes.forEach(snake => {
            if (!snake.isAlive) return;
            const head = snake.body[0];

            if (snake.role === 'BASS') {
                if (head.x < GRID_SIZE / 2){
                    if (head.y < GRID_SIZE / 2) {
                        audioEngine.playBass(45);
                    }
                    else {
                        audioEngine.playBass(49);
                    }
                }
                else {
                    if (head.y < GRID_SIZE / 2) {
                        audioEngine.playBass(52);
                    }
                    else {
                        audioEngine.playBass(57);
                    }
                }
            }
            else if (snake.role === 'PAD') {
                const chords = [[49], [52], [57], [58], [61], [64]];
                const chordIdx = (head.x + head.y) % 5;
                audioEngine.playPad(chords[chordIdx]);
            }
            else if (snake.role === 'LEAD') {
                const note = [45, 46, 49, 50, 52, 53, 56, 57, 58, 61, 62, 64, 65, 68, 69, 70];
                const noteIdx = head.x + (GRID_SIZE - head.y) - 1;
                audioEngine.playLead(note[noteIdx]);
            }
            else if (snake.role === 'PERC') {
                if ((head.x + head.y) % 2 === 1) {
                    audioEngine.playPerc(2);
                }
                else if((head.x - head.y) % 4 === 0) {
                    audioEngine.playPerc(1);
                }
                else {
                    audioEngine.playPerc(0);
                }
            }
        });

        set({ snakes: movedSnakes });
    }
}));