import { motion } from 'framer-motion';
import { useStore } from '../../hooks/useStore';

const Hero = () => {
    const setScene = useStore(state => state.setScene);

    return (
        <section className="h-screen flex items-center justify-center relative z-10 pointer-events-none">
            <div className="container mx-auto px-6 text-center pointer-events-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-xl md:text-2xl font-mono text-cyan-400 mb-4 tracking-widest">
                        HELLO, I AM YESOL HEO
                    </h2>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Cinematic <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                            Metaverse Director
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Three.js와 React를 활용하여 웹상에서 몰입형 3D 경험을 설계합니다.<br />
                        상상 그 이상의 시네마틱 유니버스를 탐험해보세요.
                    </p>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => document.getElementById('work').scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105"
                        >
                            View Projects
                        </button>
                        <button
                            onClick={() => setScene('contact')}
                            className="px-8 py-3 border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all backdrop-blur-sm"
                        >
                            Contact Me
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
