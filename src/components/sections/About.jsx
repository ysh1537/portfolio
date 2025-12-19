import { motion } from 'framer-motion';

const About = () => {
    return (
        <section className="py-20 relative z-10 text-white">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-sm font-mono text-cyan-400 mb-2 tracking-widest">ABOUT ME</h2>
                    <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                        노력으로 끝내지 않고 <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                            결과물로 입증하는 PM
                        </span>
                    </h3>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 text-gray-300 leading-relaxed text-lg">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full" />
                            공감에 기반한 소통
                        </h4>
                        <p className="mb-6">
                            다양한 서비스업 경험과 스타트업 초기 멤버로서의 활동을 통해,
                            가장 낮은 곳에서부터 관리자 위치까지 폭넓은 시야를 갖추게 되었습니다.
                        </p>
                        <p>
                            이러한 경험은 개발자, 디자이너, 클라이언트 등
                            다양한 이해관계자의 입장을 이해하고 조율하는
                            유연한 커뮤니케이션 능력의 바탕이 되었습니다.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <h4 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full" />
                            끝까지 해결하는 책임감
                        </h4>
                        <p className="mb-6">
                            "농담은 해도 거짓말은 하지 않는다"는 생활신조 아래,
                            맡은 일에 대해서는 변명보다 해결책을 찾으려 노력합니다.
                        </p>
                        <p>
                            예상치 못한 이슈가 발생하더라도 포기하지 않고
                            데이터와 논리를 바탕으로 문제를 해결하며,
                            반드시 실질적인 성과로 연결시키는 것을 목표로 합니다.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 p-8 bg-white/5 border border-white/10 rounded-2xl text-center backdrop-blur-sm"
                >
                    <p className="text-xl font-medium text-white mb-2">
                        "저에게 기획이란 단순히 문서를 만드는 것이 아니라,"
                    </p>
                    <p className="text-cyan-400">
                        사용자와 기술 사이의 복잡한 문제를 풀어내는 과정입니다.
                    </p>
                    {/* Planning Philosophy */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm text-left"
                    >
                        <h4 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full" />
                            기획의 본질에 대한 고민
                        </h4>
                        <p className="mb-6 leading-relaxed">
                            "왜 이 서비스가 필요한가?"라는 질문은 저에게 있어 나침반과 같습니다.
                            화려한 기술이나 시각적인 즐거움도 중요하지만, 그 이전에 **사용자의 결핍을 채워주고 불편함을 해소하는 것**이 기획의 본질이라 믿습니다.
                            저는 기술을 위한 기술이 아닌, 사람을 향한 기술을 설계하고자 합니다.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            이 포트폴리오는 단순한 기술 과시용 프로젝트가 아닙니다.
                            **React Three Fiber**를 통한 웹 3D 성능 최적화, **Zustand**를 활용한 효율적인 상태 관리,
                            그리고 **몰입감 있는 스토리텔링**을 구현하기 위한 치열한 기술적 고민과 해결 과정이 담겨 있습니다.
                            메타버스라는 가상 공간에서도 따뜻한 인간미와 연결을 만들어내려는 저의 비전과 노력을 지켜봐 주시기 바랍니다.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
