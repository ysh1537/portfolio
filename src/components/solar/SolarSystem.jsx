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

// TextLabel Component - Moved up to avoid hoisting issues
const TextLabel = ({ text, color, hovered }) => (
    <Html transform center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className={`transition-all duration-300 flex flex-col items-center ${hovered ? 'scale-110' : 'scale-95 opacity-60'}`}>

            {/* HUD Line - Fixed gradient syntax for dynamic color */}
            <div className={`w-[1px] transition-all duration-300 ${hovered ? 'h-12 opacity-100' : 'h-4 opacity-30'}`}
                style={{
                    background: `linear-gradient(to top, transparent, ${color}, transparent)`
                }} />

            {/* Label Container */}
            <div className="px-3 py-1 text-xs font-bold font-mono tracking-widest border border-white/10 bg-black/80 backdrop-blur-md rounded shadow-xl whitespace-nowrap"
                style={{
                    color: color,
                    textShadow: `0 0 15px ${color}`,
                    borderColor: hovered ? color : 'rgba(255,255,255,0.1)',
                    boxShadow: hovered ? `0 0 20px ${color}40` : 'none'
                }}>
                {text}
            </div>

            {/* Click Hint */}
            <div className={`mt-1 overflow-hidden transition-all duration-300 ${hovered ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}>
                <div className="text-[8px] text-white/70 font-mono tracking-widest animate-pulse">
                    [ ACCESS SYSTEM ]
                </div>
            </div>
        </div>
    </Html>
);

// Individual Orbit Logic for each planet
const PlanetaryOrbit = ({ lab, config }) => {
    const groupRef = useRef();
    const planetRef = useRef();
    const startWarp = useStore(state => state.startWarp);
    const openMissionModal = useStore(state => state.openMissionModal); // Phase 34
    const hoveredPlanet = useStore(state => state.hoveredPlanet); // Get global hover state
    const { playClick, playHover } = useSoundFX();

    // Local hover state - Rename to localHover to avoid ReferenceError
    const [localHover, setLocalHover] = useState(false);

    // Combine local hover and global hover (from Dock)
    const isActive = localHover || hoveredPlanet === config.target;

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
                    opacity={isActive ? 0.4 : 0.1}
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

                    // Phase 34: Open Mission Modal instead of direct warp
                    const safePos = [targetPos.x, targetPos.y, targetPos.z];
                    openMissionModal({
                        lab: lab,
                        config: config,
                        warpPos: safePos
                    });
                }}
                onPointerEnter={(e) => {
                    e.stopPropagation();
                    setLocalHover(true);
                    playHover();
                    document.body.style.cursor = 'pointer';
                }}
                onPointerLeave={() => {
                    setLocalHover(false);
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
                {isActive && (
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[1.2, 1.3, 32]} />
                        <meshBasicMaterial color={config.color} transparent opacity={0.8} side={THREE.DoubleSide} />
                    </mesh>
                )}

                {/* 3. Label (Always facing camera) */}
                <Billboard position={[0, -1.8, 0]}>
                    <TextLabel text={lab.name} color={config.color} hovered={isActive} />
                </Billboard>
            </group>
        </group>
    );
};


const SolarSystem = () => {
    // Mapping LORE data to orbit configs
    // Phase 35: 궤도 반경 및 속도 조정 - 행성 충돌 방지
    const planets = [
        {
            lab: LORE.SECTORS.LAB_01,
            config: { target: 'lab01', color: LORE.SECTORS.LAB_01.visual.color, xRadius: 7, zRadius: 7, inclination: [0, 0, 0], speedOffset: 0.8 }
        },
        {
            lab: LORE.SECTORS.LAB_02,
            config: { target: 'lab02', color: LORE.SECTORS.LAB_02.visual.color, xRadius: 11, zRadius: 11, inclination: [Math.PI / 10, 0, 0], speedOffset: 0.5 }
        },
        {
            lab: LORE.SECTORS.LAB_03,
            config: { target: 'lab03', color: LORE.SECTORS.LAB_03.visual.color, xRadius: 16, zRadius: 16, inclination: [-Math.PI / 14, 0, 0], speedOffset: 0.35 }
        },
        {
            lab: LORE.SECTORS.LAB_04,
            config: { target: 'lab04', color: LORE.SECTORS.LAB_04.visual.color, xRadius: 22, zRadius: 22, inclination: [Math.PI / 8, 0, Math.PI / 16], speedOffset: 0.25 }
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
