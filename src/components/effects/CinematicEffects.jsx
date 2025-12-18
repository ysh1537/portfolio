import { EffectComposer, Bloom } from '@react-three/postprocessing';

const CinematicEffects = () => {
    return (
        <EffectComposer disableNormalPass>
            {/* Bloom Effect: Adds the glowing neon look */}
            <Bloom
                luminanceThreshold={0.2} // Lower threshold to catch more emits
                mipmapBlur // Better quality blur
                intensity={0.5} // Moderate glow to avoid overpowering
                radius={0.7} // Spread range
            />
        </EffectComposer>
    );
};

export default CinematicEffects;
