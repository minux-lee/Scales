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
}

export interface GameState {
    isPlaying: boolean;
    bpm: number;
    snakes: SnakeState[];
    food: Point[];
    gridSize: number;

    // Actions
    togglePlay: () => void;
    setDirection: (id: number, dir: Direction) => void;
    tick: () => void;
    reset: () => void;
}