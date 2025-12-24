import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Sparkles, MeshTransmissionMaterial, MeshDistortMaterial, Float, Trail, Ring, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

// 💎 Lab 01: The Prism (lab01)
// 특징: 2중 굴절 구조 (내부 코어 + 외부 팔면체 쉘)
const CrystalPlanet = ({ color, isActive, timeRef }) => {
    const groupRef = useRef();
    const coreRef = useRef();
    const shellRef = useRef();

    useFrame((state, delta) => {
        const t = (timeRef?.current !== undefined) ? timeRef.current : state.clock.getElapsedTime();

        // Hover Scale Effect
        const targetScale = isActive ? 1.6 : 1;
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 4);

        groupRef.current.rotation.y = t * 0.1;
        coreRef.current.rotation.x = -t * 0.5;
        shellRef.current.rotation.y = t * 0.3;
        coreRef.current.scale.setScalar(0.4 + Math.sin(t * 3) * 0.05);
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <group ref={groupRef}>
                <mesh ref={coreRef}>
                    <icosahedronGeometry args={[2, 2]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={20}
                        transparent
                        opacity={0.9}
                    />
                </mesh>

                <mesh ref={shellRef}>
                    <octahedronGeometry args={[4.2, 0]} />
                    <MeshTransmissionMaterial
                        backside
                        backsideThickness={15}
                        thickness={10}
                        roughness={0.05}
                        transmission={1}
                        ior={2.2}
                        chromaticAberration={25}
                        anisotropy={10}
                        distortion={0.2}
                        distortionScale={0.5}
                        temporalDistortion={0.1}
                        color={color}
                        background={new THREE.Color('#000000')}
                    />
                </mesh>

                <mesh ref={shellRef} scale={1.01}>
                    <octahedronGeometry args={[4.2, 0]} />
                    <meshBasicMaterial color={color} wireframe transparent opacity={0.3} blending={THREE.AdditiveBlending} />
                </mesh>

                <Sparkles count={40} scale={12} size={15} speed={1} opacity={0.6} color={color} />
            </group>
        </Float>
    );
};

// 🌿 Lab 02: The Node Network (lab02)
// 특징: 맥동하는 데이터 노드 + 신경망 구조
const OrganicPlanet = ({ color, isActive, timeRef }) => {
    const groupRef = useRef();
    const nodesRef = useRef();
    const nodePulse = useMemo(() => Array.from({ length: 42 }).map(() => Math.random() * Math.PI * 2), []);

    useFrame((state, delta) => {
        const t = (timeRef?.current !== undefined) ? timeRef.current : state.clock.getElapsedTime();

        // Hover Scale Effect
        const targetScale = isActive ? 1.6 : 1;
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 4);

        groupRef.current.rotation.y = t * 0.1;
        if (nodesRef.current) {
            nodesRef.current.children.forEach((node, i) => {
                if (node.material) {
                    const s = 1 + Math.sin(t * 3 + nodePulse[i]) * 0.3;
                    node.scale.setScalar(s);
                    node.material.emissiveIntensity = 5 + Math.sin(t * 5 + nodePulse[i]) * 10;
                }
            });
        }
    });

    return (
        <group ref={groupRef}>
            <mesh>
                <icosahedronGeometry args={[2.5, 1]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            <mesh>
                <icosahedronGeometry args={[3.5, 2]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} wireframe transparent opacity={0.4} />
            </mesh>

            <group ref={nodesRef}>
                <Icosahedron args={[3.6, 1]}>
                    <meshBasicMaterial visible={false} />
                    {Array.from({ length: 42 }).map((_, i) => (
                        <mesh key={i} position={new THREE.Vector3().setFromSphericalCoords(4.0, Math.acos(1 - 2 * (i / 42)), (Math.PI * 2 * i) / 1.618)}>
                            <boxGeometry args={[0.25, 0.25, 0.25]} />
                            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={10} />
                        </mesh>
                    ))}
                </Icosahedron>
            </group>

            <mesh rotation={[Math.PI / 4, 0, 0]}>
                <icosahedronGeometry args={[4.2, 1]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} wireframe transparent opacity={0.15} />
            </mesh>

            <Sparkles count={60} scale={10} size={5} speed={2} opacity={0.8} color={color} />
        </group>
    );
};

// 🔊 Lab 03: The Resonance (lab03)
// 특징: 고밀도 선형 링 시스템 + 대기 아우라
const GasGiant = ({ color, isActive, timeRef }) => {
    const groupRef = useRef();
    const stormRef = useRef();
    const ringsRef = useRef();

    const ringCount = 25;
    const ringData = useMemo(() => Array.from({ length: ringCount }).map((_, i) => ({
        radius: 6 + (i * 0.15),
        opacity: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.05 + 0.02
    })), []);

    useFrame((state, delta) => {
        const t = (timeRef?.current !== undefined) ? timeRef.current : state.clock.getElapsedTime();

        // Hover Scale Effect
        const targetScale = isActive ? 1.6 : 1;
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 4);

        groupRef.current.rotation.y = t * 0.05;
        stormRef.current.rotation.y = -t * 0.1;
        if (ringsRef.current) {
            ringsRef.current.children.forEach((ring, i) => {
                ring.rotation.z = t * ringData[i].speed;
            });
        }
    });

    return (
        <group ref={groupRef}>
            <mesh>
                <sphereGeometry args={[4.5, 64, 64]} />
                <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} emissive={color} emissiveIntensity={0.5} />
            </mesh>

            <mesh scale={1.03} ref={stormRef}>
                <sphereGeometry args={[4.5, 32, 16]} />
                <meshStandardMaterial color="#fcd34d" transparent opacity={0.25} wireframe />
            </mesh>

            <group ref={ringsRef} rotation={[Math.PI / 2.5, 0.4, 0]}>
                {ringData.map((ring, i) => (
                    <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[ring.radius, ring.radius + 0.02, 128]} />
                        <meshBasicMaterial color={color} transparent opacity={ring.opacity} side={THREE.DoubleSide} />
                    </mesh>
                ))}
            </group>

            <mesh scale={1.2}>
                <sphereGeometry args={[4.5, 32, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.05} side={THREE.BackSide} />
            </mesh>

            <Sparkles count={80} scale={18} size={4} speed={0.5} opacity={0.6} color="#fde68a" />
        </group>
    );
};

