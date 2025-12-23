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

/**
 * [HUD] Cinematic Text Label (V3)
 * Provides ultra-scale readability and high-end aesthetic.
 */
const TextLabel = ({ korName, engName, color, hovered }) => {
    return (
        <Html
            transform
            center
            distanceFactor={12}
            style={{ pointerEvents: 'none' }}
        >
            <div className={`flex flex-col items-center transition-all duration-700 ${hovered ? 'scale-110 opacity-100' : 'scale-95 opacity-70'}`}>
                {/* 1. Technical HUD Line */}
                <div
                    className="w-[1px] mb-2 bg-gradient-to-t from-white to-transparent transition-all duration-700"
                    style={{ height: hovered ? '100px' : '60px', opacity: hovered ? 0.8 : 0.3 }}
                />

                {/* 2. Holographic HUD Frame */}
                <div className={`relative px-8 py-4 bg-black/60 backdrop-blur-md border border-white/10 transition-all duration-700 ${hovered ? 'border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.2)]' : ''}`}>
                    {/* Corner Brackets */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/50" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/50" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/50" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/50" />

                    <div className="flex flex-col items-center justify-center text-center">
                        {/* KOREAN NAME (Main) */}
                        <span
                            className="text-[28px] md:text-[32px] font-sans font-bold tracking-[0.2em] text-white leading-tight whitespace-nowrap mb-1"
                            style={{ textShadow: hovered ? `0 0 20px ${color}` : 'none' }}
                        >
                            {korName}
                        </span>

                        {/* ENGLISH NAME (Sub) */}
                        <span
                            className="text-[11px] md:text-[13px] font-orbitron font-bold tracking-[0.4em] whitespace-nowrap uppercase transition-colors duration-300"
                            style={{ color: hovered ? color : 'rgba(255, 255, 255, 0.8)' }}
                        >
                            {engName}
                        </span>
                    </div>
                </div>
            </div>
        </Html>
    );
};

const PlanetaryOrbit = ({ lab, config, activeScene }) => {
    const groupRef = useRef();
    const planetRef = useRef();
    const { playClick, playHover } = useSoundFX();
    const [isHovered, setIsHovered] = useState(false);
    const openMissionModal = useStore(state => state.openMissionModal);

    // Global active state from store or local hover
    const isActive = isHovered || activeScene === config.target;

    // Register for warp camera tracking
    useEffect(() => {
        registerPlanet(config.target, planetRef);
        return () => unregisterPlanet(config.target);
    }, [config.target]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime() * config.speedOffset;
        const x = Math.cos(t) * config.xRadius;
        const z = Math.sin(t) * config.zRadius;
        planetRef.current.position.set(x, 0, z);
    });

    return (
        <group rotation={config.inclination}>
            {/* 1. Refined Orbit Path - Colored & Subtle */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[config.xRadius - 0.05, config.xRadius + 0.05, 128]} />
                <meshBasicMaterial color={config.color} transparent opacity={0.15} side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[config.xRadius - 0.1, config.xRadius + 0.1, 128]} />
                <meshBasicMaterial color={config.color} transparent opacity={0.05} side={THREE.DoubleSide} />
            </mesh>

            <group
                ref={planetRef}
                onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                    const targetPos = new THREE.Vector3();
                    planetRef.current.getWorldPosition(targetPos);
                    openMissionModal({
                        lab: lab,
                        config: config,
                        warpPos: [targetPos.x, targetPos.y, targetPos.z]
                    });
                }}
                onPointerEnter={() => {
                    setIsHovered(true);
                    playHover();
                    document.body.style.cursor = 'pointer';
                }}
                onPointerLeave={() => {
                    setIsHovered(false);
                    document.body.style.cursor = 'auto';
                }}
            >
                {/* 2. Interactive Target - Precision Hitbox */}
                <mesh>
                    <sphereGeometry args={[7, 32, 32]} />
                    <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
                </mesh>

                {/* 3. Planet Visual Core */}
                <PlanetFactory type={config.target} color={config.color} isActive={isActive} />

                {/* 4. Selection Ring (Hover Effect) - Dynamic Size */}
                <mesh visible={isActive} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[config.target === 'lab03' ? 11 : 5.5, config.target === 'lab03' ? 11.5 : 6, 64]} />
                    <meshBasicMaterial color={config.color} transparent opacity={0.6} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
                </mesh>
                <mesh visible={isActive} rotation={[-Math.PI / 2, 0, 0]} scale={[1.1, 1.1, 1.1]}>
                    <ringGeometry args={[config.target === 'lab03' ? 11 : 5.5, config.target === 'lab03' ? 11.1 : 5.6, 64]} />
                    <meshBasicMaterial color={config.color} transparent opacity={0.3} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
                </mesh>

                {/* 5. Cinematic Label */}
                <Billboard position={[0, -14.5, 0]}>
                    <TextLabel korName={config.korName} engName={config.engName} color={config.color} hovered={isActive} />
                </Billboard>
            </group>
        </group>
    );
};

