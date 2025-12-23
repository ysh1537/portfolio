import { Component, useRef, useEffect } from 'react';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise, ToneMapping } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useStore } from '../../hooks/useStore';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import RadialBlurEffect from './RadialBlurEffect';

/**
 * Bloom 효과 ErrorBoundary
 */
class BloomErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error) {
        console.log('[CinematicEffects] Bloom 효과 비활성화:', error.message);
    }

    render() {
        if (this.state.hasError) {
            return null;
        }
        return this.props.children;
    }
}

/**
 * CinematicEffects 컴포넌트
 * - Radial Blur로 워프 전환 효과
 * - Vignette로 시네마틱 분위기
 */
const CinematicEffects = () => {
    const isWarping = useStore((state) => state.isWarping);
    const blurRef = useRef();
    const vignetteRef = useRef();
    const warpTimeRef = useRef(0);

    // Animate blur strength & vignette darkness during warp
    useFrame((state, delta) => {
        if (!blurRef.current || !vignetteRef.current) return;

        if (isWarping) {
            warpTimeRef.current += delta;

            // 1. Radial Blur: 0 → 0.7 (1.5초)
            const blurProgress = Math.min(warpTimeRef.current / 1.5, 1.0);
            blurRef.current.strength = blurProgress * 0.7;

            // 2. Dip to Black (Vignette Darkness): 0.4 → 10.0 (1.2초 ~ 1.5초 사이 급격히)
            // 1.2초 시점부터 어두워지기 시작
            const darkProgress = Math.max(0, (warpTimeRef.current - 1.0) / 0.5);
            vignetteRef.current.darkness = 0.4 + darkProgress * 10.0;

        } else {
            warpTimeRef.current = 0;

            // Blur & Darkness Fade Out
            blurRef.current.strength *= 0.95;

            // Vignette Darkness: 복귀 (Lerp to 0.4)
            vignetteRef.current.darkness = THREE.MathUtils.lerp(vignetteRef.current.darkness, 0.4, delta * 3.0);
        }
    });

    return (
        <BloomErrorBoundary>
            <EffectComposer disableNormalPass>
                {/* Radial Blur - 워프 전환 효과 */}
                <RadialBlurEffect ref={blurRef} strength={0} />

                {/* Vignette - 화면 가장자리 어둡게 */}
                <Vignette
                    ref={vignetteRef}
                    offset={0.4}
                    darkness={0.4}
                    eskil={false}
                />

                {/* Tone Mapping for Color Depth */}
                <ToneMapping
                    adaptive={true}
                    resolution={256}
                    middleGrey={0.6}
                    maxLuminance={16.0}
                    averageLuminance={1.0}
                    adaptationRate={1.0}
                />
            </EffectComposer>
        </BloomErrorBoundary>
    );
};

export default CinematicEffects;
