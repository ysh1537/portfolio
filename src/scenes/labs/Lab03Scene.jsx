import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Environment, Billboard, Html, PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../hooks/useStore';
import useSoundFX from '../../hooks/useSoundFX';

// --- Audio Manager Hook ---
const useAudioAnalyzer = (mode) => {
    const [analyser, setAnalyser] = useState(null);
    const audioContextRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        const cleanup = () => {
            if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
            if (audioContextRef.current) audioContextRef.current.close();
        };

        if (mode === 'mic') {
            cleanup();
            const initMic = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    streamRef.current = stream;
                    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    audioContextRef.current = audioCtx;
                    const source = audioCtx.createMediaStreamSource(stream);
                    const newAnalyser = audioCtx.createAnalyser();
                    newAnalyser.fftSize = 256; // Increased for particles
                    source.connect(newAnalyser);
                    setAnalyser(newAnalyser);
                } catch (err) {
                    console.error("Mic Error:", err);
                }
            };
            initMic();
        } else {
            cleanup();
            setAnalyser(null);
        }
        return cleanup;
    }, [mode]);

    return analyser;
};

// --- Components ---

const Particles = ({ analyser, mode }) => {
    const pointsRef = useRef();
    // 500 particles for a nice cloud
    const count = 500;
    const [originalPositions] = useState(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 10;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
        }
        return pos;
    });
    const dataArray = useMemo(() => new Uint8Array(128), []);

    useFrame((state) => {
        if (!pointsRef.current) return;

        let intensity = 0;

        if (mode === 'mic' && analyser) {
            analyser.getByteFrequencyData(dataArray);
            intensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
        } else {
            const time = state.clock.elapsedTime;
            intensity = (Math.sin(time) * 0.5 + 0.5) * 0.5; // Demo intensity
        }


        const currentPositions = pointsRef.current.geometry.attributes.position.array;

        for (let i = 0; i < count; i++) {
            // Base movement
            let ix = originalPositions[i * 3];
            let iy = originalPositions[i * 3 + 1];
            let iz = originalPositions[i * 3 + 2];

            // Audio reaction: Expand outwards based on intensity
            const expansion = 1 + intensity * 2;

            // Add some noise/swirl
            const time = state.clock.elapsedTime;
            const noise = Math.sin(time + ix) * 0.2;

            currentPositions[i * 3] = ix * expansion + Math.sin(time * 2 + iy) * 0.1;
            currentPositions[i * 3 + 1] = iy * expansion + Math.cos(time * 1.5 + ix) * 0.1;
            currentPositions[i * 3 + 2] = iz * expansion + noise;
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Pulse color/size - 안전 검사 추가
        const mat = pointsRef.current.material;
        if (mat) {
            mat.size = 0.05 + intensity * 0.2;
            if (mat.color) mat.color.setHSL(0.5 + intensity * 0.5, 1, 0.5);
        }
    });

    return (
        <Points ref={pointsRef} positions={originalPositions} stride={3}>
            <PointMaterial
                transparent
                color="#06b6d4"
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
};

const Bars = ({ analyser, mode }) => {
    const groupRef = useRef();
    const count = 16;
    const spacing = 0.6;
    const dataArray = useMemo(() => new Uint8Array(32), []);

    useFrame((state) => {
        if (!groupRef.current) return;

        let data = [];
        if (mode === 'mic' && analyser) {
            analyser.getByteFrequencyData(dataArray);
            data = Array.from(dataArray).slice(0, count);
        } else {
            const time = state.clock.elapsedTime;
            for (let i = 0; i < count; i++) {
                const val = (Math.sin(time * 3 + i * 0.5) + Math.cos(time * 2 + i * 0.2)) * 0.5 + 0.5;
                data.push(val * 255);
            }
        }

        groupRef.current.children.forEach((child, i) => {
            if (data[i] !== undefined && child.material) {
                const value = data[i] / 255;
                const targetScale = 0.5 + value * 5;
                child.scale.y = THREE.MathUtils.lerp(child.scale.y, targetScale, 0.2);
                const hue = 0.5 + value * 0.3;
                if (child.material.color) child.material.color.setHSL(hue, 1, 0.5);
                if (child.material.emissive) child.material.emissive.setHSL(hue, 1, 0.2);
                if ('emissiveIntensity' in child.material) child.material.emissiveIntensity = value * 3;
            }
        });
    });

    return (
        <group ref={groupRef} position={[-(count * spacing) / 2, -2, 0]}>
            {Array.from({ length: count }).map((_, i) => (
                <mesh key={i} position={[i * spacing, 2, 0]}>
                    <boxGeometry args={[0.4, 1, 0.4]} />
                    <meshStandardMaterial color="#06b6d4" roughness={0.2} metalness={0.8} />
                </mesh>
            ))}
        </group>
    );
};

const WireframeWave = ({ analyser, mode }) => {
    const mesh = useRef();
    const dataArray = useMemo(() => new Uint8Array(64), []);

    useFrame((state) => {
        if (!mesh.current) return;

        let intensity = 0;
        if (mode === 'mic' && analyser) {
            analyser.getByteFrequencyData(dataArray);
            intensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
        } else {
            intensity = (Math.sin(state.clock.elapsedTime) * 0.5 + 0.5) * 0.6;
        }

        // Ripple/Distortion
        const positions = mesh.current.geometry.attributes.position;
        const time = state.clock.elapsedTime;

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const dist = Math.sqrt(x * x + y * y);

            // Tech-style wave calculation
            let z = Math.sin(dist * 1.5 - time * 2) * (0.2 + intensity * 1.5);
            z += Math.cos(x * 2 + time) * 0.1;

            positions.setZ(i, z);
        }
        positions.needsUpdate = true;

        // Flash emissive on beat - 안전 검사 추가
        const mat = mesh.current.material;
        if (mat && 'emissiveIntensity' in mat) {
            const targetEmissive = intensity * 3;
            mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, 0.1);
        }
    });

    return (
        <mesh ref={mesh} position={[0, -3, -2]} rotation={[-Math.PI / 2.5, 0, 0]}>
            <planeGeometry args={[20, 15, 32, 32]} />
            <meshPhysicalMaterial
                color="#ec4899"
                emissive="#ec4899"
                emissiveIntensity={0.5}
                wireframe={true}
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

const Lab03Scene = () => {
    const startWarp = useStore(state => state.startWarp);
    const [mode, setMode] = useState('demo');
    const analyser = useAudioAnalyzer(mode);
    const { playClick, playHover } = useSoundFX();

    return (
        <group>
            {/* Thematic Background - Deep Sonic Void */}
            <color attach="background" args={['#0f172a']} />
            <fogExp2 attach="fog" args={['#0f172a', 0.05]} />
            <Environment preset="studio" />

            <Billboard>
                <Text position={[0, 6, -5]} fontSize={0.6} color="#f59e0b" anchorX="center">
                    THE RESONANCE [HARMONICS]
                </Text>
            </Billboard>

            {/* UI Controls - pointerEvents로 드래그와 분리 */}
            <Html position={[0, 3.5, 0]} center transform distanceFactor={5} style={{ pointerEvents: 'auto' }}>
                <div className="flex gap-4 p-4 bg-black/80 rounded border border-amber-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.2)]" style={{ pointerEvents: 'auto' }}>
                    <button
                        onClick={() => { playClick(); setMode('demo'); }}
                        onPointerEnter={playHover}
                        className={`px-4 py-1 rounded font-mono text-xs transition-all cursor-pointer ${mode === 'demo' ? 'bg-amber-600 text-white shadow-[0_0_10px_orange]' : 'text-amber-500 hover:bg-amber-900/50'}`}
                    >
                        DEMO_FREQUENCY
                    </button>
                    <button
                        onClick={() => { playClick(); setMode('mic'); }}
                        onPointerEnter={playHover}
                        className={`px-4 py-1 rounded font-mono text-xs transition-all cursor-pointer ${mode === 'mic' ? 'bg-blue-600 text-white shadow-[0_0_10px_blue]' : 'text-blue-500 hover:bg-blue-900/50'}`}
                    >
                        LIVE_INPUT
                    </button>

                    <button
                        onClick={() => { playClick(); startWarp('hub'); }}
                        onPointerEnter={playHover}
                        className="px-4 py-1 rounded font-mono text-xs border border-white/30 text-white/70 hover:bg-white/10 hover:border-white/50 hover:text-white transition-all shadow-lg cursor-pointer bg-black/50"
                    >
                        [ WARP TO NEXUS ]
                    </button>
                </div>
            </Html>

            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <Bars analyser={analyser} mode={mode} />
            </Float>

            <WireframeWave analyser={analyser} mode={mode} />

            <Particles analyser={analyser} mode={mode} />

            {/* Floor Reflection Grid - Gold */}
            <gridHelper args={[50, 50, 0xf59e0b, 0x1e293b]} position={[0, -4, 0]} />
        </group>
    );
};

export default Lab03Scene;
