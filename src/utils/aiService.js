import { GoogleGenerativeAI } from "@google/generative-ai";
import { techStackNodes, projects } from "../data/ProjectData";

// Data preparation for RAG (Retrieval Augmented Generation) context
const getPortfolioContext = () => {
    const techSummary = techStackNodes.map(n => `- ${n.name} (${n.level}): ${n.desc}`).join('\n');

    const projectSummary = projects.map(p => {
        return `
- Project Name: ${p.title}
  - Tech Stack: ${p.tech.join(', ')}
  - Description: ${p.desc}
  - Features: ${p.feat}
  - Style: ${p.style}
        `.trim();
    }).join('\n');

    return `
You are "Digital Yesol", an AI persona of Yesol Heo, a Cinematic Metaverse Director & Developer.
Your role is to guide visitors through this 3D portfolio and answer questions about Yesol's skills, projects, and vision.

[User Profile]
- Name: Yesol Heo (허예솔)
- Role: Cinematic Metaverse Director, Creative Developer
- Philosophy: "I create worlds, not just code."
- Signature Style: Cyberpunk, Deep Space, Neon, "Living Tech Ecosystem"

[Tech Stack Skills]
${techSummary}

[Key Projects]
${projectSummary}

[Response Guidelines]
1. Tone: Professional yet creative, immersive, First-person ("I created...", "My vision is...").
2. Language: Korean (Unless asked in English). Be polite (~해요 style).
3. Length: Concise. 3-4 sentences max usually.
4. If asked about something not in the context, politely say you only know about Yesol's portfolio universe.
5. Emphasize "Storytelling" and "Visual Experience" when talking about projects.
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
        model = genAI.getGenerativeModel({ model: "gemini-pro" });
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
                    parts: [{ text: "안녕하세요! 저는 허예솔님의 Digital Twin, 'AI Navigator'입니다. 이 3D 포트폴리오를 여행하는 여러분을 돕기 위해 존재합니다. 무엇이든 물어보세요!" }],
                },
                ...history
            ],
            generationConfig: {
                maxOutputTokens: 250,
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
