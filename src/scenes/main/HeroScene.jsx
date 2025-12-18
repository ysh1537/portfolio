import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';

const HeroScene = () => {
    const meshRef = useRef();

    // Create particle instances once
    const [particles] = useState(() => {
        const temp = [];
        for (let i = 0; i < 50; i++) {
            const x = (Math.random() - 0.5) * 10;
            const y = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 10;
            const scale = Math.random() * 0.2;
            temp.push({ position: [x, y, z], scale });
        }
        return temp;
    });

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.cos(t / 4) / 4;
            meshRef.current.rotation.y = Math.sin(t / 4) / 4;
            meshRef.current.position.y = Math.sin(t / 1.5) / 5;
        }
    });

    return (
        <group position={[0, 0, 0]}>
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                {/* Main Holographic Core */}
                <mesh ref={meshRef}>
                    <icosahedronGeometry args={[1, 1]} />
                    <meshStandardMaterial
                        color="#06b6d4"
                        wireframe
                        emissive="#7c3aed"
                        emissiveIntensity={2}
                    />
                </mesh>

                <mesh scale={1.2} ref={meshRef}>
                    <icosahedronGeometry args={[1, 0]} />
                    <meshBasicMaterial color="#7c3aed" wireframe transparent opacity={0.3} />
                </mesh>
            </Float>

            {/* Floating Particles */}
            <Instances range={50}>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1} />
                {particles.map((data, i) => (
                    <Instance key={i} position={data.position} scale={data.scale} />
                ))}
            </Instances>

            {/* 3D Typography */}
            <Text
                position={[0, -2.5, 2]}
                fontSize={0.5}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
            >
                YESOL HEO
            </Text>
            <Text
                position={[0, -3.2, 2]}
                fontSize={0.2}
                color="#a3a3a3"
                anchorX="center"
                anchorY="middle"
            >
                METAVERSE & XR DIRECTOR
            </Text>
        </group>
    );
};

export default HeroScene;
