export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Point = { x: number; y: number };
export type PlayerType = 'HUMAN' | 'AI';
export type Role = 'BASS' | 'PAD' | 'LEAD' | 'PERC';

export interface SnakeState {
    id: number;
    role: Role;
    type: PlayerType;
    body: Point[];
    direction: Direction;
    nextDirection: Direction;
    color: string;
    isAlive: boolean;
    respawnTimer: number;
    food: Point;
}

export interface GameState {
    isPlaying: boolean;
    bpm: number;
    snakes: SnakeState[];
    gridSize: number;
    humanOrderIdQueue: number[];

    togglePlay: () => void;
    setDirection: (id: number, dir: Direction) => void;
    tick: () => void;
    reset: () => void;
    togglePlayerType: (id: number) => void;

    addSnake: (role: Role) => void;
    removeSnake: (id: number) => void;
}