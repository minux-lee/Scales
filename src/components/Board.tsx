import React from 'react';
import type { SnakeState, Point } from '../game/types';
import clsx from 'clsx';

interface BoardProps {
    snake: SnakeState;
    food: Point;
    gridSize: number;
}

export const Board: React.FC<BoardProps> = ({ snake, food, gridSize }) => {
    const cells = [];

    const head = snake.body[0];

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const isHead = head.x === x && head.y === y;
            const isBody = snake.body.some((p, i) => i > 0 && p.x === x && p.y === y);
            const isFood = food.x === x && food.y === y;

            let cellClass = "bg-slate-900";

            if (isHead) cellClass = "bg-white";
            else if (isBody) cellClass = snake.color;
            else if (isFood) cellClass = "bg-yellow-400 animate-pulse-fast";

            cells.push(
                <div
                    key={`${x}-${y}`}
                    className={clsx(
                        "w-full h-full border border-slate-800 transition-colors duration-75 rounded-sm",
                        cellClass
                    )}
                />
            );
        }
    }

    return (
        <div className="flex flex-col items-center p-4 bg-slate-950 rounded-xl border border-slate-800 shadow-xl">
            <div className="flex justify-between w-full mb-2 px-1">
                <span className={clsx("text-xs font-bold uppercase tracking-widest",
                    snake.role === 'BASS' ? "text-blue-400" :
                        snake.role === 'PAD' ? "text-purple-400" :
                            snake.role === 'LEAD' ? "text-red-400" : "text-emerald-400"
                )}>
                    {snake.role}
                </span>
                <span className="text-xs text-slate-500">{snake.type}</span>
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