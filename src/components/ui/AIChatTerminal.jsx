import React, { useState, useEffect, useRef } from 'react';
import { generateAIResponse } from '../../utils/aiService';
import { useStore } from '../../hooks/useStore';
import Holo3DAvatar from '../3d/Holo3DAvatar';

const AIChatTerminal = ({ onExpand }) => {
    const config = useStore(state => state.lab02Config);
    const isZeroG = config.zeroG || false;

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'system', text: 'SYSTEM: HOLOGRAM LINK ESTABLISHED...' },
        { role: 'model', text: '안녕하세요, 허예솔입니다. 제 포트폴리오 우주에 오신 것을 환영해요! 궁금한 점이 있으시면 뭐든 물어보세요.' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isThinking) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsThinking(true);

        // Convert messages to Gemini history format (excluding system/visual logs)
        const history = messages
            .filter(m => m.role === 'user' || m.role === 'model')
            .map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

        const response = await generateAIResponse(userMsg, history);

        setIsThinking(false);
        setMessages(prev => [...prev, { role: 'model', text: response }]);
    };

    // Color Theme based on Gravity Mode
    const theme = isZeroG
        ? {
            bg: 'bg-black/90',
            border: 'border-purple-500/50',
            text: 'text-purple-100',
            accent: 'text-purple-400',
            glow: 'shadow-[0_0_30px_rgba(168,85,247,0.2)]',
            inputBg: 'bg-purple-900/20'
        }
        : {
            bg: 'bg-black/90',
            border: 'border-emerald-500/50',
            text: 'text-emerald-100',
            accent: 'text-emerald-400',
            glow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]',
            inputBg: 'bg-emerald-900/20'
        };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 right-8 z-50 px-6 py-3 rounded-full 
                    ${theme.bg} backdrop-blur-md border ${theme.border} ${theme.text}
                    font-mono font-bold tracking-widest text-xs hover:scale-105 transition-all
                    flex items-center gap-3 ${theme.glow}`}
            >
                <span className={`w-2 h-2 rounded-full ${isZeroG ? 'bg-purple-500' : 'bg-emerald-500'} animate-pulse`} />
                [?] ASK AI NAVIGATOR
            </button>
        );
    }

    return (
        <div className={`fixed bottom-8 right-8 z-50 w-[380px] h-[500px] flex flex-col rounded-lg 
            ${theme.bg} backdrop-blur-xl border ${theme.border} ${theme.glow} transition-all duration-500`}>

            {/* Header */}
            <div className={`flex justify-between items-center p-4 border-b ${theme.border} bg-white/5`}>
                <div className="flex items-center gap-4">
                    <Holo3DAvatar isSpeaking={isThinking} />
                    <div className="flex flex-col justify-center">
                        <div className={`text-xs font-bold tracking-widest ${theme.accent}`}>AI NAVIGATOR</div>
                        <div className="text-[10px] text-white/40 font-mono">STATUS: ONLINE</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {onExpand && (
                        <button
                            onClick={onExpand}
                            className={`${theme.accent} hover:text-white transition-colors text-xs font-mono`}
                            title="시네마틱 모드로 확장"
                        >
                            ⬡ EXPAND
                        </button>
                    )}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        _MINIMIZE
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg ${msg.role === 'user'
                            ? 'bg-white/10 text-white rounded-tr-none'
                            : `bg-black/40 border border-white/10 ${theme.text} rounded-tl-none`
                            }`}>
                            {msg.role === 'system' ? (
                                <span className="text-[10px] font-mono opacity-50 block text-center">
                                    {msg.text}
                                </span>
                            ) : (
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            )}
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="flex justify-start">
                        <div className={`bg-black/40 border border-white/10 p-3 rounded-lg rounded-tl-none`}>
                            <span className="flex gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${theme.accent} bg-current animate-bounce`} style={{ animationDelay: '0ms' }} />
                                <span className={`w-1.5 h-1.5 rounded-full ${theme.accent} bg-current animate-bounce`} style={{ animationDelay: '150ms' }} />
                                <span className={`w-1.5 h-1.5 rounded-full ${theme.accent} bg-current animate-bounce`} style={{ animationDelay: '300ms' }} />
                            </span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className={`p-4 border-t ${theme.border}`}>
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="이 생태계에 대해 물어보세요..."
                        className={`w-full bg-black/50 border border-white/10 rounded px-4 py-3 pr-10
                            text-white text-sm focus:outline-none focus:border-${isZeroG ? 'purple' : 'emerald'}-500/50 transition-colors`}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isThinking}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white disabled:opacity-30`}
                    >
                        ➤
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AIChatTerminal;
