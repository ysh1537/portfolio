export const projects = [
    {
        id: 1,
        title: "메타한옥: 북촌",
        description: "한옥건축 모델링을 웹기반 실시간 렌더링 기술로 구현한 건축 시뮬레이션 메타버스 플랫폼. KOCCA R&D 과제, 중간평가 A등급.",
        tech: ["Three.js", "WebGL", "React", "3D Modeling"],
        image: "/assets/projects/hanok.jpg",
        link: "#",
        award: "2024 웹어워드 문화부문 통합대상 / ICT 기술부문 Bronze",
        budget: "3.75억"
    },
    {
        id: 2,
        title: "심리 메타버스 플랫폼",
        description: "심리상담도구, 화상회의, 메타버스 스페이스를 결합한 신개념 상담 플랫폼. TIPA R&D 과제.",
        tech: ["Metaverse", "WebRTC", "UI/UX", "Platform Architecture"],
        image: "/assets/projects/psychology.jpg",
        link: "#",
        budget: "7.5억"
    },
    {
        id: 3,
        title: "경남 온라인 안전체험원",
        description: "VR360 파노라마 기반 학생 안전 교육 플랫폼. 경상남도교육청 발주, 전체 PM 담당.",
        tech: ["VR360", "Panorama", "UI/UX", "교육 콘텐츠"],
        image: "/assets/projects/safety.jpg",
        link: "#",
        award: "2024 ICT Award UI부문 Grand Prize / 웹어워드 체험분야 최우수상",
        budget: "1.37억"
    },
    {
        id: 4,
        title: "직업계고 메타버스 잡스페이스",
        description: "전북 직업계고 31개교 홍보 ZEP 메타버스 플랫폼. 3D 모델링, 미니게임 개발.",
        tech: ["ZEP", "TypeScript", "3D Modeling", "Game Design"],
        image: "/assets/projects/jobspace.jpg",
        link: "#",
        award: "2024 웹어워드 메타버스분야 대상",
        budget: "1.37억"
    },
    {
        id: 5,
        title: "학교안전공제 메타버스 안전교육",
        description: "We.Canvas 기반 초등학생 대상 안전교육 콘텐츠 4종 개발 (교통, 등산, 물놀이, 놀이공원).",
        tech: ["We.Canvas", "Metaverse", "교육 콘텐츠", "UI/UX"],
        image: "/assets/projects/school.jpg",
        link: "#",
        budget: "1.43억"
    },
    {
        id: 6,
        title: "KISTi 고령자 XR 플랫폼",
        description: "고령자용 비대면 인지-운동 융합 훈련 XR 콘텐츠 및 시스템 개선. MR 기반 운동 가이드.",
        tech: ["XR", "Unity", "MR", "Healthcare"],
        image: "/assets/projects/kisti.jpg",
        link: "#",
        budget: "1.38억"
    }
];

export const techStackNodes = [
    // Frontend Ecosystem
    { name: "React", color: "#61dafb", type: "frontend", level: "Expert", desc: "컴포넌트 기반 아키텍처 설계 및 최적화 경험 보유." },
    { name: "Three.js", color: "#ffffff", type: "frontend", level: "Advanced", desc: "WebGL 기반 3D 인터랙션 및 Shader 효과 구현 가능." },
    { name: "Next.js", color: "#000000", type: "frontend", level: "Advanced", desc: "SSR/SSG 하이브리드 웹 애플리케이션 구축 및 배포." },
    { name: "TypeScript", color: "#3178c6", type: "language", level: "Advanced", desc: "정적 타입을 통한 안정적인 대규모 코드베이스 관리." },
    { name: "Tailwind", color: "#38bdf8", type: "style", level: "Expert", desc: "Utility-first CSS를 활용한 신속한 UI 런칭." },
    { name: "Framer", color: "#0055ff", type: "frontend", level: "Intermediate", desc: "생동감 있는 마이크로 인터랙션 및 제스처 구현." },
    { name: "Zustand", color: "#453a33", type: "state", level: "Expert", desc: "가볍고 직관적인 전역 상태 관리 로직 설계." },
    { name: "Vite", color: "#646cff", type: "tool", level: "Advanced", desc: "초고속 번들링 및 개발 환경 세팅 최적화." },

    // Backend / Infra
    { name: "Node.js", color: "#339933", type: "backend", level: "Intermediate", desc: "REST API 서버 구축 및 비동기 프로세스 처리." },
    { name: "Firebase", color: "#ffca28", type: "backend", level: "Advanced", desc: "실시간 DB 연동 및 Serverless 인증 시스템 구현." },
    { name: "Supabase", color: "#3ecf8e", type: "backend", level: "Intermediate", desc: "PostgreSQL 기반의 오픈소스 BaaS 활용." },
    { name: "AWS", color: "#ff9900", type: "infra", level: "Basic", desc: "EC2, S3를 활용한 기본적인 클라우드 인프라 운영." },
    { name: "Vercel", color: "#000000", type: "infra", level: "Advanced", desc: "CI/CD 자동화 및 Edge Function 활용 배포." },
    { name: "Docker", color: "#2496ed", type: "infra", level: "Basic", desc: "컨테이너 기반의 일관된 개발/배포 환경 구성." },
    { name: "K8s", color: "#326ce5", type: "infra", level: "Basic", desc: "쿠버네티스 클러스터 기본 개념 이해 및 운영." },

    // AI & Data
    { name: "OpenAI", color: "#10a37f", type: "ai", level: "Advanced", desc: "GPT API를 활용한 대화형 에이전트 서비스 개발." },
    { name: "Python", color: "#3776ab", type: "language", level: "Intermediate", desc: "데이터 분석 및 업무 자동화 스크립트 작성." },
    { name: "TensorFlow", color: "#ff6f00", type: "ai", level: "Basic", desc: "기본적인 머신러닝 모델 학습 및 구조 이해." },
    { name: "PyTorch", color: "#ee4c2c", type: "ai", level: "Basic", desc: "딥러닝 파이프라인 구성 및 모델 튜닝 기초." },
    { name: "RAG", color: "#ff00ff", type: "ai", level: "Intermediate", desc: "검색 증강 생성을 통한 지능형 정보 처리 구현." },
    { name: "LlamaIndex", color: "#ffffff", type: "ai", level: "Basic", desc: "LLM 데이터 인덱싱 및 지식 베이스 구축." },

    // Metaverse / Immersive
    { name: "Unity", color: "#000000", type: "engine", level: "Advanced", desc: "C# 스크립팅 및 물리 엔진을 활용한 게임 개발." },
    { name: "Unreal", color: "#0e1128", type: "engine", level: "Basic", desc: "블루프린트 활용 및 고품질 리얼타임 렌더링 이해." },
    { name: "Blender", color: "#f5792a", type: "tool", level: "Intermediate", desc: "3D 에셋 모델링, UV 매핑 및 간단한 애니메이션." },
    { name: "WebGL", color: "#990000", type: "core", level: "Expert", desc: "로우레벨 그래픽스 API 이해 및 최적화." },
    { name: "WebGPU", color: "#00ff00", type: "core", level: "Basic", desc: "차세대 웹 그래픽스 파이프라인 연구 및 실습." },
    { name: "ZEP", color: "#00c73c", type: "platform", level: "Expert", desc: "ZEP 스크립트(ZEM)를 활용한 메타버스 맵/게임 제작." },
    { name: "Roblox", color: "#cd201f", type: "platform", level: "Intermediate", desc: "Lua 스크립팅을 이용한 로블록스 게임 로직 구현." }
];

