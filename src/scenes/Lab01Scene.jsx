import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance, Float, Text, Environment, Billboard, Html } from '@react-three/drei';
import { useStore } from '../hooks/useStore';
import * as THREE from 'three';

const Lab01Scene = () => {
    const setScene = useStore(state => state.setScene);
    const [config, setConfig] = useState({
        distort: 0.6,
        speed: 3,
        hover: false
    });

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 200; i++) {
            const x = (Math.random() - 0.5) * 15;
            const y = (Math.random() - 0.5) * 15;
            const z = (Math.random() - 0.5) * 15;
            temp.push({ position: [x, y, z], scale: Math.random() });
        }
        return temp;
    }, []);

    // Simple Control Panel UI
    const Controls = () => (
        <Html
            position={[3.5, 0, 0]}
            transform
            distanceFactor={5}
            zIndexRange={[100, 0]}
            style={{ pointerEvents: 'auto', userSelect: 'none' }}
        >
            <div
                className="w-64 bg-black/80 border border-cyan-500/50 p-4 rounded backdrop-blur-md text-cyan-400 font-mono text-xs select-none"
                style={{ pointerEvents: 'auto' }}
            >

                <div className="mb-4 border-b border-cyan-500/30 pb-2 font-bold flex justify-between">
                    <span>SHADER_CONTROLLER</span>
                    <span className="animate-pulse">●</span>
                </div>

                <div className="mb-3">
                    <label className="block mb-1 flex justify-between">
                        <span>DISTORTION</span>
                        <span>{config.distort.toFixed(1)}</span>
                    </label>
                    <input
                        type="range" min="0" max="1" step="0.1"
                        value={config.distort}
                        onChange={(e) => setConfig(prev => ({ ...prev, distort: parseFloat(e.target.value) }))}
                        className="w-full accent-cyan-500 h-1 bg-gray-700 rounded appearance-none"
                        style={{ pointerEvents: 'auto' }}
                    />
                </div>

                <div className="mb-3">
                    <label className="block mb-1 flex justify-between">
                        <span>SPEED</span>
                        <span>{config.speed.toFixed(1)}</span>
                    </label>
                    <input
                        type="range" min="0" max="10" step="0.5"
                        value={config.speed}
                        onChange={(e) => setConfig(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                        className="w-full accent-cyan-500 h-1 bg-gray-700 rounded appearance-none"
                        style={{ pointerEvents: 'auto' }}
                    />
                </div>
            </div>
        </Html>
    );

    return (
        <group>
            <color attach="background" args={['#020b02']} />
            <Environment preset="city" />

            <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
                <Text position={[0, 2.5, -2]} fontSize={0.5} color="#ececec" anchorX="center">
                    LAB 01 : SHADER FIELD
                </Text>
            </Billboard>

            {/* Back button is now handled globally via Overlay/ESC */}


            <Instances range={200}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color="#00ff41" emissive="#00ff41" />
                {particles.map((data, i) => (
                    <Instance key={i} position={data.position} scale={data.scale} />
                ))}
            </Instances>

            <Float speed={2} rotationIntensity={1}>
                <mesh
                    onPointerOver={() => setConfig(prev => ({ ...prev, hover: true }))}
                    onPointerOut={() => setConfig(prev => ({ ...prev, hover: false }))}
                >
                    <icosahedronGeometry args={[1.5, 4]} />
                    <meshStandardMaterial
                        color={config.hover ? "#00ffff" : "#00ff41"}
                        attach="material"
                        roughness={0.2}
                        metalness={0.9}
                        wireframe={config.hover}
                        emissive={config.hover ? "#00ffff" : "#00ff41"}
                        emissiveIntensity={0.3}
                    />
                </mesh>
            </Float>

            <Controls />
        </group>
    );
};

export default Lab01Scene;
