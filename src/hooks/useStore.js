import { create } from 'zustand';

export const useStore = create((set) => ({
    // Core System State
    currentScene: 'boot', // 'boot', 'hub', 'lab01', 'lab02', 'lab03', 'lab04', 'contact', 'history'
    prevScene: null,
    isTransitioning: false,

    // Performance & Settings
    performanceMode: 'high', // 'high', 'low'
    audioMuted: true,
    // Persistence Data
    systemLogs: [],

    // Actions
    addLog: (log) => set((state) => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newLog = { timestamp, message: log };
        // Keep last 100 logs
        const updatedLogs = [newLog, ...state.systemLogs].slice(0, 100);
        return { systemLogs: updatedLogs };
    }),

    setHoverState: (hovering) => set({ hoverState: hovering }),

    // Warp Transition Logic
    isWarping: false,
    warpTarget: null,

    startWarp: (scene) => set({ isWarping: true, warpTarget: scene }),

    finishWarp: () => set((state) => {
        // Actual Scene Switch
        return {
            prevScene: state.currentScene,
            currentScene: state.warpTarget,
            isTransitioning: true,
            isWarping: false,
            warpTarget: null
        };
    }),

    setScene: (scene) => set((state) => {
        if (state.currentScene === scene) return {};
        return {
            prevScene: state.currentScene,
            currentScene: scene,
            isTransitioning: true
        };
    }),

    endTransition: () => set({ isTransitioning: false }),

    setPerformanceMode: (mode) => set({ performanceMode: mode }),

    toggleAudio: () => set((state) => ({ audioMuted: !state.audioMuted })),

    // Visual Settings
    orbitSpeed: 0.05,
    setOrbitSpeed: (speed) => set({ orbitSpeed: speed }),
}));
