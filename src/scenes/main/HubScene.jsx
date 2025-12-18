import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, useCursor, Environment, Stars, Sparkles, Billboard, Html } from '@react-three/drei';
import { useStore } from '../../hooks/useStore';
import * as THREE from 'three';

const CosmicNode = ({ position = [0, 0, 0], label, targetScene, color }) => {
    const setScene = useStore(state => state.setScene);
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef();
    useCursor(hovered);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
            meshRef.current.rotation.x += 0.005;
        }
    });

    // Memoize random values
    // Memoize random values
    const [randomSpeed] = useState(() => 2 + Math.random());

    // Different geometries for different scenes
    const getGeometry = () => {
        switch (targetScene) {
            case 'lab01': // SHADER - Tesseract/4D Cube
                return (
                    <group ref={meshRef}>
                        <mesh scale={1.2}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshPhysicalMaterial
                                color={color}
                                roughness={0}
                                metalness={1}
                                transparent
                                opacity={0.3}
                                wireframe
                            />
                        </mesh>
                        <mesh scale={0.7} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshPhysicalMaterial
                                color={color}
                                roughness={0.1}
                                metalness={0.9}
                                emissive={color}
                                emissiveIntensity={hovered ? 2 : 0.8}
                            />
                        </mesh>
                    </group>
                );
            case 'lab02': // PHYSICS - Planet
                return (
                    <mesh ref={meshRef}>
                        <icosahedronGeometry args={[0.8, 2]} />
                        <meshPhysicalMaterial
                            color={color}
                            roughness={0.4}
                            metalness={0.6}
                            emissive={color}
                            emissiveIntensity={hovered ? 1.5 : 0.3}
                            clearcoat={1}
                            clearcoatRoughness={0.1}
                        />
                    </mesh>
                );
            case 'lab03': // AUDIO - Pulsing Sphere
                return (
                    <mesh ref={meshRef} scale={hovered ? 1.2 : 1}>
                        <sphereGeometry args={[0.7, 32, 32]} />
                        <meshPhysicalMaterial
                            color={color}
                            roughness={0.2}
                            metalness={0.8}
                            transparent
                            opacity={0.7}
                            emissive={color}
                            emissiveIntensity={hovered ? 2.5 : 1}
                        />
                    </mesh>
                );
            case 'lab04': // DEBUG - Wireframe Polyhedron
                return (
                    <group ref={meshRef}>
                        <mesh>
                            <octahedronGeometry args={[0.9]} />
                            <meshPhysicalMaterial
                                color={color}
                                roughness={0}
                                metalness={1}
                                wireframe
                                emissive={color}
                                emissiveIntensity={hovered ? 2 : 1}
                            />
                        </mesh>
                    </group>
                );
            case 'profile': // PROFILE - Glowing Core
                return (
                    <group ref={meshRef}>
                        <mesh>
                            <icosahedronGeometry args={[1, 0]} />
                            <meshPhysicalMaterial
                                color={color}
                                roughness={0}
                                metalness={1}
                                emissive={color}
                                emissiveIntensity={hovered ? 3 : 1.5}
                                wireframe
                            />
                        </mesh>
                        <mesh scale={0.6}>
                            <icosahedronGeometry args={[1, 0]} />
                            <meshPhysicalMaterial
                                color={color}
                                roughness={0.1}
                                metalness={0.9}
                                emissive={color}
                                emissiveIntensity={2}
                            />
                        </mesh>
                    </group>
                );
            default:
                return (
                    <mesh ref={meshRef}>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshPhysicalMaterial
                            color={color}
                            roughness={0.1}
                            metalness={0.8}
                            emissive={color}
                            emissiveIntensity={hovered ? 2 : 0.5}
                        />
                    </mesh>
                );
        }
    };

    return (
        <group
            position={position}
            onClick={(e) => {
                e.stopPropagation();
                setScene(targetScene);
            }}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
        >
            {/* 3D Geometry */}
            <Float speed={randomSpeed} rotationIntensity={0.5} floatIntensity={0.5}>
                {getGeometry()}
                <pointLight distance={5} intensity={hovered ? 8 : 3} color={color} />
            </Float>

            {/* Reliable HTML Navigation Label */}
            <Html
                position={[0, -1.2, 0]}
                center
                transform
                distanceFactor={10}
                zIndexRange={[100, 0]}
                style={{ pointerEvents: 'auto' }}
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setScene(targetScene);
                    }}
                    onPointerEnter={() => setHovered(true)}
                    onPointerLeave={() => setHovered(false)}
                    className="px-4 py-2 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 group hover:scale-110 hover:border-white/50 hover:bg-white/10"
                    style={{
                        backgroundColor: hovered ? `${color}33` : 'transparent',
                        borderColor: hovered ? color : 'rgba(255,255,255,0.2)',
                        boxShadow: hovered ? `0 0 20px ${color}` : 'none',
                        color: 'white',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        letterSpacing: '0.1em',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {label}
                </button>
            </Html>
        </group>
    );
};

