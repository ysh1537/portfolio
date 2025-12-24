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
            },
            details: {
                longDescription: "프리즘(Prism)이 빛을 분석하듯, 복잡한 시각적 로직을 셰어더 단위로 분해하여 연구하는 실험 섹터입니다. 투명한 수정체 모듈(MeshTransmissionMaterial)을 통해 고도의 데이터 굴절과 분산 기술을 제어할 수 있습니다.",
                features: [
                    "Transmission Shader (투과 및 굴절 제어)",
                    "Chromatic Aberration (실시간 색수차 변조)",
                    "Expansive Shell Layers (다중 레이어 분산)",
                    "Interactive Parameter Sync (상태 동기화)"
                ],
                techStack: ["GLSL", "Transmission Material", "Shader Logic", "R3F", "GSAP"],
                media: ["/assets/screenshots/lab01_prism.jpg"],
                projects: [
                    {
                        title: "Archive Entry #01: Hanok-meta",
                        period: "2024.04 - 2024.12",
                        role: "Architecture Blueprint",
                        desc: "고밀도 BIM 데이터를 메타버스 환경에 이식하기 위한 시각적 아키텍처 실증. 언리얼 엔진 5의 픽셀 스트리밍 기술과 웹 연동 설계.",
                        metrics: ["3.7억 R&D", "Excellent Eval"],
                        tech: ["Unreal 5", "Pixel Streaming", "BIM"],
                        color: "amber",
                        link: "https://github.com/Yesol-Pilot"
                    },
                    {
                        title: "Archive Entry #02: Gyeongnam Safety",
                        period: "2023.09 - 2023.12",
                        role: "Visual Director",
                        desc: "광범위한 VR360 데이터셋을 활용한 인터랙티브 교육 플랫폼. 직관적인 UI/UX와 대규모 콘텐츠 렌더링 최적화 연구.",
                        metrics: ["ICT Grand Prize", "30+ Content"],
                        tech: ["WebGL", "VR360", "React"],
                        color: "emerald",
                        link: "https://github.com/Yesol-Pilot"
                    }
                ]
            }
        },
        LAB_02: {
            id: 'LAB-02',
            name: '데이터 생태계 (The Terrarium)',
            tech: 'PHYSICS',
            type: '생명 행성 (Living Planet)',
            description: "기술적 상호작용이 생태계처럼 유기적으로 얽힌 공간입니다.",
            mission: "물리 개체 충돌 분석 및 로직 테스트",
            status: "ACTIVE",
            visual: {
                color: '#10b981', // Emerald
                texture: 'organic',
                effect: 'pulse'
            },
            details: {
                longDescription: "Cannon.js 물리 엔진을 통해 각 기술 컴포넌트들이 실제 '개체'로서 상호작용하는 테라리움 섹터입니다. 구체화된 기술 스택(Tech Bubbles)을 직접 클릭하여 물리적 충격을 가하거나, 중력장(Gravity Field)을 왜곡하여 시스템의 안정성을 테스트할 수 있습니다.",
                features: [
                    "Cannon.js Physics (실시간 물리 충돌)",
                    "Dynamic Gravity Control (중력장 변조)",
                    "Tech Entity Interaction (기술 개체 반응)",
                    "Instanced Mesh Rendering (대량 개체 최적화)"
                ],
                techStack: ["@react-three/cannon", "Physics Engine", "Interactive Logic", "Billboard UI"],
                media: ["/assets/screenshots/lab02_terrarium.jpg"],
                projects: [
                    {
                        title: "Log Entry: Multiverse Creature Lab",
                        period: "2024.11 - 2024.12",
                        role: "Lead Engineer",
                        desc: "AI 생명체의 유전적 조합과 성장을 시뮬레이션하는 육성 엔진. Firebase 실시간 데이터 연동 및 Zustand 기반 상태 동기화 아키텍처.",
                        metrics: ["Real-time DB", "State Sync"],
                        tech: ["React", "Firebase", "Zustand"],
                        color: "emerald",
                        link: "https://yesol-pilot.github.io/game/"
                    }
                ]
            }
        },
        LAB_03: {
            id: 'LAB-03',
            name: '주파수 공명 (The Resonance)',
            tech: 'AUDIO',
            type: '가스 거성 (Gas Giant)',
            description: "소리의 파동이 시각적 입자로 변환되는 공간입니다.",
            mission: "오디오 스펙트럼 시뮬레이션",
            status: "REACTIVE",
            visual: {
                color: '#facc15', // Yellow
                texture: 'gas',
                effect: 'waves'
            },
            details: {
                longDescription: "Web Audio API를 통해 감지된 주파수를 실시간 시각적 데이터(FFT)로 변환하는 섹션입니다. Particle System과 Audio Analyser를 결합하여 소리의 형태를 3D 공간에 재구성합니다. 데모 파형과 실제 마이크 입력을 교차 테스트할 수 있습니다.",
                features: [
                    "Web Audio API (오디오 컨텍스트 제어)",
                    "FFT Analysis (실시간 주파수 분석)",
                    "Reactive Particle System (반응형 입자)",
                    "Device I/O Mapping (입출력 매핑)"
                ],
                techStack: ["Web Audio API", "AnalyserNode", "Particle Shaders", "FFT"],
                media: ["/assets/screenshots/lab03_resonance.png"]
            }
        },
        LAB_04: {
            id: 'LAB-04',
            name: '비정형 기록소 (The Glitch)',
            tech: 'DEBUG',
            type: '소행성 (Asteroid)',
            description: "시스템의 파편화된 기록과 글리치 데이터를 보관합니다.",
            mission: "무결성 복구 및 방명록 기록",
            status: "UNSTABLE",
            visual: {
                color: '#ff4d4d', // Red
                texture: 'glitch',
                effect: 'noise'
            },
            details: {
                longDescription: "불안정한 시스템 환경에서 발생하는 '비정형 데이터'와 '오류'를 기록으로 전환하는 섹터입니다. Matrix Code 시뮬레이션과 Glitch Shader를 통해 데이터의 불안정성을 표현하며, Firebase 연동 방명록(Guestbook)을 통해 방문자의 흔적을 기록합니다.",
                features: [
                    "Glitch Artifact Simulation (글리치 효과)",
                    "Matrix Digital Rain (매트릭스 렌더링)",
                    "Firebase Guestbook (익명 방명록)",
                    "Reality Integrity Sync (현실 무결성)"
                ],
                techStack: ["Post-processing", "Firebase Firestore", "Noisy Textures", "Custom Shaders"],
                media: ["/assets/screenshots/lab04_glitch.png"]
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
