import { useState, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Sparkles, Stars } from '@react-three/drei';
import { useStore } from '../hooks/useStore';
import BootLogs from '../components/BootLogs';
import * as THREE from 'three';

const BootScene = () => {
    const setScene = useStore(state => state.setScene);
    const [phase, setPhase] = useState(0); // 0: Init, 1: Logo, 2: Access Granted
    const logoRef = useRef();
    const { camera } = useThree();

    // Transition to Phase 2 (Logo Glitch) after Phase 1 is set
    useEffect(() => {
        if (phase === 1) {
            const timer = setTimeout(() => setPhase(2), 3000);
            return () => clearTimeout(timer);
        }
        if (phase === 2) {
            const timer = setTimeout(() => setScene('hub'), 2000);
            return () => clearTimeout(timer);
        }
    }, [phase, setScene]);

    // Dramatic camera zoom and logo animation
    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        if (phase === 1 && logoRef.current) {
            // Pulsing glow effect
            logoRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.1);

            // Random glitch rotation
            if (Math.random() > 0.95) {
                logoRef.current.rotation.y += (Math.random() - 0.5) * 0.3;
            } else {
                logoRef.current.rotation.y += 0.02;
            }

            // Camera shake for intensity
            camera.position.x = Math.sin(t * 10) * 0.02;
            camera.position.y = Math.cos(t * 8) * 0.02;
        }

        // Camera zoom in on phase 2
        if (phase === 2) {
            camera.position.z = THREE.MathUtils.lerp(camera.position.z, 3, 0.05);
            camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.1);
            camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.1);
        }
    });

    return (
        <group>
            {/* Cyberpunk grid background */}
            <mesh position={[0, -5, -10]} rotation={[-Math.PI / 3, 0, 0]}>
                <planeGeometry args={[50, 50]} />
                <meshBasicMaterial color="#001100" wireframe opacity={0.2} transparent />
            </mesh>
            <gridHelper args={[50, 50, '#00ff41', '#003311']} position={[0, -5, -5]} rotation={[0, 0, 0]} />

            {/* Background stars */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Phase 0: System Init Text + Particles */}
            {phase === 0 && (
                <group>
                    {/* Dramatic particles */}
                    <Sparkles count={300} scale={15} size={3} speed={0.5} opacity={0.6} color="#00ff41" />

                    {/* Glowing title */}
                    <Text
                        position={[0, 1, 0]}
                        fontSize={0.5}
                        color="#00ff41"
                        anchorX="center"
                        anchorY="center"
                        outlineWidth={0.02}
                        outlineColor="#003311"
                    >
                        SYSTEM_BOOT_SEQUENCE
                    </Text>

                    {/* When logs finish, Trigger Phase 1 */}
                    <BootLogs onComplete={() => setPhase(1)} />
                </group>
            )}

            {/* Phase 1: Dramatic Logo */}
            {phase >= 1 && (
                <group>
                    {/* Enhanced particle field */}
                    <Sparkles count={500} scale={20} size={4} speed={1.5} opacity={phase === 2 ? 0 : 0.8} color="#00ff41" />

                    <group ref={logoRef}>
                        <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
                            {/* Outer wireframe shell */}
                            <mesh position={[0, 0, 0]} scale={1.5}>
                                <icosahedronGeometry args={[1, 0]} />
                                <meshStandardMaterial
                                    color="#00ff41"
                                    wireframe
                                    transparent
                                    opacity={phase === 2 ? 0 : 0.3}
                                    emissive="#00ff41"
                                    emissiveIntensity={0.5}
                                />
                            </mesh>

                            {/* Middle octahedron */}
                            <mesh position={[0, 0, 0]}>
                                <octahedronGeometry args={[1, 0]} />
                                <meshStandardMaterial
                                    color="#00ff41"
                                    wireframe
                                    transparent
                                    opacity={phase === 2 ? 0 : 1}
                                    emissive="#00ff41"
                                    emissiveIntensity={1}
                                />
                            </mesh>

                            {/* Inner core */}
                            <mesh position={[0, 0, 0]} scale={0.3}>
                                <sphereGeometry args={[1, 16, 16]} />
                                <meshStandardMaterial
                                    color="#00ff41"
                                    transparent
                                    opacity={phase === 2 ? 0 : 1}
                                    emissive="#00ff41"
                                    emissiveIntensity={3}
                                />
                            </mesh>
                        </Float>

                        {/* Point light for dramatic glow */}
                        <pointLight position={[0, 0, 0]} intensity={phase === 2 ? 0 : 10} color="#00ff41" distance={10} />
                    </group>

                    <Text
                        position={[0, -1.5, 0]}
                        fontSize={0.3}
                        color="white"
                        anchorX="center"
                        outlineWidth={0.01}
                        outlineColor="#00ff41"
                    >
                        METAVERSE_OS
                    </Text>
                </group>
            )}

            {/* Phase 2: Access Granted - Dramatic entrance */}
            {phase === 2 && (
                <group>
                    {/* Explosive particle burst */}
                    <Sparkles count={1000} scale={30} size={6} speed={2} opacity={1} color="#00ff41" />

                    <Text
                        position={[0, 0, 2]}
                        fontSize={1.2}
                        color="#00ff41"
                        anchorX="center"
                        scale={[1, 1, 1]}
                        outlineWidth={0.05}
                        outlineColor="#003311"
                        letterSpacing={0.1}
                    >
                        ACCESS GRANTED
                    </Text>
                    <Text
                        position={[0, -1, 2]}
                        fontSize={0.35}
                        color="#00ff41"
                        anchorX="center"
                        scale={[1, 1, 1]}
                        outlineWidth={0.02}
                        outlineColor="#003311"
                    >
                        WELCOME, DIRECTOR.
                    </Text>

                    {/* Glowing ring effect */}
                    <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[3, 0.05, 16, 100]} />
                        <meshBasicMaterial color="#00ff41" transparent opacity={0.5} />
                    </mesh>
                </group>
            )}
        </group>
    );
};

export default BootScene;
