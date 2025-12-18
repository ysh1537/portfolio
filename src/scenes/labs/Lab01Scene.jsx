import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Environment, Float, MeshDistortMaterial, Html, Billboard, Sparkles } from '@react-three/drei';
import { useStore } from '../../hooks/useStore';
import * as THREE from 'three';

const Lab01Scene = () => {
    const setScene = useStore(state => state.setScene);
    const [config, setConfig] = useState({
        distort: 0.5,
        speed: 2,
        color: '#00ff41'
    });

    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle rotation
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
        }
    });

    return (
        <group>
            <color attach="background" args={['#050505']} />
            <Environment preset="night" />

            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Billboard>
                    <Text
                        position={[0, 3.5, -2]}
                        fontSize={0.4}
                        color="#00ff41"
                        anchorX="center"
                        anchorY="middle"
                    >
                        LAB 01 : SHADER FIELD
                    </Text>
                </Billboard>
            </Float>

            <Float speed={config.speed * 0.5} rotationIntensity={2} floatIntensity={1}>
                <mesh ref={meshRef} position={[0, 0, 0]} scale={2}>
                    <icosahedronGeometry args={[1, 64]} />
                    <MeshDistortMaterial
                        color={config.color}
                        envMapIntensity={1}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        metalness={0.5}
                        roughness={0.2}
                        distort={config.distort}
                        speed={config.speed}
                    />
                </mesh>
            </Float>

            {/* Cinematic FX */}
            <Sparkles count={100} scale={15} size={3} speed={0.4} opacity={0.5} color="#00ff41" />

            {/* Grid Floor for context */}
            <gridHelper args={[20, 20, 0x111111, 0x050505]} position={[0, -4, 0]} />

            {/* Control Panel UI */}
            <Html
                position={[3.5, 0, 0]}
                transform
                distanceFactor={5}
                zIndexRange={[100, 0]}
                style={{ pointerEvents: 'auto', userSelect: 'none' }}
            >
                <div className="w-72 bg-black/90 border border-[#00ff41]/50 p-6 rounded-lg backdrop-blur-xl text-[#00ff41] font-mono text-xs shadow-[0_0_30px_rgba(0,255,65,0.2)]">
                    <div className="mb-6 border-b border-[#00ff41]/30 pb-2 font-bold flex justify-between tracking-widest">
                        <span>SHADER_CONTROLLER</span>
                        <span className="animate-pulse">●ONLINE</span>
                    </div>

                    <div className="space-y-6" onPointerDown={(e) => e.stopPropagation()}>
                        <div>
                            <label className="flex justify-between mb-2 opacity-80">
                                <span>DISTORTION</span>
                                <span>{config.distort.toFixed(2)}</span>
                            </label>
                            <input
                                type="range" min="0" max="1" step="0.01"
                                value={config.distort}
                                onChange={(e) => setConfig(prev => ({ ...prev, distort: parseFloat(e.target.value) }))}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="w-full h-1 bg-[#00ff41]/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#00ff41] [&::-webkit-slider-thumb]:rounded-full"
                            />
                        </div>

                        <div>
                            <label className="flex justify-between mb-2 opacity-80">
                                <span>FLUX_SPEED</span>
                                <span>{config.speed.toFixed(1)}</span>
                            </label>
                            <input
                                type="range" min="0" max="10" step="0.1"
                                value={config.speed}
                                onChange={(e) => setConfig(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="w-full h-1 bg-[#00ff41]/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#00ff41] [&::-webkit-slider-thumb]:rounded-full"
                            />
                        </div>
                    </div>

                    <div className="mt-6 text-[10px] opacity-50 text-center border-t border-[#00ff41]/20 pt-2">
                        INTERACTIVE_MODULE_V1.0
                    </div>

                    <button
                        onClick={() => setScene('hub')}
                        className="w-full mt-4 py-2 border border-[#00ff41]/50 text-[#00ff41] hover:bg-[#00ff41]/20 rounded transition-all font-mono text-xs tracking-widest"
                    >
                        [ RETURN TO SYSTEM ]
                    </button>
                </div>
            </Html>
        </group>
    );
};

export default Lab01Scene;
