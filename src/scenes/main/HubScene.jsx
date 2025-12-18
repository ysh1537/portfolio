import { Environment, Stars, Sparkles, Cloud } from '@react-three/drei';
import SolarSystem from '../../components/solar/SolarSystem';
import TechConstellation from '../../components/solar/TechConstellation';
import SystemHUD from '../../components/ui/SystemHUD';

const HubScene = () => {
    return (
        <group position={[0, -1, 0]}>
            <Environment preset="city" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={500} scale={20} size={4} speed={0.4} opacity={0.5} color="#ffffff" />
            <fog attach="fog" args={['#050510', 10, 50]} />

            {/* Cinematic Background Elements */}
            <Cloud opacity={0.3} seed={1} position={[0, -10, -20]} speed={0.2} color="#111122" />

            {/* The Solar System Architecture */}
            <SolarSystem />

            {/* Background Skills */}
            <TechConstellation />

            {/* HUD Overlay (In-Scene Hologram) */}
            <SystemHUD />

            {/* Floor Reflection and Grid (Maintained for depth) */}
            <group position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <mesh receiveShadow>
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial color="#050505" roughness={0.4} metalness={0.8} />
                </mesh>
                <gridHelper args={[50, 50, 0x222222, 0x050505]} position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} />
            </group>

            <spotLight position={[-10, 10, 10]} angle={0.3} penumbra={1} intensity={10} color="#06b6d4" />
        </group>
    );
};

export default HubScene;
