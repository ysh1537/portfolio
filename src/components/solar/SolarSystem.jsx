import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { LORE } from '../../data/lore';
import { useStore } from '../../hooks/useStore';
import useSoundFX from '../../hooks/useSoundFX';
import CoreSun from './CoreSun';
import PlanetFactory from './PlanetFactory';
import * as THREE from 'three';
import { Billboard, Html } from '@react-three/drei';
import { registerPlanet, unregisterPlanet } from '../../utils/planetRegistry';

// Individual Orbit Logic for each planet
const PlanetaryOrbit = ({ lab, config }) => {
    const groupRef = useRef();
    const planetRef = useRef();
    const startWarp = useStore(state => state.startWarp);
    const { playClick, playHover } = useSoundFX();
    const [hovered, setHovered] = useState(false);

    // Random start position
    const [startAngle] = useState(() => Math.random() * Math.PI * 2);

    // Register planet ref for real-time tracking during warp
    useEffect(() => {
        registerPlanet(config.target, planetRef);
        return () => unregisterPlanet(config.target);
    }, [config.target]);

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
            {/* 1. Orbit Path Line - Brighter on Hover */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[config.xRadius, config.xRadius + 0.05, 64]} />
                <meshBasicMaterial
                    color={config.color}
                    opacity={hovered ? 0.4 : 0.1}
                    transparent
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* 2. The Planet */}
            {/* 2. The Planet */}
            <group
                ref={planetRef}
                onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                    const targetPos = new THREE.Vector3();
                    planetRef.current.getWorldPosition(targetPos);

                    // Pass as Array [x, y, z] to satisfy WarpController's "new Vector3(...pos)"
                    const safePos = [targetPos.x, targetPos.y, targetPos.z];
                    startWarp(config.target, safePos);
                }}
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
                {/* Invisible Hit Box (Larger Target for Touch) */}
                <mesh visible={false}>
                    <sphereGeometry args={[2.5, 16, 16]} />
                    <meshBasicMaterial transparent opacity={0} />
                </mesh>

                {/* Planet Mesh */}
                <PlanetFactory type={lab.type} color={lab.visual.color} />

                {/* Hover Effect: Targeting Ring */}
                {hovered && (
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[1.2, 1.3, 32]} />
                        <meshBasicMaterial color={config.color} transparent opacity={0.8} side={THREE.DoubleSide} />
                    </mesh>
                )}

                {/* 3. Label (Always facing camera) */}
                <Billboard position={[0, -1.8, 0]}>
                    <TextLabel text={lab.name} color={config.color} hovered={hovered} />
                </Billboard>
            </group>
        </group>
    );
};

const TextLabel = ({ text, color, hovered }) => (
    <Html transform center distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div className={`transition-all duration-300 flex flex-col items-center ${hovered ? 'scale-110' : 'scale-100 opacity-80'}`}>
            <div className="px-2 py-1 text-xs font-bold font-mono tracking-widest border border-white/20 bg-black/60 backdrop-blur-sm rounded whitespace-nowrap"
                style={{
                    color: color,
                    textShadow: `0 0 10px ${color}`,
                    borderColor: hovered ? color : 'rgba(255,255,255,0.2)'
                }}>
                {text}
            </div>
            {hovered && (
                <div className="mt-1 text-[8px] text-white/70 font-mono tracking-widest animate-pulse">
                    [ CLICK TO WARP ]
                </div>
            )}
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
