import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

const SkillStar = ({ position, label }) => {
    return (
        <group position={position}>
            <mesh>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
            <mesh scale={[1.5, 1.5, 1.5]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} toneMapped={false} />
            </mesh>
            <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
                <Text
                    position={[0.2, 0.2, 0]}
                    fontSize={0.2}
                    color="rgba(255,255,255,0.5)"
                    font="/fonts/Geist-Regular.ttf"
                    anchorX="left"
                    anchorY="bottom"
                >
                    {label}
                </Text>
            </Float>
        </group>
    );
};

const Constellation = ({ points, color = "#06b6d4" }) => {
    const linePoints = useMemo(() => points.map(p => new THREE.Vector3(...p.position)), [points]);

    return (
        <group>
            <Line points={linePoints} color={color} opacity={0.1} transparent lineWidth={1} />
            {points.map((p, i) => (
                <SkillStar key={i} position={p.position} label={p.label} />
            ))}
        </group>
    );
};

const TechConstellation = () => {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            // Slowly rotate the entire star field
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.01;
        }
    });

    const frontendSkills = [
        { label: "REACT", position: [-15, 5, -10] },
        { label: "THREE.JS", position: [-12, 8, -8] },
        { label: "NEXT.JS", position: [-10, 4, -12] },
        { label: "TYPESCRIPT", position: [-14, 2, -9] },
    ];

    const graphicsSkills = [
        { label: "WEBGL", position: [10, 6, -15] },
        { label: "GLSL", position: [13, 3, -12] },
        { label: "BLENDER", position: [8, -2, -10] },
        { label: "R3F", position: [15, 8, -14] },
    ];

    return (
        <group ref={groupRef}>
            <Constellation points={frontendSkills} color="#06b6d4" />
            <Constellation points={graphicsSkills} color="#7c3aed" />
        </group>
    );
};

export default TechConstellation;
