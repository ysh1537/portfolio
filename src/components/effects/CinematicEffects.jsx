import { Component } from 'react';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise, ToneMapping } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

/**
 * Bloom 효과 ErrorBoundary
 * - 호환성 문제로 오류 발생 시 자동으로 비활성화
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
            return null; // 오류 발생 시 아무것도 렌더링하지 않음
        }
        return this.props.children;
    }
}

/**
 * CinematicEffects 컴포넌트
 * - Bloom 효과로 시네마틱 분위기 연출
 * - ErrorBoundary로 호환성 문제 시 자동 비활성화
 */
const CinematicEffects = () => {
    return (
        <BloomErrorBoundary>
            <EffectComposer disableNormalPass>
                {/* Bloom 효과 제거 - 시각적 쨍함 개선 */}

                {/* Vignette - 화면 가장자리 어둡게 */}
                <Vignette
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


