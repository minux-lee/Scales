import { useState, useEffect, useCallback } from 'react';

type Coordinate = {
    x: number;
    y: number;
};

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const BOARD_SIZE = 20;
const INITIAL_SPEED = 150;

const GameBoard = () => {
    const [snake, setSnake] = useState<Coordinate[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<Coordinate>({ x: 15, y: 15 });
    const [direction, setDirection] = useState<Direction>('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    const generateFood = useCallback((): Coordinate => {
        return {
            x: Math.floor(Math.random() * BOARD_SIZE),
            y: Math.floor(Math.random() * BOARD_SIZE),
        };
    }, []);

    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(generateFood());
        setDirection('RIGHT');
        setGameOver(false);
        setScore(0);
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp':
                    if (direction !== 'DOWN') setDirection('UP');
                    break;
                case 'ArrowDown':
                    if (direction !== 'UP') setDirection('DOWN');
                    break;
                case 'ArrowLeft':
                    if (direction !== 'RIGHT') setDirection('LEFT');
                    break;
                case 'ArrowRight':
                    if (direction !== 'LEFT') setDirection('RIGHT');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [direction]);

    useEffect(() => {
        if (gameOver) return;

        const moveSnake = setInterval(() => {
            setSnake((prevSnake) => {
                const newHead = { ...prevSnake[0] };

                switch (direction) {
                    case 'UP': newHead.y -= 1; break;
                    case 'DOWN': newHead.y += 1; break;
                    case 'LEFT': newHead.x -= 1; break;
                    case 'RIGHT': newHead.x += 1; break;
                }

                if (
                    newHead.x < 0 ||
                    newHead.x >= BOARD_SIZE ||
                    newHead.y < 0 ||
                    newHead.y >= BOARD_SIZE ||
                    prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
                ) {
                    setGameOver(true);
                    if (score > highScore) setHighScore(score);
                    return prevSnake;
                }

                const newSnake = [newHead, ...prevSnake];

                if (newHead.x === food.x && newHead.y === food.y) {
                    setScore((s) => s + 1);
                    setFood(generateFood());
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        }, INITIAL_SPEED);

        return () => clearInterval(moveSnake);
    }, [direction, food, gameOver, score, highScore, generateFood]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
            <h1 style={{
                color: 'var(--neon-pink)',
                textShadow: '0 0 10px var(--neon-pink)',
                fontSize: '3rem',
                letterSpacing: '5px'
            }}>
                CYBER SNAKE
            </h1>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '400px',
                color: 'var(--neon-blue)',
                textShadow: '0 0 5px var(--neon-blue)'
            }}>
                <span>SCORE: {score.toString().padStart(3, '0')}</span>
                <span>HIGH: {highScore.toString().padStart(3, '0')}</span>
            </div>

            <div style={{
                width: `${BOARD_SIZE * GRID_SIZE}px`,
                height: `${BOARD_SIZE * GRID_SIZE}px`,
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '2px solid var(--neon-green)',
                boxShadow: '0 0 20px var(--neon-green), inset 0 0 20px rgba(57, 255, 20, 0.2)',
                position: 'relative'
            }}>
                {snake.map((segment, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            width: `${GRID_SIZE - 2}px`,
                            height: `${GRID_SIZE - 2}px`,
                            left: `${segment.x * GRID_SIZE}px`,
                            top: `${segment.y * GRID_SIZE}px`,
                            backgroundColor: index === 0 ? '#fff' : 'var(--neon-green)',
                            boxShadow: '0 0 10px var(--neon-green)',
                            zIndex: 2
                        }}
                    />
                ))}
                <div
                    style={{
                        position: 'absolute',
                        width: `${GRID_SIZE - 2}px`,
                        height: `${GRID_SIZE - 2}px`,
                        left: `${food.x * GRID_SIZE}px`,
                        top: `${food.y * GRID_SIZE}px`,
                        backgroundColor: 'var(--neon-pink)',
                        boxShadow: '0 0 15px var(--neon-pink)',
                        borderRadius: '50%',
                        animation: 'pulse 1s infinite'
                    }}
                />
                {gameOver && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        backdropFilter: 'blur(2px)',
                        color: 'var(--neon-pink)',
                        zIndex: 10
                    }}>
                        <h2 style={{ fontSize: '2rem', textShadow: '0 0 10px red', marginBottom: '20px' }}>SYSTEM FAILURE</h2>
                        <button
                            onClick={resetGame}
                            style={{
                                background: 'transparent',
                                border: '2px solid var(--neon-blue)',
                                color: 'var(--neon-blue)',
                                padding: '10px 30px',
                                fontFamily: 'inherit',
                                fontSize: '1.2rem',
                                cursor: 'pointer',
                                boxShadow: '0 0 10px var(--neon-blue)',
                                textTransform: 'uppercase'
                            }}
                        >
                            Reboot System
                        </button>
                    </div>
                )}
            </div>

            <div style={{ color: '#555', fontSize: '0.8rem', marginTop: '10px' }}>
                [USE ARROW KEYS TO NAVIGATE]
            </div>

            <style>{`
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.7; }
        }
      `}</style>
        </div>
    );
};

export default GameBoard;