import { useStore } from '../../hooks/useStore';
import HistoryPanel from './HistoryPanel';
import Navbar from './Navbar';

const Overlay = () => {
    const currentScene = useStore((state) => state.currentScene);
    const setScene = useStore((state) => state.setScene);
    const isMuted = useStore((state) => state.isMuted);
    const toggleMute = useStore((state) => state.toggleMute);
    const performanceMode = useStore((state) => state.performanceMode);
    const orbitSpeed = useStore((state) => state.orbitSpeed);
    const setOrbitSpeed = useStore((state) => state.setOrbitSpeed);

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

            {/* Sound Toggle & Perf Toggle */}
            <div className="fixed top-20 right-6 md:top-24 md:right-10 flex flex-col gap-2 pointer-events-auto z-50 items-end">
                <button
                    onClick={toggleMute}
                    className="px-3 py-1.5 md:px-4 md:py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 hover:border-accent text-white transition-colors flex items-center gap-2 justify-between min-w-[110px] md:min-w-[140px]"
                >
                    <span className="text-[10px] md:text-xs">AUDIO</span>
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
                    className="px-3 py-1.5 md:px-4 md:py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 hover:border-accent text-white transition-colors flex items-center gap-2 justify-between min-w-[110px] md:min-w-[140px]"
                >
                    <span className="text-[10px] md:text-xs">PERF</span>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/50">{performanceMode === 'high' ? 'HIGH' : 'LOW'}</span>
                        <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${performanceMode === 'low' ? 'bg-yellow-500' : 'bg-cyan-500 animate-pulse'}`} />
                    </div>
                </button>
            </div>

            {/* Bottom Left Status */}
            <div className="fixed bottom-10 left-10 text-xs text-muted font-mono mix-blend-difference">
                SYSTEM: ONLINE <br />
                FPS: 60 <br />
                COORD: [34.5, 127.0]
            </div>


        </div>
    );
};

export default Overlay;
