/**
 * WarpController.jsx
 * Phase 38: 프리미엄 워프 전환 - 행성 중심으로 정확히 카메라 이동
 */
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useStore } from '../../hooks/useStore';
import gsap from 'gsap';
import * as THREE from 'three';
import { getPlanetWorldPosition } from '../../utils/planetRegistry';

const WarpController = () => {
    const { camera, controls } = useThree();
    const isWarping = useStore((state) => state.isWarping);
    const warpTargetPosition = useStore((state) => state.warpTargetPosition);
    const warpTarget = useStore((state) => state.warpTarget);

    const targetRef = useRef(new THREE.Vector3());
    const timelineRef = useRef(null);

    const currentScene = useStore((state) => state.currentScene); // Need to track scene change

    useEffect(() => {
        if (!isWarping) return;

        // Phase 1: Departure (Hub -> Planet)
        if (warpTargetPosition && currentScene === 'hub') {
            // ... existing departure logic ...
            if (controls) controls.enabled = false;

            const targetPos = new THREE.Vector3(...warpTargetPosition);
            targetRef.current.copy(targetPos);

            if (timelineRef.current) timelineRef.current.kill();
            timelineRef.current = gsap.timeline();

            timelineRef.current.to(camera.position, {
                x: targetPos.x * 0.15,
                y: targetPos.y * 0.15,
                z: targetPos.z * 0.15,
                duration: 1.5,
                ease: "power3.in",
                onUpdate: () => {
                    camera.lookAt(targetRef.current);
                }
            });
        }
        // Phase 2: Arrival (Planet -> Lab)
        else if (currentScene !== 'hub') {
            // Reset Camera for new scene entry
            if (timelineRef.current) timelineRef.current.kill();

            // "Pop" out of the warp
            // Start very close (Zoomed in) and pull back
            camera.position.set(0, 0, 2);
            camera.lookAt(0, 0, 0);

            timelineRef.current = gsap.timeline();
            timelineRef.current.to(camera.position, {
                z: 14, // Standard Lab Distance
                duration: 2.0, // Deceleration
                ease: "power2.out"
            });
        }

        return () => {
            // Cleanup only if warping is fully done (handled by store)
        };
    }, [isWarping, camera, warpTargetPosition, currentScene, controls]);

    // Continuously look at target during warp
    useFrame(() => {
        if (isWarping && warpTarget) {
            const dynamicPos = getPlanetWorldPosition(warpTarget, targetRef.current);
            if (dynamicPos) {
                camera.lookAt(targetRef.current);
            }
        }
    }, 100);

    return null;
};

export default WarpController;
