/**
 * DevLogData.js
 * Phase 35: The Black Box - Integrated Archives
 * 
 * Identity: The Cinematic Multiverse Director
 * 'Original Architect Logs' (기존 기록) + 'Director's Insight' (신규 기획/전략) 통합본
 */

export const devLogs = [
    // [ORIGINAL ARCHIVES] - 복원된 기존 로그 (log-001 ~ 006)
    {
        id: "log-001",
        title: "왜 '포트폴리오'가 아닌 '멀티버스'인가",
        date: "2025-12-01",
        tags: ["철학", "세계관", "컨셉"],
        summary: "평범한 개발자 포트폴리오 대신 탐험 가능한 우주를 만들기로 한 이유",
        content: `## 문제 인식

개발자 포트폴리오는 대부분 비슷하다. 상단에 이름, 중간에 스킬 아이콘들, 하단에 프로젝트 카드. 
수백 개의 포트폴리오 사이에서 **"나"**를 어떻게 기억하게 할 것인가?

## 발상의 전환

> "사람들은 정보를 기억하지 않는다. **경험**을 기억한다."

영화관에서 본 영화의 줄거리는 잊어도, 그 영화를 보며 느꼈던 감정은 기억한다.
포트폴리오도 마찬가지다. 단순한 정보 나열이 아닌, **몰입 경험**을 설계해야 한다.

## 왜 우주인가?

1. **무한한 확장성**: 프로젝트가 늘어나도 "새로운 행성 발견"으로 자연스럽게 추가
2. **게임적 요소**: 클릭, 탐험, 발견의 재미
3. **기술 시연**: WebGL, 3D 렌더링 역량을 포트폴리오 자체로 증명
4. **개인 브랜딩**: "차원의 설계자(Dimension Architect)"라는 고유한 정체성

## 결론

이 포트폴리오는 단순한 이력서가 아니다. 
**방문자를 "우주 여행자"로 만들고, 내 기술 스택을 "탐험 가능한 행성"으로 바꾸는 것.**
그것이 "Cinematic Multiverse"의 핵심이다.`
    },
    {
        id: "log-002",
        title: "항성계 설계: 행성에 의미를 부여하다",
        date: "2025-12-05",
        tags: ["세계관", "디자인", "UX"],
        summary: "각 Lab 행성이 왜 그런 이름과 비주얼을 갖게 되었는지",
        content: `## 설계 원칙

랜덤하게 예쁜 행성을 만드는 건 쉽다. 하지만 **의미 있는** 행성을 만드는 건 다르다.
각 행성은 특정 기술 영역을 상징해야 한다.

## 행성 배정 로직

### Lab-01: The Prism (프리즘)
- **상징**: 셰이더, 빛, 굴절
- **비주얼**: 투명한 크리스탈 행성
- **이유**: 빛을 분해하는 프리즘처럼, 복잡한 렌더링 로직을 분해하고 재조합

### Lab-02: The Terrarium (테라리움)
- **상징**: 생명체, 유기적 시스템
- **비주얼**: 초록빛 살아있는 행성
- **이유**: 크리처 수집 게임 - 데이터가 "생명체"로 진화하는 생태계

### Lab-03: The Resonance (공명)
- **상징**: 오디오, 파동, 리듬
- **비주얼**: 고리를 두른 가스 행성
- **이유**: 목성의 거대 폭풍처럼, 사운드 파동이 시각화되는 공간

### Lab-04: The Glitch (글리치)
- **상징**: 디버그, 불안정, 실험
- **비주얼**: 부서진 달, 와이어프레임
- **이유**: 개발 중인 프로토타입, "아직 완성되지 않음"의 미학

## 핵심 인사이트

행성의 이름과 색상만으로 방문자는 무의식적으로 기대감을 형성한다.
**"저 푸른 크리스탈 행성에는 뭐가 있을까?"**
이것이 **게이미피케이션**의 힘이다.`
    },
    {
        id: "log-003",
        title: "React Three Fiber: 왜 이 기술 스택인가",
        date: "2025-12-08",
        tags: ["기술", "React", "Three.js"],
        summary: "순수 Three.js 대신 R3F를 선택한 기술적 근거",
        content: `## 후보 기술들

| 옵션 | 장점 | 단점 |
|------|------|------|
| 순수 Three.js | 완전한 통제권 | 컴포넌트화 어려움 |
| Babylon.js | 강력한 물리엔진 | 무거움, 오버킬 |
| PlayCanvas | 게임 특화 | React 생태계 분리 |
| **React Three Fiber** | React 생태계 통합 | 학습 곡선 |

## R3F를 선택한 이유

### 1. 선언적 3D
\`\`\`jsx
// 선언형 R3F
<mesh>
  <boxGeometry />
  <meshBasicMaterial />
</mesh>
\`\`\`

### 2. React 상태 관리 통합
Zustand와의 완벽한 호환. 씬 전환, 모달, 사운드 상태를 React 방식으로 관리.

### 3. 풍부한 에코시스템
- \`@react-three/drei\`: 카메라, 컨트롤, 헬퍼
- \`@react-three/postprocessing\`: Bloom, Vignette
- \`@react-spring/three\`: 자연스러운 애니메이션

## 결론

R3F는 "3D 개발자"가 아닌 "React 개발자"가 3D를 다루기 위한 최적의 도구다.
이 포트폴리오는 그 가능성을 증명한다.`
    },
    {
        id: "log-004",
        title: "성능 최적화 전쟁: High vs Low 모드",
        date: "2025-12-12",
        tags: ["성능", "최적화", "UX"],
        summary: "모든 기기에서 동작하는 포트폴리오를 위한 성능 전략",
        content: `## 문제 상황

아무리 아름다워도, **로딩에 10초 걸리면 이탈**한다.
특히 모바일 기기나 저사양 노트북에서 60FPS를 유지하는 것이 과제였다.

## 병목 지점 분석
1. **Post-Processing**: Bloom, Vignette (GPU 집약적)
2. **Stars**: 20,000개 파티클 렌더링
3. **Nebula Clouds**: 볼륨 렌더링

## 해결책: 성능 모드 토글 (Service Tiering)

### High Mode (기본)
- 모든 시각 효과 활성화
- 20,000 Stars
- Bloom + Vignette

### Low Mode
- Post-Processing OFF
- 5,000 Stars (75% 감소)
- 배경 요소 최소화

## 교훈

> "최적화는 삭제의 예술이다."

필요 없는 것을 제거하는 게 아니라, **언제 제거할지**를 결정하는 것이 핵심이다.`
    },
    {
        id: "log-005",
        title: "부팅 시퀀스: 자동화된 몰입",
        date: "2025-12-15",
        tags: ["UX", "애니메이션", "브랜딩"],
        summary: "방문자가 사이트에 착륙하는 순간을 영화처럼 연출하기",
        content: `## 첫인상의 중요성

유저가 사이트에 접속했을 때, 첫 3초가 모든 것을 결정한다.
빈 화면? 로딩 스피너? 지루하다.
**"이곳은 다르다"**라는 신호를 즉시 보내야 한다.

## 현재 부팅 시스템 (v2.0)

### 자동 시작
- 클릭 대기 화면 **제거**
- 접속 즉시 부팅 시퀀스 자동 시작

### 4가지 랜덤 테마
매번 다른 부팅 경험을 제공:
1. **Quantum Warp**: 양자 공간 워프 효과
2. **Digital Genesis**: 디지털 창세기 파티클
3. **Neural Dive**: 신경망 다이브 시각화
4. **Classic Matrix**: 클래식 매트릭스 코드

## 인사이트

> "로딩 화면도 콘텐츠다."

기다림의 시간을 **몰입의 시간**으로 전환하라.`
    },
    {
        id: "log-006",
        title: "Cinematic Multiverse: 다음 단계",
        date: "2025-12-22",
        tags: ["로드맵", "비전", "미래"],
        summary: "이 실험은 어디로 향하는가",
        content: `## 현재까지의 여정
- ✅ 3D 태양계 네비게이션
- ✅ Planetary Archives (프로젝트 상세)
- ✅ The Black Box (개발 일지)

## 철학

> "포트폴리오는 완성되지 않는다. 진화할 뿐이다."

이 프로젝트는 단순한 취업용 자료가 아니다.
**디지털 정체성의 실험**이자, **기술 역량의 증명**이다.
코드가 곧 DNA이고, 이 우주가 곧 나다.`
    },

    // [DIRECTOR'S ARCHIVES] - 신규 기획/전략 로그 (log-007 ~ 009)
    {
        id: "log-007",
        title: "The Silicon Synapse: AI와의 '공명(Resonance)'",
        date: "2025-12-23",
        tags: ["PM", "AI협업", "디렉팅"],
        summary: "[NEW] Human Vision + AI Logic = Hyper-Productivity. 단순 생성이 아닌 설계의 확장.",
        content: `## 개발자가 아닌 기획자의 코딩
나는 코드를 직접 짜지 않는다. **설계**한다.
이 프로젝트에서 나의 역할은 AI에게 단순한 명령을 내리는 것이 아니라, 
**명확한 비전과 제약 조건(Constraints)**을 제시하는 것이었다.

### Co-Reasoning Process
1.  **Vision (Human)**: *"프리즘 행성은 기하학적으로 완벽하면서도, 내부 구조가 폭발하는 키네틱 아트여야 해."*
2.  **Implementation (AI)**: *"그럼 Icosahedron Geometry를 복제하고 Wireframe Layer를 씌워 회전시키겠습니다."*

AI는 훌륭한 'Lead Developer'다. 하지만 그들은 '목적'을 스스로 설정하지 못한다.
그 목적을 날카롭게 다듬어 던져주는 것. 그것이 **AI 시대 기획자의 핵심 역량**이다.`
    },
    {
        id: "log-008",
        title: "The Prism Paradox: 디자인 진화의 기록",
        date: "2025-12-23",
        tags: ["디자인", "시행착오", "Co-Pilot"],
        summary: "[NEW] Lab-01 프리즘의 시각적 정체성을 찾기 위한 3단계 진화 과정",
        content: `## 1단계: Capability Prism (폐기)
초기에는 아주 직관적인 접근을 했다. 텍스트가 빔처럼 뿜어져 나오는 방식.
- **Problem**: 너무 촌스럽고(Literal), "우주적 신비감"이 없었다.

## 2단계: Quantum Nebula (수정)
"닥터 스트레인지" 스타일의 구름(Nebula) 구현.
- **Problem**: 예쁘긴 한데... **"프리즘과의 개연성"**이 부족했다.

## 3단계: Crystalline Echoes (최종)
프리즘의 기하학적 형태(Icosahedron)를 그대로 '복제(Echo)'하여 3겹의 껍질로 확장.
- **Result**: 프리즘이 '살아서 움직이는 기계'처럼 느껴지는 완벽한 일체감.

이 과정은 내가 **Art Direction**을 하고, AI가 **Technical execution**을 맡아 이뤄낸 합작품이다.`
    },
    {
        id: "log-009",
        title: "The Director: 기획자의 미래",
        date: "2025-12-23",
        tags: ["비전", "정체성", "커리어"],
        summary: "[NEW] AI 시대, 기획자는 '설계자(Architect)'이자 '지휘자(Conductor)'가 된다.",
        content: `## Paradigm Shift
이제 코딩을 몰라도 서비스를 만들 수 있는 시대다.
그렇다면 기획자의 역할은 줄어들었는가?
아니, 오히려 **폭발적으로 중요해졌다.**

기술의 장벽이 사라진 자리에 **'누구의 상상력이 더 뛰어난가'**의 경쟁이 남았기 때문이다.

## Cinematic Metaverse Director
나는 스스로를 이렇게 정의한다.
단순히 화면 설계서(SB)를 그리는 것이 아니라, 
**공간(Space)**, **시간(Time)**, **서사(Narrative)**를 총체적으로 지휘하여
가상 공간 안에 설득력 있는 세계를 구축하는 사람.

**"Welcome to my version of reality."**`
    }
];

// 태그별 색상 정의
export const tagColors = {
    // Original Colors
    "철학": "#a855f7",
    "세계관": "#7c3aed",
    "컨셉": "#6366f1",
    "기술": "#06b6d4",
    "React": "#61dafb",
    "Three.js": "#ffffff",
    "성능": "#10b981",
    "최적화": "#22c55e",
    "UX": "#f97316",

    // New PM/Strategy Colors
    "PM": "#ec4899",
    "디렉팅": "#db2777",
    "AI협업": "#0891b2",
    "Co-Reasoning": "#22d3ee",
    "디자인": "#f472b6",
    "시행착오": "#fb7185",
    "비전": "#6366f1",
    "정체성": "#a855f7"
};
