import { useState, useEffect, useMemo, useRef, memo } from 'react';
import { Physics, usePlane, useSphere } from '@react-three/cannon';
import { useStore } from '../../hooks/useStore';
import { Text, Html, Environment, Float, Sparkles, Cloud, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { techStackNodes, projects } from '../../data/ProjectData';
import { useFrame } from '@react-three/fiber';
import AIChatTerminal from '../../components/ui/AIChatTerminal';
import CinematicHologramChat from '../../components/ui/CinematicHologramChat';

// 🌌 Lab02: Tech Constellation - Dual Mode (Gravity / Zero-G)

// Category configuration for constellation positions
const CATEGORY_CONFIG = {
    frontend: { center: [-6, 4, 0], color: '#61dafb' },
    backend: { center: [6, 4, 0], color: '#339933' },
    ai: { center: [0, 7, -4], color: '#ff6f00' },
    infra: { center: [0, 1, -2], color: '#ff9900' },
    language: { center: [-3, 6, -3], color: '#3178c6' },
    tool: { center: [3, 6, -3], color: '#646cff' },
    engine: { center: [-4, 0, 2], color: '#000000' },
    platform: { center: [4, 0, 2], color: '#00c73c' },
    core: { center: [0, 3, 2], color: '#990000' },
    state: { center: [-2, 2, 3], color: '#453a33' },
    style: { center: [2, 2, 3], color: '#38bdf8' },
};

// 🏗️ Floor (for gravity mode)
const Floor = () => {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -5, 0] }));
    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[80, 80]} />
            <meshStandardMaterial color="#0a0a0a" transparent opacity={0.8} roughness={0.9} metalness={0.1} />
        </mesh>
    );
};

