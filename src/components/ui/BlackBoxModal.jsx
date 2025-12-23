/**
 * BlackBoxModal.jsx
 * Phase 37: Integrated CMS - Headless Fetching
 * 
 * 개발 로그를 읽는 CRT 터미널 스타일의 몰입형 UI
 * Local Data와 Sanity CMS를 모두 지원하는 하이브리드 리더
 */
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../hooks/useStore';
import useSoundFX from '../../hooks/useSoundFX';
import { tagColors } from '../../data/DevLogData'; // Colors only
import { useDevLogs } from '../../hooks/useDevLogs'; // Hook Import

const BlackBoxModal = () => {
    const blackBoxOpen = useStore((state) => state.blackBoxOpen);
    const currentLogId = useStore((state) => state.currentLogId);
    const closeBlackBox = useStore((state) => state.closeBlackBox);
    const { playHover, playClick } = useSoundFX();

    // Data Fetching
    const { logs: devLogs, isLoading, source } = useDevLogs();

    // 선택된 로그
    const [selectedLogId, setSelectedLogId] = useState(null);
    // 태그 필터
    const [activeTag, setActiveTag] = useState(null);

    // 초기 로그 설정 (로딩 완료 후)
    useEffect(() => {
        if (!isLoading && blackBoxOpen) {
            if (currentLogId) {
                // 특정 로그 ID가 지정된 경우
                setSelectedLogId(currentLogId);
            } else if (!selectedLogId && devLogs.length > 0) {
                // 지정되지 않았으면 최신 로그(첫번째) 선택
                setSelectedLogId(devLogs[0]?.id);
            }
        }
    }, [blackBoxOpen, currentLogId, isLoading, devLogs]);

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') closeBlackBox();
        };
        if (blackBoxOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [blackBoxOpen, closeBlackBox]);

    // 필터된 로그 목록
    const filteredLogs = useMemo(() => {
        if (!devLogs) return [];
        if (!activeTag) return devLogs;
        return devLogs.filter(log => log.tags.includes(activeTag));
    }, [activeTag, devLogs]);

    // 모든 태그 추출
    const allTags = useMemo(() => {
        const tags = new Set();
        if (devLogs) {
            devLogs.forEach(log => log.tags.forEach(tag => tags.add(tag)));
        }
        return Array.from(tags);
    }, [devLogs]);

    // 선택된 로그 데이터
    const selectedLog = devLogs.find(log => log.id === selectedLogId);

    if (!blackBoxOpen) return null;

    return (
        <AnimatePresence>
            {blackBoxOpen && (
                <motion.div
                    key="blackbox-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md pointer-events-auto"
                    onClick={closeBlackBox}
                >
                    <motion.div
                        key="blackbox-content"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-[95vw] max-w-6xl h-[85vh] flex flex-col md:flex-row overflow-hidden rounded-lg border border-cyan-500/30 bg-black shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            boxShadow: '0 0 60px rgba(6, 182, 212, 0.2), inset 0 0 100px rgba(6, 182, 212, 0.05)'
                        }}
                    >
                        {/* 스캔라인 오버레이 */}
                        <div className="absolute inset-0 pointer-events-none z-50 opacity-10"
                            style={{
                                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
                            }}
                        />

                        {/* 터미널 헤더 */}
                        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-cyan-950/80 to-transparent border-b border-cyan-500/20 flex items-center justify-between px-4 z-40">
                            <div className="flex items-center gap-2">
                                <span className="text-cyan-400 font-mono text-sm">▒</span>
                                <span className="text-cyan-300 font-mono text-xs tracking-widest">
                                    BLACK BOX :: SYSTEM ARCHIVE v2.1
                                    <span className="ml-2 text-[10px] opacity-70">
                                        [{isLoading ? 'BOOTING...' : `LINK: ${source}`}]
                                    </span>
                                </span>
                            </div>
                            <button
                                onClick={() => { playClick(); closeBlackBox(); }}
                                onMouseEnter={playHover}
                                className="text-cyan-500/70 hover:text-cyan-300 transition-colors text-xl font-mono"
                            >
                                ×
                            </button>
                        </div>

                        {/* 로딩 상태 */}
                        {isLoading ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-cyan-500 font-mono">
                                <div className="text-xl animate-pulse mb-4">ESTABLISHING UPLINK...</div>
                                <div className="text-sm opacity-70">Connecting to Satellite Database</div>
                            </div>
                        ) : (
                            <>
                                {/* 좌측 사이드바: 로그 목록 */}
                                <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-cyan-500/20 pt-12 pb-4 flex flex-col bg-black/50 overflow-hidden">
                                    {/* 로그 섹션 */}
                                    <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
                                        <h3 className="text-cyan-400 font-mono text-xs tracking-widest mb-3 border-b border-cyan-500/20 pb-2">
                                            ARCHIVE LOGS [{filteredLogs.length}]
                                        </h3>
                                        <div className="space-y-1">
                                            {filteredLogs.map((log) => (
                                                <button
                                                    key={log.id}
                                                    onClick={() => { playClick(); setSelectedLogId(log.id); }}
                                                    onMouseEnter={playHover}
                                                    className={`w-full text-left px-3 py-2 rounded border transition-all text-xs font-mono group ${selectedLogId === log.id
                                                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                                                        : 'border-transparent hover:border-cyan-500/30 hover:bg-cyan-500/5 text-white/60 hover:text-white'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-cyan-500">{selectedLogId === log.id ? '▶' : '○'}</span>
                                                        <span className="truncate group-hover:text-cyan-200 transition-colors">{log.title}</span>
                                                    </div>
                                                    <div className="text-[10px] text-white/40 mt-1 pl-5">{log.date}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 태그 필터 */}
                                    <div className="px-4 pt-4 border-t border-cyan-500/20">
                                        <h3 className="text-cyan-400 font-mono text-xs tracking-widest mb-2">TAGS</h3>
                                        <div className="flex flex-wrap gap-1">
                                            <button
                                                onClick={() => { playClick(); setActiveTag(null); }}
                                                onMouseEnter={playHover}
                                                className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-all ${activeTag === null
                                                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                                                    : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'
                                                    }`}
                                            >
                                                ALL
                                            </button>
                                            {allTags.slice(0, 10).map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => { playClick(); setActiveTag(tag); }}
                                                    onMouseEnter={playHover}
                                                    className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-all ${activeTag === tag
                                                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                                                        : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'
                                                        }`}
                                                    style={activeTag === tag ? { borderColor: tagColors[tag] || '#06b6d4', color: tagColors[tag] || '#06b6d4' } : {}}
                                                >
                                                    #{tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 우측: 콘텐츠 뷰어 */}
                                <div className="flex-1 pt-12 pb-6 px-6 overflow-y-auto custom-scrollbar">
                                    {selectedLog ? (
                                        <div className="max-w-3xl mx-auto">
                                            {/* 로그 헤더 */}
                                            <div className="mb-6 border-b border-cyan-500/20 pb-4">
                                                <div className="text-cyan-500 font-mono text-[10px] tracking-widest mb-2">
                                                    LOG ENTRY: {selectedLog.id ? selectedLog.id.toUpperCase() : 'UNKNOWN'}
                                                </div>
                                                <h1 className="text-2xl md:text-3xl font-bold text-white font-orbitron mb-2">
                                                    {selectedLog.title}
                                                </h1>
                                                <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                                                    <span className="text-white/40">DATE: <span className="text-cyan-300">{selectedLog.date}</span></span>
                                                    <div className="flex gap-1">
                                                        {selectedLog.tags && selectedLog.tags.map(tag => (
                                                            <span
                                                                key={tag}
                                                                className="px-2 py-0.5 rounded-full text-[10px] border"
                                                                style={{
                                                                    borderColor: `${tagColors[tag] || '#06b6d4'}50`,
                                                                    color: tagColors[tag] || '#06b6d4',
                                                                    backgroundColor: `${tagColors[tag] || '#06b6d4'}15`
                                                                }}
                                                            >
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-white/60 text-sm mt-3 italic">{selectedLog.summary}</p>
                                            </div>

                                            {/* 마크다운 콘텐츠 */}
                                            <div className="prose prose-invert prose-cyan max-w-none pb-20">
                                                <MarkdownRenderer content={selectedLog.content} />
                                            </div>

                                            {/* 네비게이션 */}
                                            <div className="mt-8 pt-4 border-t border-cyan-500/20 flex justify-between">
                                                <NavigationButton
                                                    direction="prev"
                                                    logs={devLogs}
                                                    currentId={selectedLogId}
                                                    onNavigate={(id) => { playClick(); setSelectedLogId(id); }}
                                                />
                                                <NavigationButton
                                                    direction="next"
                                                    logs={devLogs}
                                                    currentId={selectedLogId}
                                                    onNavigate={(id) => { playClick(); setSelectedLogId(id); }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-white/30 font-mono text-sm">
                                            [NO LOG SELECTED]
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* CRT 글로우 효과 */}
                        <div className="absolute inset-0 pointer-events-none rounded-lg"
                            style={{
                                boxShadow: 'inset 0 0 150px rgba(6, 182, 212, 0.1)'
                            }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

/**
 * 간단한 마크다운 렌더러
 * 헤딩, 코드 블록, 리스트, 테이블, 인라인 스타일 지원
 */
const MarkdownRenderer = ({ content }) => {
    if (!content) return null;

    const lines = content.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeContent = [];
    let inTable = false;
    let tableRows = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 코드 블록 시작/종료
        if (line.startsWith('```')) {
            if (inCodeBlock) {
                elements.push(
                    <pre key={`code-${i}`} className="bg-black/50 border border-cyan-500/20 rounded-lg p-4 overflow-x-auto my-4 text-left">
                        <code className="text-xs md:text-sm font-mono text-cyan-300/90 whitespace-pre">{codeContent.join('\n')}</code>
                    </pre>
                );
                codeContent = [];
                inCodeBlock = false;
            } else {
                inCodeBlock = true;
            }
            continue;
        }

        if (inCodeBlock) {
            codeContent.push(line);
            continue;
        }

        // 테이블 처리
        if (line.includes('|') && line.trim().startsWith('|')) {
            if (!inTable) {
                inTable = true;
                tableRows = [];
            }
            // 구분선 스킵
            if (line.includes('---')) continue;
            tableRows.push(line.split('|').filter(cell => cell.trim()).map(cell => cell.trim()));
            continue;
        } else if (inTable) {
            elements.push(
                <div key={`table-${i}`} className="overflow-x-auto">
                    <table className="w-full my-4 text-sm border-collapse min-w-[500px]">
                        <thead>
                            <tr className="border-b border-cyan-500/30">
                                {tableRows[0]?.map((cell, idx) => (
                                    <th key={idx} className="text-left py-2 px-3 text-cyan-400 font-mono whitespace-nowrap">{cell}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows.slice(1).map((row, rowIdx) => (
                                <tr key={rowIdx} className="border-b border-white/10 hover:bg-white/5">
                                    {row.map((cell, cellIdx) => (
                                        <td key={cellIdx} className="py-2 px-3 text-white/70">{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
            inTable = false;
            tableRows = [];
        }

        // 빈 줄
        if (!line.trim()) {
            elements.push(<div key={`space-${i}`} className="h-4" />);
            continue;
        }

        // H2
        if (line.startsWith('## ')) {
            elements.push(
                <h2 key={`h2-${i}`} className="text-xl font-bold text-cyan-400 mt-6 mb-3 font-orbitron border-l-2 border-cyan-500 pl-3">
                    {line.slice(3)}
                </h2>
            );
            continue;
        }

        // H3
        if (line.startsWith('### ')) {
            elements.push(
                <h3 key={`h3-${i}`} className="text-lg font-bold text-white mt-4 mb-2">
                    {line.slice(4)}
                </h3>
            );
            continue;
        }

        // 인용
        if (line.startsWith('> ')) {
            elements.push(
                <blockquote key={`quote-${i}`} className="border-l-2 border-purple-500 pl-4 my-4 text-white/70 italic bg-purple-500/5 py-2 pr-4 rounded-r">
                    {renderInline(line.slice(2))}
                </blockquote>
            );
            continue;
        }

        // 리스트
        if (line.match(/^(\d+)\. /)) {
            elements.push(
                <div key={`li-${i}`} className="flex gap-2 text-white/80 my-1 ml-2">
                    <span className="text-cyan-500 font-mono">{line.match(/^(\d+)/)[1]}.</span>
                    <span>{renderInline(line.replace(/^\d+\. /, ''))}</span>
                </div>
            );
            continue;
        }

        if (line.startsWith('- ')) {
            elements.push(
                <div key={`li-${i}`} className="flex gap-2 text-white/80 my-1 ml-2">
                    <span className="text-cyan-500">•</span>
                    <span>{renderInline(line.slice(2))}</span>
                </div>
            );
            continue;
        }

        // 수평선
        if (line === '---') {
            elements.push(<hr key={`hr-${i}`} className="my-6 border-cyan-500/20" />);
            continue;
        }

        // 일반 단락
        elements.push(
            <p key={`p-${i}`} className="text-white/80 leading-relaxed my-2">
                {renderInline(line)}
            </p>
        );
    }

    return <>{elements}</>;
};

/**
 * 인라인 마크다운 처리 (볼드, 이탤릭, 코드, 링크)
 */
const renderInline = (text) => {
    // 간단한 인라인 코드 처리
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/);
    return parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={i} className="bg-cyan-500/10 text-cyan-300 px-1 rounded text-sm font-mono">{part.slice(1, -1)}</code>;
        }
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i} className="italic text-white/70">{part.slice(1, -1)}</em>;
        }
        return part;
    });
};

/**
 * 이전/다음 로그 네비게이션 버튼
 */
const NavigationButton = ({ direction, logs, currentId, onNavigate }) => {
    if (!logs) return null;
    const currentIndex = logs.findIndex(log => log.id === currentId);
    const targetIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    const targetLog = logs[targetIndex];

    if (!targetLog) return <div />;

    return (
        <button
            onClick={() => onNavigate(targetLog.id)}
            className="flex items-center gap-2 text-xs font-mono text-white/50 hover:text-cyan-400 transition-colors group"
        >
            {direction === 'prev' && <span className="text-cyan-500 group-hover:-translate-x-1 transition-transform">←</span>}
            <span className="hidden md:inline">{targetLog.title}</span>
            <span className="md:hidden">{direction === 'prev' ? 'PREV' : 'NEXT'}</span>
            {direction === 'next' && <span className="text-cyan-500 group-hover:translate-x-1 transition-transform">→</span>}
        </button>
    );
};

export default BlackBoxModal;
