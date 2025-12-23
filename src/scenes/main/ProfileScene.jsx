import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Stars, Sparkles, Text, Html, PivotControls } from '@react-three/drei';
import { useStore } from '../../hooks/useStore';
import * as THREE from 'three';

const ProfileScene = () => {
    const setScene = useStore(state => state.setScene);
    const groupRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(t / 4) / 8;
            groupRef.current.rotation.x = Math.cos(t / 4) / 8;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Background Atmosphere */}
            <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
            <Sparkles count={200} scale={12} size={2} speed={0.2} opacity={0.3} color="#06b6d4" />

            {/* Central "Core" Identity Object */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh position={[0, 0, 0]}>
                    <icosahedronGeometry args={[1.5, 0]} />
                    <meshStandardMaterial
                        color="#06b6d4"
                        wireframe
                        roughness={0}
                        metalness={1}
                        emissive="#06b6d4"
                        emissiveIntensity={0.5}
                    />
                </mesh>
            </Float>

            {/* Left Panel: Identity Data */}
            <Html position={[-3.5, 0, 0]} transform distanceFactor={4} style={{ pointerEvents: 'auto' }}>
                <div className="w-80 bg-black/80 border-l-4 border-cyan-500 p-6 rounded-r-lg backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                    <h1 className="text-3xl font-bold text-white mb-1 tracking-tighter">YESOL HEO</h1>
                    <div className="text-cyan-400 font-mono text-sm mb-4 tracking-widest uppercase">Creative Developer</div>

                    <div className="space-y-2 text-xs text-gray-300 font-sans">
                        <div className="flex justify-between border-b border-white/10 pb-1">
                            <span>전문분야 (CLASS)</span>
                            <span className="text-white">마법사 (Wizard)</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                            <span>경력 (LEVEL)</span>
                            <span className="text-white">4년차 (Lv. 25)</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                            <span>현황 (GUILD)</span>
                            <span className="text-white">새로운 도전을 구하는 중</span>
                        </div>
                    </div>
                </div>
            </Html>

            {/* Right Panel: Stats & Skills */}
            <Html position={[3.5, 0.5, 0]} transform distanceFactor={4} style={{ pointerEvents: 'auto' }}>
                <div className="w-72 bg-black/80 border-r-4 border-pink-500 p-6 rounded-l-lg backdrop-blur-md shadow-[0_0_30px_rgba(236,72,153,0.3)] text-right">
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-pink-500/50 pb-2 inline-block font-sans">핵심 역량 (STATS)</h2>

                    <div className="space-y-3 font-mono text-xs">
                        <div>
                            <div className="flex justify-between text-pink-300 mb-1">
                                <span>REACT.JS</span>
                                <span>92%</span>
                            </div>
                            <div className="w-full bg-gray-800 h-1 rounded overflow-hidden">
                                <div className="bg-pink-500 h-full w-[92%] shadow-[0_0_10px_pink]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-pink-300 mb-1">
                                <span>THREE.JS (3D)</span>
                                <span>85%</span>
                            </div>
                            <div className="w-full bg-gray-800 h-1 rounded overflow-hidden">
                                <div className="bg-pink-500 h-full w-[85%] shadow-[0_0_10px_pink]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-pink-300 mb-1">
                                <span>UI/UX DESIGN</span>
                                <span>88%</span>
                            </div>
                            <div className="w-full bg-gray-800 h-1 rounded overflow-hidden">
                                <div className="bg-pink-500 h-full w-[88%] shadow-[0_0_10px_pink]" />
                            </div>
                        </div>
                    </div>
                </div>
            </Html>

            {/* Bottom Panel: Mission/Bio */}
            <Html position={[0, -2.5, 0]} transform distanceFactor={4} style={{ pointerEvents: 'auto' }}>
                <div className="w-[500px] bg-black/60 border-t border-b border-white/20 p-4 backdrop-blur-sm text-center font-sans">
                    <p className="text-gray-300 text-sm leading-relaxed">
                        "디자인과 기술의 접점에서 몰입형 디지털 경험을 구축합니다. <br />
                        코드를 시각적 시로 완성하는 디렉터입니다."
                    </p>
                    <div className="mt-2 text-[10px] text-gray-500 flex justify-center gap-4 font-mono">
                        <span>LOC: SEOUL, KR</span>
                        <span>STATUS: ACTIVE</span>
                        <span>PING: 12ms</span>
                    </div>
                </div>
            </Html>

        </group>
    );
};

export default ProfileScene;
