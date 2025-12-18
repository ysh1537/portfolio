import { motion } from 'framer-motion';
import { Award, Mic, Newspaper, Trophy } from 'lucide-react';

const Achievements = () => {
    const achievements = [
        {
            icon: <Trophy className="w-8 h-8 text-yellow-400" />,
            title: "Best Metaverse Design 2024",
            org: "K-Metaverse Awards",
            desc: "가상 전시관 'The Void'로 최우수 디자인상 수상"
        },
        {
            icon: <Mic className="w-8 h-8 text-blue-400" />,
            title: "WebGL Conference Speaker",
            org: "Tech Art Summit Seoul",
            desc: "'React Three Fiber로 구현하는 시네마틱 웹' 세션 발표"
        },
        {
            icon: <Award className="w-8 h-8 text-purple-400" />,
            title: "Excellence in Innovation",
            org: "Digital Creator Festival",
            desc: "생성형 AI를 활용한 3D 에셋 파이프라인 구축 사례 선정"
        },
        {
            icon: <Newspaper className="w-8 h-8 text-green-400" />,
            title: "Featured Artist",
            org: "D.O.M Magazine",
            desc: "인터뷰: '현실과 가상의 경계를 허무는 크리에이터'"
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
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
                        Honors & Activities
                    </span>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {achievements.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-zinc-900/50 border border-white/10 p-8 rounded-2xl flex items-start gap-6 hover:border-yellow-500/50 transition-colors"
                        >
                            <div className="bg-white/10 p-3 rounded-lg">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                                <p className="text-sm text-yellow-500 font-mono mb-3">{item.org}</p>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Achievements;
