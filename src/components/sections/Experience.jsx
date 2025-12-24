import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import gsap from 'gsap'; // Added GSAP
import CinematicEffects from '../effects/CinematicEffects';
import SceneManager from '../core/SceneManager';
import { useStore } from '../../hooks/useStore';
import WarpController from '../core/WarpController'; // Restored for camera animation
import HyperspaceTunnel from '../effects/HyperspaceTunnel';
import * as THREE from 'three';

import { useFPSMonitor } from '../../hooks/useFPSMonitor';

const CameraHandler = () => {
    const currentScene = useStore((state) => state.currentScene);
    const prevScene = useStore((state) => state.prevScene);
    const isWarping = useStore((state) => state.isWarping);
    const missionModalData = useStore((state) => state.missionModalData);
    const { camera, gl, controls } = useThree();

    const focusTarget = useRef(new THREE.Vector3());
    const isFocused = useRef(false);

    // Auto-Performance Tuning
    useFPSMonitor(35, 4000);

    // 1. Initial Scene Transitions
    useEffect(() => {
        if (isWarping) return;

        gsap.killTweensOf(camera.position);

        if (currentScene === 'hub') {
            const defaultPos = new THREE.Vector3(0, 50, 60);
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
                    x: defaultPos.x, y: defaultPos.y, z: defaultPos.z,
                    duration: 3.5, ease: "power2.out",
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
        }

        if (controls) {
            controls.target.set(0, 0, 0);
            controls.update();
        }

        if (currentScene !== 'hub' || !prevScene) {
            camera.lookAt(0, 0, 0);
        }
        camera.updateProjectionMatrix();
    }, [currentScene, prevScene, camera, gl, controls, isWarping]);

    // 2. Cinematic Planetary Focus (Phase 2)
    useEffect(() => {
        if (currentScene !== 'hub' || isWarping) return;

        if (missionModalData) {
            isFocused.current = true;

            // Get Planet Position
            const planetPos = new THREE.Vector3(...missionModalData.warpPos);

            // Calculate a point "outside" the planet looking in
            // Use a fixed offset for consistent zoom scale across all planets
            const direction = planetPos.clone().normalize();
            const zoomDist = 15; // Fixed distance from planet center
            const cameraTargetPos = planetPos.clone().add(direction.multiplyScalar(zoomDist)).add(new THREE.Vector3(0, 5, 0));

            // Kill any ongoing animations to prevent jitter
            gsap.killTweensOf(camera.position);
            if (controls) gsap.killTweensOf(controls.target);

            // Animate camera to new position
            gsap.to(camera.position, {
                x: cameraTargetPos.x,
                y: cameraTargetPos.y,
                z: cameraTargetPos.z,
                duration: 1.5,
                ease: "expo.out",
                onUpdate: () => {
                    camera.lookAt(planetPos);
                }
            });

            // Animate controls focus
            if (controls) {
                controls.enabled = false;
                gsap.to(controls.target, {
                    x: planetPos.x,
                    y: planetPos.y,
                    z: planetPos.z,
                    duration: 1.5,
                    ease: "expo.out"
                });
            }
        } else {
            if (isFocused.current) {
                isFocused.current = false;

                gsap.killTweensOf(camera.position);
                if (controls) {
                    gsap.killTweensOf(controls.target);
                    controls.enabled = true;
                    gsap.to(controls.target, { x: 0, y: 0, z: 0, duration: 1.5, ease: "power2.inOut" });
                }

                gsap.to(camera.position, {
                    x: 0, y: 50, z: 60,
                    duration: 2,
                    ease: "power2.inOut",
                    onUpdate: () => {
                        camera.lookAt(0, 0, 0);
                    }
                });
            }
        }
    }, [missionModalData, currentScene, isWarping, camera, controls]);

    // 3. Frame-by-frame focus tracking
    useFrame(() => {
        if (isFocused.current && missionModalData && !isWarping) {
            // Ensure camera stays locked during focus
            const planetPos = new THREE.Vector3(...missionModalData.warpPos);
            camera.lookAt(planetPos);
        }
    });

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
