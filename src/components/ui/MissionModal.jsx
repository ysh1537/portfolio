/**
 * MissionModal.jsx
 * Phase 34: Planetary Archives - 행성 클릭 시 상세 정보를 보여주는 홀로그램 모달
 */
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../hooks/useStore';
import useSoundFX from '../../hooks/useSoundFX';

const MissionModal = () => {
    const missionModalData = useStore((state) => state.missionModalData);
    const closeMissionModal = useStore((state) => state.closeMissionModal);
    const warpTo = useStore((state) => state.warpTo);
    const { playHover, playClick } = useSoundFX();

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') closeMissionModal();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [closeMissionModal]);

    // 모달 데이터가 없으면 렌더링하지 않음
    if (!missionModalData) return null;

    const { lab, config, warpPos } = missionModalData;
    const details = lab.details || {};

    // 행성으로 워프 (모달 닫고 씬 전환 + 카메라 이동)
    const handleWarp = () => {
        playClick();
        closeMissionModal();
        warpTo(config.target, warpPos); // warpPos 전달하여 카메라 애니메이션 활성화
    };

    return (
        <AnimatePresence>
            {missionModalData && (
                <motion.div
                    key="mission-modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto"
                    onClick={closeMissionModal}
                >
                    <motion.div
                        key="mission-modal-content"
                        initial={{ scale: 0.85, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-[90vw] max-w-4xl max-h-[85vh] flex flex-col md:flex-row overflow-hidden rounded-2xl border border-white/10 bg-black/95 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            boxShadow: `0 0 60px ${config.color}30, inset 0 0 30px ${config.color}10`
                        }}
                    >
                        {/* 좌측: 비주얼 & 스탯 */}
                        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 p-6 md:p-8 flex flex-col relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10"
                                style={{ background: `radial-gradient(circle at center, ${config.color}, transparent)` }} />

                            {/* 섹터 ID */}
                            <div className="text-3xl md:text-4xl font-black font-orbitron mb-1 tracking-tighter" style={{ color: config.color }}>
                                {lab.id}
                            </div>
                            <div className="text-xs font-mono text-white/50 mb-6 tracking-widest">
                                STATUS: <span className="text-emerald-400">{lab.status || 'ACTIVE'}</span>
                            </div>

                            {/* 미디어 영역 */}
                            <div className="flex-1 min-h-[150px] rounded-xl border border-white/10 bg-black/50 relative overflow-hidden mb-4 group">
                                {details.media && details.media.length > 0 ? (
                                    <img
                                        src={details.media[0]}
                                        alt={lab.name}
                                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-white/20 font-mono text-xs text-center p-4">
                                        [ NO VISUAL DATA ]<br />
                                        SCANNING...
                                    </div>
                                )}
                            </div>

                            {/* 퀵 스탯 */}
                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                                <div className="p-2 border border-white/10 rounded bg-white/5">
                                    <div className="text-white/40 mb-1">TECH</div>
                                    <div className="text-white font-bold">{lab.tech}</div>
                                </div>
                                <div className="p-2 border border-white/10 rounded bg-white/5">
                                    <div className="text-white/40 mb-1">TYPE</div>
                                    <div className="text-white font-bold text-[10px]">{lab.type}</div>
                                </div>
                            </div>
                        </div>

                        {/* 우측: 미션 리포트 */}
                        <div className="flex-1 p-6 md:p-8 flex flex-col relative z-10 overflow-y-auto">
                            {/* 헤더 */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold font-orbitron text-white mb-1">{lab.name}</h2>
                                    <h3 className="text-sm md:text-base text-white/60 font-rajdhani">{lab.description}</h3>
                                </div>
                                <button
                                    onClick={() => { playClick(); closeMissionModal(); }}
                                    onMouseEnter={playHover}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* 상세 설명 */}
                            {details.longDescription && (
                                <div className="text-sm text-white/70 leading-relaxed mb-6">
                                    <p>{details.longDescription}</p>
                                </div>
                            )}

                            {/* 기능 목록 */}
                            {details.features && details.features.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-xs font-bold font-orbitron text-white/80 mb-3 border-b border-white/10 pb-2 uppercase flex items-center gap-2">
                                        <span className="w-1 h-3 bg-emerald-500 rounded-full" />
                                        Mission Objectives
                                    </h4>
                                    <ul className="grid grid-cols-1 gap-2">
                                        {details.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center text-xs text-white/60 bg-white/5 px-3 py-2 rounded border border-white/5">
                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* 기술 스택 */}
                            {details.techStack && details.techStack.length > 0 && (
                                <div className="mb-auto">
                                    <h4 className="text-xs font-bold font-orbitron text-white/80 mb-3 border-b border-white/10 pb-2 uppercase flex items-center gap-2">
                                        <span className="w-1 h-3 bg-blue-500 rounded-full" />
                                        Technical Schematics
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {details.techStack.map((tech, idx) => (
                                            <span key={idx}
                                                className="px-2 py-1 text-[10px] font-mono rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 액션 버튼 */}
                            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                                <button
                                    onClick={closeMissionModal}
                                    onMouseEnter={playHover}
                                    className="px-4 py-2 rounded text-xs font-bold text-white/50 hover:text-white transition-colors uppercase font-mono tracking-wider"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleWarp}
                                    onMouseEnter={playHover}
                                    className="px-6 py-2 rounded text-xs font-bold tracking-widest uppercase font-orbitron flex items-center gap-2 transition-all hover:scale-105"
                                    style={{
                                        background: config.color,
                                        color: '#000',
                                        boxShadow: `0 0 20px ${config.color}50`
                                    }}
                                >
                                    <span>Enter Sector</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MissionModal;
