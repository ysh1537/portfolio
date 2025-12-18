import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const MatrixRain = ({ opacity = 0.2 }) => {
    const mesh = useRef();
    const { viewport } = useThree();

    // Create shader material with stable uniforms
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color('#00ff41') },
                uOpacity: { value: opacity },
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
                uniform float uOpacity;

                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }

                void main() {
                    vec2 uv = vUv;
                    
                    // Grid columns
                    float columns = 60.0;
                    vec2 ipos = floor(uv * columns);
                    
                    // Rain speed varying per column
                    float speed = 1.0 + random(vec2(ipos.x, 1.33)) * 2.0;
                    float y = mod(uv.y + uTime * speed * 0.1, 1.0);

                    // Matrix character flickering / trail
                    float strength = 1.0 - step(0.1, random(vec2(ipos.x, floor(y * 40.0)))); 
                    strength *= (1.0 - fract(y * 10.0)); // Fade trail
                    
                    // Leading bright head
                    float head = 1.0 - step(0.005, y); 
                    
                    vec3 color = uColor * (strength + head * 1.5);
                    gl_FragColor = vec4(color, (strength + head) * uOpacity);
                }
            `,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide
        });
    }, [opacity]); // Re-create if base opacity changes

    useFrame((state) => {
        if (mesh.current && mesh.current.material && mesh.current.material.uniforms) {
            const u = mesh.current.material.uniforms;
            if (u.uTime) u.uTime.value = state.clock.getElapsedTime();
            if (u.uOpacity) u.uOpacity.value = opacity;
        }
    });

    return (
        <mesh ref={mesh} scale={[viewport.width * 2, viewport.height * 2, 1]} position={[0, 0, -8]}>
            <planeGeometry args={[1, 1]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
};

export default MatrixRain;
