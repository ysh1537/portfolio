import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import { useStore } from '../hooks/useStore';
import BootLogs from '../components/BootLogs';
import * as THREE from 'three';

const BootScene = () => {
    const setScene = useStore(state => state.setScene);
    const [phase, setPhase] = useState(0); // 0: Init, 1: Logo, 2: Access Granted

    // Transition to Phase 2 (Logo Glitch) after Phase 1 is set
    useEffect(() => {
        if (phase === 1) {
            const timer = setTimeout(() => setPhase(2), 3000); // Show logo for 3s
            return () => clearTimeout(timer);
        }
        if (phase === 2) {
            const timer = setTimeout(() => setScene('hub'), 2000); // Show Access Granted for 2s then switch
            return () => clearTimeout(timer);
        }
    }, [phase, setScene]);

    return (
        <group>
            {/* Phase 0: System Init Text */}
            {phase === 0 && (
                <group>
                    <Text position={[0, 1, 0]} fontSize={0.5} color="#00ff41" anchorX="center" anchorY="center">
                        SYSTEM_BOOT_SEQUENCE
                    </Text>
                    {/* When logs finish, Trigger Phase 1 */}
                    <BootLogs onComplete={() => setPhase(1)} />
                </group>
            )}

            {/* Phase 1: Glitchy Logo */}
            {phase >= 1 && (
                <group>
                    <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
                        <mesh position={[0, 0, 0]}>
                            <octahedronGeometry args={[1, 0]} />
                            <meshStandardMaterial
                                color="#00ff41"
                                wireframe
                                transparent
                                opacity={phase === 2 ? 0 : 1}
                                emissive="#00ff41"
                                emissiveIntensity={0.3}
                            />
                        </mesh>
                    </Float>
                    <Text position={[0, -1.5, 0]} fontSize={0.3} color="white" anchorX="center">
                        METAVERSE_OS
                    </Text>
                </group>
            )}

            {/* Phase 2: Access Granted */}
            {phase === 2 && (
                <>
                    <Text position={[0, 0, 2]} fontSize={1} color="#00ff41" anchorX="center" scale={[1, 1, 1]}>
                        ACCESS GRANTED
                    </Text>
                    <Text position={[0, -1, 2]} fontSize={0.3} color="#00ff41" anchorX="center" scale={[1, 1, 1]}>
                        WELCOME, DIRECTOR.
                    </Text>
                </>
            )}
        </group>
    );
};

export default BootScene;
