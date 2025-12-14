import React from 'react';
import clsx from 'clsx';

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

export const AboutSection: React.FC = () => {
    return (
        <section className="w-full bg-slate-950 py-24 px-4 border-t border-slate-900">
            <div className="max-w-5xl mx-auto space-y-24">

                {/* Introduction Section */}
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

                {/* Motivation Section */}
                <div>
                    <SectionTitle>💡 Motivation & Concept</SectionTitle>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4 text-slate-300 leading-relaxed">
                            <p>
                                <strong className="text-white">"One Screen, Multiple Boards."</strong><br />
                                The typical Snake game is a solitary experience. This project began with the question: "What if multiple games ran simultaneously in one space?"
                            </p>
                            <p>
                                The goal is to create a musical ensemble where four agents with different speeds and patterns interact. We designed a unique algorithm that translates Grid coordinates into MIDI Notes and collision events into Rhythms.
                            </p>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col justify-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">V</div>
                                <div>
                                    <div className="text-white font-bold">Visual Feedback</div>
                                    <div className="text-xs text-slate-500">Real-time Reactive Rendering</div>
                                </div>
                            </div>
                            <div className="w-0.5 h-6 bg-slate-800 ml-5"></div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">A</div>
                                <div>
                                    <div className="text-white font-bold">Audio Synthesis</div>
                                    <div className="text-xs text-slate-500">WebChucK DSP Engine</div>
                                </div>
                            </div>
                            <div className="w-0.5 h-6 bg-slate-800 ml-5"></div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">I</div>
                                <div>
                                    <div className="text-white font-bold">Intelligence</div>
                                    <div className="text-xs text-slate-500">Reinforcement Learning Agents</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tech Stack Section */}
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

                {/* Musical Logic Section */}
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

                {/* AI Architecture Section */}
                <div>
                    <SectionTitle>🧠 AI Architecture: From Python to Browser</SectionTitle>
                    <div className="bg-slate-900/30 p-8 rounded-xl border border-slate-800">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1 space-y-4">
                                <h4 className="text-lg font-bold text-white">The Brain (DQN Agent)</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    The AI Agent perceives the world through 11 sensors.
                                    It analyzes obstacles (front/back/left/right), current direction, and relative food position to decide the action with the highest expected reward.
                                </p>
                                <ul className="space-y-2 mt-4">
                                    <li className="flex items-center gap-3 text-sm text-slate-300">
                                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                        Input Layer: 11 Features (Collision Risks, Direction, Food Pos)
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-300">
                                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                        Hidden Layers: Dense(256) → Dropout → Dense(256)
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-300">
                                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                        Output: 3 Discrete Actions (Straight, Turn Left, Turn Right)
                                    </li>
                                </ul>
                            </div>
                            <div className="flex-1 w-full bg-slate-950 p-6 rounded-lg font-mono text-xs text-slate-500 border border-slate-800">
                                <div className="text-purple-400 mb-2">// Inference Loop</div>
                                <div className="mb-2">1. Get State (Sensors)</div>
                                <div className="pl-4 text-slate-600">[0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1]</div>
                                <div className="mb-2 mt-2">2. Model Predict (TensorFlow.js)</div>
                                <div className="pl-4 text-slate-600">waiting...</div>
                                <div className="mb-2 mt-2">3. Best Action Selection</div>
                                <div className="pl-4 text-emerald-400">Action: "TURN_RIGHT"</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 text-center border-t border-slate-900">
                    <p className="text-slate-500 text-sm">
                        Designed & Engineered by <span className="text-slate-300 font-bold">You</span>
                    </p>
                    <div className="mt-4 flex justify-center gap-4">
                        <a href="#" className="text-slate-600 hover:text-white transition-colors">GitHub Repository</a>
                        <span className="text-slate-700">|</span>
                        <a href="#" className="text-slate-600 hover:text-white transition-colors">Project Documentation</a>
                    </div>
                </div>

            </div>
        </section>
    );
};