// 🚧 Lab 04: The Glitch (lab04)
// 특징: 비선형 스냅 움직임 (진짜 디지철 오류)
const GlitchMoon = ({ color, isActive, timeRef }) => {
    const groupRef = useRef();
    const fragmentsRef = useRef();
    const [glitchOffset, setGlitchOffset] = useState([0, 0, 0]);
    const [glitchScale, setGlitchScale] = useState(1);
    const currentScale = useRef(1);

    const fragments = useMemo(() => Array.from({ length: 40 }).map(() => ({
        pos: [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: Math.random() * 0.5 + 0.2,
    })), []);

    useFrame((state, delta) => {
        const t = (timeRef?.current !== undefined) ? timeRef.current : state.clock.getElapsedTime();
        groupRef.current.rotation.y = t * 0.2;

        if (Math.random() > 0.96) {
            setGlitchOffset([
                (Math.random() - 0.5) * 0.4,
                (Math.random() - 0.5) * 0.4,
                (Math.random() - 0.5) * 0.4
            ]);
            setGlitchScale(1 + (Math.random() - 0.5) * 0.2);
        } else if (Math.random() > 0.9) {
            setGlitchOffset([0, 0, 0]);
            setGlitchScale(1);
        }

        // Combine Glitch Scale + Hover Scale
        const targetHoverScale = isActive ? 1.6 : 1;
        currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetHoverScale, delta * 4);

        const finalScale = glitchScale * currentScale.current;

        groupRef.current.position.set(...glitchOffset);
        groupRef.current.scale.setScalar(finalScale);
    });

    return (
        <group ref={groupRef}>
            <mesh>
                <icosahedronGeometry args={[3.8, 0]} />
                <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh scale={0.98}>
                <icosahedronGeometry args={[3.8, 1]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={15} wireframe />
            </mesh>

            <group ref={fragmentsRef}>
                {fragments.map((f, i) => (
                    <mesh key={i} position={[f.pos[0] * 8, f.pos[1] * 6, f.pos[2] * 8]} rotation={f.rot} scale={f.scale}>
                        <boxGeometry args={[0.5, 0.5, 0.5]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} />
                    </mesh>
                ))}
            </group>

            <mesh scale={1.2}>
                <sphereGeometry args={[3.8, 4, 32]} />
                <meshBasicMaterial color={color} wireframe transparent opacity={0.2} />
            </mesh>

            <Sparkles count={100} scale={10} size={15} speed={30} opacity={1} color={color} noise={10} />
        </group>
    );
};

const PlanetFactory = ({ type, color, isActive, timeRef }) => {
    switch (type) {
        case 'lab01': return <CrystalPlanet color={color} isActive={isActive} timeRef={timeRef} />;
        case 'lab02': return <OrganicPlanet color={color} isActive={isActive} timeRef={timeRef} />;
        case 'lab03': return <GasGiant color={color} isActive={isActive} timeRef={timeRef} />;
        case 'lab04': return <GlitchMoon color={color} isActive={isActive} timeRef={timeRef} />;
        default: return <Sphere args={[1]}><meshStandardMaterial color={color} /></Sphere>;
    }
};

export default PlanetFactory;
