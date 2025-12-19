import { useEffect } from 'react';
import { useStore } from '../../hooks/useStore';
import QuantumWarp from '../boot/QuantumWarp';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';

const WarpController = () => {
    const isWarping = useStore(state => state.isWarping);
    const finishWarp = useStore(state => state.finishWarp);
    const { camera } = useThree();

    useEffect(() => {
        if (isWarping) {
            // Camera Zoom & Shake Effect before transition
            gsap.to(camera.position, {
                z: 0, // Zoom into the center (Black Hole)
                duration: 2.0,
                ease: "power3.in",
                onComplete: () => {
                    finishWarp();
                }
            });

            // Optional: Add camera shake here using GSAP or other methods if needed
        }
    }, [isWarping, camera, finishWarp]);

    // Only render the visual effect when warping
    if (!isWarping) return null;

    return (
        <group>
            {/* Render overlay on top */}
            <QuantumWarp />
            <ambientLight intensity={5} />
        </group>
    );
};

export default WarpController;
