import { useState, useEffect } from 'react';
import { useStore } from '../../hooks/useStore';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [activeSection, setActiveSection] = useState('');

    // Scroll Spy Logic
    useEffect(() => {
        const handleSpy = () => {
            const sections = ['hero', 'about', 'work', 'expertise', 'achievements']; // Added 'about'
            const scrollPosition = window.scrollY + 100; // Offset

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
                    setActiveSection(section === 'achievements' ? 'awards' : section); // Map achievements id to awards logic id if needed, but nav uses 'achievements' id.
                    // Wait, activeSection === link.id. link.id for Awards is 'achievements'. So just set section.
                    setActiveSection(section);
                    return;
                }
            }
            setActiveSection('');
        };

        window.addEventListener('scroll', handleSpy);
        return () => window.removeEventListener('scroll', handleSpy);
    }, []);

    const currentScene = useStore((state) => state.currentScene);
    const setScene = useStore((state) => state.setScene);

    const handleNav = (scene, id) => {
        setScene(scene);
        if (id) {
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    };

    // Reordered to match ProfileScene: Work -> Expertise -> Process(Achievements)
    const navLinks = [
        { name: 'Home', action: () => handleNav('hub'), id: 'hub' },
        { name: 'About', action: () => handleNav('profile', 'about'), id: 'about' },
        { name: 'Experience', action: () => handleNav('profile', 'work'), id: 'work' }, // Work -> Experience
        { name: 'Expertise', action: () => handleNav('profile', 'expertise'), id: 'expertise' },
        { name: 'Awards', action: () => handleNav('profile', 'achievements'), id: 'achievements' }, // Process -> Awards
        { name: 'Contact', action: () => handleNav('contact'), id: 'contact' },
        { name: 'History', action: () => setScene('history'), id: 'history' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 pointer-events-none bg-black/60 backdrop-blur-md border-b border-white/10 ${scrolled ? 'py-3' : 'py-4'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <button onClick={() => setScene('hub')} className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent pointer-events-auto">
                    Yesol Heo
                </button>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8 pointer-events-auto">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={link.action}
                            className={`transition-colors text-sm font-medium ${currentScene === 'history' && link.name === 'History'
                                ? 'text-primary font-bold'
                                : activeSection === link.id
                                    ? 'text-primary font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                                    : 'text-gray-300 hover:text-white hover:text-glow'
                                }`}
                        >
                            {link.name}
                        </button>
                    ))}
                </div>

                {/* Mobile Menu Button (SVG replacement) */}
                <button
                    className="md:hidden text-white pointer-events-auto p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-surface border-b border-gray-800 bg-black/90 backdrop-blur"
                    >
                        <div className="flex flex-col px-6 py-4 space-y-4">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    className="text-gray-300 hover:text-white block py-3 text-left"
                                    onClick={() => {
                                        link.action();
                                        setIsOpen(false);
                                    }}
                                >
                                    {link.name}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
