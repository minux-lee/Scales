import React, { useState } from 'react';
import clsx from 'clsx';

// --- Small Components ---
const TechBadge = ({ children }: { children: React.ReactNode }) => (
    <span className="px-3 py-1 text-xs font-mono font-bold text-slate-300 bg-slate-800 rounded-full border border-slate-700">
        {children}
    </span>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        {children}
    </h3>
);

const RoleCard = ({ role, color, desc, logic }: { role: string, color: string, desc: string, logic: string }) => (
    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
        <div className={clsx("text-sm font-black tracking-widest mb-2", color)}>{role}</div>
        <div className="text-slate-300 text-sm mb-4 leading-relaxed">{desc}</div>
        <div className="bg-slate-950 p-3 rounded text-xs font-mono text-slate-500">
            <span className="text-slate-400">Logic:</span> {logic}
        </div>
    </div>
);

const GitHubProfile = ({ username }: { username: string }) => (
    <a
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-slate-800 hover:border-indigo-500 hover:bg-indigo-900/20 transition-all group"
    >
        <div className="w-2 h-2 rounded-full bg-slate-500 group-hover:bg-indigo-400 transition-colors" />
        <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
            {username}
        </span>
    </a>
);

// --- Main Component ---
export const AboutSection: React.FC = () => {
    const [isAIDetailsOpen, setIsAIDetailsOpen] = useState(false);

    return (
        <section className="w-full bg-slate-950 py-24 px-4 border-t border-slate-900">
            <div className="max-w-5xl mx-auto space-y-24">

                {/* 1. Introduction */}
                <div className="text-center space-y-6">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        THE ARCHITECTURE OF <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400">
                            SCALES
                        </span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        The title <strong>'SCALES'</strong> embodies a double meaning: the <span className="text-slate-200">reptilian scales</span> that form the snake's body, and the <span className="text-slate-200">musical scales</span> that form the ensemble's harmony.
                    </p>
                    <p className="text-slate-500 max-w-2xl mx-auto text-base leading-relaxed">
                        This project reimagines the classic rules of the Snake game into a modern Generative Music System.
                        Going beyond simple win/loss mechanics, it transforms the interplay of chance and order created by players and AI into a unique auditory experience.
                    </p>
                </div>

                {/* 2. Motivation */}
                <div>
                    <SectionTitle>💡 Motivation & Concept</SectionTitle>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4 text-slate-300 leading-relaxed">
                            <p>
                                <strong className="text-white">"Controlled Randomness: The Multi-Agent Ensemble"</strong><br />
                                Traditional music production often relies on static, repetitive loops. SCALES challenges this determinism by introducing <strong>Controlled Randomness</strong> into the composition process.
                            </p>
                            <p>
                                The system allows multiple instances of the same instrument to run simultaneously across different boards, creating a layered, polyphonic texture. Whether driven by the pathfinding logic of an <strong>AI Agent</strong> or the spontaneous reactions of a <strong>Human Player</strong>, each board generates a unique, non-linear pattern.
                            </p>
                            <p className="text-slate-400 italic text-sm border-l-2 border-slate-700 pl-3 mt-4">
                                "The collision of agents becomes the coincidence of rhythm."
                            </p>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col justify-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">V</div>
                                <div>
                                    <div className="text-white font-bold">Multi-Agent System</div>
                                    <div className="text-xs text-slate-500">Parallel Execution Environment</div>
                                </div>
                            </div>
                            <div className="w-0.5 h-6 bg-slate-800 ml-5"></div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">A</div>
                                <div>
                                    <div className="text-white font-bold">Generative Audio</div>
                                    <div className="text-xs text-slate-500">Polyphonic Texture Synthesis</div>
                                </div>
                            </div>
                            <div className="w-0.5 h-6 bg-slate-800 ml-5"></div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">I</div>
                                <div>
                                    <div className="text-white font-bold">Hybrid Control</div>
                                    <div className="text-xs text-slate-500">Human-AI Collaboration</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Tech Stack */}
                <div>
                    <SectionTitle>🛠 Tech Stack & Engineering</SectionTitle>
                    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <h4 className="text-white font-bold mb-4 border-b border-slate-700 pb-2">Core & Frontend</h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <TechBadge>React 18</TechBadge>
                                    <TechBadge>TypeScript</TechBadge>
                                    <TechBadge>Vite</TechBadge>
                                    <TechBadge>Tailwind CSS</TechBadge>
                                </div>
                                <p className="text-sm text-slate-400">
                                    Optimized React's reconciliation process for high-performance rendering.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-4 border-b border-slate-700 pb-2">State & Audio</h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <TechBadge>Zustand</TechBadge>
                                    <TechBadge>WebChucK</TechBadge>
                                    <TechBadge>Web Audio API</TechBadge>
                                </div>
                                <p className="text-sm text-slate-400">
                                    Maintains perfect <span className="text-white">500ms Tick Sync</span> between 4 game loops and the audio engine using Zustand's transient updates.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-4 border-b border-slate-700 pb-2">AI & Learning</h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <TechBadge>TensorFlow.js</TechBadge>
                                    <TechBadge>Python (Gym)</TechBadge>
                                    <TechBadge>DQN</TechBadge>
                                </div>
                                <p className="text-sm text-slate-400">
                                    Inferences a pre-trained Reinforcement Learning (DQN) model from Python directly in the browser.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Musical Logic */}
                <div>
                    <SectionTitle>🎹 Musical Logic Implementation</SectionTitle>
                    <p className="text-slate-400 mb-8">
                        Each snake is not just a game object, but an instrument. Position values (x, y) are converted into audio parameters in real-time.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RoleCard
                            role="BASS"
                            color="text-blue-400"
                            desc="Provides the musical foundation. Lower Y positions trigger deeper bass notes."
                            logic="Scale Index = (GRID_SIZE - 1 - Y)"
                        />
                        <RoleCard
                            role="PAD (HARMONY)"
                            color="text-purple-400"
                            desc="Fills the harmony. Cycles through 4 chord progressions based on the X-axis region."
                            logic="Chord Index = floor(X / 2) % 4"
                        />
                        <RoleCard
                            role="LEAD (MELODY)"
                            color="text-red-400"
                            desc="Plays the melody. Creates dynamic pitch changes using a combination of X and Y coordinates to account for diagonal movement."
                            logic="Note = Base + X + (GRID_SIZE - Y)"
                        />
                        <RoleCard
                            role="PERC (RHYTHM)"
                            color="text-emerald-400"
                            desc="Provides the rhythm. Triggered (Kick/Snare) when touching the top or bottom walls of the grid."
                            logic="Trigger if Y === 0 or Y === GRID_SIZE - 1"
                        />
                    </div>
                </div>

                {/* 5. AI Architecture (Deep Dive) */}
                <div>
                    <SectionTitle>🧠 AI Architecture: DQN Agent</SectionTitle>
                    <div className="bg-slate-900/30 p-8 rounded-xl border border-slate-800">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="flex-1 space-y-4">
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        The AI Agent (Deep Q-Network) runs entirely in the browser using TensorFlow.js.
                                        It was originally trained in Python using Gymnasium and converted for the web.
                                        The agent makes decisions every 500ms based on the immediate surroundings.
                                    </p>
                                    <div className="flex gap-4 mt-4">
                                        <button
                                            onClick={() => setIsAIDetailsOpen(!isAIDetailsOpen)}
                                            className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors flex items-center gap-2"
                                        >
                                            {isAIDetailsOpen ? 'HIDE TECHNICAL DETAILS' : 'READ TECHNICAL DEEP DIVE'}
                                            <span className={clsx("transition-transform duration-300", isAIDetailsOpen ? "rotate-180" : "rotate-0")}>▼</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 w-full bg-slate-950 p-6 rounded-lg font-mono text-xs text-slate-500 border border-slate-800">
                                    <div className="text-purple-400 mb-2">// Inference Loop Summary</div>
                                    <div className="mb-2">1. Get State (11 Booleans)</div>
                                    <div className="pl-4 text-slate-600">[0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1]</div>
                                    <div className="mb-2 mt-2">2. Neural Net Forward Pass</div>
                                    <div className="pl-4 text-slate-600">TensorFlow.js execution...</div>
                                    <div className="mb-2 mt-2">3. Action Selection (ArgMax)</div>
                                    <div className="pl-4 text-emerald-400">Action: "TURN_RIGHT"</div>
                                </div>
                            </div>

                            {/* Collapsible Details */}
                            <div className={clsx(
                                "grid gap-8 overflow-hidden transition-all duration-500 ease-in-out border-t border-slate-800/50",
                                isAIDetailsOpen ? "mt-6 pt-6 opacity-100 max-h-[1000px]" : "max-h-0 opacity-0"
                            )}>
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <h4 className="text-white font-bold border-l-4 border-indigo-500 pl-3">1. Observation Space (The Inputs)</h4>
                                        <p className="text-slate-400 text-sm">
                                            The neural network receives a vector of <strong>11 boolean values</strong> representing the snake's immediate perception. It does not see the entire grid, only relative dangers and targets.
                                        </p>
                                        <ul className="space-y-2 text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded border border-slate-800">
                                            <li className="flex gap-2"><span className="text-red-400">[0-2]</span> Danger (Straight, Right, Left)</li>
                                            <li className="flex gap-2"><span className="text-blue-400">[3-6]</span> Current Direction (L, R, U, D)</li>
                                            <li className="flex gap-2"><span className="text-green-400">[7-10]</span> Food Location (L, R, U, D)</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-white font-bold border-l-4 border-purple-500 pl-3">2. Neural Network Structure</h4>
                                        <p className="text-slate-400 text-sm">
                                            A concise Dense Neural Network optimized for real-time web inference.
                                        </p>
                                        <div className="text-xs text-slate-400 space-y-2 bg-slate-950 p-4 rounded border border-slate-800 font-mono">
                                            <div className="flex justify-between">
                                                <span>Input Layer</span>
                                                <span className="text-slate-500">Shape: (11,)</span>
                                            </div>
                                            <div className="flex justify-center text-slate-600">↓</div>
                                            <div className="flex justify-between">
                                                <span className="text-white">Dense (Relu)</span>
                                                <span className="text-indigo-400">256 Units</span>
                                            </div>
                                            <div className="flex justify-center text-slate-600">↓</div>
                                            <div className="flex justify-between">
                                                <span>Dropout</span>
                                                <span className="text-slate-500">Rate: 0.2</span>
                                            </div>
                                            <div className="flex justify-center text-slate-600">↓</div>
                                            <div className="flex justify-between">
                                                <span className="text-white">Dense (Relu)</span>
                                                <span className="text-indigo-400">256 Units</span>
                                            </div>
                                            <div className="flex justify-center text-slate-600">↓</div>
                                            <div className="flex justify-between">
                                                <span className="text-emerald-400 font-bold">Output Layer</span>
                                                <span className="text-emerald-500">3 Units (Actions)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 md:col-span-2">
                                        <h4 className="text-white font-bold border-l-4 border-emerald-500 pl-3">3. Action Space & Decision</h4>
                                        <p className="text-slate-400 text-sm">
                                            The model outputs 3 values (Q-values). The system selects the action with the highest value (ArgMax).
                                            Crucially, the actions are <strong>relative</strong> to the snake's current head direction, not absolute coordinates.
                                        </p>
                                        <div className="flex flex-wrap gap-4 mt-2">
                                            <span className="px-3 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">Action 0: Go Straight</span>
                                            <span className="px-3 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">Action 1: Turn Right (Clockwise)</span>
                                            <span className="px-3 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">Action 2: Turn Left (Counter-Clockwise)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* 6. Footer & Credits */}
                <div className="pt-20 pb-8 text-center border-t border-slate-900">
                    <div className="flex flex-col items-center gap-6">
                        <div className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-2">
                            Designed & Engineered by
                        </div>
                        <div className="flex gap-4 flex-wrap justify-center">
                            <GitHubProfile username="minux-lee" />
                            <GitHubProfile username="siu1031" />
                        </div>

                        <div className="mt-8 flex items-center gap-2 text-slate-700">
                            <span className="h-px w-12 bg-slate-800"></span>
                            <span className="text-xs">SOURCE CODE</span>
                            <span className="h-px w-12 bg-slate-800"></span>
                        </div>

                        <a
                            href="https://github.com/minux-lee/Scales"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-white transition-colors text-sm flex items-center gap-2 hover:underline"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            minux-lee/Scales
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
};