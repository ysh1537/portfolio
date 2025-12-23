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

    useEffect(() => {
        if (isWarping && warpTargetPosition) {
            // Disable orbit controls during warp
            if (controls) controls.enabled = false;

            const targetPos = new THREE.Vector3(...warpTargetPosition);
            targetRef.current.copy(targetPos);

            // Kill any existing animation
            if (timelineRef.current) timelineRef.current.kill();

            // Create smooth camera animation
            timelineRef.current = gsap.timeline();

            // Phase 1: Quick approach to planet (1.5s)
            timelineRef.current.to(camera.position, {
                x: targetPos.x * 0.15, // Very close to planet center
                y: targetPos.y * 0.15,
                z: targetPos.z * 0.15,
                duration: 1.5,
                ease: "power3.in",
                onUpdate: () => {
                    camera.lookAt(targetRef.current);
                }
            });

            return () => {
                if (timelineRef.current) timelineRef.current.kill();
                if (controls) controls.enabled = true;
            };
        }
    }, [isWarping, camera, warpTargetPosition, controls]);

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
