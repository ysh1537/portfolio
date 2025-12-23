/**
 * Lore & Narrative Data Constants
 * 프로젝트 서사(Narrative)와 관련된 텍스트 상수를 정의합니다.
 */

export const LORE = {
    // 공통 시스템 메시지
    SYSTEM: {
        BOOT_SEQUENCE: [
            "Initializing Neural Link...",
            "Loading Reality Modules...",
            "Stabilizing Quantum Fields...",
            "Bypassing Security Protocols...",
            "Welcome, Visitor."
        ],
        LOADING: "Synchronizing Dimensions...",
        ERROR: "⚠️ Anomaly Detected: Reality breach imminent.",
        SUCCESS: "Sequence Complete.",
    },

    // 각 씬(Scene)별 서사 정보 + 비주얼 데이터
    SECTORS: {
        LAB_01: {
            id: 'LAB-01',
            name: '빛과 굴절의 세계 (The Prism)',
            tech: 'SHADER',
            type: '수정 행성 (Crystalline)',
            description: "순수한 빛과 셰이더 기술로 이루어진 아카이브입니다.",
            mission: "프로젝트 탐색 및 시각 기술 확인",
            status: "STABLE",
            visual: {
                color: '#06b6d4', // Cyan
                texture: 'glass',
                effect: 'transmission'
            }
        },
        LAB_02: {
            id: 'LAB-02',
            name: '진화하는 데이터 생태계 (The Terrarium)',
            tech: 'PHYSICS',
            type: '생명 행성 (Living Planet)',
            description: "육성 시뮬레이션과 데이터 개체가 진화하는 세계입니다.",
            mission: "크리처 분석 및 게임 로직 체험",
            status: "ACTIVE",
            visual: {
                color: '#10b981', // Emerald
                texture: 'organic',
                effect: 'pulse'
            }
        },
        LAB_03: {
            id: 'LAB-03',
            name: '주파수의 폭풍 (The Resonance)',
            tech: 'AUDIO',
            type: '가스 거성 (Gas Giant)',
            description: "사운드 웨이브와 주파수가 휘몰아치는 공간입니다.",
            mission: "오디오 시각화 및 반응형 기술 확인",
            status: "REACTIVE",
            visual: {
                color: '#facc15', // Yellow
                texture: 'gas',
                effect: 'waves'
            }
        },
        LAB_04: {
            id: 'LAB-04',
            name: '불안정한 현실 (The Glitch)',
            tech: 'DEBUG',
            type: '조각난 위성 (Fractured Moon)',
            description: "디버깅과 패치 작업이 필요한 불안정한 섹터입니다.",
            mission: "시스템 디버깅 및 테스트 체험",
            status: "UNSTABLE",
            visual: {
                color: '#ef4444', // Red
                texture: 'wireframe',
                effect: 'glitch'
            }
        },
        PROFILE: {
            id: 'PROFILE',
            name: '데이터 근원지 (The Core)',
            tech: 'LEGACY',
            type: '항성 (Stellar Source)',
            description: "모든 코드와 창작물이 시작되는 본질적인 공간입니다.",
            mission: "설계자 프로필 데이터 조회",
            status: "SECURE",
            visual: {
                color: '#3b82f6', // Blue
                texture: 'plasma',
                effect: 'glow'
            }
        }
    },

    // 설계자(Architect) 프로필 텍스트
    ARCHITECT: {
        TITLE: "디멘션 아키텍트 (Dimension Architect)",
        SUBTITLE: "로직을 현실로 엮어내는 개발자",
        QUOTE: "\"저는 단순한 코드를 넘어, 하나의 세계를 구축합니다.\"",
    },

    // 크리처 기원(Origin) 스토리 템플릿
    CREATURE_ORIGINS: {
        COMMON: "Formed from basic data dust found in the Void.",
        RARE: "Synthesized from compressed logic gates and crystallized algorithms.",
        LEGENDARY: "A unique anomaly that gained sentience through a recursive singularity."
    }
};
