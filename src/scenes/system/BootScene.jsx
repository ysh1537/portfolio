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
    if (!hasInteracted) {
        return (
            <Html fullscreen zIndexRange={[1000, 0]}>
                <div
                    className="absolute inset-0 bg-black flex flex-col items-center justify-center cursor-pointer z-50 hover:bg-white/5 transition-colors"
                    onClick={() => setHasInteracted(true)}
                >
                    <div className="text-center relative">
                        {/* Pulse Ring */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 rounded-full border border-cyan-500/30 animate-ping" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-36 md:h-36 rounded-full border border-cyan-500/20 animate-ping animation-delay-500" />

                        <h1 className="text-white font-mono text-xl md:text-3xl tracking-[0.5em] animate-pulse border-b border-white/50 pb-4 mb-4 select-none">
                            INITIALIZE SYSTEM
                        </h1>
                        <p className="text-cyan-400/70 font-mono text-[10px] md:text-xs tracking-widest select-none">
                            [ CLICK ANYWHERE TO START ]
                        </p>
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
                            className="px-6 py-2 border border-white/20 bg-black/40 text-white/50 text-xs font-mono hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm rounded-full tracking-widest pointer-events-auto"
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
