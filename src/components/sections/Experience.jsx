import { Canvas, useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useEffect } from 'react';
import CinematicEffects from '../effects/CinematicEffects';
import SceneManager from '../core/SceneManager';
import { useStore } from '../../hooks/useStore';

const CameraHandler = () => {
    const currentScene = useStore((state) => state.currentScene);
    const { camera, gl, controls } = useThree();

    // Simple approach: Reset camera manually and let next frame handle it.
    useEffect(() => {
        if (currentScene === 'hub') {
            camera.position.set(0, 0, 18);
        } else if (currentScene === 'boot') {
            camera.position.set(0, 0, 12); // Wide shot for boot logs
        } else if (currentScene.startsWith('lab')) {
            camera.position.set(0, 0, 14);
        } else if (currentScene === 'contact') {
            camera.position.set(0, 0, 12);
        } else {
            camera.position.set(0, 0, 5);
        }

        // Reset controls target to center to prevent "snapping" to old look-at point
        if (controls) {
            controls.target.set(0, 0, 0);
            controls.update();
        }

        camera.lookAt(0, 0, 0); // Force look at center
        camera.updateProjectionMatrix();
    }, [currentScene, camera, gl, controls]);

    return null;
};

const Experience = () => {
    const currentScene = useStore((state) => state.currentScene);

    return (
        <div className="w-full h-screen fixed inset-0 z-0 bg-black">
            <Canvas
                dpr={[1, 1]}
                gl={{
                    antialias: false,
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: true
                }}
            >
                <CameraHandler />
                <PerspectiveCamera makeDefault position={[0, 0, 18]} />
                <OrbitControls
                    makeDefault
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI - 0.1}
                    minDistance={2}
                    maxDistance={30}
                    enablePan={false}
                    enableDamping={true}
                    dampingFactor={0.05}
                    rotateSpeed={0.5}
                    enabled={currentScene !== 'profile' && currentScene !== 'contact'}
                />

                <color attach="background" args={['#000000']} />
                <ambientLight intensity={1} />
                <SceneManager />

                {/* Reset Fog for non-Hub scenes just in case */}
                <fog attach="fog" args={['#000000', 50, 200]} />

                <CinematicEffects />
            </Canvas>
        </div>
    );
};

export default Experience;
