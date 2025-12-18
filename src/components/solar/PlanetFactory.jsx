import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshPhysicalMaterial, Sphere, Sparkles, MeshDistortionMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 💎 Lab 01: Crystalline Planet
const CrystalPlanet = ({ color }) => {
    const groupRef = useRef();

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y -= 0.005;
            groupRef.current.rotation.z += 0.002;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Outer Shell */}
            <Sphere args={[1, 32, 32]}>
                <MeshPhysicalMaterial
                    roughness={0}
                    transmission={1} // 유리처럼 투명하게
                    thickness={2}   // 굴절 두께
                    color={color}
                    ior={1.5}
                    clearcoat={1}
                />
            </Sphere>
            {/* Inner Geometry (Fractals) */}
            <mesh scale={0.6}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                    color="#ffffff"
                    emissive={color}
                    emissiveIntensity={2}
                    wireframe
                />
            </mesh>
        </group>
    );
};

// 🌿 Lab 02: Living Planet (Organic)
const OrganicPlanet = ({ color }) => {
    const meshRef = useRef();

    // Simple custom shader or distortion for breathing effect
    // Using MeshDistortionMaterial for organic feel
    return (
        <group>
            <Sphere ref={meshRef} args={[1, 64, 64]}>
                <MeshDistortionMaterial
                    color={color}
                    roughness={0.4}
                    metalness={0.2}
                    distort={0.3}
                    speed={1.5}
                />
            </Sphere>
            {/* Spores/Pollen */}
            <Sparkles count={50} scale={2.5} size={3} speed={0.4} opacity={0.5} color="#ccffcc" />
        </group>
    );
};

// 🔊 Lab 03: Gas Giant (Audio)
const GasGiant = ({ color }) => {
    const outerRef = useRef();
    const innerRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (outerRef.current) outerRef.current.rotation.y = t * 0.1;
        if (innerRef.current) innerRef.current.rotation.y = t * -0.2;
    });

    return (
        <group>
            {/* Core */}
            <Sphere ref={innerRef} args={[0.7, 32, 32]}>
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </Sphere>
            {/* Atmosphere Layers */}
            <Sphere ref={outerRef} args={[1.0, 32, 32]}>
                <meshPhysicalMaterial
                    color={color}
                    transparent
                    opacity={0.4}
                    roughness={1}
                    thickness={1}
                    transmission={0.2}
                />
            </Sphere>
            {/* Ring */}
            <mesh rotation={[Math.PI / 3, 0, 0]}>
                <ringGeometry args={[1.4, 1.8, 64]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

// 🚧 Lab 04: Glitch Moon (Debug)
const GlitchMoon = ({ color }) => {
    const meshRef = useRef();

    useFrame((state) => {
        // Randomly toggle wireframe or visibility for glitch effect
        if (meshRef.current && Math.random() > 0.95) {
            meshRef.current.visible = !meshRef.current.visible;
        } else if (meshRef.current) {
            meshRef.current.visible = true;
        }
    });

    return (
        <group>
            <Sphere ref={meshRef} args={[0.9, 16, 16]}>
                <meshStandardMaterial
                    color={color}
                    wireframe
                    emissive={color}
                    emissiveIntensity={2}
                />
            </Sphere>
            {/* Debris */}
            <Sparkles count={20} scale={2} size={5} speed={2} color="red" />
        </group>
    );
};

const PlanetFactory = ({ type, color }) => {
    switch (type) {
        case 'Crystalline Planet':
            return <CrystalPlanet color={color} />;
        case 'Living Planet':
            return <OrganicPlanet color={color} />;
        case 'Gas Giant':
            return <GasGiant color={color} />;
        case 'Fractured Moon':
            return <GlitchMoon color={color} />;
        default:
            return <Sphere args={[1]}><meshStandardMaterial color={color} /></Sphere>;
    }
};

export default PlanetFactory;
