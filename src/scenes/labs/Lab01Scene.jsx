import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../hooks/useStore';

const PrismShells = ({ config }) => {
    // Refs for independent rotation
    const innerRef = useRef();
    const midRef = useRef();
    const outerRef = useRef();

    useFrame((state, delta) => {
        // Significantly reduced speed for comfort
        const speed = 0.05 + config.speed * 0.5;

        // Use delta for smooth acceleration without jumping
        if (innerRef.current) {
            innerRef.current.rotation.x += delta * speed * 0.5;
            innerRef.current.rotation.y += delta * speed * 0.3;
        }
        if (midRef.current) {
            midRef.current.rotation.x -= delta * speed * 0.3;
            midRef.current.rotation.z += delta * speed * 0.2;
        }
        if (outerRef.current) {
            outerRef.current.rotation.y += delta * speed * 0.1;
            outerRef.current.rotation.z -= delta * speed * 0.1;
        }
    });

    // Expansion factors based on Dispersion (Exploded View)
    // Increased base spacing to prevent "overlapping/cluttered" look
    const innerScale = 2.8 + config.distort * 0.5;
    const midScale = 3.2 + config.distort * 1.5;
    const outerScale = 3.6 + config.distort * 3.0;

    // Opacity based on Dispersion (Reveal)
    // Reduced base opacity to prevent eye strain
    const shellOpacity = 0.05 + config.distort * 0.4;

    return (
        <group>
            {/* Layer 1: Tech Wireframe (Structural Echo) */}
            <mesh ref={innerRef} scale={innerScale}>
                <icosahedronGeometry args={[1, 0]} />
                <meshBasicMaterial
                    color={config.color}
                    wireframe
                    transparent
                    opacity={0.3}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Layer 2: Data Points (Vertices Echo) */}
            <points ref={midRef} scale={midScale}>
                <icosahedronGeometry args={[1, 2]} /> {/* Higher density for points */}
                <pointsMaterial
                    color="#ffffff"
                    size={0.08}
                    sizeAttenuation
                    transparent
                    opacity={shellOpacity}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Layer 3: Fresnel Ghost (Surface Echo) */}
            <mesh ref={outerRef} scale={outerScale}>
                <icosahedronGeometry args={[1, 0]} />
                <meshPhongMaterial
                    color={config.color}
                    transparent
                    opacity={shellOpacity * 0.2} // Very faint
                    shininess={100}
                    wireframe={false}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
};

const Lab01Scene = () => {
    const config = useStore(state => state.lab01Config);
    const meshRef = useRef();

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Main Core Rotation - Linked to Speed now (Slowed down)
            const coreSpeed = 0.05 + config.speed * 0.4;

            // Rotates in sync (or harmony) with the shells
            meshRef.current.rotation.x += delta * coreSpeed * 0.5;
            meshRef.current.rotation.y += delta * coreSpeed * 1.0; // Primary spin axis
        }
    });

    return (
        <group>
            {/* Deep Technical Background */}
            <color attach="background" args={['#010204']} />
            <Environment preset="city" />

            {/* Main Crystal - The Core */}
            <Float
                speed={2}
                rotationIntensity={0.1}
                floatIntensity={0.1}
            >
                <mesh ref={meshRef} position={[0, 0, 0]} scale={2.5}>
                    <icosahedronGeometry args={[1, 0]} />
                    <MeshTransmissionMaterial
                        backside
                        samples={16}
                        thickness={2.0}
                        chromaticAberration={0.5 + config.distort * 1.5}
                        anisotropy={20}
                        distortion={0.4}
                        distortionScale={0.5}
                        temporalDistortion={config.speed * 0.5}
                        iridescence={1}
                        iridescenceIOR={1}
                        roughness={0}
                        ior={1.5}
                        color={config.color}
                        transmission={1}
                    />
                </mesh>
            </Float>

            {/* Holographic Shells - The Echoes */}
            <PrismShells config={config} />

            {/* Minimal Grid */}
            <gridHelper args={[30, 30, 0x1f2937, 0x000000]} position={[0, -4, 0]} />
        </group>
    );
};

export default Lab01Scene;
