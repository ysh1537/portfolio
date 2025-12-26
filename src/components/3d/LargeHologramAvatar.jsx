import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 대형 홀로그램 아바타 컴포넌트
 * 영화 스타일의 시네마틱 AI 대화 인터페이스용
 */

// 홀로그램 쉐이더 머티리얼 (확장 버전)
const LargeHologramMaterial = ({ isSpeaking }) => {
    const materialRef = useRef();

    const texture = useTexture('/assets/avatar_yesol.png');
    texture.colorSpace = THREE.SRGBColorSpace;

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uTexture: { value: texture },
        uSpeaking: { value: isSpeaking ? 1.0 : 0.0 },
        uGlitchIntensity: { value: 0.0 }
    }), [texture]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
            materialRef.current.uniforms.uSpeaking.value = isSpeaking ? 1.0 : 0.0;
            // 강화된 랜덤 글리치 효과
            materialRef.current.uniforms.uGlitchIntensity.value = Math.random() < 0.08 ? Math.random() * 0.4 : 0.0;
        }
    });

    const vertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uTime;
        uniform float uSpeaking;
        
        void main() {
            vUv = uv;
            vPosition = position;
            
            vec3 pos = position;
            
            // 강화된 부유 애니메이션
            float floatAmount = sin(uTime * 1.5) * 0.03 + cos(uTime * 0.8) * 0.015;
            pos.y += floatAmount;
            
            // 말할 때 강화된 진동 효과
            if (uSpeaking > 0.5) {
                pos.x += sin(uTime * 20.0) * 0.008;
                pos.y += cos(uTime * 15.0) * 0.005;
            }
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const fragmentShader = `
        uniform float uTime;
        uniform sampler2D uTexture;
        uniform float uSpeaking;
        uniform float uGlitchIntensity;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
            vec2 uv = vUv;
            
            // 강화된 글리치 오프셋
            if (uGlitchIntensity > 0.0) {
                uv.x += (sin(uv.y * 80.0 + uTime * 15.0) * uGlitchIntensity * 0.03);
                // RGB 분리 효과
                float rgbShift = uGlitchIntensity * 0.01;
                uv.x += rgbShift * sin(uTime * 100.0);
            }
            
            // 기본 텍스처
            vec4 texColor = texture2D(uTexture, uv);
            
            // 홀로그램 시안/마젠타 틴트
            vec3 holoTint = vec3(0.0, 0.95, 1.0);
            vec3 magentaTint = vec3(0.9, 0.2, 0.8);
            float tintMix = sin(uTime * 0.5) * 0.1 + 0.2;
            vec3 finalTint = mix(holoTint, magentaTint, tintMix);
            vec3 tintedColor = mix(texColor.rgb, finalTint, 0.3);
            
            // 강화된 스캔라인 효과
            float scanline = sin(vUv.y * 300.0 + uTime * 3.0) * 0.12;
            float scanline2 = sin(vUv.y * 150.0 - uTime * 1.5) * 0.06;
            tintedColor -= (scanline + scanline2) * 0.15;
            
            // 밝은 스캔 스윕 (더 빈번하게)
            float scanSweep = smoothstep(0.48, 0.5, fract(vUv.y - uTime * 0.15)) 
                            - smoothstep(0.5, 0.52, fract(vUv.y - uTime * 0.15));
            tintedColor += holoTint * scanSweep * 0.4;
            
            // 수평 스캔 라인
            float hScan = smoothstep(0.49, 0.5, fract(uTime * 0.3)) 
                        - smoothstep(0.5, 0.51, fract(uTime * 0.3));
            tintedColor += magentaTint * hScan * 0.3;
            
            // 말할 때 강화된 펄스 효과
            if (uSpeaking > 0.5) {
                float pulse = 0.15 + sin(uTime * 10.0) * 0.15;
                tintedColor += holoTint * pulse;
                // 에너지 파동
                float wave = sin(vUv.y * 20.0 - uTime * 8.0) * 0.1;
                tintedColor += holoTint * wave * 0.3;
            }
            
            // 강화된 엣지 글로우
            float edgeGlow = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 4.0) * 0.25;
            float topGlow = pow(1.0 - vUv.y, 3.0) * 0.2;
            float bottomGlow = pow(vUv.y, 3.0) * 0.15;
            tintedColor += holoTint * (edgeGlow + topGlow + bottomGlow);
            
            // 알파 (원형 마스크 with softer edges)
            float dist = length(vUv - 0.5) * 2.0;
            float alpha = texColor.a * smoothstep(1.0, 0.7, dist);
            
            // 외곽 글로우
            float outerGlow = smoothstep(0.9, 0.6, dist) * 0.3;
            tintedColor += holoTint * outerGlow;
            
            gl_FragColor = vec4(tintedColor, alpha * 0.92);
        }
    `;

    return (
        <shaderMaterial
            ref={materialRef}
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            transparent={true}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
        />
    );
};

