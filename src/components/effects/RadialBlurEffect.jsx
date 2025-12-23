/**
 * RadialBlurEffect.jsx
 * 워프 전환 시 화면 중앙에서 바깥으로 퍼지는 방사형 블러 효과
 */
import { forwardRef, useMemo, useEffect } from 'react';
import { Effect } from 'postprocessing';
import { useStore } from '../../hooks/useStore';
import { useFrame } from '@react-three/fiber';

// Custom Radial Blur Shader
const fragmentShader = `
uniform float uStrength;
uniform vec2 uCenter;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 dir = uv - uCenter;
    float dist = length(dir);
    
    vec4 color = vec4(0.0);
    float total = 0.0;
    
    // Radial blur samples
    const int samples = 16;
    for (int i = 0; i < samples; i++) {
        float t = float(i) / float(samples - 1);
        float scale = 1.0 - uStrength * t * 0.3;
        vec2 sampleUv = uCenter + dir * scale;
        color += texture2D(inputBuffer, sampleUv);
        total += 1.0;
    }
    
    outputColor = color / total;
}
`;

// Custom Effect class for postprocessing
class RadialBlurEffectImpl extends Effect {
    constructor({ strength = 0.0 } = {}) {
        super('RadialBlurEffect', fragmentShader, {
            uniforms: new Map([
                ['uStrength', { value: strength }],
                ['uCenter', { value: [0.5, 0.5] }],
            ]),
        });
    }

    set strength(value) {
        this.uniforms.get('uStrength').value = value;
    }

    get strength() {
        return this.uniforms.get('uStrength').value;
    }
}

// React wrapper component
const RadialBlurEffect = forwardRef((props, ref) => {
    const effect = useMemo(() => new RadialBlurEffectImpl(props), []);
    return <primitive ref={ref} object={effect} dispose={null} />;
});

RadialBlurEffect.displayName = 'RadialBlurEffect';

export default RadialBlurEffect;
