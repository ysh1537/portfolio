import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Html, PerspectiveCamera, OrbitControls, Float, Billboard, Sparkles } from '@react-three/drei';
import { useStore } from '../../hooks/useStore';
import * as THREE from 'three';

// --- Matrix Rain Shader Material ---
const MatrixRainMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#00ff41') },
        uSpeed: { value: 1.0 },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColor;

        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
            vec2 uv = vUv;
            
            // Grid columns
            float columns = 50.0;
            vec2 ipos = floor(uv * columns);
            vec2 fpos = fract(uv * columns);

            // Rain speed varying per column
            float speed = 2.0 + random(vec2(ipos.x, 0.0)) * 3.0;
            float y = mod(uv.y + uTime * speed * 0.2, 1.0);

            // Trail effect
            float strength = 1.0 - step(0.1, random(vec2(ipos.x, floor(y * 20.0)))); // Random chars
            strength *= (1.0 - fract(y * 10.0)); // Fade trail
            
            // Leading bright head
            float head = 1.0 - step(0.01, y); 
            
            vec3 color = uColor * strength;
            color += vec3(0.8, 1.0, 0.8) * head; // White-ish head

            gl_FragColor = vec4(color, strength);
        }
    `
};

const MatrixEffect = () => {
    const mesh = useRef();
    const { viewport } = useThree();

    // Create shader material instance
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color('#ef4444') }, // Red
            },
            vertexShader: MatrixRainMaterial.vertexShader,
            fragmentShader: MatrixRainMaterial.fragmentShader,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide
        });
    }, []);

    useFrame((state) => {
        if (mesh.current && mesh.current.material && mesh.current.material.uniforms) {
            const uniforms = mesh.current.material.uniforms;
            if (uniforms.uTime) {
                uniforms.uTime.value = state.clock.getElapsedTime();
            }
        }
    });

    return (
        <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]} position={[0, 0, -5]}>
            <planeGeometry args={[1, 1]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
};

const GlitchText = ({ text, position, fontSize, color }) => {
    const group = useRef();

    useFrame(() => {
        if (!group.current) return;
        if (Math.random() > 0.95) {
            group.current.position.x = position[0] + (Math.random() - 0.5) * 0.1;
            group.current.position.y = position[1] + (Math.random() - 0.5) * 0.1;
        } else {
            group.current.position.set(...position);
        }
    });

    return (
        <group ref={group} position={position}>
            <Text position={[0.02, 0, 0]} fontSize={fontSize} color="cyan" opacity={0.5} anchorX="center">{text}</Text>
            <Text position={[-0.02, 0, 0]} fontSize={fontSize} color="red" opacity={0.5} anchorX="center">{text}</Text>
            <Text position={[0, 0, 0]} fontSize={fontSize} color={color} anchorX="center">{text}</Text>
        </group>
    );
};

// ... (Previous components)

const Lab04Scene = () => {
    const startWarp = useStore(state => state.startWarp);

    // Use state lazy initializer for stable random values
    const [randomLogs] = useState(() => {
        return Array.from({ length: 5 }).map(() =>
            `0x${Math.floor(Math.random() * 16777215).toString(16)} 0000 0000 ...`
        );
    });

    return (
        <group>
            {/* Background: Digital Rain (Red) */}
            <MatrixEffect />

            {/* Central Terminal Interface */}
            <group position={[0, 0, 0]}>
                <mesh position={[0, 0, -1]}>
                    <planeGeometry args={[6, 4]} />
                    <meshBasicMaterial color="#000000" transparent opacity={0.9} />
                    <lineSegments>
                        <edgesGeometry args={[new THREE.PlaneGeometry(6, 4)]} />
                        <meshBasicMaterial color="#ef4444" />
                    </lineSegments>
                </mesh>

                {/* Header with Glitch Effect */}
                <Billboard>
                    <GlitchText text="THE GLITCH [FATAL ERROR]" position={[0, 1.5, 0]} fontSize={0.3} color="#ef4444" />
                </Billboard>
                <Billboard>
                    <Text position={[0, 1.1, 0]} fontSize={0.12} color="#ef4444" anchorX="center">
                        UNSTABLE SECTOR - CAUTION
                    </Text>
                </Billboard>

                {/* Content Area - Simulated Logs */}
                <Html position={[-2.5, 1, 0]} transform scale={0.5} style={{ width: '800px', height: '400px', overflow: 'hidden', pointerEvents: 'none' }}>
                    <div className="font-mono text-red-500 text-lg leading-relaxed shadow-red-500/20 drop-shadow-lg">
                        <p>&gt; [SYSTEM] CRITICAL FAILURE IN SECTOR 04</p>
                        <p>&gt; [KERNEL] REALITY INTEGRITY: 12% </p>
                        <p>&gt; [WARNING] DATA CORRUPTION DETECTED</p>
                        <p>&gt; [ERROR] 0x8291F - SEGMENTATION FAULT</p>
                        <p>&gt; [INFO] ATTEMPTING CONTAINMENT...</p>
                        <p>&gt; [NETWORK] CONNECTION UNSTABLE</p>
                        <p className="animate-pulse font-bold mt-4">&gt; _SYSTEM BREACH IMMINENT_</p>
                        <p className="opacity-50 mt-2">&gt; DUMPING MEMORY STACK...</p>
                        {randomLogs.map((log, i) => (
                            <p key={i} className="text-xs opacity-70">
                                {log}
                            </p>
                        ))}
                    </div>
                </Html>
            </group>


            {/* Floating Wireframe Objects */}
            <Float speed={5} rotationIntensity={2} floatIntensity={1}>
                <mesh position={[4, 0, 0]} rotation={[0.5, 0.5, 0]}>
                    <icosahedronGeometry args={[1, 0]} />
                    <meshBasicMaterial color="#ef4444" wireframe transparent opacity={0.5} />
                </mesh>
            </Float>
            <Float speed={3} rotationIntensity={3} floatIntensity={1}>
                <mesh position={[-4, -1, 0]} rotation={[0.2, 0, 0.5]}>
                    <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />
                    <meshBasicMaterial color="#ef4444" wireframe transparent opacity={0.5} />
                </mesh>
            </Float>

            {/* Cinematic FX */}
            <Sparkles count={50} scale={10} size={5} speed={0.8} opacity={0.8} color="#ef4444" />

            {/* Cinematic FX */}
            <Sparkles count={50} scale={10} size={5} speed={0.8} opacity={0.8} color="#ef4444" />

            {/* Return Button moved to LabUI (Overlay) */}
        </group>
    );
};

export default Lab04Scene;
