import { useRef, useCallback } from 'react';

const useSoundFX = () => {
    const audioContextRef = useRef(null);

    const getContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        // Resume context if suspended (browser autoplay policy)
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        return audioContextRef.current;
    }, []);

    const playHover = useCallback(() => {
        try {
            const ctx = getContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            // High frequency blip
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);

            osc.type = 'sine';

            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {
            console.warn('Audio FX Error:', e);
        }
    }, [getContext]);

    const playClick = useCallback(() => {
        try {
            const ctx = getContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            // Digital click sound
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);

            osc.type = 'square'; // More "tech" sounding

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) {
            console.warn('Audio FX Error:', e);
        }
    }, [getContext]);

    const playTransition = useCallback(() => {
        try {
            const ctx = getContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            // Whoosh transition
            osc.frequency.setValueAtTime(100, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);

            osc.type = 'sawtooth';

            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

            // Filter for swoosh effect
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, ctx.currentTime);
            filter.frequency.linearRampToValueAtTime(2000, ctx.currentTime + 0.5);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) {
            console.warn('Audio FX Error:', e);
        }
    }, [getContext]);

    return { playHover, playClick, playTransition };
};

export default useSoundFX;
