import { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useStore } from '../../hooks/useStore';
import gsap from 'gsap';
import * as THREE from 'three';
import QuantumWarp from '../boot/QuantumWarp';
import { getPlanetWorldPosition } from '../../utils/planetRegistry';

const WarpController = () => {
    const { camera, controls } = useThree();
    const isWarping = useStore((state) => state.isWarping);
    const warpTargetPosition = useStore((state) => state.warpTargetPosition);
    const warpTarget = useStore((state) => state.warpTarget);
    const finishWarp = useStore((state) => state.finishWarp);
    const setWarping = useStore((state) => state.setWarping); // Assuming this might be needed, but mostly startWarp handles it. Checking store, it uses startWarp.
    // Store only has startWarp/finishWarp. 

    // We need playWarp sound
    // import useSoundFX but can't use hook inside loop, need to use it in event or effect.
    // Actually we handle sound in the effect.

    // Re-implementing sound here or relying on previously imported context? 
    // The previous code used useSoundFX inside the component.

    // Let's import useSoundFX
    // Wait, useSoundFX is a hook.

    const [showVisuals, setShowVisuals] = useState(false);

    // Target position ref to avoid closure staleness in useFrame
    const targetRef = useRef(new THREE.Vector3());

    useEffect(() => {
        if (isWarping && warpTargetPosition) {
            // Disable controls
            if (controls) controls.enabled = false;

            const targetPos = new THREE.Vector3(...warpTargetPosition);

            // Animation
            const tl = gsap.timeline({
                onComplete: () => {
                    finishWarp();
                    if (controls) controls.enabled = true;
                }
            });

            // Camera movement
            tl.to(camera.position, {
                x: targetPos.x * 0.8, // Stop slightly before the planet
                y: targetPos.y * 0.8, // Adjust to be slightly above or aligned
                z: targetPos.z * 0.8,
                duration: 2.5,
                ease: "power2.in",
                onUpdate: () => {
                    // Update ref is not strictly needed for gsap but for useFrame if we used it.
                    // But here we can simply lookAt in the useFrame or update.
                    // Let's rely on useFrame for continuous lookAt.
                    targetRef.current.copy(targetPos);
                }
            });

            if (!showVisuals) setShowVisuals(true);

            return () => {
                tl.kill();
            };
        } else {
            if (showVisuals) setShowVisuals(false);
            if (controls && !isWarping) controls.enabled = true;
        }
    }, [isWarping, camera, finishWarp, warpTargetPosition, controls, showVisuals]);

    // Force camera to look at target during warp
    useFrame(() => {
        if (isWarping && warpTarget) {
            // Dynamically get planet position (Pass targetRef.current to avoid undefined crash)
            const dynamicPos = getPlanetWorldPosition(warpTarget, targetRef.current);

            // If dynamicPos returns valid vector (which is targetRef.current), look at it
            if (dynamicPos) {
                camera.lookAt(targetRef.current);
            }
        }
    }, 100); // High priority

    return (
        <>
            {showVisuals && <QuantumWarp />}
        </>
    );
};

export default WarpController;