const SolarSystem = () => {
    const activeScene = useStore((state) => state.currentScene);
    const [isCoreHovered, setIsCoreHovered] = useState(false);

    const planets = [
        {
            lab: LORE.SECTORS.LAB_01,
            config: { target: 'lab01', color: LORE.SECTORS.LAB_01.visual.color, xRadius: 18, zRadius: 18, inclination: [0, 0, 0], speedOffset: 0.6, korName: "프로젝트", engName: "PROJECTS" }
        },
        {
            lab: LORE.SECTORS.LAB_02,
            config: { target: 'lab02', color: LORE.SECTORS.LAB_02.visual.color, xRadius: 28, zRadius: 28, inclination: [Math.PI / 12, 0, 0], speedOffset: 0.4, korName: "기술 연구소", engName: "TECH LAB" }
        },
        {
            lab: LORE.SECTORS.LAB_03,
            config: { target: 'lab03', color: LORE.SECTORS.LAB_03.visual.color, xRadius: 40, zRadius: 40, inclination: [-Math.PI / 16, 0, 0], speedOffset: 0.25, korName: "커리어", engName: "CAREER" }
        },
        {
            lab: LORE.SECTORS.LAB_04,
            config: { target: 'lab04', color: LORE.SECTORS.LAB_04.visual.color, xRadius: 54, zRadius: 54, inclination: [Math.PI / 10, 0, Math.PI / 20], speedOffset: 0.15, korName: "방명록", engName: "GUESTBOOK" }
        },
    ];

    return (
        <group>
            {/* Center: THE NEURAL CORE */}
            <group
                onClick={() => useStore.getState().setScene('profile')}
                onPointerEnter={() => { setIsCoreHovered(true); document.body.style.cursor = 'pointer'; }}
                onPointerLeave={() => { setIsCoreHovered(false); document.body.style.cursor = 'auto'; }}
            >
                <CoreSun isActive={isCoreHovered} />

                {/* ID Collider (Optimized) */}
                <mesh>
                    <sphereGeometry args={[10, 32, 32]} />
                    <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
                </mesh>

                {/* Identity Selection Ring */}
                <mesh visible={isCoreHovered} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[8.5, 9, 64]} />
                    <meshBasicMaterial color="#00f2ff" transparent opacity={0.6} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
                </mesh>
                <mesh visible={isCoreHovered} rotation={[-Math.PI / 2, 0, 0]} scale={[1.05, 1.05, 1.05]}>
                    <ringGeometry args={[8.5, 8.6, 64]} />
                    <meshBasicMaterial color="#00f2ff" transparent opacity={0.3} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
                </mesh>

                <Billboard position={[0, -16.5, 0]}>
                    <TextLabel
                        korName="프로필"
                        engName="IDENTITY"
                        color="#00f2ff"
                        hovered={true}
                    />
                </Billboard>
            </group>

            {/* Orbiting Sectors */}
            {planets.map((p, i) => (
                <PlanetaryOrbit
                    key={i}
                    lab={p.lab}
                    config={p.config}
                    activeScene={activeScene}
                />
            ))}
        </group>
    );
};

export default SolarSystem;
