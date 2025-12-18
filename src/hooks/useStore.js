import { create } from 'zustand';

export const useStore = create((set) => ({
    // Core System State
    currentScene: 'boot', // 'boot', 'hub', 'lab01', 'lab02', 'lab03', 'lab04', 'contact', 'history'
    prevScene: null,
    isTransitioning: false,

    // Performance & Settings
    performanceMode: 'high', // 'high', 'low'
    audioMuted: true,
    hoverState: false,

    // Actions
    setHoverState: (hovering) => set({ hoverState: hovering }),
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
