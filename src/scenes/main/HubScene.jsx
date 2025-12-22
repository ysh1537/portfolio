import { Environment, Stars, Sparkles, Cloud, MeshReflectorMaterial } from '@react-three/drei';
import SolarSystem from '../../components/solar/SolarSystem';
import TechConstellation from '../../components/solar/TechConstellation';
import BlackBoxSatellite from '../../components/solar/BlackBoxSatellite';
import { useStore } from '../../hooks/useStore';
import CinematicEffects from '../../components/effects/CinematicEffects';
import StarField from '../../components/solar/StarField';

const HubScene = () => {
    const performanceMode = useStore((state) => state.performanceMode);
    const isHighPerf = performanceMode === 'high';

    return (
        <group position={[0, -1, 0]}>
            {/* Post-Processing Effects (Bloom, Vignette) - High Mode Only */}
            {isHighPerf && <CinematicEffects />}

            {/* Interactive Space Dust */}
            <StarField count={800} />

            <Environment preset="city" />

            {/* Deep Space Background - Ultra High Density */}
            <Stars
                radius={300}
                depth={60}
                count={isHighPerf ? 20000 : 5000}
                factor={7}
                saturation={0.9}
                fade
                speed={isHighPerf ? 0.3 : 0.1}
            />

            <Sparkles
                count={isHighPerf ? 1500 : 300}
                scale={50}
                size={isHighPerf ? 3 : 2}
                speed={0.2}
                opacity={0.6}
                color="#88ccff"
                noise={0.5}
            />
            {/* Atmospheric Fog - Darker and denser for depth */}
            <fog attach="fog" args={['#020208', 30, 90]} />

            {/* Cinematic Background Elements: NEBULA - High Mode Only */}
            {isHighPerf && (
                <>
                    {/* Purple Galaxy Arm */}
                    <Cloud opacity={0.3} seed={10} position={[35, 5, -40]} speed={0.2} color="#5b21b6" segments={30} bounds={[15, 3, 3]} volume={20} />

                    {/* Cyan Galaxy Arm */}
                    <Cloud opacity={0.25} seed={20} position={[-35, -5, -40]} speed={0.15} color="#0e7490" segments={30} bounds={[15, 3, 3]} volume={20} />

                    {/* Subtle Dust */}
                    <Cloud opacity={0.1} seed={30} position={[0, 20, -50]} speed={0.1} color="#374151" segments={10} bounds={[20, 2, 2]} volume={30} />
                </>
            )}

            {/* The Solar System Architecture */}
            <SolarSystem />

            {/* Background Skills */}
            <TechConstellation />

            {/* Phase 35: Black Box Satellite (DevLog Entry Point) */}
            <BlackBoxSatellite position={[28, 10, -20]} />

            {/* Premium Reflective Floor - REMOVED for Deep Space Feel (Phase 27) */}
            {/* 
               We remove the floor to avoid the "cut off" look and enhance infinite space.
               The stars and nebula provide enough depth.
            */}

            {/* Cinematic Lighting System */}
            {/* 1. Main Key Light (Cool) */}
            <spotLight position={[-20, 20, 20]} angle={0.25} penumbra={1} intensity={14} color="#22d3ee" castShadow />

            {/* 2. Fill Light (Warm/Neutral) */}
            <pointLight position={[20, 10, 20]} intensity={4} color="#c084fc" distance={50} />

            {/* 3. Rim Light (Backlight for Planet Contours) */}
            <spotLight position={[0, 10, -30]} angle={0.6} penumbra={0.5} intensity={25} color="#4f46e5" distance={100} />
        </group>
    );
};

export default HubScene;
