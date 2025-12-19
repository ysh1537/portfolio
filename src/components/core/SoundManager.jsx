import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../hooks/useStore';

const SoundManager = () => {
    const currentScene = useStore((state) => state.currentScene);
    const isMuted = useStore((state) => state.isMuted);
    const audioRef = useRef(null);
    const currentTrackRef = useRef(null);

    // BGM Configuration
    const bgmTracks = {
        'boot': '/sounds/hub_theme.mp3',
        'hub': '/sounds/hub_theme.mp3',
        'profile': '/sounds/hub_theme.mp3',
        'lab01': '/sounds/lab01_theme.mp3', // Prism
        'lab02': '/sounds/lab02_theme.mp3', // Nature
        'lab03': '/sounds/lab03_theme.mp3', // Gas Giant
        'lab04': '/sounds/lab04_theme.mp3', // Glitch
        'contact': '/sounds/hub_theme.mp3',
    };

    const playTrack = async (scene) => {
        let trackPath = bgmTracks[scene] || bgmTracks['hub'];

        // Detailed Scene Logic
        if (scene.startsWith('lab01')) trackPath = bgmTracks['lab01'];
        else if (scene.startsWith('lab02')) trackPath = bgmTracks['lab02'];
        else if (scene.startsWith('lab03')) trackPath = bgmTracks['lab03'];
        else if (scene.startsWith('lab04')) trackPath = bgmTracks['lab04'];

        // If track is already playing, do nothing
        if (currentTrackRef.current === trackPath) return;

        // Fade out current
        if (audioRef.current) {
            const oldAudio = audioRef.current;
            oldAudio.pause();
        }

        currentTrackRef.current = trackPath;
        const newAudio = new Audio(trackPath);
        newAudio.loop = true;
        newAudio.volume = isMuted ? 0 : 0.4;

        try {
            await newAudio.play();
            audioRef.current = newAudio;
        } catch (e) {
            console.warn("Audio Autoplay blocked, waiting for interaction", e);
        }
    };

    // React to Scene Changes
    useEffect(() => {
        playTrack(currentScene);
    }, [currentScene]);

    // Handle Mute State
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : 0.4;
            if (!isMuted && audioRef.current.paused) {
                audioRef.current.play().catch(e => console.warn("Play failed", e));
            }
        }
    }, [isMuted]);

    // Unlock Audio Context on Interaction (Browser Policy Fix)
    useEffect(() => {
        const unlockAudio = () => {
            if (audioRef.current && audioRef.current.paused && !isMuted) {
                audioRef.current.play().catch(e => console.log("Audio resume failed", e));
            }
        };
        window.addEventListener('click', unlockAudio);
        return () => window.removeEventListener('click', unlockAudio);
    }, [isMuted]);

    return null;
};

export default SoundManager;
