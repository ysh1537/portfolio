import { Canvas, useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useEffect } from 'react';
import gsap from 'gsap'; // Added GSAP
import CinematicEffects from '../effects/CinematicEffects';
import SceneManager from '../core/SceneManager';
import { useStore } from '../../hooks/useStore';
import WarpController from '../core/WarpController'; // Restored for camera animation
import HyperspaceTunnel from '../effects/HyperspaceTunnel';
import * as THREE from 'three';

const CameraHandler = () => {
    const currentScene = useStore((state) => state.currentScene);
    const prevScene = useStore((state) => state.prevScene);
    const isWarping = useStore((state) => state.isWarping); // Add this
    const { camera, gl, controls } = useThree();

    useEffect(() => {
        // CRITICAL: Do NOT reset camera/controls while warping!
        // WarpController is actively animating them.
        if (isWarping) {
            console.log("[CameraHandler] Warping active, skipping reset.");
            return;
        }

        // Kill existing tweens on camera to prevent conflicts
        gsap.killTweensOf(camera.position);

        if (currentScene === 'hub') {
            const defaultPos = new THREE.Vector3(0, 50, 60); // Zoomed out to see Black Box at [28, 10, -20]

            const spawnPoints = {
                'lab01': new THREE.Vector3(4, 2, 10),
                'lab02': new THREE.Vector3(6, 3, 13),
                'lab03': new THREE.Vector3(8, 4, 16),
                'lab04': new THREE.Vector3(10, 5, 19)
            };

            if (prevScene && spawnPoints[prevScene]) {
                camera.position.copy(spawnPoints[prevScene]);
                camera.lookAt(0, 0, 0);

                gsap.to(camera.position, {
                    x: defaultPos.x,
                    y: defaultPos.y,
                    z: defaultPos.z,
                    duration: 3.5,
                    ease: "power2.out",
                    onUpdate: () => camera.lookAt(0, 0, 0)
                });
            } else {
                camera.position.copy(defaultPos);
            }

        } else if (currentScene === 'boot') {
            camera.position.set(0, 0, 12);
        } else if (currentScene.startsWith('lab')) {
            camera.position.set(0, 0, 14);
        } else if (currentScene === 'contact') {
            camera.position.set(0, 0, 12);
        } else {
            camera.position.set(0, 0, 5);
        }

        // Reset controls target ONLY when NOT warping
        if (controls) {
            controls.target.set(0, 0, 0);
            controls.update();
        }

        if (currentScene !== 'hub' || !prevScene) {
            camera.lookAt(0, 0, 0);
        }

        camera.updateProjectionMatrix();

    }, [currentScene, prevScene, camera, gl, controls, isWarping]); // Add isWarping to deps

    return null;
};

const Experience = () => {
    const currentScene = useStore((state) => state.currentScene);
    const isWarping = useStore((state) => state.isWarping); // Add this for OrbitControls

    return (
        <div className="w-full h-screen fixed inset-0 z-0 bg-black">
            <Canvas
                dpr={[1, 2]} // Optimize for HiDPI screens (max 2x)
                gl={{
                    antialias: true, // Enable AA for smoother edges
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: true
                }}
                // Lab 씬 UI 패널 클릭 이벤트 정상화
                style={{ touchAction: 'none' }}
                onPointerMissed={() => { }} // 빈 캔버스 클릭 시 이벤트 전파 방지
            >
                <CameraHandler />
                <PerspectiveCamera makeDefault position={[0, 0, 18]} />
                {currentScene === 'hub' && !isWarping && (
                    <OrbitControls
                        makeDefault
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI - 0.1}
                        minDistance={2}
                        maxDistance={100}
                        enablePan={false}
                        enableDamping={true}
                        dampingFactor={0.08}
                        rotateSpeed={1.2}
                    />
                )}

                <color attach="background" args={['#000000']} />
                <ambientLight intensity={1} />
                <SceneManager />

                {/* Reset Fog for non-Hub scenes just in case - Disabled to avoid conflict with Lab fogs */}
                {/* <fog attach="fog" args={['#000000', 50, 200]} /> */}

                {/* Phase 38: Premium Warp - 카메라 이동 + Radial Blur (CinematicEffects) */}
                {isWarping && <WarpController />}

                <CinematicEffects />
            </Canvas>
        </div>
    );
};

export default Experience;
