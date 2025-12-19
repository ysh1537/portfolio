import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Environment, Float, MeshDistortMaterial, Html, Billboard, Sparkles, Caustics } from '@react-three/drei';
import { useStore } from '../../hooks/useStore';
import * as THREE from 'three';

const Lab01Scene = () => {
    const startWarp = useStore(state => state.startWarp);
    const [config, setConfig] = useState({
        distort: 0.4,
        speed: 1.5,
        color: '#06b6d4' // Cyan
    });

    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <group>
            {/* Bright, Clean Background */}
            <color attach="background" args={['#080c14']} />
            <Environment preset="city" />

            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Billboard>
                    <Text
                        position={[0, 3.5, -2]}
                        fontSize={0.5}
                        color="#ffffff"
                        anchorX="center"
                        anchorY="middle"
                    >
                        THE PRISM [REFRACTION]
                    </Text>
                </Billboard>
            </Float>

            <Float speed={config.speed * 0.5} rotationIntensity={1} floatIntensity={1}>
                {/* Crystal Geometry */}
                <mesh ref={meshRef} position={[0, 0, 0]} scale={2}>
                    <icosahedronGeometry args={[1, 0]} /> {/* Low poly for crystal look */}
                    <MeshDistortMaterial
                        color={config.color}
                        envMapIntensity={2}
                        clearcoat={1}
                        clearcoatRoughness={0}
                        metalness={0.1}
                        roughness={0}
                        transmission={0.5} // Glass-like
                        thickness={2}
                        distort={config.distort}
                        speed={config.speed}
                    />
                </mesh>
            </Float>

            {/* Crystal Shards */}
            <Sparkles count={200} scale={15} size={4} speed={0.2} opacity={0.8} color="#ffffff" />

            {/* Grid Floor */}
            <gridHelper args={[30, 30, 0x06b6d4, 0x050510]} position={[0, -4, 0]} />

            {/* Control Panel UI - Cyan Theme */}
            <Html
                position={[3.5, 0, 0]}
                transform
                distanceFactor={5}
                zIndexRange={[100, 0]}
                style={{ pointerEvents: 'auto', userSelect: 'none' }}
            >
                <div className="w-72 bg-black/60 border border-cyan-500/50 p-6 rounded-lg backdrop-blur-xl text-cyan-400 font-mono text-xs shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                    <div className="mb-6 border-b border-cyan-500/30 pb-2 font-bold flex justify-between tracking-widest">
                        <span>PRISM_CONTROLLER</span>
                        <span className="animate-pulse text-white">● STABLE</span>
                    </div>

                    <div className="space-y-6" onPointerDown={(e) => e.stopPropagation()}>
                        <div>
                            <label className="flex justify-between mb-2 opacity-80 text-white">
                                <span>REFRACTION (Distort)</span>
                                <span>{config.distort.toFixed(2)}</span>
                            </label>
                            <input
                                type="range" min="0" max="1" step="0.01"
                                value={config.distort}
                                onChange={(e) => setConfig(prev => ({ ...prev, distort: parseFloat(e.target.value) }))}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="w-full h-1 bg-cyan-500/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:rounded-full"
                            />
                        </div>

                        <div>
                            <label className="flex justify-between mb-2 opacity-80 text-white">
                                <span>FLUX_SPEED</span>
                                <span>{config.speed.toFixed(1)}</span>
                            </label>
                            <input
                                type="range" min="0" max="10" step="0.1"
                                value={config.speed}
                                onChange={(e) => setConfig(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="w-full h-1 bg-cyan-500/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:rounded-full"
                            />
                        </div>
                    </div>

                    <div className="mt-6 text-[10px] opacity-50 text-center border-t border-cyan-500/20 pt-2 text-white">
                        CRYSTALLINE_OPTICS_V2.0
                    </div>

                    <button
                        onClick={() => startWarp('hub')}
                        className="w-full mt-4 py-2 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 rounded transition-all font-mono text-xs tracking-widest bg-black/50"
                    >
                        [ WARP TO NEXUS ]
                    </button>
                </div>
            </Html>
        </group>
    );
};

export default Lab01Scene;
