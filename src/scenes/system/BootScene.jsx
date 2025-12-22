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
    // 클릭 대기 제거 - 자동 시작

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

    // 자동 시작 - 클릭 대기 UI 제거됨

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

            {/* 5. UI Overlay (Logs Only - Skip 버튼 제거: 리소스 로딩 필요) */}
            {!isFinished && (
                <Html fullscreen zIndexRange={[100, 0]}>
                    <BootLogs onComplete={handleBootComplete} theme={theme} />
                </Html>
            )}
        </group>
    );
};

export default BootScene;
