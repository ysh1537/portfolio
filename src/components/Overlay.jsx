import { useScroll } from '@react-three/drei';
import { useEffect, useState } from 'react';
import { useStore } from '../hooks/useStore';
import Navbar from './Navbar';
import useAudio from '../hooks/useAudio';
import { Volume2, VolumeX } from 'lucide-react'; // Assuming lucide-react is installed

// This component uses R3F's useScroll hook, so it must be inside <ScrollControls> or we bridge it.
// To keep it simple, we might just put the Navbar outside the Canvas and use a separate HTML overlay for content.
// BUT, the cinematic request implies text should interact with 3D.
// Let's create a "connected" overlay. For now, this plain Overlay will sit ON TOP of Canvas.

const Section = ({ align = "center", children }) => {
    return (
        <section className={`h-screen w-full p-20 flex flex-col justify-center ${align === 'left' ? 'items-start' : align === 'right' ? 'items-end' : 'items-center'}`}>
            <div className="max-w-4xl w-full">
                {children}
            </div>
        </section>
    );
};

const Overlay = () => {
    const isMuted = useStore((state) => state.audioMuted);
    const toggleMute = useStore((state) => state.toggleMute);
    const currentScene = useStore((state) => state.currentScene);
    const setScene = useStore((state) => state.setScene);
    const orbitSpeed = useStore((state) => state.orbitSpeed);
    const setOrbitSpeed = useStore((state) => state.setOrbitSpeed);
    const { playHoverSound, playClickSound } = useAudio();

    // Attach global hover listener for sound
    useEffect(() => {
        const handleMouseOver = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                playHoverSound();
            }
        };

        const handleClick = () => playClickSound();

        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('click', handleClick);
        };
    }, [playHoverSound, playClickSound]);

    // Global ESC Key Listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            // If typing in an input, ESC should blur the input, not navigate away immediately
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
                if (e.key === 'Escape') {
                    document.activeElement.blur();
                }
                return;
            }

            if (e.key === 'Escape') {
                setScene('hub');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setScene]);

    return (
        <div className="fixed inset-0 pointer-events-none z-40 text-xs font-mono select-none">

            {/* Global Back Button (Visible in sub-scenes) */}
            {currentScene !== 'boot' && currentScene !== 'hub' && (
                <button
                    onClick={() => setScene('hub')}
                    className="fixed top-24 left-6 pointer-events-auto flex items-center gap-2 group text-white/70 hover:text-white transition-colors"
                >
                    <span className="w-8 h-px bg-white/30 group-hover:bg-accent transition-colors" />
                    &lt; RETURN TO SYSTEM [ESC]
                </button>
            )}

            {/* Top Navigation Bar */}
            <nav className="fixed top-0 w-full p-6 flex justify-between items-start pointer-events-auto mix-blend-difference">
                <Navbar />
            </nav>

            {/* Sound Toggle */}
            <button
                onClick={toggleMute}
                className="fixed top-24 right-10 pointer-events-auto p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 hover:border-accent text-white transition-colors z-50"
            >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* We will rely on R3F ScrollControls `html` for scroll-synced content, 
            OR we use a separate scrolling div synced with GSAP. 
            Given the plan, let's use the R3F ScrollControls for the main 3D sync, 
            and this Overlay for STATIC UI like Navbar, Cursor, and persistent HUD.
        */}
            <div className="fixed bottom-10 left-10 text-xs text-muted font-mono mix-blend-difference">
                SYSTEM: ONLINE <br />
                FPS: 60 <br />
                COORD: [34.5, 127.0]
            </div>

            {/* Bottom Right UI Area */}
            <div className="fixed bottom-10 right-10 flex flex-col items-end gap-4 mix-blend-difference pointer-events-auto">

                {/* Orbit Speed Controls (visible only in 'hub') */}
                {currentScene === 'hub' && (
                    <div className="flex items-center gap-2 scale-150 origin-bottom-right">
                        <button
                            onClick={() => setOrbitSpeed(Math.max(0.05, orbitSpeed - 0.05))}
                            className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-accent hover:text-black transition-colors rounded"
                        >
                            -
                        </button>
                        <span className="w-12 text-center font-mono text-accent">
                            {orbitSpeed.toFixed(2)}
                        </span>
                        <button
                            onClick={() => setOrbitSpeed(Math.min(0.5, orbitSpeed + 0.05))}
                            className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-accent hover:text-black transition-colors rounded"
                        >
                            +
                        </button>
                    </div>
                )}

                {/* Scroll Progress Placeholder */}
                <div className="text-right">
                    <div className="text-xs text-muted font-mono mb-2">SCROLL PROGRESS</div>
                    <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-accent w-1/3 animate-pulse" />
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Overlay;
