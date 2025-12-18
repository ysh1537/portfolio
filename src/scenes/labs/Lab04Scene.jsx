import { useRef, useMemo } from 'react';
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
                uColor: { value: new THREE.Color('#00ff41') },
            },
            vertexShader: MatrixRainMaterial.vertexShader,
            fragmentShader: MatrixRainMaterial.fragmentShader,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide
        });
    }, []);

    useFrame((state) => {
        // mesh.current.material을 통해 uniforms에 안전하게 접근
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

const Lab04Scene = () => {
    const setScene = useStore(state => state.setScene);

    return (
        <group>
            {/* Background: Digital Rain */}
            <MatrixEffect />

            {/* Central Terminal Interface */}
            <group position={[0, 0, 0]}>
                <mesh position={[0, 0, -1]}>
                    <planeGeometry args={[6, 4]} />
                    <meshBasicMaterial color="#000000" transparent opacity={0.8} />
                    <lineSegments>
                        <edgesGeometry args={[new THREE.PlaneGeometry(6, 4)]} />
                        <meshBasicMaterial color="#00ff41" />
                    </lineSegments>
                </mesh>

                {/* Header */}
                <Billboard>
                    <Text position={[0, 1.5, 0]} fontSize={0.3} color="#00ff41">
                        LAB 04: DEBUG_ROOM
                    </Text>
                </Billboard>

                {/* Content Area - Simulated Logs */}
                <Html position={[-2.5, 1, 0]} transform scale={0.5} style={{ width: '800px', height: '400px', overflow: 'hidden' }}>
                    <div className="font-mono text-green-500 text-lg leading-relaxed">
                        <p>&gt; [SYSTEM] INITIALIZING DEBUG PROTOCOLS...</p>
                        <p>&gt; [KERNEL] LOADING MODULE: MATRIX_RENDERER_V2</p>
                        <p>&gt; [WARNING] UNSTABLE REALITY DETECTED</p>
                        <p>&gt; [INFO] MEMORY USAGE: 14GB / 16GB</p>
                        <p>&gt; [INFO] GPU TEMPERATURE: 72°C</p>
                        <p>&gt; [NETWORK] CONNECTED TO: heoyesol.kr</p>
                        <p className="animate-pulse">&gt; _WAITING FOR INPUT...</p>
                    </div>
                </Html>
            </group>

            {/* Floating Wireframe Objects */}
            <Float speed={4} rotationIntensity={1} floatIntensity={1}>
                <mesh position={[4, 0, 0]} rotation={[0.5, 0.5, 0]}>
                    <icosahedronGeometry args={[1, 0]} />
                    <meshBasicMaterial color="#00ff41" wireframe transparent opacity={0.3} />
                </mesh>
            </Float>
            <Float speed={3} rotationIntensity={1} floatIntensity={1}>
                <mesh position={[-4, -1, 0]} rotation={[0.2, 0, 0.5]}>
                    <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />
                    <meshBasicMaterial color="#00ff41" wireframe transparent opacity={0.3} />
                </mesh>
            </Float>

            {/* Cinematic FX */}
            <Sparkles count={100} scale={10} size={2} speed={0.3} opacity={0.6} color="#00ff41" />

            {/* Return Button */}
            <group position={[0, -2.5, 0]} onClick={() => setScene('hub')}>
                <Text fontSize={0.2} color="white" anchorX="center">
                    [ EXIT DEBUG MODE ]
                </Text>
            </group>
        </group>
    );
};

export default Lab04Scene;
