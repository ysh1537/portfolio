import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import useSoundFX from '../../hooks/useSoundFX';
import { useStore } from '../../hooks/useStore';
import { LORE } from '../../data/lore';

const CoreSun = React.memo(({ isActive, timeRef }) => {
    const groupRef = useRef();
    const meshRef = useRef();
    const glowRef = useRef();
    const [hovered, setHovered] = useState(false);
    const { playHover, playClick } = useSoundFX();

    const isHovered = isActive !== undefined ? isActive : hovered;

    useFrame((state, delta) => {
        const t = (timeRef?.current !== undefined) ? timeRef.current : state.clock.getElapsedTime();

        // Scale Animation
        if (groupRef.current) {
            const targetScale = isHovered ? 1.6 : 1;
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 4);
        }

        if (meshRef.current) {
            // 태양 자전 및 일렁임 보조
            meshRef.current.rotation.y = t * 0.1;
        }
        if (glowRef.current) {
            // 글로우 펄스 효과
            const baseScale = isHovered ? 1.4 : 1.2;
            glowRef.current.scale.setScalar(baseScale + Math.sin(t * 3) * 0.05);
            glowRef.current.rotation.z -= 0.01;
        }
    });

    const coreColor = new THREE.Color(LORE.SECTORS.PROFILE.visual.color);
    const glowColor = new THREE.Color(LORE.SECTORS.PROFILE.visual.color).multiplyScalar(1.2); // Toned down glow

    return (
        <group
            ref={groupRef}
            onPointerEnter={(e) => {
                e.stopPropagation();
                setHovered(true);
                playHover();
                document.body.style.cursor = 'pointer';
            }}
            onPointerLeave={() => {
                setHovered(false);
                document.body.style.cursor = 'auto';
            }}
        >
            {/* 1. Main Neural Core - High Poly Cyan Star */}
            <Sphere
                ref={meshRef}
                args={[5.5, 128, 128]}
                onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                    useStore.getState().setScene('profile');
                }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <MeshDistortMaterial
                    color={"#00f2ff"}
                    emissive={"#0066ff"}
                    emissiveIntensity={4}
                    distort={0.3}
                    speed={2}
                    roughness={0}
                    metalness={1}
                    toneMapped={false}
                />
            </Sphere>

            {/* 2. Primary Light Source - Deep Blue/Cyan */}
            <pointLight distance={100} intensity={30} color={"#00f2ff"} decay={2} />

            {/* 3. Neural Aura (High Precision Glow) */}
            <mesh ref={glowRef} scale={[1.15, 1.15, 1.15]}>
                <sphereGeometry args={[5.5, 64, 64]} />
                <meshBasicMaterial
                    color="#0066ff"
                    transparent
                    opacity={0.25}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* 4. Secondary Soft Outer Glow */}
            <mesh scale={[1.6, 1.6, 1.6]}>
                <sphereGeometry args={[5.5, 64, 32]} />
                <meshBasicMaterial
                    color={"#0033ff"}
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* 5. Core Particles (Sparkles) - Refined Density */}
            <Sparkles count={120} scale={20} size={20} speed={1.2} opacity={0.7} color="#00f2ff" noise={3} />
            <Sparkles count={40} scale={15} size={35} speed={0.8} opacity={0.4} color="#ffffff" noise={2} />
        </group >
    );
});

export default CoreSun;
