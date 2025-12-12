import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Html, useCursor, Environment, Stars, Sparkles, Billboard } from '@react-three/drei';
import { useStore } from '../hooks/useStore';
import * as THREE from 'three';

const CosmicNode = ({ position = [0, 0, 0], label, targetScene, color, angle, radius, onOrbit }) => {
    const setScene = useStore(state => state.setScene);
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef();
    useCursor(hovered);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
            meshRef.current.rotation.x += 0.005;
        }

        // Update orbital position
        if (onOrbit && radius > 0) {
            onOrbit(state.clock.elapsedTime);
        }
    });

    // Different geometries for different scenes
    const getGeometry = () => {
        switch (targetScene) {
            case 'lab01': // SHADER - Tesseract/4D Cube
                return (
                    <group ref={meshRef}>
                        {/* Outer cube */}
                        <mesh scale={1.2}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshPhysicalMaterial
                                color={color}
                                roughness={0}
                                metalness={1}
                                transparent
                                opacity={0.3}
                                wireframe
                            />
                        </mesh>
                        {/* Inner rotating cube */}
                        <mesh scale={0.7} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshPhysicalMaterial
                                color={color}
                                roughness={0.1}
                                metalness={0.9}
                                emissive={color}
                                emissiveIntensity={hovered ? 2 : 0.8}
                            />
                        </mesh>
                    </group>
                );
            case 'lab02': // PHYSICS - Planet
                return (
                    <mesh ref={meshRef}>
                        <icosahedronGeometry args={[0.8, 2]} />
                        <meshPhysicalMaterial
                            color={color}
                            roughness={0.4}
                            metalness={0.6}
                            emissive={color}
                            emissiveIntensity={hovered ? 1.5 : 0.3}
                            clearcoat={1}
                            clearcoatRoughness={0.1}
                        />
                    </mesh>
                );
            case 'lab03': // AUDIO - Pulsing Sphere
                return (
                    <mesh ref={meshRef} scale={hovered ? 1.2 : 1}>
                        <sphereGeometry args={[0.7, 32, 32]} />
                        <meshPhysicalMaterial
                            color={color}
                            roughness={0.2}
                            metalness={0.8}
                            transparent
                            opacity={0.7}
                            emissive={color}
                            emissiveIntensity={hovered ? 2.5 : 1}
                        />
                    </mesh>
                );
            case 'lab04': // DEBUG - Wireframe Polyhedron
                return (
                    <group ref={meshRef}>
                        <mesh>
                            <octahedronGeometry args={[0.9]} />
                            <meshPhysicalMaterial
                                color={color}
                                roughness={0}
                                metalness={1}
                                wireframe
                                emissive={color}
                                emissiveIntensity={hovered ? 2 : 1}
                            />
                        </mesh>
                    </group>
                );
            case 'profile': // PROFILE - Glowing Core
                return (
                    <group ref={meshRef}>
                        <mesh>
                            <icosahedronGeometry args={[1, 0]} />
                            <meshPhysicalMaterial
                                color={color}
                                roughness={0}
                                metalness={1}
                                emissive={color}
                                emissiveIntensity={hovered ? 3 : 1.5}
                                wireframe
                            />
                        </mesh>
                        <mesh scale={0.6}>
                            <icosahedronGeometry args={[1, 0]} />
                            <meshPhysicalMaterial
                                color={color}
                                roughness={0.1}
                                metalness={0.9}
                                emissive={color}
                                emissiveIntensity={2}
                            />
                        </mesh>
                    </group>
                );
            default:
                return (
                    <mesh ref={meshRef}>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshPhysicalMaterial
                            color={color}
                            roughness={0.1}
                            metalness={0.8}
                            emissive={color}
                            emissiveIntensity={hovered ? 2 : 0.5}
                        />
                    </mesh>
                );
        }
    };

    return (
        <group position={position}
            onClick={() => setScene(targetScene)}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}>
            <Float speed={2 + Math.random()} rotationIntensity={0.5} floatIntensity={0.5}>
                {getGeometry()}
                {/* Enhanced Core Light */}
                <pointLight distance={5} intensity={hovered ? 8 : 3} color={color} />
            </Float>

            <Billboard>
                <Text
                    position={[0, -1.8, 0]}
                    fontSize={0.18}
                    color="white"
                    anchorX="center"
                    outlineWidth={0.03}
                    outlineColor={color}
                    fontWeight="bold"
                >
                    {label}
                </Text>
            </Billboard>
        </group>
    );
};

const OrbitRing = ({ radius, color, speed = 0.1 }) => {
    const ref = useRef();
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.z += delta * speed;
            // Tilt the ring to stay above grid
            ref.current.rotation.x = Math.PI / 3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <group ref={ref} position={[0, 1, 0]}>
            {/* Main Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius, 0.02, 16, 100]} />
                <meshBasicMaterial color={color} transparent opacity={0.4} />
            </mesh>
            {/* Moving Particle on Ring */}
            <mesh position={[radius, 0, 0]}>
                <sphereGeometry args={[0.05]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} roughness={0} metalness={1} />
                <
