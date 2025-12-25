import { GoogleGenerativeAI } from "@google/generative-ai";

// .env 파일에서 확인한 키를 사용하여 직접 테스트
const API_KEY = "AIzaSyAcfKsmxuH13-kohpFVfQb-VIrwdER8Gf8";

async function testConnection() {
    console.log("🟦 [System] AI 연결 테스트 시작...");
    console.log("🔑 API Key 확인 중...");

    if (!API_KEY) {
        console.error("❌ API Key가 없습니다.");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        console.log("📡 Gemini Pro 모델 연결 시도...");

        const prompt = "안녕? 너는 누구니? 짧게 한 문장으로 자기소개해줘.";
        console.log(`📤 질문 전송: "${prompt}"`);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("✅ [성공] 응답 수신 완료!");
        console.log("----------------------------------------");
        console.log(`🤖 AI: ${text}`);
        console.log("----------------------------------------");

    } catch (error) {
        console.error("❌ [오류] AI 연결 실패:");
        console.error(error);
    }
}

testConnection();
