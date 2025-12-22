/**
 * BlackBoxSatellite.jsx
 * Phase 35: The Black Box - Hub Scene에 표시되는 3D 데이터 큐브/위성 오브젝트
 * 
 * 클릭 시 Black Box DevLog 모달 열림
 */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, MeshTransmissionMaterial } from '@react-three/drei';
import { useStore } from '../../hooks/useStore';
import useSoundFX from '../../hooks/useSoundFX';
import * as THREE from 'three';

const BlackBoxSatellite = ({ position = [25, 8, -15] }) => {
    const groupRef = useRef();
    const cubeRef = useRef();
    const glowRef = useRef();
    const openBlackBox = useStore(state => state.openBlackBox);
    const setHoverState = useStore(state => state.setHoverState);
    const performanceMode = useStore(state => state.performanceMode);
    const { playHover, playClick } = useSoundFX();

    const isHighPerf = performanceMode === 'high';

    // 큐브 회전 애니메이션
    useFrame((state) => {
        if (cubeRef.current) {
            cubeRef.current.rotation.x += 0.005;
            cubeRef.current.rotation.y += 0.008;
        }
        if (glowRef.current) {
            // 펄스 효과
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 1;
            glowRef.current.scale.setScalar(pulse);
        }
    });

    // 호버 공간 영역 (히트박스)
    const handlePointerOver = (e) => {
        e.stopPropagation();
        setHoverState(true);
        playHover();
        document.body.style.cursor = 'pointer';
    };

    const handlePointerOut = () => {
        setHoverState(false);
        document.body.style.cursor = 'none';
    };

    const handleClick = (e) => {
        e.stopPropagation();
        playClick();
        openBlackBox();
    };

    // 데이터 스트림 라인들 생성
    const dataLines = useMemo(() => {
        const lines = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            lines.push({
                start: [Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5],
                end: [Math.cos(angle) * 3, (Math.random() - 0.5) * 2, Math.sin(angle) * 3]
            });
        }
        return lines;
    }, []);

    return (
        <group ref={groupRef} position={position}>
            <Float
                speed={1.5}
                rotationIntensity={0.3}
                floatIntensity={0.5}
            >
                {/* 히트박스 (투명) */}
                <mesh
                    onPointerOver={handlePointerOver}
                    onPointerOut={handlePointerOut}
                    onClick={handleClick}
                >
                    <boxGeometry args={[4, 4, 4]} />
                    <meshBasicMaterial transparent opacity={0} />
                </mesh>

                {/* 메인 큐브 */}
                <mesh ref={cubeRef}>
                    <boxGeometry args={[1.5, 1.5, 1.5]} />
                    {isHighPerf ? (
                        <MeshTransmissionMaterial
                            backside
                            samples={8}
                            resolution={256}
                            transmission={0.9}
                            roughness={0.1}
                            thickness={0.5}
                            ior={1.5}
                            chromaticAberration={0.1}
                            color="#06b6d4"
                        />
                    ) : (
                        <meshStandardMaterial
                            color="#06b6d4"
                            transparent
                            opacity={0.8}
                            metalness={0.9}
                            roughness={0.1}
                        />
                    )}
                </mesh>

                {/* 내부 코어 */}
                <mesh>
                    <boxGeometry args={[0.5, 0.5, 0.5]} />
                    <meshBasicMaterial color="#00ffff" />
                </mesh>

                {/* 글로우 이펙트 */}
                <mesh ref={glowRef}>
                    <sphereGeometry args={[2, 16, 16]} />
                    <meshBasicMaterial
                        color="#06b6d4"
                        transparent
                        opacity={0.1}
                        side={THREE.BackSide}
                    />
                </mesh>

                {/* 데이터 스트림 라인 (High Perf Only) */}
                {isHighPerf && dataLines.map((line, i) => (
                    <DataLine key={i} start={line.start} end={line.end} delay={i * 0.2} />
                ))}

                {/* 라벨 */}
                <Text
                    position={[0, -2.5, 0]}
                    fontSize={0.3}
                    color="#06b6d4"
                    anchorX="center"
                    anchorY="middle"
                >
                    BLACK BOX
                </Text>

                {/* 서브 라벨 */}
                <Text
                    position={[0, -3, 0]}
                    fontSize={0.15}
                    color="#06b6d4"
                    anchorX="center"
                    anchorY="middle"
                    fillOpacity={0.6}
                >
                    [CLICK TO ACCESS ARCHIVE]
                </Text>
            </Float>
        </group>
    );
};

/**
 * 데이터 스트림 라인 애니메이션
 */
const DataLine = ({ start, end, delay }) => {
    const lineRef = useRef();

    useFrame((state) => {
        if (lineRef.current) {
            // 간단한 깜빡임 효과
            const visible = Math.sin(state.clock.elapsedTime * 3 + delay) > 0;
            lineRef.current.visible = visible;
        }
    });

    const points = useMemo(() => {
        return [
            new THREE.Vector3(...start),
            new THREE.Vector3(...end)
        ];
    }, [start, end]);

    const lineGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return geometry;
    }, [points]);

    return (
        <line ref={lineRef} geometry={lineGeometry}>
            <lineBasicMaterial color="#06b6d4" transparent opacity={0.4} />
        </line>
    );
};

export default BlackBoxSatellite;
