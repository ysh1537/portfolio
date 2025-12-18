import { Component } from 'react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

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
            <EffectComposer>
                <Bloom
                    luminanceThreshold={0.3}
                    mipmapBlur
                    intensity={0.4}
                    radius={0.6}
                />
            </EffectComposer>
        </BloomErrorBoundary>
    );
};

export default CinematicEffects;


