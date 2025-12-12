import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';

const Stream = ({ startPos, speed, length, size }) => {
    const chars = "XYZ01010101";
    const streams = useMemo(() => {
        return Array.from({ length }, (_, i) => ({
            char: chars[Math.floor(Math.random() * chars.length)],
            offset: i * size * 1.2,
            opacity: 1 - i / length
        }));
    }, [length, size]);

    const ref = useRef();

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.position.y -= speed * delta;
            if (ref.current.position.y < -15) {
                ref.current.position.y = 15;
            }
        }
    });

    return (
        <group ref={ref} position={startPos}>
            {streams.map((s, i) => (
                <Text
                    key={i}
                    position={[0, s.offset, 0]}
                    fontSize={size}
                    color="#00ff41"
                    font="https://fonts.gstatic.com/s/sharetechmono/v15/J7aHnp1uDWRCCytEs2UM2w.woff"
                    fillOpacity={s.opacity}
                    anchorX="center"
                    anchorY="middle"
                >
                    {s.char}
                </Text>
            ))}
        </group>
    );
};

const MatrixRain = ({ count = 30 }) => {
    const streams = useMemo(() => {
        return Array.from({ length: count }, () => ({
            x: (Math.random() - 0.5) * 40,
            z: (Math.random() - 0.5) * 20 - 5,
            speed: 5 + Math.random() * 5,
            length: 5 + Math.floor(Math.random() * 10),
            size: 0.5 + Math.random() * 0.3
        }));
    }, [count]);

    return (
        <group>
            {streams.map((props, i) => (
                <Stream key={i} startPos={[props.x, 15, props.z]} {...props} />
            ))}
        </group>
    );
};

export default MatrixRain;
