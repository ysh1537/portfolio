/**
 * Lab04Scene.jsx
 * "The Glitch" - Debugging Experience
 * 
 * Concept: 사용자가 불안정한 모듈을 클릭하여 "패치"하면
 * Reality Integrity가 상승하고, 최종적으로 섹터가 안정화된다.
 * "Debugging is Creating" - 혼돈에서 질서를 찾아가는 과정의 시각화.
 */
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Html, Float, Billboard, Sparkles } from '@react-three/drei';
import useSoundFX from '../../hooks/useSoundFX';
import * as THREE from 'three';

// --- Matrix Rain Shader Material ---
const MatrixRainMaterial = {
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uSpeed;

        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
            vec2 uv = vUv;
            float columns = 50.0;
            vec2 ipos = floor(uv * columns);
            // 속도 절반으로 줄임 (0.5~1.5)
            float baseSpeed = 0.5 + random(vec2(ipos.x, 0.0)) * 1.0;
            float y = mod(uv.y + uTime * baseSpeed * 0.1 * uSpeed, 1.0);
            float strength = 1.0 - step(0.1, random(vec2(ipos.x, floor(y * 20.0))));
            strength *= (1.0 - fract(y * 10.0));
            float head = 1.0 - step(0.01, y); 
            vec3 color = uColor * strength;
            color += vec3(0.8, 1.0, 0.8) * head;
            gl_FragColor = vec4(color, strength * 0.7);
        }
    `
};

const MatrixEffect = ({ stabilized }) => {
    const mesh = useRef();
    const { viewport } = useThree();
    const frozenTime = useRef(0);

    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color('#ef4444') },
                uSpeed: { value: 1.0 },
            },
            vertexShader: MatrixRainMaterial.vertexShader,
            fragmentShader: MatrixRainMaterial.fragmentShader,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide
        });
    }, []);

    useFrame((state, delta) => {
        if (mesh.current && mesh.current.material && mesh.current.material.uniforms) {
            const uniforms = mesh.current.material.uniforms;

            // 안정화되면 애니메이션 멈춤
            if (stabilized) {
                if (frozenTime.current === 0) frozenTime.current = state.clock.elapsedTime;
                uniforms.uTime.value = frozenTime.current;
                uniforms.uSpeed.value = THREE.MathUtils.lerp(uniforms.uSpeed.value, 0.0, delta * 2);
            } else {
                uniforms.uTime.value = state.clock.getElapsedTime();
                uniforms.uSpeed.value = 1.0;
            }

            // 안정화되면 색상이 청록색으로 변한다
            const targetColor = stabilized ? new THREE.Color('#06b6d4') : new THREE.Color('#ef4444');
            uniforms.uColor.value.lerp(targetColor, delta * 2);
        }
    });

    return (
        <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]} position={[0, 0, -5]}>
            <planeGeometry args={[1, 1]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
};

const GlitchText = ({ text, position, fontSize, color, intensity = 1 }) => {
    const group = useRef();

    useFrame(() => {
        if (!group.current) return;
        if (Math.random() > (1 - 0.05 * intensity)) {
            group.current.position.x = position[0] + (Math.random() - 0.5) * 0.1 * intensity;
            group.current.position.y = position[1] + (Math.random() - 0.5) * 0.1 * intensity;
        } else {
            group.current.position.set(...position);
        }
    });

    return (
        <group ref={group} position={position}>
            <Text position={[0.02 * intensity, 0, 0]} fontSize={fontSize} color="cyan" opacity={0.5} anchorX="center">{text}</Text>
            <Text position={[-0.02 * intensity, 0, 0]} fontSize={fontSize} color="red" opacity={0.5} anchorX="center">{text}</Text>
            <Text position={[0, 0, 0]} fontSize={fontSize} color={color} anchorX="center">{text}</Text>
        </group>
    );
};

// 패치 가능한 모듈 컴포넌트
const PatchableModule = ({ id, position, geometry, onPatch, isPatched, speed = 2 }) => {
    const mesh = useRef();
    const [hovered, setHover] = useState(false);
    const { playHover, playClick } = useSoundFX();

    useFrame((state, delta) => {
        if (!mesh.current) return;

        // 패치되지 않은 상태: 불안정하게 떨림
        if (!isPatched) {
            mesh.current.rotation.x += delta * speed * (0.5 + Math.sin(state.clock.elapsedTime * 5) * 0.3);
            mesh.current.rotation.y += delta * speed * (0.5 + Math.cos(state.clock.elapsedTime * 4) * 0.3);
            // 랜덤 떨림
            if (Math.random() > 0.9) {
                mesh.current.position.x = position[0] + (Math.random() - 0.5) * 0.2;
                mesh.current.position.y = position[1] + (Math.random() - 0.5) * 0.2;
            }
        } else {
            // 패치된 상태: 안정적으로 천천히 회전
            mesh.current.rotation.x += delta * 0.3;
            mesh.current.rotation.y += delta * 0.2;
            mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, position[0], delta * 5);
            mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, position[1], delta * 5);
        }

        // 호버/클릭 스케일
        const scaleTarget = hovered ? 1.3 : 1;
        mesh.current.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget), 0.1);
    });

    const handleClick = () => {
        if (isPatched) return;
        playClick();
        onPatch(id);
    };

    return (
        <Float speed={isPatched ? 2 : 8} rotationIntensity={isPatched ? 1 : 4} floatIntensity={1}>
            <mesh
                ref={mesh}
                position={position}
                onPointerOver={() => { if (!isPatched) { setHover(true); playHover(); document.body.style.cursor = 'pointer'; } }}
                onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto'; }}
                onClick={handleClick}
            >
                <primitive object={geometry} attach="geometry" />
                <meshBasicMaterial
                    color={isPatched ? "#06b6d4" : (hovered ? "#ffffff" : "#ef4444")}
                    wireframe
                    transparent
                    opacity={isPatched ? 0.8 : (hovered ? 0.9 : 0.5)}
                />
            </mesh>
        </Float>
    );
};

const Lab04Scene = () => {
    // 패치 상태 관리
    const [patchedModules, setPatchedModules] = useState(new Set());
    const [logs, setLogs] = useState([
        "[SYSTEM] CRITICAL FAILURE IN SECTOR 04",
        "[KERNEL] REALITY INTEGRITY: 12%",
        "[WARNING] DATA CORRUPTION DETECTED"
    ]);

    const totalModules = 4;
    const baseIntegrity = 12;
    const integrityPerPatch = Math.floor((100 - baseIntegrity) / totalModules);
    const currentIntegrity = baseIntegrity + (patchedModules.size * integrityPerPatch);
    const isStabilized = patchedModules.size >= totalModules;

    // 패치 핸들러
    const handlePatch = useCallback((id) => {
        setPatchedModules(prev => {
            const newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });

        const moduleNames = {
            'mod-1': 'QUANTUM_CORE',
            'mod-2': 'NEURAL_LINK',
            'mod-3': 'MEMORY_STACK',
            'mod-4': 'REALITY_ANCHOR'
        };

        setLogs(prev => [
            ...prev,
            `[PATCHING] ${moduleNames[id] || id}...`,
            `[SUCCESS] Module restored. Integrity +${integrityPerPatch}%`
        ]);
    }, [integrityPerPatch]);

    // 안정화 완료 시 메시지
    useEffect(() => {
        if (isStabilized) {
            setLogs(prev => [
                ...prev,
                "[SYSTEM] ALL MODULES RESTORED",
                "[STATUS] SECTOR STABILIZED",
                "",
                ">>> \"Debugging is Creating.\" <<<"
            ]);
        }
    }, [isStabilized]);

    // Geometries
    const icoGeo = useMemo(() => new THREE.IcosahedronGeometry(0.8, 0), []);
    const torusGeo = useMemo(() => new THREE.TorusKnotGeometry(0.5, 0.15, 64, 12), []);
    const octaGeo = useMemo(() => new THREE.OctahedronGeometry(0.7, 0), []);
    const dodecaGeo = useMemo(() => new THREE.DodecahedronGeometry(0.6, 0), []);

    return (
        <group>
            {/* Background: Digital Rain */}
            <MatrixEffect stabilized={isStabilized} />

            {/* Central Terminal Interface */}
            <group position={[0, 0, 0]}>
                <mesh position={[0, 0, -1]}>
                    <planeGeometry args={[6, 4]} />
                    <meshBasicMaterial color="#000000" transparent opacity={0.9} />
                    <lineSegments>
                        <edgesGeometry args={[new THREE.PlaneGeometry(6, 4)]} />
                        <meshBasicMaterial color={isStabilized ? "#06b6d4" : "#ef4444"} />
                    </lineSegments>
                </mesh>

                {/* Header */}
                <Billboard>
                    <GlitchText
                        text={isStabilized ? "SECTOR STABILIZED" : "THE GLITCH [FATAL ERROR]"}
                        position={[0, 1.5, 0]}
                        fontSize={0.3}
                        color={isStabilized ? "#06b6d4" : "#ef4444"}
                        intensity={isStabilized ? 0.1 : 1}
                    />
                </Billboard>
                <Billboard>
                    <Text position={[0, 1.1, 0]} fontSize={0.15} color={isStabilized ? "#06b6d4" : "#fbbf24"} anchorX="center">
                        REALITY INTEGRITY: {currentIntegrity}%
                    </Text>
                </Billboard>

                {/* Content Area - Live Logs */}
                <Html position={[-2.5, 0.8, 0]} transform scale={0.5} style={{ width: '800px', maxHeight: '350px', overflow: 'hidden', pointerEvents: 'none' }}>
                    <div className="font-mono text-sm leading-relaxed">
                        {logs.map((log, i) => (
                            <p key={i} className={`
                                ${log.includes('SUCCESS') ? 'text-emerald-400' : ''}
                                ${log.includes('PATCHING') ? 'text-yellow-400' : ''}
                                ${log.includes('CRITICAL') || log.includes('ERROR') ? 'text-red-500' : ''}
                                ${log.includes('STABILIZED') ? 'text-cyan-400 font-bold' : ''}
                                ${log.includes('Debugging') ? 'text-white text-lg font-bold mt-4 animate-pulse' : ''}
                                ${!log.includes('SUCCESS') && !log.includes('PATCHING') && !log.includes('CRITICAL') && !log.includes('ERROR') && !log.includes('STABILIZED') && !log.includes('Debugging') ? 'text-red-400 opacity-70' : ''}
                            `}>
                                {log.startsWith('[') ? `> ${log}` : log}
                            </p>
                        ))}
                        {!isStabilized && (
                            <p className="text-yellow-500 animate-pulse mt-4">
                                &gt; [HINT] 불안정한 모듈을 클릭하여 패치하세요...
                            </p>
                        )}
                    </div>
                </Html>
            </group>


            {/* Patchable Modules - 4개 모두 화면 내 배치 */}
            <PatchableModule
                id="mod-1"
                position={[3.5, 0.8, 1]}
                geometry={icoGeo}
                onPatch={handlePatch}
                isPatched={patchedModules.has('mod-1')}
                speed={3}
            />
            <PatchableModule
                id="mod-2"
                position={[-5, 1.5, 3]}
                geometry={torusGeo}
                onPatch={handlePatch}
                isPatched={patchedModules.has('mod-2')}
                speed={4}
            />
            <PatchableModule
                id="mod-3"
                position={[3.5, -1.2, 1]}
                geometry={octaGeo}
                onPatch={handlePatch}
                isPatched={patchedModules.has('mod-3')}
                speed={2.5}
            />
            <PatchableModule
                id="mod-4"
                position={[-3.5, -1.2, 1]}
                geometry={dodecaGeo}
                onPatch={handlePatch}
                isPatched={patchedModules.has('mod-4')}
                speed={3.5}
            />

            {/* Cinematic FX */}
            <Sparkles
                count={isStabilized ? 100 : 50}
                scale={10}
                size={isStabilized ? 3 : 5}
                speed={isStabilized ? 0.3 : 0.8}
                opacity={0.8}
                color={isStabilized ? "#06b6d4" : "#ef4444"}
            />
        </group>
    );
};

export default Lab04Scene;
