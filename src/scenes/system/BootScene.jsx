import { useState, Suspense } from 'react';
import { useStore } from '../../hooks/useStore';
import BootLogs from '../../components/core/BootLogs';
import React from 'react';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { Html } from '@react-three/drei';

const QuantumWarp = React.lazy(() => import('../../components/boot/QuantumWarp'));
const DigitalGenesis = React.lazy(() => import('../../components/boot/DigitalGenesis'));
const NeuralDive = React.lazy(() => import('../../components/boot/NeuralDive'));
const ClassicMatrix = React.lazy(() => import('../../components/boot/ClassicMatrix'));

const BootScene = () => {
    const setScene = useStore((state) => state.setScene);
    const performanceMode = useStore((state) => state.performanceMode);
    const [isFinished, setIsFinished] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // 1. 랜덤 테마 결정
    const [theme] = useState(() => {
        const variants = ['warp', 'genesis', 'neural', 'classic'];
        const selected = variants[Math.floor(Math.random() * variants.length)];
        console.log(`[System] Boot Theme Selected: ${selected.toUpperCase()}`);
        return selected;
    });

    const handleBootComplete = () => {
        if (isFinished) return;
        setIsFinished(true);
        setTimeout(() => setScene('hub'), 1500);
    };

    if (!theme) return null;

    // 2. Wait for interaction (Audio Autoplay Fix)
    // 2. Wait for interaction (Audio Autoplay Fix)
    if (!hasInteracted) {
        return (
            <Html fullscreen zIndexRange={[1000, 0]}>
                <div
                    className="absolute inset-0 bg-black flex flex-col items-center justify-center cursor-pointer z-50 transition-colors duration-700"
                    onClick={() => setHasInteracted(true)}
                >
                    {/* Background Grid/Noise for texture */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle at center, #06b6d4 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                    />

                    <div className="relative group">
                        {/* 1. Pulse Rings - Enhanced */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-cyan-500/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-cyan-400/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_0.5s_infinite]" />

                        {/* 2. Main Button Container */}
                        <div className="relative z-10 flex flex-col items-center justify-center p-10 md:p-16 border border-cyan-500/50 bg-black/80 backdrop-blur-md rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] group-hover:shadow-[0_0_80px_rgba(6,182,212,0.4)] group-hover:border-cyan-400 transition-all duration-500">

                            {/* Icon */}
                            <div className="mb-6 text-cyan-400 animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                                </svg>
                            </div>

                            {/* Main Title */}
                            <h1 className="text-white font-mono text-3xl md:text-5xl font-bold tracking-[0.3em] text-center mb-4 group-hover:text-cyan-50 transition-colors">
                                SYSTEM START
                            </h1>

                            {/* Subtitle / Instruction */}
                            <div className="flex items-center space-x-3">
                                <span className="h-px w-8 bg-cyan-500/50"></span>
                                <p className="text-cyan-400 font-mono text-sm md:text-base tracking-widest animate-pulse">
                                    CLICK TO INITIALIZE
                                </p>
                                <span className="h-px w-8 bg-cyan-500/50"></span>
                            </div>
                        </div>

                        {/* 3. Decorative Corners */}
                        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-500" />
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-500" />
                    </div>
                </div>
            </Html>
        );
    }

    return (
        <group>
            {/* 3. 랜덤 테마 렌더링 */}
            <Suspense fallback={null}>
                {theme === 'warp' && <QuantumWarp isFinished={isFinished} />}
                {theme === 'genesis' && <DigitalGenesis isFinished={isFinished} />}
                {theme === 'neural' && <NeuralDive isFinished={isFinished} />}
                {theme === 'classic' && <ClassicMatrix isFinished={isFinished} />}
            </Suspense>

            {/* 4. 포스트 프로세싱 (High Mode Only) */}
            {performanceMode === 'high' && (
                <EffectComposer disableNormalPass>
                    <Bloom luminanceThreshold={0.5} mipmapBlur intensity={0.4} radius={0.4} />
                    <Noise opacity={0.02} />
                    <ChromaticAberration offset={[0.0005, 0.0005]} />
                    <Vignette eskil={false} offset={0.1} darkness={0.4} />
                </EffectComposer>
            )}

            {/* 5. UI Overlay (Logs & Skip) */}
            {!isFinished && (
                <group>
                    <Html fullscreen zIndexRange={[100, 0]}>
                        <BootLogs onComplete={handleBootComplete} theme={theme} />
                    </Html>

                    {/* Skip Button - Bottom Center */}
                    <Html position={[0, -2, 0]} center zIndexRange={[100, 0]}>
                        <button
                            onClick={handleBootComplete}
                            className="px-8 py-3 border border-white/20 bg-black/40 text-white/50 text-xs font-mono hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm rounded-full tracking-widest pointer-events-auto active:scale-95"
                        >
                            SKIP SEQUENCE
                        </button>
                    </Html>
                </group>
            )}
        </group>
    );
};

export default BootScene;
