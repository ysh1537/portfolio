import { motion } from 'framer-motion';
import { Target, Users, Briefcase, Lightbulb } from 'lucide-react';

const Expertise = () => {
    const expertiseItems = [
        {
            icon: <Target className="w-8 h-8 text-cyan-400" />,
            title: "Metaverse Architecture",
            desc: "가상 공간의 구조와 동선을 설계하고, 사용자 경험을 고려한 최적의 메타버스 환경을 구축합니다."
        },
        {
            icon: <Lightbulb className="w-8 h-8 text-purple-400" />,
            title: "Interactive WebGL",
            desc: "Three.js와 R3F를 활용하여 웹 브라우저에서도 고품질의 3D 인터랙션을 끊김 없이 구현합니다."
        },
        {
            icon: <Users className="w-8 h-8 text-pink-400" />,
            title: "Technical Directing",
            desc: "아티스트와 개발자 사이의 가교 역할을 하며, 비주얼 퀄리티와 퍼포먼스 최적화를 동시에 달성합니다."
        },
        {
            icon: <Briefcase className="w-8 h-8 text-emerald-400" />,
            title: "Project Management",
            desc: "기획부터 배포까지 프로젝트 전반을 리딩하며, 효율적인 파이프라인과 협업 프로세스를 정립합니다."
        }
    ];

    return (
        <section className="py-20 relative z-10 text-white">
            <div className="container mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold mb-16 text-center"
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                        Core Expertise
                    </span>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {expertiseItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-xl hover:bg-white/10 transition-all hover:scale-105"
                        >
                            <div className="mb-6 p-4 bg-black/30 rounded-full w-fit mx-auto border border-white/5">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-center">{item.title}</h3>
                            <p className="text-gray-400 text-sm text-center leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Expertise;
