import { motion } from 'framer-motion';
import { Briefcase, Calendar, ChevronRight } from 'lucide-react';

const Career = () => {
    const careerHistory = [
        {
            company: "㈜이트라이브",
            team: "CTS(Culture Technology Squad) · PM",
            period: "2023.08 - 현재",
            description: "메타버스/XR 플랫폼 기획 및 프로젝트 총괄 관리 (Project Leader)",
            achievements: [
                "KOCCA R&D 'Hanok-meta' 기획 PL: 한옥 건축 시뮬레이션 플랫폼 구축 (중간평가 A등급, 3.75억)",
                "TIPA R&D 심리 메타버스 플랫폼 구축 PM: 상담/화상회의/메타버스 통합 플랫폼 기획 (7.5억)",
                "경남 온라인 안전체험원 구축 PM: VR360 파노라마 교육 콘텐츠 기획 및 일정 관리 (1.37억)",
                "학교안전공제중앙회 메타버스 안전교육 자료 개발 PM: 초등생 대상 안전교육 서비스 4종 개발 (1.42억)",
                "KISTi 고령자 XR 플랫폼 고도화 실무책임: 인지-운동 융합 훈련 콘텐츠 및 관리 시스템 개선",
                "전북 직업계고 홍보 ZEP 메타버스 Z-World 구축 PM: 31개 학교/학과 모델링 및 미니게임 기획"
            ]
        },
        {
            company: "㈜이츠자비스",
            team: "서비스개발팀 · 팀장",
            period: "2021.06 - 2023.06",
            description: "웹/메타버스 플랫폼 서비스 기획 및 사업 수주 전략 수립",
            achievements: [
                "1o1.GG 이스포츠 통합 플랫폼 구축 PM: 데이터 분석 기반 서비스 개선 및 투자 유치 (5억)",
                "메타버스 플랫폼 'Holiday' 구축 PM: 블록체인(Token/NFT) 경제 생태계 및 백서(Whitepaper) 설계",
                "NFT 'Cyber-holic' 프로젝트 PM: 스마트 컨트랙트 및 리워드 시스템 기획, 마켓플레이스 런칭",
                "인도네시아 합작법인 설립 및 자비스월드 블록체인 플랫폼 기획 참여"
            ]
        },
        {
            company: "수원대학교 북한경제연구소",
            team: "연구원",
            period: "2018.03 - 2019.02",
            description: "경제 데이터 수집 및 분석, 컨퍼런스 운영 지원",
            achievements: [
                "북한 경제 데이터베이스 구축을 위한 자료 수집 및 정리",
                "국제 학술 컨퍼런스 자료 준비 및 현장 운영 서포트"
            ]
        }
    ];

    return (
        <section className="py-20 relative z-10 text-white">
            <div className="container mx-auto px-6 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-end gap-6 mb-16 border-b border-white/10 pb-8"
                >
                    <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                        Experience
                    </h2>
                    <span className="text-gray-400 font-mono text-sm mb-2">
                        // TOTAL EXPERIENCE: 5 YEARS
                    </span>
                </motion.div>

                <div className="space-y-12">
                    {careerHistory.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-8 md:pl-0"
                        >
                            {/* Timeline Line (Desktop) */}
                            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-white/10 -ml-8 md:ml-0 md:left-[200px]" />

                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Left: Period & Company */}
                                <div className="md:w-fit flex-shrink-0 md:text-right pt-2">
                                    <div className="flex items-center gap-2 md:justify-end text-cyan-400 font-mono font-bold mb-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{item.period}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1 whitespace-nowrap">{item.company}</h3>
                                    <p className="text-sm text-gray-400 mb-2">{item.team}</p>
                                </div>

                                {/* Right: Details */}
                                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                                            <Briefcase className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white mb-1">{item.description}</h4>
                                        </div>
                                    </div>

                                    <ul className="space-y-3">
                                        {item.achievements.map((achievement, i) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                                                <ChevronRight className="w-4 h-4 text-cyan-500 mt-1 flex-shrink-0" />
                                                <span>
                                                    <strong className="text-white/80 mr-1">
                                                        {achievement.split(':')[0]}:
                                                    </strong>
                                                    {achievement.split(':')[1]}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Career;
