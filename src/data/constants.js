/**
 * 전역 설정 및 디자인 토큰 상수
 */
export const THEME = {
    primary: '#06b6d4',      // Cyan (LAB 01, Cursor)
    secondary: '#7c3aed',    // Violet (LAB 02)
    accent: '#facc15',       // Yellow (LAB 03)
    success: '#00ff41',      // Matrix Green (LAB 04, Matrix)
    background: '#0a0a0a',
    surface: '#121212',
    text: '#f5f5f5',
};

export const MATRIX = {
    opacity: 0.15,
    columns: 64.0,
    speedFactor: 0.12,
};

export const HUB = {
    orbitSpeed: 0.05,
    nodeDistance: {
        x: 6.5,
        z: 4.5
    }
};

export const PERFORMANCE = {
    LOW: {
        matrixOpacity: 0.05,
        bloomEnabled: false,
    },
    HIGH: {
        matrixOpacity: 0.2,
        bloomEnabled: true,
    }
};
