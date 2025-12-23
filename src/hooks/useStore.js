import { create } from 'zustand';

export const useStore = create((set, get) => ({
    // Core System State
    currentScene: 'boot', // 'boot', 'hub', 'lab01', 'lab02', 'lab03', 'lab04', 'contact', 'history'
    prevScene: null,
    isTransitioning: false,

    // Performance & Settings
    performanceMode: 'high', // 'high', 'low'
    isMuted: false,

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

    // Interaction State
    hoverState: false, // For general cursor state
    setHoverState: (hovering) => set({ hoverState: hovering }),

    hoveredPlanet: null, // For Dock interaction (Visual Highlight)
    setHoveredPlanet: (planetId) => set({ hoveredPlanet: planetId }),

    // Phase 34: Mission Modal State (Planetary Archives)
    missionModalData: null, // { lab, config, warpPos } or null
    openMissionModal: (data) => set({ missionModalData: data }),
    closeMissionModal: () => set({ missionModalData: null }),

    // Phase 35: Black Box Modal State (DevLog)
    blackBoxOpen: false,
    currentLogId: null,
    openBlackBox: (logId = null) => set({ blackBoxOpen: true, currentLogId: logId }),
    closeBlackBox: () => set({ blackBoxOpen: false, currentLogId: null }),
    setCurrentLog: (logId) => set({ currentLogId: logId }),

    // Phase 38: Hyperspace Navigation Logic
    isWarping: false,
    warpTarget: null,
    warpTargetPosition: null, // [x, y, z] for camera animation

    // Unified Warp Action - accepts optional position for camera movement
    warpTo: (targetScene, position = null) => {
        const state = get();
        if (state.currentScene === targetScene) return;

        // 1. Warp Engage (Visuals ON, set target)
        set({
            isWarping: true,
            warpTarget: targetScene,
            warpTargetPosition: position
        });

        // 2. Scene Switch (Hidden behind warp effect)
        setTimeout(() => {
            set((state) => ({
                prevScene: state.currentScene,
                currentScene: targetScene,
                isTransitioning: true
            }));

            // 3. Warp Disengage (Visuals OFF)
            setTimeout(() => {
                set({
                    isWarping: false,
                    warpTarget: null,
                    warpTargetPosition: null
                });
            }, 1000);
        }, 1200);
    },

    // Legacy compat for WarpController
    finishWarp: () => set({
        isWarping: false,
        warpTarget: null,
        warpTargetPosition: null
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

    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

    // Visual Settings
    orbitSpeed: 0.05,
    setOrbitSpeed: (speed) => set({ orbitSpeed: speed }),
    // Lab Local Configs (Global State)
    lab01Config: { distort: 0.4, speed: 1.5, color: '#06b6d4' },
    setLab01Config: (config) => set((state) => ({ lab01Config: { ...state.lab01Config, ...config } })),

    lab02Config: { zeroG: false, gravity: [0, -0.5, 0] },
    setLab02Config: (config) => set((state) => ({ lab02Config: { ...state.lab02Config, ...config } })),

    lab03Config: { mode: 'demo' },
    setLab03Config: (mode) => set({ lab03Config: { mode } }),
}));
