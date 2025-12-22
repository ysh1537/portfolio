import { useEffect } from 'react';
import { useStore } from '../../hooks/useStore';
import HistoryPanel from './HistoryPanel';
import Navbar from './Navbar';
import NavigationDock from './NavigationDock';
import LabUI from '../ui/LabUI';

const Overlay = () => {
    const currentScene = useStore((state) => state.currentScene);
    const setScene = useStore((state) => state.setScene);
    const isMuted = useStore((state) => state.isMuted);
    const toggleMute = useStore((state) => state.toggleMute);
    const performanceMode = useStore((state) => state.performanceMode);

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
