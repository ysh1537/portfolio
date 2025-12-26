import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// 커스텀 홀로그램 쉐이더 머티리얼
const HologramMaterial = ({ isSpeaking }) => {
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
            // 랜덤 글리치 효과
            materialRef.current.uniforms.uGlitchIntensity.value = Math.random() < 0.05 ? Math.random() * 0.3 : 0.0;
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
            
            // 부유 애니메이션
            float floatAmount = sin(uTime * 2.0) * 0.02;
            pos.y += floatAmount;
            
            // 말할 때 진동 효과
            if (uSpeaking > 0.5) {
                pos.x += sin(uTime * 15.0) * 0.005;
                pos.y += cos(uTime * 12.0) * 0.003;
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
            
            // 글리치 오프셋
            if (uGlitchIntensity > 0.0) {
                uv.x += (sin(uv.y * 50.0 + uTime * 10.0) * uGlitchIntensity * 0.02);
            }
            
            // 기본 텍스처
            vec4 texColor = texture2D(uTexture, uv);
            
            // 홀로그램 시안 틴트
            vec3 holoTint = vec3(0.0, 0.9, 1.0);
            vec3 tintedColor = mix(texColor.rgb, holoTint, 0.25);
            
            // 스캔라인 효과
            float scanline = sin(vUv.y * 200.0 + uTime * 2.0) * 0.1;
            tintedColor -= scanline * 0.15;
            
            // 밝은 스캔 스윕
            float scanSweep = smoothstep(0.48, 0.5, fract(vUv.y - uTime * 0.1)) 
                            - smoothstep(0.5, 0.52, fract(vUv.y - uTime * 0.1));
            tintedColor += holoTint * scanSweep * 0.3;
            
            // 말할 때 펄스 효과
            if (uSpeaking > 0.5) {
                float pulse = 0.1 + sin(uTime * 8.0) * 0.1;
                tintedColor += holoTint * pulse;
            }
            
            // 엣지 글로우
            float edgeGlow = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 3.0) * 0.2;
            tintedColor += holoTint * edgeGlow;
            
            // 알파 (원형 마스크)
            float dist = length(vUv - 0.5) * 2.0;
            float alpha = texColor.a * smoothstep(1.0, 0.8, dist);
            
            gl_FragColor = vec4(tintedColor, alpha * 0.95);
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
        />
    );
};

// 홀로그램 메시
const HologramMesh = ({ isSpeaking }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            // 천천히 Y축 회전
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[1.8, 1.8, 32, 32]} />
            <HologramMaterial isSpeaking={isSpeaking} />
        </mesh>
    );
};

// 홀로그램 파티클 효과
const HoloParticles = () => {
    const particlesRef = useRef();
    const count = 30;

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const radius = 0.8 + Math.random() * 0.2;
            pos[i * 3] = Math.cos(angle) * radius;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
            pos[i * 3 + 2] = Math.sin(angle) * radius * 0.3;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = state.clock.elapsedTime * 0.2;
            // 파티클 위아래 움직임
            const positions = particlesRef.current.geometry.attributes.position.array;
            for (let i = 0; i < count; i++) {
                positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 2 + i) * 0.002;
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
                size={0.03}
                color="#00ffff"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
};

// 메인 3D 아바타 컴포넌트
const Holo3DAvatar = ({ isSpeaking = false }) => {
    return (
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.4)] bg-slate-900">
            <Canvas
                camera={{ position: [0, 0, 2], fov: 50 }}
                gl={{ alpha: true, antialias: true }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[2, 2, 2]} intensity={1} color="#00ffff" />
                <Suspense fallback={null}>
                    <HologramMesh isSpeaking={isSpeaking} />
                    <HoloParticles />
                </Suspense>
            </Canvas>
            {/* 홀로그램 링 오버레이 */}
            <div className="absolute inset-0 rounded-full border border-cyan-400/20 pointer-events-none" />
            {/* 앰비언트 비네트 */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/40 to-transparent pointer-events-none" />
        </div>
    );
};

export default Holo3DAvatar;
