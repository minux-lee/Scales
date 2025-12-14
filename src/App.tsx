import { useEffect } from 'react';
import clsx from 'clsx';
import { useGameStore } from './store/useStore';
import { Board } from './components/Board';
import { AboutSection } from './components/AboutSection';
import { loadModel } from './ai/AIController';
import type { Role } from './game/types';

function App() {
    const {
        snakes,
        gridSize,
        tick,
        togglePlay,
        isPlaying,
        setDirection,
        reset,
        togglePlayerType,
        addSnake,
        removeSnake
    } = useGameStore();

    useEffect(() => { loadModel(); }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }

            const humanSnakes = snakes.filter(s => s.type === 'HUMAN').sort((a, b) => a.id - b.id);
            const player1 = humanSnakes[0];
            const player2 = humanSnakes[1];

            if (player1) {
                if (e.key === 'w' || e.key === 'W') setDirection(player1.id, 'UP');
                if (e.key === 's' || e.key === 'S') setDirection(player1.id, 'DOWN');
                if (e.key === 'a' || e.key === 'A') setDirection(player1.id, 'LEFT');
                if (e.key === 'd' || e.key === 'D') setDirection(player1.id, 'RIGHT');
            }
            if (player2) {
                if (e.key === 'ArrowUp') setDirection(player2.id, 'UP');
                if (e.key === 'ArrowDown') setDirection(player2.id, 'DOWN');
                if (e.key === 'ArrowLeft') setDirection(player2.id, 'LEFT');
                if (e.key === 'ArrowRight') setDirection(player2.id, 'RIGHT');
            }

            if (e.key === ' ') togglePlay();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setDirection, snakes]);

    useEffect(() => {
        let interval: number;
        if (isPlaying) {
            interval = window.setInterval(() => tick(), 500);
        }
        return () => clearInterval(interval);
    }, [isPlaying, tick]);

    const getControlsLabel = (snakeId: number, type: string) => {
        if (type === 'AI') return null;
        const humanSnakes = snakes.filter(s => s.type === 'HUMAN').sort((a, b) => a.id - b.id);
        const index = humanSnakes.findIndex(s => s.id === snakeId);
        if (index === 0) return "WASD";
        if (index === 1) return "ARROWS";
        return null;
    };

    return (
        <div className="bg-slate-950 min-h-screen">
            <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
                <header className="mb-8 text-center">
                    <h1 className="text-6xl font-black tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 mb-2 font-display">
                        SCALES
                    </h1>
                    <p className="text-slate-400 text-xs tracking-[0.3em] uppercase">
                        Generative Audio Ensemble
                    </p>
                </header>

                <div className="flex flex-wrap justify-center gap-8 mb-12 max-w-7xl">
                    {snakes.map((snake) => (
                        <Board
                            key={snake.id}
                            snake={snake}
                            gridSize={gridSize}
                            onToggleType={() => togglePlayerType(snake.id)}
                            onRemove={() => removeSnake(snake.id)}
                            controls={getControlsLabel(snake.id, snake.type)}
                        />
                    ))}
                </div>

                <div className="flex flex-col items-center gap-6 z-10">
                    <div className="flex flex-wrap justify-center gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800 max-w-full">
                        <span className="px-3 py-2 text-slate-500 text-xs font-bold self-center">ADD:</span>
                        {(['BASS', 'PAD', 'LEAD', 'PERC'] as Role[]).map(role => (
                            <button
                                key={role}
                                onClick={() => addSnake(role)}
                                className={clsx(
                                    "whitespace-nowrap px-3 py-2 text-xs font-bold rounded hover:scale-105 transition-all active:scale-95 border border-slate-700",
                                    role === 'BASS' ? "text-blue-400 hover:bg-blue-900/30" :
                                        role === 'PAD' ? "text-purple-400 hover:bg-purple-900/30" :
                                            role === 'LEAD' ? "text-red-400 hover:bg-red-900/30" :
                                                "text-emerald-400 hover:bg-emerald-900/30"
                                )}
                            >
                                + {role}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <button onClick={togglePlay} className={clsx("px-8 py-3 font-bold rounded shadow-lg transition-all transform hover:scale-105 active:scale-95", isPlaying ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-white text-slate-900 hover:bg-blue-50")}>
                            {isPlaying ? 'STOP ENSEMBLE' : 'START ENSEMBLE'}
                        </button>
                        <button onClick={reset} className="px-6 py-3 border border-slate-700 text-slate-400 font-bold rounded hover:bg-slate-800 transition">
                            RESET
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-8 animate-bounce text-slate-600 flex flex-col items-center gap-2 cursor-pointer"
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                    <span className="text-xs font-bold tracking-widest uppercase">System Architecture</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>

            <AboutSection />
        </div>
    );
}

export default App;