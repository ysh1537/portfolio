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

const Lab02Scene = () => {
    const startWarp = useStore(state => state.startWarp);
    const [gravity, setGravity] = useState([0, -9.8, 0]);
    const [zeroG, setZeroG] = useState(false);

    const toggleGravity = () => {
        if (zeroG) {
            setGravity([0, -9.8, 0]);
            setZeroG(false);
        } else {
            setGravity([0, 0.5, 0]); // Slight upward float
            setZeroG(true);
        }
    };

    // Generate random objects with organic colors
    const [objects] = useState(() => {
        const objs = [];
        const colors = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#86efac']; // Forest/Emerald Palette
        for (let i = 0; i < 15; i++) {
            const x = (Math.random() - 0.5) * 6;
            const y = 5 + Math.random() * 10;
            const z = (Math.random() - 0.5) * 6;
            const type = Math.random() > 0.5 ? 'box' : 'sphere';
            const color = colors[Math.floor(Math.random() * colors.length)];
            objs.push({ type, position: [x, y, z], color, id: i });
        }
        return objs;
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
                        THE TERRARIUM [EVOLUTION]
                    </Text>
                </Billboard>
            </Float>

            <Physics gravity={gravity} iterations={10}>
                <Floor />
                {objects.map((obj) => (
                    obj.type === 'box' ?
                        <PhysBox key={obj.id} position={obj.position} color={obj.color} /> :
                        <PhysSphere key={obj.id} position={obj.position} color={obj.color} />
                ))}
            </Physics>

            {/* Cinematic FX: Spores */}
            <Sparkles count={300} scale={20} size={5} speed={0.4} opacity={0.6} color="#6ee7b7" />
            <Cloud opacity={0.3} seed={2} position={[0, 5, -10]} speed={0.2} color="#064e3b" />

            {/* Physics Controls Panel - Emerald Theme */}
            <Html
                position={[3.5, 0, 0]}
                transform
                distanceFactor={5}
                zIndexRange={[100, 0]}
                style={{ pointerEvents: 'auto', userSelect: 'none' }}
            >
                <div className="w-72 bg-black/60 border border-emerald-500/50 p-6 rounded-lg backdrop-blur-xl text-emerald-400 font-mono text-xs shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <div className="mb-6 border-b border-emerald-500/30 pb-2 font-bold flex justify-between tracking-widest">
                        <span>ECOSYSTEM_ENGINE</span>
                        <span className="animate-pulse text-white">● ACTIVE</span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-emerald-500/10 p-3 rounded">
                            <span className="text-white opacity-80">GRAVITY_FIELD</span>
                            <span className={zeroG ? "text-cyan-400 font-bold" : "text-emerald-500 opacity-50"}>
                                {zeroG ? "[ZERO-G]" : "[NORMAL]"}
                            </span>
                        </div>

                        <button
                            onClick={toggleGravity}
                            className={`w-full py-3 border transition-all font-bold tracking-widest hover:scale-105 active:scale-95 ${zeroG
                                ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                                : 'bg-transparent text-emerald-500 border-emerald-500 hover:bg-emerald-500 hover:text-black'
                                }`}
                        >
                            {zeroG ? 'RESTORE GRAVITY' : 'INITIATE ZERO-G'}
                        </button>

                        <div className="text-[10px] opacity-70 mt-2 text-center text-white">
                            &gt; INTERACT WITH ORGANIC MATTER
                        </div>

                        <button
                            onClick={() => startWarp('hub')}
                            className="w-full mt-4 py-2 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20 rounded transition-all font-mono text-xs tracking-widest bg-black/50"
                        >
                            [ WARP TO NEXUS ]
                        </button>
                    </div>
                </div>
            </Html>
        </group>
    );
};

export default Lab02Scene;