// 홀로그램 메시
const LargeHologramMesh = ({ isSpeaking }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            // 천천히 Y축 회전
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
            // 약간의 기울기
            meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[3, 3, 64, 64]} />
            <LargeHologramMaterial isSpeaking={isSpeaking} />
        </mesh>
    );
};

// 홀로그램 파티클 효과 (확장 버전)
const LargeHoloParticles = ({ isSpeaking }) => {
    const particlesRef = useRef();
    const count = 80;

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const radius = 1.2 + Math.random() * 0.5;
            pos[i * 3] = Math.cos(angle) * radius;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
            pos[i * 3 + 2] = Math.sin(angle) * radius * 0.4;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = state.clock.elapsedTime * 0.15;
            // 파티클 위아래 움직임
            const positions = particlesRef.current.geometry.attributes.position.array;
            for (let i = 0; i < count; i++) {
                const speed = isSpeaking ? 4 : 2;
                positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * speed + i) * 0.003;
            }
            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.04}
                color={isSpeaking ? "#ff66ff" : "#00ffff"}
                transparent
                opacity={0.7}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

// 홀로그램 베이스 링
const HoloBaseRing = ({ isSpeaking }) => {
    const ringRef = useRef();

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
            const scale = isSpeaking ? 1.1 + Math.sin(state.clock.elapsedTime * 5) * 0.05 : 1;
            ringRef.current.scale.set(scale, scale, 1);
        }
    });

    return (
        <mesh ref={ringRef} position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.0, 1.15, 64]} />
            <meshBasicMaterial
                color={isSpeaking ? "#ff00ff" : "#00ffff"}
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

// 메인 대형 아바타 컴포넌트
const LargeHologramAvatar = ({ isSpeaking = false, className = "" }) => {
    return (
        <div className={`relative ${className}`} style={{ width: '400px', height: '500px' }}>
            <Canvas
                camera={{ position: [0, 0, 4], fov: 45 }}
                gl={{ alpha: true, antialias: true }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.3} />
                <pointLight position={[3, 3, 3]} intensity={1.5} color="#00ffff" />
                <pointLight position={[-3, -2, 2]} intensity={0.8} color="#ff00ff" />
                <Suspense fallback={null}>
                    <LargeHologramMesh isSpeaking={isSpeaking} />
                    <LargeHoloParticles isSpeaking={isSpeaking} />
                    <HoloBaseRing isSpeaking={isSpeaking} />
                </Suspense>
            </Canvas>

            {/* 홀로그램 오버레이 효과 */}
            <div className="absolute inset-0 pointer-events-none">
                {/* 스캔라인 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse" />
                {/* 외곽 글로우 */}
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 shadow-[0_0_40px_rgba(6,182,212,0.3)]" />
                {/* 말할 때 추가 글로우 */}
                {isSpeaking && (
                    <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 to-transparent animate-pulse" />
                )}
            </div>
        </div>
    );
};

export default LargeHologramAvatar;
