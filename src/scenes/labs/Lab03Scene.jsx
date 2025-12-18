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
    const [positions, setPositions] = useState(new Float32Array(count * 3));
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
        let data = [];

        if (mode === 'mic' && analyser) {
            analyser.getByteFrequencyData(dataArray);
            intensity = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
            data = dataArray;
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

        // Pulse color/size
        pointsRef.current.material.size = 0.05 + intensity * 0.2;
        pointsRef.current.material.color.setHSL(0.5 + intensity * 0.5, 1, 0.5); // Cyan to Purple
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
            if (data[i] !== undefined) {
                const value = data[i] / 255;
                const targetScale = 0.5 + value * 5;
                child.scale.y = THREE.MathUtils.lerp(child.scale.y, targetScale, 0.2);
                const hue = 0.5 + value * 0.3;
                child.material.color.setHSL(hue, 1, 0.5);
                child.material.emissive.setHSL(hue, 1, 0.2);
                child.material.emissiveIntensity = value * 3; // Boost for Bloom
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

        // Flash emissive on beat
        const targetEmissive = intensity * 3;
        mesh.current.material.emissiveIntensity = THREE.MathUtils.lerp(mesh.current.material.emissiveIntensity, targetEmissive, 0.1);
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
    const setScene = useStore(state => state.setScene);
    const [mode, setMode] = useState('demo');
    const analyser = useAudioAnalyzer(mode);
    const { playClick, playHover } = useSoundFX();

    return (
        <group>
            {/* Thematic Background */}
            <color attach="background" args={['#02040b']} />
            <Environment preset="night" />

            <Billboard>
                <Text position={[0, 6, -5]} fontSize={0.6} color="white" anchorX="center">
                    AUDIO LAB [SYNTHETIC]
                </Text>
            </Billboard>

            {/* UI Controls */}
            <Html position={[0, 3.5, 0]} center transform distanceFactor={5}>
                <div className="flex gap-4 p-2 bg-black/80 rounded border border-cyan-500/30 backdrop-blur-md">
                    <button
                        onClick={() => { playClick(); setMode('demo'); }}
                        onPointerEnter={playHover}
                        className={`px-4 py-1 rounded font-mono text-xs transition-all ${mode === 'demo' ? 'bg-cyan-600 text-white shadow-[0_0_10px_cyan]' : 'text-cyan-500 hover:bg-cyan-900/50'}`}
                    >
                        DEMO_MODE
                    </button>
                    <button
                        onClick={() => { playClick(); setMode('mic'); }}
                        onPointerEnter={playHover}
                        className={`px-4 py-1 rounded font-mono text-xs transition-all ${mode === 'mic' ? 'bg-pink-600 text-white shadow-[0_0_10px_pink]' : 'text-pink-500 hover:bg-pink-900/50'}`}
                    >
                        LIVE_INPUT
                    </button>

                    <button
                        onClick={() => { playClick(); setScene('hub'); }}
                        onPointerEnter={playHover}
                        className="px-4 py-1 rounded font-mono text-xs border border-white/30 text-white/70 hover:bg-white/10 hover:border-white/50 hover:text-white transition-all shadow-lg"
                    >
                        [ EXIT LAB ]
                    </button>
                </div>
            </Html>

            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <Bars analyser={analyser} mode={mode} />
            </Float>

            <WireframeWave analyser={analyser} mode={mode} />

            <Particles analyser={analyser} mode={mode} />

            {/* Floor Reflection Grid */}
            <gridHelper args={[50, 50, 0x333333, 0x050505]} position={[0, -4, 0]} />
        </group>
    );
};

export default Lab03Scene;
