import { useEffect, useState } from 'react';
import { useStore } from '../../hooks/useStore';
import HistoryPanel from './HistoryPanel';
import Navbar from './Navbar';
import NavigationDock from './NavigationDock';
import LabUI from '../ui/LabUI';
import { motion, AnimatePresence } from 'framer-motion';

// Welcome Overlay for first-time visitors
const WelcomeOverlay = ({ onDismiss }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onDismiss}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto cursor-pointer"
    >
        <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -20 }}
            transition={{ delay: 0.2, type: 'spring', damping: 20 }}
            className="text-center max-w-md px-8 py-10 border border-white/10 bg-black/80 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="text-4xl mb-4">🌌</div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 font-orbitron tracking-wide">
                WELCOME TO THE METAVERSE
            </h2>
            <p className="text-white/60 text-sm md:text-base mb-6 leading-relaxed">
                각 <span className="text-cyan-400 font-bold">행성</span>을 클릭하여 프로젝트를 탐험하세요.
                <br />
                중앙의 <span className="text-yellow-400 font-bold">태양</span>은 저의 프로필입니다.
            </p>
            <button
                onClick={onDismiss}
                className="px-6 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-full text-sm font-bold tracking-wider hover:bg-cyan-500/30 transition-all"
            >
                탐험 시작하기
            </button>
            <p className="text-white/30 text-[10px] mt-4 animate-pulse">
                아무 곳이나 클릭해도 닫힙니다
            </p>
        </motion.div>
    </motion.div>
);

const Overlay = () => {
    const currentScene = useStore((state) => state.currentScene);
    const setScene = useStore((state) => state.setScene);
    const isMuted = useStore((state) => state.isMuted);
    const toggleMute = useStore((state) => state.toggleMute);
    const performanceMode = useStore((state) => state.performanceMode);

    // Welcome Overlay State
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        // Hub 진입 시 첫 방문 체크
        if (currentScene === 'hub') {
            const hasVisited = localStorage.getItem('hub_visited');
            if (!hasVisited) {
                setShowWelcome(true);
            }
        } else {
            setShowWelcome(false);
        }
    }, [currentScene]);

    const dismissWelcome = () => {
        setShowWelcome(false);
        localStorage.setItem('hub_visited', 'true');
    };

    // ESC 키로 Hub로 돌아가기
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && currentScene !== 'boot' && currentScene !== 'hub') {
                setScene('hub');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentScene, setScene]);

    return (
        <div className="fixed inset-0 pointer-events-none z-40 text-xs font-mono select-none">

            {/* Welcome Overlay (First-time visitors) */}
            <AnimatePresence>
                {showWelcome && <WelcomeOverlay onDismiss={dismissWelcome} />}
            </AnimatePresence>

            {/* History Panel Overlay */}
            {currentScene === 'history' && (
                <HistoryPanel onClose={() => setScene('hub')} />
            )}

            {/* Global Back Button (Visible in sub-scenes) */}
            {currentScene !== 'boot' && currentScene !== 'hub' && currentScene !== 'history' && (
                <button
                    onClick={() => setScene('hub')}
                    className="fixed top-24 left-6 pointer-events-auto flex items-center gap-2 group text-white/70 hover:text-white transition-colors"
                >
                    <span className="w-8 h-px bg-white/30 group-hover:bg-accent transition-colors" />
                    &lt; RETURN TO SYSTEM [ESC]
                </button>
            )}

            {/* Top Navigation Bar */}
            <Navbar />

            {/* Lab Specific UI Controls */}
            <LabUI />

            {/* Sound Toggle & Perf Toggle */}
            <div className="fixed top-20 right-6 md:top-24 md:right-10 flex flex-col gap-3 pointer-events-auto z-50 items-end">
                <button
                    onClick={toggleMute}
                    className="px-4 py-3 md:px-4 md:py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 hover:border-accent text-white transition-colors flex items-center gap-3 justify-between min-w-[120px] md:min-w-[140px] shadow-lg focus:ring-2 focus:ring-accent/50 active:scale-95"
                    aria-label="Toggle Audio"
                >
                    <span className="text-[10px] md:text-xs font-bold tracking-wider">AUDIO</span>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/50">{isMuted ? 'OFF' : 'ON'}</span>
                        <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isMuted ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                    </div>
                </button>

                <button
                    onClick={() => {
                        const newMode = performanceMode === 'high' ? 'low' : 'high';
                        useStore.getState().setPerformanceMode(newMode);
                    }}
                    className="px-4 py-3 md:px-4 md:py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 hover:border-accent text-white transition-colors flex items-center gap-3 justify-between min-w-[120px] md:min-w-[140px] shadow-lg focus:ring-2 focus:ring-accent/50 active:scale-95"
                    aria-label="Toggle Performance Mode"
                >
                    <span className="text-[10px] md:text-xs font-bold tracking-wider">PERF</span>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/50">{performanceMode === 'high' ? 'HIGH' : 'LOW'}</span>
                        <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${performanceMode === 'low' ? 'bg-yellow-500' : 'bg-cyan-500 animate-pulse'}`} />
                    </div>
                </button>
            </div>

            {/* Quick Navigation Dock (Visible only in Hub) */}
            {currentScene === 'hub' && <NavigationDock />}

            {/* Bottom Left Status - Hidden on mobile to avoid Dock overlap */}
            <div className="hidden md:block fixed bottom-10 left-10 text-xs text-muted font-mono mix-blend-difference">
                SYSTEM: ONLINE <br />
                FPS: 60 <br />
                COORD: [34.5, 127.0]
            </div>


        </div>
    );
};

export default Overlay;
