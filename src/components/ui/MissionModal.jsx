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

    // Lab Configs for Telemetry
    const lab01Config = useStore((state) => state.lab01Config);
    const lab02Config = useStore((state) => state.lab02Config);
    const lab03Config = useStore((state) => state.lab03Config);

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
                        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 p-6 md:p-8 flex flex-col relative overflow-hidden bg-black/40">
                            <div className="absolute inset-0 opacity-10"
                                style={{ background: `radial-gradient(circle at center, ${config.color}, transparent)` }} />

                            {/* 섹터 ID */}
                            <div className="text-3xl md:text-4xl font-black font-orbitron mb-1 tracking-tighter" style={{ color: config.color }}>
                                {lab.id}
                            </div>
                            <div className="text-xs font-mono text-white/50 mb-6 tracking-widest uppercase flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                SYSTEM: <span className="text-emerald-400">ONLINE</span>
                            </div>

                            {/* 미디어 영역 (Holographic Preview) */}
                            <div className="aspect-square w-full rounded-xl border border-white/10 bg-black/50 relative overflow-hidden mb-6 group">
                                {details.media && details.media.length > 0 ? (
                                    <img
                                        src={details.media[0]}
                                        alt={lab.name}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700 scale-110 group-hover:scale-100"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-white/20 font-mono text-[10px] text-center p-4">
                                        SCANNING UNIT...
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-3 left-3 text-[9px] font-mono text-white/40">SEC_PREVIEW_0{lab.id.slice(-1)}</div>
                            </div>

                            {/* [NEW] Live Telemetry - 실제 랩 파라미터 연결 */}
                            <div className="space-y-3 mb-6">
                                <h4 className="text-[10px] font-bold font-mono text-white/30 uppercase tracking-[0.2em] mb-3 border-b border-white/5 pb-1">
                                    LIVE TELEMETRY
                                </h4>
                                {lab.id === 'LAB-01' && (
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex justify-between text-[10px] font-mono"><span className="text-white/40">DISTORTION</span><span className="text-cyan-400">{lab01Config.distort.toFixed(2)}</span></div>
                                        <div className="flex justify-between text-[10px] font-mono"><span className="text-white/40">COLOR_MODE</span><span className="text-cyan-400">{lab01Config.color.toUpperCase()}</span></div>
                                        <div className="flex justify-between text-[10px] font-mono"><span className="text-white/40">FLOW_SPEED</span><span className="text-cyan-400">{lab01Config.speed.toFixed(1)}</span></div>
                                    </div>
                                )}
                                {lab.id === 'LAB-02' && (
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex justify-between text-[10px] font-mono"><span className="text-white/40">GRAVITY</span><span className="text-emerald-400">{lab02Config.zeroG ? 'ZERO_G' : 'NORMAL'}</span></div>
                                        <div className="flex justify-between text-[10px] font-mono"><span className="text-white/40">ENV_VECTOR</span><span className="text-emerald-400">[{lab02Config.gravity.join(', ')}]</span></div>
                                        <div className="flex justify-between text-[10px] font-mono"><span className="text-white/40">SIM_ENGINE</span><span className="text-emerald-400">ENABLED</span></div>
                                    </div>
                                )}
                                {lab.id === 'LAB-03' && (
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex justify-between text-[10px] font-mono"><span className="text-white/40">REACTIVE</span><span className="text-yellow-400">{lab03Config.mode === 'mic' ? 'MIC_INPUT' : 'DEMO_OSC'}</span></div>
                                        <div className="flex justify-between text-[10px] font-mono"><span className="text-white/40">FREQUENCY</span><span className="text-yellow-400">SYNCED</span></div>
                                        <div className="flex justify-between text-[10px] font-mono"><span className="text-white/40">VIZ_MODULE</span><span className="text-yellow-400">FFT_3D</span></div>
                                    </div>
                                )}
                                {lab.id === 'LAB-04' && (
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex justify-between text-[10px] font-mono"><span className="text-white/40">INTEGRITY</span><span className="text-red-400">STABLE</span></div>
                                        <div className="flex justify-between text-[10px] font-mono"><span className="text-white/40">DB_CONNECTION</span><span className="text-red-400">FIREBASE</span></div>
                                        <div className="flex justify-between text-[10px] font-mono"><span className="text-white/40">GLITCH_SCAN</span><span className="text-red-400">READY</span></div>
                                    </div>
                                )}
                            </div>

                            {/* 퀵 스탯 */}
                            <div className="mt-auto grid grid-cols-2 gap-2 text-[10px] font-mono">
                                <div className="p-2 border border-white/5 rounded bg-white/5">
                                    <div className="text-white/20 mb-1">TECH</div>
                                    <div className="text-white/80 font-bold">{lab.tech}</div>
                                </div>
                                <div className="p-2 border border-white/5 rounded bg-white/5">
                                    <div className="text-white/20 mb-1">TYPE</div>
                                    <div className="text-white/80 font-bold">{lab.type.split(' ')[0]}</div>
                                </div>
                            </div>
                        </div>

                        {/* 우측: 미션 리포트 */}
                        <div className="flex-1 p-6 md:p-8 flex flex-col relative z-10 overflow-y-auto custom-scrollbar">
                            {/* 헤더 */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold font-orbitron text-white mb-1 tracking-tight">{lab.name}</h2>
                                    <h3 className="text-sm md:text-base text-white/50 font-rajdhani italic">{lab.description}</h3>
                                </div>
                                <button
                                    onClick={() => { playClick(); closeMissionModal(); }}
                                    onMouseEnter={playHover}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/30 hover:text-white"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* 1. 섹터 개요 */}
                                <div className="text-sm text-white/70 leading-relaxed font-sans">
                                    <p className="border-l-2 border-white/20 pl-4 py-1">{details.longDescription}</p>
                                </div>

                                {/* 2. 핵심 실험 모듈 (실제 기능 연결) */}
                                {details.features && details.features.length > 0 && (
                                    <div>
                                        <h4 className="text-[11px] font-bold font-mono text-white/40 mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.color }} />
                                            Active Modules (핵심 기능)
                                        </h4>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {details.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center text-[11px] text-white/70 bg-white/5 px-3 py-2.5 rounded border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                                                    <span className="w-1 h-1 bg-white/30 rounded-full mr-3" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* 3. 기술 아키텍처 (Technical Schematics) */}
                                {details.techStack && details.techStack.length > 0 && (
                                    <div>
                                        <h4 className="text-[11px] font-bold font-mono text-white/40 mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.color }} />
                                            Tech Schematics (기술 스택)
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {details.techStack.map((tech, idx) => (
                                                <span key={idx}
                                                    className="px-2 py-1 text-[10px] font-mono rounded bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* 액션 버튼 */}
                            <div className="mt-12 flex items-center justify-end gap-3 border-t border-white/10 pt-6">
                                <button
                                    onClick={closeMissionModal}
                                    onMouseEnter={playHover}
                                    className="px-5 py-2.5 rounded text-[11px] font-bold text-white/40 hover:text-white transition-colors uppercase font-mono tracking-widest"
                                >
                                    CLOSE
                                </button>
                                <button
                                    onClick={handleWarp}
                                    onMouseEnter={playHover}
                                    className="px-8 py-2.5 rounded text-[11px] font-bold tracking-[0.3em] uppercase font-mono flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                                    style={{
                                        background: config.color,
                                        color: '#000',
                                        boxShadow: `0 0 30px ${config.color}40`
                                    }}
                                >
                                    <span>ENTER SECTOR</span>
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
