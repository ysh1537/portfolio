import React from 'react';
import { useStore } from '../../hooks/useStore';
import useSoundFX from '../../hooks/useSoundFX';

const LabUI = () => {
    const currentScene = useStore(state => state.currentScene);
    const startWarp = useStore(state => state.startWarp);
    const { playClick, playHover } = useSoundFX();

    // Lab 01 Config & Actions
    const lab01Config = useStore(state => state.lab01Config);
    const setLab01Config = useStore(state => state.setLab01Config);

    // Lab 02 Config & Actions
    const lab02Config = useStore(state => state.lab02Config);
    const setLab02Config = useStore(state => state.setLab02Config);

    // Lab 03 Config & Actions
    const lab03Config = useStore(state => state.lab03Config);
    const setLab03Config = useStore(state => state.setLab03Config);

    if (!currentScene.startsWith('lab')) return null;

    const handleWarpToHub = () => {
        playClick();
        startWarp('hub');
    };

    return (
        <div className="fixed top-1/2 left-8 -translate-y-1/2 z-30 pointer-events-auto">

            {/* LAB 01: PRISM */}
            {currentScene === 'lab01' && (
                <div className="w-72 bg-black/80 border border-cyan-500/50 p-6 rounded-lg backdrop-blur-md text-cyan-400 font-mono text-xs shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                    <div className="mb-6 border-b border-cyan-500/30 pb-2 font-bold flex justify-between tracking-widest">
                        <span>PRISM_CONTROLLER</span>
                        <span className="animate-pulse text-white">● STABLE</span>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-cyan-400 font-bold tracking-widest text-[10px]">
                                DISPERSION
                            </span>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={lab01Config.distort}
                                onChange={(e) => setLab01Config({ distort: parseFloat(e.target.value) })}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="w-32 h-1 bg-cyan-900/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 hover:[&::-webkit-slider-thumb]:bg-cyan-300 transition-all border border-cyan-500/30"
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-purple-400 font-bold tracking-widest text-[10px]">
                                DATA FLOW
                            </span>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.1"
                                value={lab01Config.speed}
                                onChange={(e) => setLab01Config({ speed: parseFloat(e.target.value) })}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="w-32 h-1 bg-purple-900/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400 hover:[&::-webkit-slider-thumb]:bg-purple-300 transition-all border border-purple-500/30"
                            />
                        </div>
                    </div>

                    <div className="mt-6 text-[10px] opacity-50 text-center border-t border-cyan-500/20 pt-2 text-white">
                        CRYSTALLINE_OPTICS_V2.0
                    </div>

                    <button
                        onClick={handleWarpToHub}
                        onMouseEnter={playHover}
                        className="w-full mt-4 py-2 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 rounded transition-all font-mono text-xs tracking-widest bg-black/50"
                    >
                        [ WARP TO NEXUS ]
                    </button>
                </div>
            )}

            {/* LAB 02: TERRARIUM */}
            {currentScene === 'lab02' && (
                <div className="w-72 bg-black/80 border border-emerald-500/50 p-6 rounded-lg backdrop-blur-md text-emerald-400 font-mono text-xs shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <div className="mb-6 border-b border-emerald-500/30 pb-2 font-bold flex justify-between tracking-widest">
                        <span>ECOSYSTEM_ENGINE</span>
                        <span className="animate-pulse text-white">● ACTIVE</span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-emerald-500/10 p-3 rounded">
                            <span className="text-white opacity-80">GRAVITY_FIELD</span>
                            <span className={lab02Config.zeroG ? "text-cyan-400 font-bold" : "text-emerald-500 opacity-50"}>
                                {lab02Config.zeroG ? "[ZERO-G]" : "[NORMAL]"}
                            </span>
                        </div>

                        <button
                            onClick={() => {
                                playClick();
                                if (lab02Config.zeroG) {
                                    setLab02Config({ zeroG: false, gravity: [0, -0.5, 0] });
                                } else {
                                    setLab02Config({ zeroG: true, gravity: [0, 0.2, 0] });
                                }
                            }}
                            onMouseEnter={playHover}
                            className={`w-full py-3 border transition-all font-bold tracking-widest hover:scale-105 active:scale-95 ${lab02Config.zeroG
                                ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                                : 'bg-transparent text-emerald-500 border-emerald-500 hover:bg-emerald-500 hover:text-black'
                                }`}
                        >
                            {lab02Config.zeroG ? 'RESTORE GRAVITY' : 'INITIATE ZERO-G'}
                        </button>

                        <div className="text-[10px] opacity-70 mt-2 text-center text-white">
                            &gt; INTERACT WITH ORGANIC MATTER
                        </div>

                        <button
                            onClick={handleWarpToHub}
                            onMouseEnter={playHover}
                            className="w-full mt-4 py-2 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20 rounded transition-all font-mono text-xs tracking-widest bg-black/50"
                        >
                            [ WARP TO NEXUS ]
                        </button>
                    </div>
                </div>
            )}

            {/* LAB 03: RESONANCE */}
            {currentScene === 'lab03' && (
                <div className="w-72 bg-black/80 border border-purple-500/30 p-4 rounded-xl backdrop-blur-md shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                    <div className="mb-4 border-b border-purple-500/30 pb-2 font-bold flex justify-between tracking-widest">
                        <span className="text-purple-400">SONIC_CONTROLS</span>
                    </div>

                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => { playClick(); setLab03Config('demo'); }}
                            onMouseEnter={playHover}
                            className={`flex-1 py-2 rounded font-mono text-xs transition-all cursor-pointer border ${lab03Config.mode === 'demo'
                                ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_#7c3aed]'
                                : 'border-purple-500/30 text-purple-500 hover:bg-purple-900/30'}`}
                        >
                            DEMO_MODE
                        </button>
                        <button
                            onClick={() => { playClick(); setLab03Config('mic'); }}
                            onMouseEnter={playHover}
                            className={`flex-1 py-2 rounded font-mono text-xs transition-all cursor-pointer border ${lab03Config.mode === 'mic'
                                ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_15px_#0891b2]'
                                : 'border-cyan-500/30 text-cyan-500 hover:bg-cyan-900/30'}`}
                        >
                            MIC_INPUT
                        </button>
                    </div>

                    <button
                        onClick={handleWarpToHub}
                        onMouseEnter={playHover}
                        className="w-full py-2 border border-white/30 text-white/70 hover:bg-white/10 hover:border-white/50 hover:text-white transition-all rounded shadow-lg cursor-pointer bg-black/50 text-xs font-mono tracking-widest"
                    >
                        [ WARP TO NEXUS ]
                    </button>
                </div>
            )}

            {/* LAB 04: GLITCH */}
            {currentScene === 'lab04' && (
                <div className="absolute top-[80vh] left-[50vw] -translate-x-1/2 -translate-y-1/2 w-auto">
                    <button
                        onClick={handleWarpToHub}
                        onMouseEnter={playHover}
                        className="px-6 py-2 bg-red-900/80 border border-red-500 rounded font-mono text-sm text-red-200 hover:bg-red-700 hover:text-white transition-all cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse"
                    >
                        [ EMERGENCY EXIT ]
                    </button>
                </div>
            )}

        </div>
    );
};

export default LabUI;
