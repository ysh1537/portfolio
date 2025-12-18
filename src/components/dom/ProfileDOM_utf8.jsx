import Hero from '../sections/Hero';
import Expertise from '../sections/Expertise';
import Career from '../sections/Career';
import Achievements from '../sections/Achievements';
import { useStore } from '../../hooks/useStore';
import { motion } from 'framer-motion';

const ProfileDOM = () => {
    const setScene = useStore(state => state.setScene);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 overflow-y-auto overflow-x-hidden bg-black/30 backdrop-blur-sm pointer-events-auto"
        >
            <div className="w-full min-h-screen text-white selection:bg-primary/30 pb-32">

                {/* Fixed Navbar / Back Button Area (handled by Overlay globally, but adding spacing) */}
                <div className="pt-0">
                    <section id="hero"><Hero /></section>
                    <section id="work"><Career /></section>
                    <section id="expertise"><Expertise /></section>
                    <section id="achievements"><Achievements /></section>

                    {/* Footer / CTA Area */}
                    <div className="py-20 text-center border-t border-white/5 bg-black">
                        <h2 className="text-3xl font-bold mb-6 text-white">Ready to Collaborate?</h2>
                        <p className="text-gray-400 mb-8 mb-12">
                            ???�세???�트?�리?�나 커피챗을 ?�하?�다�??�제???�락주세??
                        </p>
                        <button
                            onClick={() => setScene('contact')}
                            className="px-8 py-4 bg-primary text-black font-bold rounded-full hover:bg-primary/80 transition-all transform hover:scale-105"
                        >
                            Contact Me (Portal)
                        </button>
                        <div className="mt-12 text-xs text-gray-600 font-mono">
                            SYSTEM STATUS: OPTIMAL | LOGIN: GUEST
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileDOM;
