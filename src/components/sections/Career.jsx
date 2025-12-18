import { motion } from 'framer-motion';

const Career = () => {
    return (
        <section className="py-20 relative z-10 text-white">
            <div className="container mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
                >
                    Professional Journey
                </motion.h2>

                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Role 1 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="border-l-2 border-cyan-500 pl-8 relative pb-12"
                    >
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-cyan-500 shadow-[0_0_10px_cyan]" />
                        <h3 className="text-2xl font-bold mb-2">Cinematic Metaverse Director</h3>
                        <p className="text-cyan-400 font-mono mb-4">2023 - Present | Freelance Lead</p>
                        <p className="text-gray-300 leading-relaxed">
                            Web 3.0 환경에서의 몰입형 경험을 설계하고 연출합니다.
                            Three.js와 R3F를 활용한 웹 기반 3D 인터랙티브 콘텐츠 제작을 총괄하며,
                            사용자 경험(UX)과 스토리텔링이 결합된 시네마틱 유니버스를 구축하고 있습니다.
                        </p>
                    </motion.div>

                    {/* Role 2 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="border-l-2 border-purple-500 pl-8 relative pb-12"
                    >
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_purple]" />
                        <h3 className="text-2xl font-bold mb-2">Metaverse Project Manager</h3>
                        <p className="text-purple-400 font-mono mb-4">2021 - 2023 | Creative Studio</p>
                        <p className="text-gray-300 leading-relaxed">
                            대규모 메타버스 플랫폼 구축 프로젝트를 리딩했습니다.
                            기획 단계부터 개발, 런칭까지 전 과정을 관리하며
                            최적화된 3D 에셋 파이프라인과 실시간 인터랙션 시스템을 설계했습니다.
                        </p>
                    </motion.div>

                    {/* Education */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="border-l-2 border-pink-500 pl-8 relative"
                    >
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-pink-500 shadow-[0_0_10px_pink]" />
                        <h3 className="text-2xl font-bold mb-2">Digital Art & Technology</h3>
                        <p className="text-pink-400 font-mono mb-4">2017 - 2021 | University Degree</p>
                        <p className="text-gray-300 leading-relaxed">
                            미디어 아트와 인터랙티브 기술을 전공하여 예술적 감각과 기술적 구현 능력을 함께 함양했습니다.
                            졸업 작품으로 '가상 공간에서의 자아 정체성'을 주제로 한 VR 전시를 기획했습니다.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Career;
