import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../hooks/useStore';
import * as THREE from 'three';

const STAR_COUNT = 600; // Reduced density for reduced visual clutter

export default function HyperspaceTunnel() {
    const meshRef = useRef();
    const isWarping = useStore((state) => state.isWarping);
    const speedRef = useRef(0.2); // Base cruising speed

    // 1. Setup Instanced Attributes (Positions & Colors)
    const { positions, randoms } = useMemo(() => {
        const pos = new Float32Array(STAR_COUNT * 3);
        const rnd = new Float32Array(STAR_COUNT);

        for (let i = 0; i < STAR_COUNT; i++) {
            // Tunnel shape: Random angle, random radius
            const angle = Math.random() * Math.PI * 2;
            const radius = 15 + Math.random() * 40; // Slightly wider tunnel

            pos[i * 3] = Math.cos(angle) * radius;     // x
            pos[i * 3 + 1] = Math.sin(angle) * radius; // y
            pos[i * 3 + 2] = (Math.random() - 0.5) * 400; // z (depth)

            rnd[i] = Math.random();
        }
        return { positions: pos, randoms: rnd };
    }, []);

    const dummyRef = useRef(new THREE.Object3D());

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // --- Logic: Acceleration / Deceleration ---
        // Slower, softer warp (30.0 instead of 80.0)
        const targetSpeed = isWarping ? 30.0 : 0.5;

        // Smooth interpolation (Lerp)
        speedRef.current = THREE.MathUtils.lerp(speedRef.current, targetSpeed, delta * 2.0);

        // Move stars logic (JS CPU side for maximum compatibility)
        const speed = speedRef.current;

        for (let i = 0; i < STAR_COUNT; i++) {
            let z = positions[i * 3 + 2];

            // Move fast
            z += speed * (isWarping ? 50 : 10) * delta;

            // Reset if passed camera
            if (z > 200) z -= 400;

            positions[i * 3 + 2] = z;

            dummyRef.current.position.set(
                positions[i * 3],
                positions[i * 3 + 1],
                z
            );

            // Stretch based on speed (Warp Effect)
            // Less stretch (15.0 instead of 40.0)
            const stretch = 1.0 + (isWarping ? 15.0 : 0.0);
            dummyRef.current.scale.set(0.2, 0.2, stretch); // Thin streaks
            dummyRef.current.rotation.x = 0; // Cylinder orientation

            dummyRef.current.updateMatrix();
            meshRef.current.setMatrixAt(i, dummyRef.current.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, STAR_COUNT]}>
            {/* Very thin cylinder for elegant streaks */}
            <cylinderGeometry args={[0.1, 0.1, 1, 4]} />
            <meshBasicMaterial
                color={isWarping ? "#a5f3fc" : "#4fd1c5"} // Softer Cyan/White
                transparent
                opacity={0.3} // Much more transparent (ghostly)
                blending={THREE.AdditiveBlending}
                depthWrite={false} // Prevent z-fighting
            />
        </instancedMesh>
    );
}
