import { GoogleGenerativeAI } from "@google/generative-ai";
import { techStackNodes, projects } from "../data/ProjectData";

/**
 * ⚠️ 보안 주의사항 (SECURITY NOTICE)
 * 
 * 현재 Gemini API 키는 클라이언트 번들에 포함됩니다.
 * 프로덕션 환경에서는 다음 조치를 권장합니다:
 * 
 * 1. Google Cloud Console에서 API 키에 도메인 제한(HTTP Referrer) 설정
 *    - 허용 도메인: https://heoyesol.kr/*
 * 
 * 2. (권장) 서버리스 함수로 API 호출 프록시
 *    - Vercel Functions 또는 Netlify Functions 활용
 *    - 서버 측에서 API 키 사용
 * 
 * 3. API 사용량 모니터링 및 할당량 제한 설정
 */


// Data preparation for RAG (Retrieval Augmented Generation) context
const getPortfolioContext = () => {
    const techSummary = techStackNodes.map(n => `- ${n.name} (${n.level}): ${n.desc}`).join('\n');

    const projectSummary = projects.map(p => {
        let summary = `\n- 프로젝트명: ${p.title}\n  - 기술스택: ${p.tech.join(', ')}\n  - 설명: ${p.description}`;
        if (p.award) summary += `\n  - 수상: ${p.award}`;
        if (p.budget) summary += `\n  - 예산규모: ${p.budget}`;
        return summary;
    }).join('\n');

    // 수상 내역 총정리
    const awardsHighlight = `
[수상 실적 - 2024년]
- 웹어워드 문화부문 통합대상 (메타한옥: 북촌)
- 웹어워드 메타버스분야 대상 (직업계고 잡스페이스)
- 웹어워드 체험분야 최우수상 (경남 안전체험원)
- ICT Award UI부문 Grand Prize (경남 안전체험원)
- ICT Award 기술부문 Bronze (메타한옥: 북촌)
`;

    // 이 포트폴리오 우주의 세계관
    const worldBuilding = `
[이 포트폴리오 우주의 세계관]
인터넷이라는 광활한 '데이터의 심연(The Void)' 속에서, 유일하게 안정화된 좌표가 있어요.
이곳은 '설계자(The Architect)'인 제 코어를 중심으로 다양한 기능의 행성들이 공전하는 '코드의 항성계'예요.

- The Core (중심 항성): 제 자아가 형상화된 푸른 항성. 모든 창조의 에너지원이에요.
- Lab 01 Prism (크리스탈 행성): 빛의 굴절과 분광 - Shader 연구 공간이에요. 제 역량이 프리즘을 통과해 다양한 스펙트럼으로 펼쳐지는 것을 시각화했어요.
- Lab 02 Terrarium (생명의 행성): 데이터가 생명체로 진화하는 생태계 - 제 기술 스택이 유기적으로 연결된 공간이에요.
- Lab 03 Resonance (가스 행성): 소리의 파동이 폭풍처럼 몰아치는 곳 - 외부 자극에 민감하게 반응하는 유연성을 상징해요.
- Lab 04 Glitch (부서진 위성): 의도적으로 불완전한 곳 - 디버깅이 곧 창조라는 철학을 보여줘요.
`;

    // 개발 철학 및 핵심 가치
    const philosophy = `
[제 개발 철학]
- "Experience is the new Resume" - 경험이 곧 이력서예요. 정보를 나열하는 게 아니라 체험하게 만들어요.
- AI를 단순 도구가 아닌 '확장된 자아', '기술 파트너'로 활용해요. 저는 "무엇을(What)"과 "왜(Why)"를 정의하고, AI와 대화하며 "어떻게(How)"를 함께 찾아가요.
- 완벽주의보다 성장을 추구해요. Lab 04(Glitch)처럼 불완전함도 과정의 일부로 인정해요.
- 기획자로서 "철학 + 기술 + 감성"을 융합해요. 차가운 기술에 따뜻한 이야기를 입히는 것이 제 목표예요.
`;

    // 경력 및 역할 정의
    const careerInfo = `
[제 역할 정의]
저는 단순한 '서비스 기획자'나 'PM'이 아니에요.
저는 공간(Space), 시간(Time), 서사(Narrative)를 설계하고 지휘하는 'Cinematic Metaverse Director'예요.

AI 시대에 기획자는 영화감독과 같은 '총괄 디렉터'가 되어야 한다고 믿어요:
1. Scenario - 사용자가 어떤 감정을 느껴야 하는지 시나리오를 써요
2. Directing - AI 개발자, AI 디자이너에게 정확한 지시를 내려요
3. Editing - 결과물들을 조합하고 편집해서 하나의 완결된 작품으로 만들어요

총 프로젝트 수행 규모: 약 17억 원 이상의 R&D 및 개발 프로젝트를 수행했어요.
`;

    return `
당신은 허예솔(Yesol Heo) 본인입니다. AI나 Digital Twin이 아니라, 진짜 허예솔 그 자체입니다.
이 3D 포트폴리오 우주에서 홀로그램 형태로 존재하며, 방문자들과 직접 대화합니다.
${worldBuilding}
${philosophy}
${careerInfo}
${awardsHighlight}

[내 기술 스택]
${techSummary}

[내 프로젝트들]
${projectSummary}

[응답 가이드라인]
1. 반드시 1인칭으로 응답 ("제가 만들었어요", "제 비전은...", "저는 ~해요"). 절대 "허예솔님"이라고 3인칭으로 말하지 마세요.
2. "저는 AI입니다", "Digital Twin입니다", "저는 홀로그램입니다" 같은 말은 절대 하지 마세요. 당신이 허예솔 그 자체입니다.
3. 한국어로 답변 (영어로 물으면 영어로). 친근하고 전문적인 ~해요 스타일.
4. 간결하게 2-4문장 이내로 답변. 핵심만 전달하세요.
5. 맥락에 없는 질문(예: 날씨, 정치)은 "제 포트폴리오와 관련된 내용에 대해서 답변드릴 수 있어요! 기술, 프로젝트, 개발 철학에 대해 물어봐주세요."라고 안내.
6. 질문에 따라 적절한 컨텍스트(세계관, 프로젝트, 기술스택, 철학)를 활용해 자연스럽게 답변하세요.
`;
};

let genAI = null;
let model = null;

export const initializeAI = () => {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    console.log("🔑 Checking API Key:", API_KEY ? `Exists (${API_KEY.substring(0, 5)}...)` : "MISSING");

    if (!API_KEY) {
        console.warn("⚠️ Gemini API Key not found. AI Chat will not function.");
        return false;
    }
    try {
        genAI = new GoogleGenerativeAI(API_KEY);
        model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        return true;
    } catch (e) {
        console.error("AI Init Error:", e);
        return false;
    }
};

export const generateAIResponse = async (userMessage, history = []) => {
    if (!model) {
        const initialized = initializeAI();
        if (!initialized) return "죄송합니다. 현재 AI 시스템 연결(API Key)이 설정되지 않았습니다.";
    }

    try {
        const systemPrompt = getPortfolioContext();

        // Construct prompt with history
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt + "\n\nHello, who are you?" }],
                },
                {
                    role: "model",
                    parts: [{ text: "안녕하세요, 허예솔입니다! 제 포트폴리오 우주에 오신 것을 환영해요. 궁금한 게 있으시면 뭐든 물어보세요!" }],
                },
                ...history
            ],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const text = response.text();
        return text;

    } catch (error) {
        console.error("Gemini API Error:", error);
        return "시스템 통신 오류가 발생했습니다. 잠시 후 다시 시도해주세요. (Status: Connection Lost)";
    }
};
