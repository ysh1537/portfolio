// import { EffectComposer, Bloom } from '@react-three/postprocessing';

/**
 * CinematicEffects 컴포넌트
 * 
 * 주의: Three.js v0.168과 @react-three/postprocessing v2.16.3 간
 * 호환성 문제로 Bloom 효과가 material uniforms 오류를 발생시킴.
 * 
 * 오류: Cannot read properties of undefined (reading 'value')
 * 
 * 해결책: 라이브러리 버전 호환성이 해결될 때까지 효과 비활성화
 */
const CinematicEffects = () => {
    // Bloom 효과 임시 비활성화 - WebGL 크래시 방지
    return null;

    /*
    return (
        <EffectComposer disableNormalPass>
            <Bloom
                luminanceThreshold={0.2}
                mipmapBlur
                intensity={0.5}
                radius={0.7}
            />
        </EffectComposer>
    );
    */
};

export default CinematicEffects;

