import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../hooks/useStore';
import * as THREE from 'three';

const STAR_COUNT = 800;

export default function HyperspaceTunnel() {
    const meshRef = useRef();
    const isWarping = useStore((state) => state.isWarping);
    const speedRef = useRef(0.2);
    const warpTimeRef = useRef(0);

    // Star positions - start in front of camera, fly backwards past it
    const { positions } = useMemo(() => {
        const pos = new Float32Array(STAR_COUNT * 3);

        for (let i = 0; i < STAR_COUNT; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 3 + Math.random() * 40; // Tunnel radius

            pos[i * 3] = Math.cos(angle) * radius;
            pos[i * 3 + 1] = Math.sin(angle) * radius;
            pos[i * 3 + 2] = Math.random() * -300; // Start in front (negative Z)
        }
        return { positions: pos };
    }, []);

    const dummyRef = useRef(new THREE.Object3D());

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Warp time tracking
        if (isWarping) {
            warpTimeRef.current += delta;
        } else {
            warpTimeRef.current = 0;
        }

        // Speed acceleration
        const targetSpeed = isWarping ? 150.0 : 0.5;
        speedRef.current = THREE.MathUtils.lerp(speedRef.current, targetSpeed, delta * 3.0);

        const speed = speedRef.current;
        const stretchProgress = Math.min(warpTimeRef.current / 0.6, 1.0);

        for (let i = 0; i < STAR_COUNT; i++) {
            let z = positions[i * 3 + 2];

            // Stars fly BACKWARDS past camera (z increases)
            z += speed * delta * 2;

            // Reset when past camera
            if (z > 100) z = -300 - Math.random() * 100;

            positions[i * 3 + 2] = z;

            dummyRef.current.position.set(
                positions[i * 3],
                positions[i * 3 + 1],
                z
            );

            // Stretch in Z direction (line effect)
            const stretch = 1.0 + (isWarping ? 30.0 * stretchProgress : 0.0);
            dummyRef.current.scale.set(0.08, 0.08, stretch);
            dummyRef.current.rotation.x = Math.PI / 2;

            dummyRef.current.updateMatrix();
            meshRef.current.setMatrixAt(i, dummyRef.current.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, STAR_COUNT]}>
            <cylinderGeometry args={[0.04, 0.04, 1, 4]} />
            <meshBasicMaterial
                color={"#a5f3fc"}
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </instancedMesh>
    );
}
