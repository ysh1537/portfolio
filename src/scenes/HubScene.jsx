import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Html, useCursor, Environment, Stars, Sparkles, Billboard } from '@react-three/drei';
import { useStore } from '../hooks/useStore';
import * as THREE from 'three';

const CosmicNode = ({ position = [0, 0, 0], label, targetScene, color }) => {
    const setScene = useStore(state => state.setScene);
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef();
    useCursor(hovered);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
            meshRef.current.rotation.x += 0.005;
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
                {/* Outer glow */}
                <mesh scale={hovered ? 2 : 1.5}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={hovered ? 0.15 : 0.05}
                    />
                </mesh>
            </Float>

            <Billboard>
                <Text position={[0, -1.5, 0]} fontSize={0.15} color="white" anchorX="center" outlineWidth={0.02} outlineColor={color}>
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
            </mesh>
        </group>
    );
};

const HubScene = () => {
    // Rotating group for satellites
    const satelliteRef = useRef();
    useFrame((state, delta) => {
        if (satelliteRef.current) {
            satelliteRef.current.rotation.y += delta * 0.05; // Slow orbit
        }
    });

    // Radial Layout Configuration - Galaxy Style
    const labs = [
        { label: "LAB 01 [SHADER]", target: "lab01", color: "#06b6d4", angle: 0, radius: 5, inclination: [0.1, 0, 0.1] },
        { label: "LAB 02 [PHYSICS]", target: "lab02", color: "#7c3aed", angle: Math.PI / 2, radius: 6.5, inclination: [-0.2, 0, 0.2] },
        { label: "LAB 03 [AUDIO]", target: "lab03", color: "#facc15", angle: Math.PI, radius: 8, inclination: [0.3, 0, -0.1] },
        { label: "LAB 04 [DEBUG]", target: "lab04", color: "#00ff41", angle: -Math.PI / 2, radius: 5.5, inclination: [-0.1, 0, -0.3] },
    ];

    return (
        <group position={[0, -1, 0]}>
            <Environment preset="city" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={500} scale={20} size={4} speed={0.4} opacity={0.5} color="#ffffff" />
            <fog attach="fog" args={['#050510', 10, 50]} />

            {/* Central Identity System */}
            <group>
                <CosmicNode
                    position={[0, 0, 0]}
                    label="IDENTITY [PROFILE]"
                    targetScene="profile"
                    color="#fbbf24"
                />
                <spotLight position={[-10, 10, 10]} angle={0.3} penumbra={1} intensity={10} color="#06b6d4" />

                {/* Floor Reflection - Much lower to avoid orbit overlap */}
                <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial color="#050505" roughness={0.4} metalness={0.8} />
                </mesh>
                <gridHelper args={[50, 50, 0x222222, 0x050505]} position={[0, -7.9, 0]} />
            </group>

            {/* Orbiting Satellites System - Galaxy Structure */}
            <group ref={satelliteRef}>
                {labs.map((lab, i) => (
                    // Apply Inclination (Tilt) to the orbital plane
                    <group key={i} rotation={lab.inclination}>
                        {/* Apply Rotation along the orbit */}
                        <group rotation={[0, lab.angle, 0]}>
                            <group position={[lab.radius, 0, 0]}>
                                <CosmicNode
                                    label={lab.label}
                                    targetScene={lab.target}
                                    color={lab.color}
                                />
                                {/* Vertical Line to Grid (Safe Mesh) */}
                                <mesh position={[0, -2, 0]}>
                                    <cylinderGeometry args={[0.02, 0.02, 4, 8]} />
                                    <meshBasicMaterial color={lab.color} transparent opacity={0.2} />
                                </mesh>
                                {/* Connector Line to Center (Safe Mesh) */}
                                <mesh position={[-lab.radius / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                                    <cylinderGeometry args={[0.02, 0.02, lab.radius, 8]} />
                                    <meshBasicMaterial color={lab.color} transparent opacity={0.1} />
                                </mesh>
                            </group>

                            {/* Orbital Ring Path */}
                            <OrbitRing radius={lab.radius} color={lab.color} speed={0.1 + (i * 0.02)} />
                        </group>
                    </group>
                ))}
            </group>
        </group>
    );
};

export default HubScene;