// Dynamic Orbit Path that breathes
const DynamicOrbitPath = ({ xRadius, zRadius, color, speedOffset }) => {
    const lineRef = useRef();

    // Create geometry once, modify positions in useFrame
    const geometry = useMemo(() => {
        const curve = new THREE.EllipseCurve(0, 0, xRadius, zRadius, 0, 2 * Math.PI, false, 0);
        const points = curve.getPoints(100);
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        return geo;
    }, [xRadius, zRadius]);

    useFrame((state) => {
        if (lineRef.current) {
            const time = state.clock.getElapsedTime();
            // Breathing effect: Scale the orbit slightly over time
            const scale = 1 + Math.sin(time * 0.5 * speedOffset) * 0.05;
            lineRef.current.scale.set(scale, scale, 1);
        }
    });

    return (
        <line ref={lineRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
            <lineBasicMaterial color={color} transparent opacity={0.3} />
        </line>
    );
};

const HubScene = () => {
    // Elliptical Layout Configuration
    const labs = useMemo(() => [
        { label: "LAB 01 [SHADER]", target: "lab01", color: "#06b6d4", xRadius: 6, zRadius: 4, inclination: [Math.PI / 6, 0, Math.PI / 12], speedOffset: 1.0 },
        { label: "LAB 02 [PHYSICS]", target: "lab02", color: "#7c3aed", xRadius: 5, zRadius: 7, inclination: [-Math.PI / 6, Math.PI / 12, 0], speedOffset: 0.8 },
        { label: "LAB 03 [AUDIO]", target: "lab03", color: "#facc15", xRadius: 8, zRadius: 5, inclination: [0, 0, Math.PI / 8], speedOffset: 0.6 },
        { label: "LAB 04 [DEBUG]", target: "lab04", color: "#00ff41", xRadius: 5, zRadius: 5, inclination: [Math.PI / 3, Math.PI / 4, 0], speedOffset: 1.2 },
    ], []);

    const groupRefs = useRef(new Array(labs.length).fill(null));
    const progressRefs = useRef(new Array(labs.length).fill(0));

    useEffect(() => {
        progressRefs.current = labs.map(() => Math.random());
    }, [labs]);

    useFrame((state, delta) => {
        const speed = useStore.getState().orbitSpeed;
        const time = state.clock.getElapsedTime();

        labs.forEach((lab, i) => {
            // Update node position
            const approximatePerimeter = 2 * Math.PI * Math.sqrt((lab.xRadius ** 2 + lab.zRadius ** 2) / 2);
            const linearSpeed = speed * 10 * lab.speedOffset;

            progressRefs.current[i] += (linearSpeed * delta) / approximatePerimeter * 5;
            const t = progressRefs.current[i] % 1;

            if (groupRefs.current[i]) {
                const angle = t * 2 * Math.PI;

                // Calculate dynamic radius (matches DynamicOrbitPath scaling)
                const breathingScale = 1 + Math.sin(time * 0.5 * lab.speedOffset) * 0.05;
                const currentXRadius = lab.xRadius * breathingScale;
                const currentZRadius = lab.zRadius * breathingScale;

                const x = Math.cos(angle) * currentXRadius;
                const z = Math.sin(angle) * currentZRadius;

                groupRefs.current[i].position.set(x, 0, z);
            }
        });
    });

    return (
        <group position={[0, -1, 0]}>
            <Environment preset="city" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={500} scale={20} size={4} speed={0.4} opacity={0.5} color="#ffffff" />
            <fog attach="fog" args={['#050510', 10, 50]} />

            {/* Central Identity System */}
            <group>
                <CosmicNode
                    position={[0, 0, 0]}
                    label="IDENTITY [PROFILE]"
                    targetScene="profile"
                    color="#fbbf24"
                />
                <spotLight position={[-10, 10, 10]} angle={0.3} penumbra={1} intensity={10} color="#06b6d4" />

                {/* Floor Reflection and Grid */}
                <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial color="#050505" roughness={0.4} metalness={0.8} />
                </mesh>
                <gridHelper args={[50, 50, 0x222222, 0x050505]} position={[0, -7.9, 0]} />
            </group>

            {/* Atomic Orbital System */}
            {labs.map((lab, i) => (
                <group key={i} rotation={lab.inclination}>
                    <DynamicOrbitPath
                        xRadius={lab.xRadius}
                        zRadius={lab.zRadius}
                        color={lab.color}
                        speedOffset={lab.speedOffset}
                    />

                    <group ref={el => groupRefs.current[i] = el}>
                        <CosmicNode
                            label={lab.label}
                            targetScene={lab.target}
                            color={lab.color}
                        />
                    </group>
                </group>
            ))}
        </group>
    );
};

export default HubScene;
