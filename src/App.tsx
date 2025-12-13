import { useEffect } from 'react'; // [Fix]: Removed unused 'React'
import clsx from 'clsx'; // [Fix]: Added missing import
import { useGameStore } from './store/useStore';
import { Board } from './components/Board';
import { loadModel } from './ai/AIController';

function App() {
    const { snakes, food, gridSize, tick, togglePlay, isPlaying, setDirection, reset } = useGameStore();

    // 초기화: AI 모델 로드
    useEffect(() => {
        loadModel();
    }, []); // [Fix]: Added empty dependency array

    // 키보드 입력 핸들러
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Human 1: WASD (Role: LEAD, Index 2)
            if (e.key === 'w') setDirection(2, 'UP');
            if (e.key === 's') setDirection(2, 'DOWN');
            if (e.key === 'a') setDirection(2, 'LEFT');
            if (e.key === 'd') setDirection(2, 'RIGHT');

            // Human 2: Arrows (Role: PERC, Index 3)
            if (e.key === 'ArrowUp') setDirection(3, 'UP');
            if (e.key === 'ArrowDown') setDirection(3, 'DOWN');
            if (e.key === 'ArrowLeft') setDirection(3, 'LEFT');
            if (e.key === 'ArrowRight') setDirection(3, 'RIGHT');
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setDirection]);

    // 메인 루프 (120 BPM 시뮬레이션)
    useEffect(() => {
        let interval: number;
        if (isPlaying) {
            interval = window.setInterval(() => {
                tick();
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isPlaying, tick]);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 mb-2">
                    POLYPHONIC SNAKE
                </h1>
                <p className="text-slate-400 text-sm">LOCAL ENSEMBLE SYSTEM</p>
            </header>

            <div className="grid grid-cols-2 gap-8 mb-12">
                {snakes.map((snake) => (
                    <Board
                        key={snake.id}
                        snake={snake}
                        // [Fix]: types.ts fix will resolve the index error here
                        food={food[snake.id]}
                        gridSize={gridSize}
                    />
                ))}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={togglePlay}
                    className={clsx(
                        "px-8 py-3 font-bold rounded shadow-lg transition-all transform hover:scale-105 active:scale-95",
                        isPlaying
                            ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            : "bg-white text-slate-900 hover:bg-blue-50"
                    )}
                >
                    {isPlaying ? 'STOP ENSEMBLE' : 'START ENSEMBLE'}
                </button>

                <button
                    onClick={reset}
                    className="px-6 py-3 border border-slate-700 text-slate-400 font-bold rounded hover:bg-slate-800 transition"
                >
                    RESET
                </button>
            </div>

            <div className="mt-8 p-4 bg-slate-900 rounded border border-slate-800 text-center">
                <p className="text-slate-500 text-xs font-mono mb-1">CONTROLS</p>
                <div className="flex gap-8 text-sm text-slate-300">
                    <span><strong className="text-red-400">LEAD</strong>: W A S D</span>
                    <span><strong className="text-emerald-400">PERC</strong>: ↑ ↓ ← →</span>
                </div>
            </div>
        </div>
    );
}

export default App;