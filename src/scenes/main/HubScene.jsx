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

            {/* Interactive Space Dust - HIGH MODE ONLY (성능 이슈) */}
            {isHighPerf && <StarField count={800} />}

            <Environment preset="city" />

            {/* Deep Space Background - 대폭 경량화 */}
            <Stars
                radius={300}
                depth={60}
                count={isHighPerf ? 15000 : 1500}
                factor={isHighPerf ? 7 : 5}
                saturation={0.9}
                fade
                speed={isHighPerf ? 0.3 : 0}
            />

            {/* Sparkles - LOW 모드에서 최소화 */}
            <Sparkles
                count={isHighPerf ? 1000 : 50}
                scale={50}
                size={isHighPerf ? 3 : 1.5}
                speed={isHighPerf ? 0.2 : 0}
                opacity={0.5}
                color="#88ccff"
                noise={0.3}
            />

            {/* Atmospheric Fog */}
            <fog attach="fog" args={['#020208', 30, 90]} />

            {/* Cinematic Background Elements: NEBULA - High Mode Only */}
            {isHighPerf && (
                <>
                    <Cloud opacity={0.3} seed={10} position={[35, 5, -40]} speed={0.2} color="#5b21b6" segments={30} bounds={[15, 3, 3]} volume={20} />
                    <Cloud opacity={0.25} seed={20} position={[-35, -5, -40]} speed={0.15} color="#0e7490" segments={30} bounds={[15, 3, 3]} volume={20} />
                    <Cloud opacity={0.1} seed={30} position={[0, 20, -50]} speed={0.1} color="#374151" segments={10} bounds={[20, 2, 2]} volume={30} />
                </>
            )}

            {/* The Solar System Architecture */}
            <SolarSystem />

            {/* Background Skills - HIGH MODE ONLY (GPU 부담 큼) */}
            {isHighPerf && <TechConstellation />}

            {/* Phase 35: Black Box Satellite */}
            <BlackBoxSatellite position={[28, 10, -20]} />

            {/* Cinematic Lighting System - LOW 모드에서 간소화 */}
            {isHighPerf ? (
                <>
                    <spotLight position={[-20, 20, 20]} angle={0.25} penumbra={1} intensity={14} color="#22d3ee" castShadow />
                    <pointLight position={[20, 10, 20]} intensity={4} color="#c084fc" distance={50} />
                    <spotLight position={[0, 10, -30]} angle={0.6} penumbra={0.5} intensity={25} color="#4f46e5" distance={100} />
                </>
            ) : (
                <>
                    {/* LOW: 단일 조명으로 단순화 */}
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1.5} color="#88ccff" />
                </>
            )}
        </group>
    );
};

export default HubScene;
