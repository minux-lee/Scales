import React from 'react';
import type { SnakeState } from '../game/types';
import clsx from 'clsx';

interface BoardProps {
    snake: SnakeState;
    gridSize: number;
    onToggleType: () => void;
    onRemove: () => void;
    controls: string | null;
}

const MIN_OPACITY = 0.3;
const getRoleColor = (role: string) => {
    switch (role) {
        case 'BASS': return 'rgb(96, 165, 250)';
        case 'PAD': return 'rgb(192, 132, 252)';
        case 'LEAD': return 'rgb(248, 113, 113)';
        case 'PERC': return 'rgb(52, 211, 153)';
        default: return 'rgb(148, 163, 184)';
    }
};

export const Board: React.FC<BoardProps> = ({ snake, gridSize, onToggleType, onRemove, controls }) => {
    const { food, body } = snake;
    const cells = [];
    const snakeLength = body.length;
    const bodyIndexMap = new Map<string, number>();
    body.forEach((p, i) => bodyIndexMap.set(`${p.x},${p.y}`, i));
    const baseColor = getRoleColor(snake.role);

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const coordKey = `${x},${y}`;
            const bodyIndex = bodyIndexMap.get(coordKey);
            const isHead = bodyIndex === 0;
            const isBody = bodyIndex !== undefined && !isHead;
            const isFood = food.x === x && food.y === y;

            let style: React.CSSProperties = {};
            let cellClass = "w-full h-full bg-slate-900 border border-slate-800 rounded-sm";

            if (isHead) {
                cellClass = "w-full h-full bg-white border-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10 rounded-sm";
            } else if (isBody) {
                const maxBodyIndex = Math.max(1, snakeLength - 1);
                const progress = bodyIndex! / maxBodyIndex;
                const opacity = 1.0 - (progress * (1.0 - MIN_OPACITY));
                cellClass = "w-full h-full border-transparent rounded-sm";
                style = { backgroundColor: baseColor, opacity: opacity, boxShadow: `0 0 5px ${baseColor}` };
            } else if (isFood) {
                cellClass = "w-full h-full bg-yellow-400 animate-pulse-fast rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]";
            }
            cells.push(<div key={`${x}-${y}`} className={cellClass} style={style} />);
        }
    }

    const ControlIcon = () => {
        if (controls === 'WASD') {
            return (
                <div className="flex gap-[2px] ml-2 opacity-80">
                    <div className="w-3 h-3 border border-current rounded flex items-center justify-center text-[6px]">W</div>
                    <div className="w-3 h-3 border border-current rounded flex items-center justify-center text-[6px]">A</div>
                    <div className="w-3 h-3 border border-current rounded flex items-center justify-center text-[6px]">S</div>
                    <div className="w-3 h-3 border border-current rounded flex items-center justify-center text-[6px]">D</div>
                </div>
            );
        }
        if (controls === 'ARROWS') {
            return (
                <div className="flex gap-[2px] ml-2 opacity-80">
                    <div className="w-3 h-3 border border-current rounded flex items-center justify-center text-[6px]">↑</div>
                    <div className="w-3 h-3 border border-current rounded flex items-center justify-center text-[6px]">←</div>
                    <div className="w-3 h-3 border border-current rounded flex items-center justify-center text-[6px]">↓</div>
                    <div className="w-3 h-3 border border-current rounded flex items-center justify-center text-[6px]">→</div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col items-center p-4 bg-slate-950 rounded-xl border border-slate-800 shadow-xl transition-all duration-300 hover:border-slate-700 hover:shadow-2xl relative group/board">

            <button
                onClick={onRemove}
                className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center opacity-0 group-hover/board:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-lg text-xs z-50 font-bold"
                title="Remove Instrument"
            >
                ✕
            </button>

            <div className="flex justify-between w-full mb-3 px-1 items-center h-8">
                <span className={clsx("text-xs font-bold uppercase tracking-widest",
                    snake.role === 'BASS' ? "text-blue-400" :
                        snake.role === 'PAD' ? "text-purple-400" :
                            snake.role === 'LEAD' ? "text-red-400" : "text-emerald-400"
                )}>
                    {snake.role}
                </span>

                <div className="flex items-center gap-2">
                    {snake.type === 'HUMAN' && (
                        <div className={clsx("flex items-center text-[10px] font-mono font-bold animate-fadeIn",
                            snake.role === 'BASS' ? "text-blue-300" :
                                snake.role === 'PAD' ? "text-purple-300" :
                                    snake.role === 'LEAD' ? "text-red-300" : "text-emerald-300"
                        )}>
                            <ControlIcon />
                        </div>
                    )}

                    <button
                        onClick={onToggleType}
                        className={clsx(
                            "relative overflow-hidden group flex items-center justify-center px-3 py-1 rounded-md text-[10px] font-bold tracking-wider transition-all duration-200 border focus:outline-none",
                            snake.type === 'AI'
                                ? "bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"
                                : "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)] hover:bg-indigo-500"
                        )}
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative flex items-center gap-1">
                            {snake.type === 'AI' ? "AI" : "HUMAN"}
                        </span>
                    </button>
                </div>
            </div>

            <div
                className="grid gap-1 w-48 h-48"
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    gridTemplateRows: `repeat(${gridSize}, 1fr)`
                }}
            >
                {cells}
            </div>
        </div>
    );
};