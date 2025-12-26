import React, { useState, useEffect, useRef } from 'react';
import { generateAIResponse } from '../../utils/aiService';
import { useStore } from '../../hooks/useStore';
import LargeHologramAvatar from '../3d/LargeHologramAvatar';

/**
 * 시네마틱 홀로그램 채팅 UI
 * 영화 스타일의 풀스크린 AI 대화 인터페이스
 */

// 빠른 질문 프리셋
const quickQuestions = [
    { label: "소개", question: "너 자신에 대해 소개해줘" },
    { label: "기술스택", question: "주력 기술 스택이 뭐야?" },
    { label: "프로젝트", question: "가장 자랑하고 싶은 프로젝트가 뭐야?" },
    { label: "수상내역", question: "수상 내역 알려줘" },
    { label: "연락처", question: "연락하고 싶으면 어떻게 해야 해?" },
];

const CinematicHologramChat = ({ onClose }) => {
    const config = useStore(state => state.lab02Config);
    const isZeroG = config?.zeroG || false;

    const [messages, setMessages] = useState([
        { role: 'system', text: '>>> HOLOGRAPHIC INTERFACE ACTIVATED <<<' },
        { role: 'model', text: '안녕하세요, 허예솔입니다. 제 포트폴리오 우주에 오신 것을 환영해요! 궁금한 게 있으시면 뭐든 물어보세요. 🚀' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [currentResponse, setCurrentResponse] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, currentResponse]);

    // ESC 키로 닫기
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSend = async (questionText = null) => {
        const userMsg = (questionText || input).trim();
        if (!userMsg || isThinking) return;

        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsThinking(true);
        setCurrentResponse('');

        // Convert messages to Gemini history format
        const history = messages
            .filter(m => m.role === 'user' || m.role === 'model')
            .map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

        const response = await generateAIResponse(userMsg, history);

        // 타이핑 효과
        let displayedText = '';
        for (let i = 0; i < response.length; i++) {
            displayedText += response[i];
            setCurrentResponse(displayedText);
            await new Promise(resolve => setTimeout(resolve, 15));
        }

        setIsThinking(false);
        setCurrentResponse('');
        setMessages(prev => [...prev, { role: 'model', text: response }]);
    };

    // 테마 색상
    const theme = isZeroG
        ? { accent: 'purple', border: 'border-purple-500', text: 'text-purple-400', glow: 'shadow-purple-500/30' }
        : { accent: 'cyan', border: 'border-cyan-500', text: 'text-cyan-400', glow: 'shadow-cyan-500/30' };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl">
            {/* 배경 그리드 효과 */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `linear-gradient(${isZeroG ? '#a855f7' : '#06b6d4'} 1px, transparent 1px), 
                                      linear-gradient(90deg, ${isZeroG ? '#a855f7' : '#06b6d4'} 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            />

            {/* 메인 컨테이너 */}
            <div className="relative w-full max-w-5xl h-[90vh] flex flex-col items-center p-8">

                {/* 상단 헤더 */}
                <div className={`w-full flex justify-between items-center mb-4 ${theme.text} font-mono text-xs tracking-widest`}>
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full bg-${theme.accent}-500 animate-pulse`} />
                        <span>HOLOGRAPHIC INTERFACE v2.0</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="opacity-50">SIGNAL: STABLE</span>
                        <span className={`animate-pulse text-${theme.accent}-400`}>● CONNECTED</span>
                    </div>
                </div>

                {/* 중앙 홀로그램 영역 */}
                <div className="flex-1 flex flex-col items-center justify-center relative w-full">

                    {/* 대형 홀로그램 아바타 */}
                    <div className="relative mb-6">
                        <LargeHologramAvatar isSpeaking={isThinking || currentResponse.length > 0} />

                        {/* 홀로그램 베이스 글로우 */}
                        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-2 bg-${theme.accent}-500/30 blur-xl rounded-full`} />
                    </div>

                    {/* AI 대사 영역 */}
                    <div className={`w-full max-w-2xl bg-black/60 ${theme.border} border rounded-lg p-6 backdrop-blur-md shadow-lg ${theme.glow}`}>
                        <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-3">
                            {messages.slice(-3).map((msg, idx) => (
                                <div key={idx} className={`text-sm ${msg.role === 'user' ? 'text-white/70 text-right' : msg.role === 'system' ? 'text-center text-white/30 font-mono text-xs' : `${theme.text}`}`}>
                                    {msg.role === 'user' && <span className="text-white/40 mr-2">[YOU]</span>}
                                    {msg.role === 'model' && <span className={`${theme.text} opacity-50 mr-2`}>[YESOL]</span>}
                                    <span className={msg.role === 'model' ? 'text-white' : ''}>{msg.text}</span>
                                </div>
                            ))}
                            {currentResponse && (
                                <div className={`text-sm`}>
                                    <span className={`${theme.text} opacity-50 mr-2`}>[YESOL]</span>
                                    <span className="text-white">{currentResponse}<span className="animate-pulse">▊</span></span>
                                </div>
                            )}
                            {isThinking && !currentResponse && (
                                <div className={`text-sm ${theme.text}`}>
                                    <span className="opacity-50 mr-2">[YESOL]</span>
                                    <span className="animate-pulse">생각 중...</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* 빠른 질문 버튼 */}
                    <div className="flex flex-wrap gap-2 mt-6 justify-center">
                        {quickQuestions.map((q, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(q.question)}
                                disabled={isThinking}
                                className={`px-4 py-2 rounded-full border ${theme.border}/50 ${theme.text} text-xs font-mono
                                    hover:bg-${theme.accent}-500/20 hover:border-${theme.accent}-400 transition-all
                                    disabled:opacity-30 disabled:cursor-not-allowed`}
                            >
                                ▸ {q.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 하단 입력 영역 */}
                <div className="w-full max-w-2xl mt-6">
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="메시지를 입력하세요..."
                            disabled={isThinking}
                            className={`w-full bg-black/70 border ${theme.border}/50 rounded-lg px-6 py-4 pr-14
                                text-white font-mono placeholder-white/30
                                focus:outline-none focus:${theme.border} focus:shadow-[0_0_20px_rgba(6,182,212,0.3)]
                                transition-all disabled:opacity-50`}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isThinking}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 ${theme.text}
                                hover:text-white disabled:opacity-30 transition-colors text-xl`}
                        >
                            ➤
                        </button>
                    </form>
                </div>

                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 px-4 py-2 border ${theme.border}/30 rounded ${theme.text}/70
                        hover:bg-${theme.accent}-500/20 hover:${theme.border} transition-all font-mono text-xs tracking-widest`}
                >
                    [X] TERMINATE
                </button>

                {/* 하단 정보 */}
                <div className="absolute bottom-4 left-4 text-white/20 font-mono text-[10px]">
                    ESC to close • Powered by Gemini AI
                </div>
            </div>
        </div>
    );
};

export default CinematicHologramChat;
