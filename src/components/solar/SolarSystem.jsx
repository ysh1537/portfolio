import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { LORE } from '../../data/lore';
import { useStore } from '../../hooks/useStore';
import useSoundFX from '../../hooks/useSoundFX';
import CoreSun from './CoreSun';
import PlanetFactory from './PlanetFactory';
import * as THREE from 'three';
import { Billboard, Html } from '@react-three/drei';

// Individual Orbit Logic for each planet
const PlanetaryOrbit = ({ lab, config }) => {
    const groupRef = useRef();
    const planetRef = useRef();
    const startWarp = useStore(state => state.startWarp);
    const { playClick, playHover } = useSoundFX();

    // Random start position
    const [startAngle] = useState(() => Math.random() * Math.PI * 2);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const speed = config.speedOffset * 0.2; // Base orbit speed
        const angle = startAngle + t * speed;

        if (groupRef.current) {
            // Keep the group rotated to the inclination
            // But move the planet along the local X/Z plane (which is tilted)
            const x = Math.cos(angle) * config.xRadius;
            const z = Math.sin(angle) * config.zRadius;
            planetRef.current.position.set(x, 0, z);
        }
    });

    return (
        <group ref={groupRef} rotation={config.inclination}>
            {/* 1. Orbit Path Line */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[config.xRadius, config.xRadius + 0.05, 64]} />
                <meshBasicMaterial color={config.color} opacity={0.1} transparent side={THREE.DoubleSide} />
            </mesh>

            {/* 2. The Planet */}
            <group
                ref={planetRef}
                onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                    startWarp(config.target); // Changed to startWarp
                }}
                onPointerEnter={(e) => {
                    e.stopPropagation();
                    playHover();
                    document.body.style.cursor = 'pointer';
                    // Optional: Set HUD data here
                }}
                onPointerLeave={() => {
                    document.body.style.cursor = 'auto';
                }}
            >
                <PlanetFactory type={lab.visual.type} color={lab.visual.color} />

                {/* 3. Label (Always facing camera) */}
                <Billboard position={[0, -1.5, 0]}>
                    <TextLabel text={lab.name} color={config.color} />
                </Billboard>
            </group>
        </group>
    );
};

const TextLabel = ({ text, color }) => (
    <Html transform center distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div className="px-2 py-1 text-xs font-bold font-mono tracking-widest border border-white/20 bg-black/50 backdrop-blur-sm rounded whitespace-nowrap"
            style={{ color: color, textShadow: `0 0 10px ${color}` }}>
            {text}
        </div>
    </Html>
);


const SolarSystem = () => {
    // Mapping LORE data to orbit configs
    const planets = [
        {
            lab: LORE.SECTORS.LAB_01,
            config: { target: 'lab01', color: LORE.SECTORS.LAB_01.visual.color, xRadius: 6, zRadius: 6, inclination: [0, 0, 0], speedOffset: 1.0 }
        },
        {
            lab: LORE.SECTORS.LAB_02,
            config: { target: 'lab02', color: LORE.SECTORS.LAB_02.visual.color, xRadius: 9, zRadius: 9, inclination: [Math.PI / 8, 0, 0], speedOffset: 0.7 }
        },
        {
            lab: LORE.SECTORS.LAB_03,
            config: { target: 'lab03', color: LORE.SECTORS.LAB_03.visual.color, xRadius: 12, zRadius: 12, inclination: [-Math.PI / 12, 0, 0], speedOffset: 0.5 }
        },
        {
            lab: LORE.SECTORS.LAB_04,
            config: { target: 'lab04', color: LORE.SECTORS.LAB_04.visual.color, xRadius: 15, zRadius: 15, inclination: [Math.PI / 6, 0, Math.PI / 12], speedOffset: 1.2 }
        },
    ];

    return (
        <group>
            {/* Center: Interaction Logic is inside CoreSun if needed, but for now it's visual */}
            <group onClick={() => useStore.getState().setScene('profile')}>
                <CoreSun />
            </group>

            {/* Orbiting Planets */}
            {planets.map((p, i) => (
                <PlanetaryOrbit key={i} lab={p.lab} config={p.config} />
            ))}
        </group>
    );
};

export default SolarSystem;
