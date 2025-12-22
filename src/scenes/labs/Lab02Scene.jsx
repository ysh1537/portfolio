import { useState, useEffect } from 'react';
import { Physics, usePlane, useBox, useSphere } from '@react-three/cannon';
import { useStore } from '../../hooks/useStore';
import { Text, Html, Environment, Float, Billboard, Sparkles, Cloud } from '@react-three/drei';
import * as THREE from 'three';

const Floor = () => {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -5, 0] }));
    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#064e3b" transparent opacity={0.8} roughness={0.8} />
        </mesh>
    );
};

// Variety of shapes for physics objects
const PhysBox = ({ position, color }) => {
    const [ref, api] = useBox(() => ({ mass: 1, position, args: [1, 1, 1] }));
    return (
        <InteractiveShape api={api} manualRef={ref} color={color}>
            <boxGeometry args={[1, 1, 1]} />
        </InteractiveShape>
    );
};

const PhysSphere = ({ position, color }) => {
    const [ref, api] = useSphere(() => ({ mass: 1, position, args: [0.7] }));
    return (
        <InteractiveShape api={api} manualRef={ref} color={color}>
            <sphereGeometry args={[0.7, 32, 32]} />
        </InteractiveShape>
    );
};

const InteractiveShape = ({ api, manualRef, children, color }) => {
    const [hovered, setHover] = useState(false);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        if (clicked) {
            const timeout = setTimeout(() => setClicked(false), 200);
            return () => clearTimeout(timeout);
        }
    }, [clicked]);

    const blast = () => {
        setClicked(true);
        api.applyImpulse(
            [(Math.random() - 0.5) * 20, 20 + Math.random() * 10, (Math.random() - 0.5) * 20],
            [0, 0, 0]
        );
        api.applyTorque([Math.random() * 20, Math.random() * 20, Math.random() * 20]);
    };

    return (
        <mesh
            ref={manualRef}
            onClick={(e) => { e.stopPropagation(); blast(); }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            castShadow
            receiveShadow
        >
            {children}
            <meshPhysicalMaterial
                color={clicked ? "#ffffff" : (hovered ? "#34d399" : color)}
                emissive={clicked ? "#ffffff" : (hovered ? "#34d399" : color)}
                emissiveIntensity={clicked ? 2 : (hovered ? 0.5 : 0.1)}
                metalness={0.1}
                roughness={0.8}
                clearcoat={0.5}
            />
        </mesh>
    );
};

import { techStackNodes } from '../../data/ProjectData';

// ... (Floor and other imports remain)

const TechBubble = ({ position, node }) => {
    const [ref, api] = useSphere(() => ({
        mass: 1,
        position,
        args: [1],
        linearDamping: 0.5,
        angularDamping: 0.5
    }));

    return (
        <InteractiveShape api={api} manualRef={ref} color={node.color}>
            <sphereGeometry args={[1, 32, 32]} />
            <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
                <div className="text-white font-bold font-mono text-sm tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ whiteSpace: 'nowrap' }}>
                    {node.name}
                </div>
            </Html>
        </InteractiveShape>
    );
};

// ... (InteractiveShape remains)

const Lab02Scene = () => {
    // Global Config from useStore
    const config = useStore(state => state.lab02Config);

    // Initialize tech nodes with random positions
    const [nodes] = useState(() => {
        return techStackNodes.map((node, i) => ({
            ...node,
            position: [
                (Math.random() - 0.5) * 8,
                5 + Math.random() * 5,
                (Math.random() - 0.5) * 8
            ],
            id: i
        }));
    });

    return (
        <group>
            {/* Dark Green Atmosphere */}
            <color attach="background" args={['#022c22']} />
            <fogExp2 attach="fog" args={['#064e3b', 0.05]} />
            <Environment preset="forest" />

            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Billboard>
                    <Text
                        position={[0, 4, -5]}
                        fontSize={0.5}
                        color="#10b981"
                        anchorX="center"
                        anchorY="middle"
                    >
                        LIVING TECH [ECOSYSTEM]
                    </Text>
                </Billboard>
            </Float>

            <Physics gravity={config.gravity} iterations={10}>
                <Floor />
                {nodes.map((node) => (
                    <TechBubble key={node.id} position={node.position} node={node} />
                ))}
            </Physics>


            {/* Cinematic FX: Spores */}
            <Sparkles count={300} scale={20} size={5} speed={0.4} opacity={0.6} color="#6ee7b7" />
            <Cloud opacity={0.3} seed={2} position={[0, 5, -10]} speed={0.2} color="#064e3b" />
        </group>
    );
};

export default Lab02Scene;