// 📊 Tech Analysis HUD
const TechHUD = ({ selectedNode, onClose }) => {
    if (!selectedNode) return null;
    const relatedProjects = projects.filter(p => p.tech.includes(selectedNode.name));

    return (
        <Html fullscreen style={{ pointerEvents: 'none', zIndex: 10 }}>
            <div className="w-full h-full flex items-center justify-end p-12 pointer-events-none">
                <div className="w-[380px] bg-black/85 backdrop-blur-xl border border-emerald-500/30 rounded-lg p-5 text-white pointer-events-auto shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                    <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-3">
                        <div>
                            <span className="text-[10px] font-mono text-emerald-400 tracking-[0.2em] uppercase">ANALYSIS</span>
                            <h2 className="text-3xl font-bold uppercase tracking-wider" style={{ color: selectedNode.color }}>
                                {selectedNode.name}
                            </h2>
                        </div>
                        <button onClick={onClose} className="text-white/50 hover:text-white text-xl">×</button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs text-white/50 mb-1 font-mono">
                                <span>LEVEL</span><span>{selectedNode.level}</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                                    style={{ width: selectedNode.level === 'Expert' ? '95%' : selectedNode.level === 'Advanced' ? '75%' : '50%' }} />
                            </div>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed">{selectedNode.desc}</p>
                        {relatedProjects.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {relatedProjects.map(p => (
                                    <span key={p.id} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-emerald-400">
                                        {p.title}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Html>
    );
};

// 💎 Hybrid Tech Node (Physics + Constellation Target)
const HybridNode = memo(({ node, constellationPos, isZeroG, onNodeClick, registerNode }) => {
    const baseSize = node.level === 'Expert' ? 0.7 : node.level === 'Advanced' ? 0.55 : 0.4;

    // Physics body - but with controllable gravity response
    const [ref, api] = useSphere(() => ({
        mass: isZeroG ? 0 : 1, // Mass 0 in Zero-G = kinematic (doesn't fall)
        position: constellationPos,
        args: [baseSize],
        linearDamping: 0.8,
        angularDamping: 0.8,
    }));

    const meshRef = useRef();
    const [hovered, setHover] = useState(false);
    const positionRef = useRef(new THREE.Vector3(...constellationPos));

    // Track current position for lines
    useEffect(() => {
        const unsubscribe = api.position.subscribe(p => {
            positionRef.current.set(p[0], p[1], p[2]);
        });
        return unsubscribe;
    }, [api]);

    // Register for constellation lines
    useEffect(() => {
        if (registerNode) {
            registerNode(node.id, { current: { position: positionRef.current } });
        }
    }, [registerNode, node.id]);

    // Zero-G: Smoothly move to constellation position
    useFrame(() => {
        if (isZeroG && ref.current) {
            const target = new THREE.Vector3(...constellationPos);
            const current = positionRef.current;
            const diff = target.clone().sub(current);

            if (diff.length() > 0.1) {
                api.velocity.set(diff.x * 2, diff.y * 2, diff.z * 2);
            } else {
                api.velocity.set(0, 0, 0);
            }
        }

        // Pulse animation
        if (meshRef.current) {
            const pulse = Math.sin(Date.now() * 0.002 + node.id) * 0.05;
            meshRef.current.scale.setScalar(1 + pulse);
        }
    });

    // When gravity mode changes, update mass
    useEffect(() => {
        api.mass.set(isZeroG ? 0 : 1);
        if (!isZeroG) {
            // Give a small upward impulse so they don't just freeze
            api.velocity.set((Math.random() - 0.5) * 2, 2, (Math.random() - 0.5) * 2);
        }
    }, [isZeroG, api]);

    return (
        <group ref={ref}>
            <mesh
                ref={meshRef}
                onClick={(e) => { e.stopPropagation(); onNodeClick(node); }}
                onPointerOver={() => { setHover(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto'; }}
            >
                <sphereGeometry args={[baseSize, 24, 24]} />
                <meshStandardMaterial
                    color={hovered ? "#ffffff" : node.color}
                    emissive={node.color}
                    emissiveIntensity={hovered ? 1 : 0.5}
                    roughness={0.3}
                    metalness={0.6}
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* Expert ring */}
            {node.level === 'Expert' && (
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[baseSize * 1.4, baseSize * 1.6, 32]} />
                    <meshBasicMaterial color={node.color} transparent opacity={0.4} side={THREE.DoubleSide} />
                </mesh>
            )}

            {/* Label */}
            <Html position={[0, baseSize + 0.2, 0]} center style={{ pointerEvents: 'none' }}>
                <div className="text-center">
                    <div className="text-[10px] font-bold whitespace-nowrap px-1.5 py-0.5 rounded bg-black/70 border border-white/20"
                        style={{ color: node.color }}>
                        {node.name}
                    </div>
                </div>
            </Html>
        </group>
    );
});

// 🧠 Constellation Lines
const ConstellationLines = memo(({ nodeRefs, nodes, isZeroG }) => {
    const linesRef = useRef();

    useFrame(() => {
        if (!linesRef.current || !isZeroG) {
            if (linesRef.current) linesRef.current.visible = isZeroG;
            return;
        }

        const positions = [];
        const colors = [];
        const categories = {};

        nodes.forEach(node => {
            if (!categories[node.type]) categories[node.type] = [];
            categories[node.type].push(node);
        });

        Object.values(categories).forEach(catNodes => {
            for (let i = 0; i < catNodes.length; i++) {
                for (let j = i + 1; j < catNodes.length; j++) {
                    const refA = nodeRefs.current[catNodes[i].id];
                    const refB = nodeRefs.current[catNodes[j].id];
                    if (!refA?.current?.position || !refB?.current?.position) continue;

                    const posA = refA.current.position;
                    const posB = refB.current.position;

                    positions.push(posA.x, posA.y, posA.z, posB.x, posB.y, posB.z);

                    const config = CATEGORY_CONFIG[catNodes[i].type] || { color: '#34d399' };
                    const c = new THREE.Color(config.color);
                    colors.push(c.r, c.g, c.b, c.r * 0.3, c.g * 0.3, c.b * 0.3);
                }
            }
        });

        const geo = linesRef.current.geometry;
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geo.attributes.position.needsUpdate = true;
        geo.attributes.color.needsUpdate = true;
        geo.setDrawRange(0, positions.length / 3);
    });

    return (
        <lineSegments ref={linesRef} visible={isZeroG}>
            <bufferGeometry />
            <lineBasicMaterial vertexColors transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
        </lineSegments>
    );
});

// 🎛️ Mode Panel
const ModePanel = ({ isZeroG, onToggle }) => {
    return (
        <Html position={[-12, 3, 0]} transform distanceFactor={15}>
            <div className="w-[200px] bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-4 text-white">
                <div className="text-xs font-mono text-emerald-400 mb-3 tracking-widest">SYSTEM_MODE</div>

                <button
                    onClick={onToggle}
                    className={`w-full py-2 px-3 rounded border text-sm font-bold tracking-wider transition-all ${isZeroG
                        ? 'bg-purple-600/30 border-purple-400 text-purple-300'
                        : 'bg-emerald-600/30 border-emerald-400 text-emerald-300'
                        }`}
                >
                    {isZeroG ? '🌌 CONSTELLATION' : '🌍 GROUNDED'}
                </button>

                <div className="mt-3 text-[10px] text-white/50 leading-relaxed">
                    {isZeroG
                        ? '무중력 상태: 기술들이 별자리처럼 자유롭게 부유하며 창의적 연결을 형성합니다.'
                        : '중력 상태: 기술들이 현실에 기반하여 안정적인 토대를 구축합니다.'}
                </div>
            </div>
        </Html>
    );
};

const Lab02Scene = () => {
    const config = useStore(state => state.lab02Config);
    const setConfig = useStore(state => state.setLab02Config);
    const nodeRefs = useRef({});
    const [selectedNode, setSelectedNode] = useState(null);
    const [isCinematicMode, setIsCinematicMode] = useState(false);

    const isZeroG = config.zeroG || false;

    const toggleMode = () => {
        setConfig({
            zeroG: !isZeroG,
            gravity: !isZeroG ? [0, 0, 0] : [0, -9.8, 0]
        });
    };

    const registerNode = (id, ref) => {
        nodeRefs.current[id] = ref;
    };

    // Calculate constellation positions
    const nodes = useMemo(() => {
        const categoryCount = {};
        return techStackNodes.map((node, i) => {
            const type = node.type;
            const cfg = CATEGORY_CONFIG[type] || CATEGORY_CONFIG.frontend;
            if (!categoryCount[type]) categoryCount[type] = 0;
            const idx = categoryCount[type]++;
            const angle = idx * 1.3;
            const radius = 1.2 + idx * 0.25;

            return {
                ...node,
                id: i,
                constellationPos: [
                    cfg.center[0] + Math.cos(angle) * radius,
                    cfg.center[1] + (Math.random() - 0.5),
                    cfg.center[2] + Math.sin(angle) * radius
                ]
            };
        });
    }, []);

    return (
        <group>
            <TechHUD selectedNode={selectedNode} onClose={() => setSelectedNode(null)} />

            {/* AI Chatbot Overlay - Renders in HTML layer */}
            <Html fullscreen style={{ pointerEvents: 'none', zIndex: 20 }}>
                <div className="w-full h-full pointer-events-none">
                    <div className="pointer-events-auto">
                        <AIChatTerminal onExpand={() => setIsCinematicMode(true)} />
                    </div>
                </div>
            </Html>

            {/* 시네마틱 홀로그램 모드 */}
            {isCinematicMode && (
                <Html fullscreen style={{ pointerEvents: 'none', zIndex: 100 }}>
                    <div className="pointer-events-auto">
                        <CinematicHologramChat onClose={() => setIsCinematicMode(false)} />
                    </div>
                </Html>
            )}

            {/* Dynamic atmosphere based on mode */}
            <color attach="background" args={[isZeroG ? '#050510' : '#0a0f0a']} />
            <fogExp2 attach="fog" args={[isZeroG ? '#0a0a20' : '#0a1a0a', 0.03]} />
            <Environment preset={isZeroG ? "night" : "forest"} blur={0.9} />

            <ambientLight intensity={0.4} />
            <pointLight position={[0, 10, 0]} intensity={1} color={isZeroG ? "#a78bfa" : "#6ee7b7"} />

            {/* Title */}
            <group position={[0, 10, -10]}>
                <Html transform distanceFactor={12} center style={{ pointerEvents: 'none' }}>
                    <div className="text-center">
                        <h1 className="text-4xl font-black uppercase tracking-[0.25em]"
                            style={{ color: isZeroG ? '#a78bfa' : '#6ee7b7', textShadow: `0 0 30px ${isZeroG ? '#7c3aed' : '#10b981'}` }}>
                            {isZeroG ? 'TECH CONSTELLATION' : 'ENGINEERING FOUNDATION'}
                        </h1>
                        <p className="text-sm text-white/40 mt-1 tracking-widest">
                            {isZeroG ? 'Creative connections in zero gravity' : 'Grounded skills built on solid foundation'}
                        </p>
                    </div>
                </Html>
            </group>

            <ModePanel isZeroG={isZeroG} onToggle={toggleMode} />

            <Physics gravity={config.gravity || [0, -9.8, 0]} iterations={15}>
                <Floor />
                {nodes.map((node) => (
                    <HybridNode
                        key={node.id}
                        node={node}
                        constellationPos={node.constellationPos}
                        isZeroG={isZeroG}
                        onNodeClick={setSelectedNode}
                        registerNode={registerNode}
                    />
                ))}
            </Physics>

            <ConstellationLines nodeRefs={nodeRefs} nodes={nodes} isZeroG={isZeroG} />

            <OrbitControls enablePan={false} enableZoom={true} minDistance={8} maxDistance={40}
                autoRotate={isZeroG} autoRotateSpeed={0.2} />

            <Sparkles count={isZeroG ? 400 : 150} scale={35} size={isZeroG ? 2 : 1} speed={0.3}
                opacity={0.4} color={isZeroG ? "#c4b5fd" : "#6ee7b7"} />
        </group>
    );
};

export default Lab02Scene;
