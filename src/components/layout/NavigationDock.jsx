import { useStore } from '../../hooks/useStore';
import { LORE } from '../../data/lore';
import { motion } from 'framer-motion';
import useSoundFX from '../../hooks/useSoundFX';

const NavigationDock = () => {
    const warpTo = useStore(state => state.warpTo); // Use warpTo instead of setScene
    const setHoveredPlanet = useStore(state => state.setHoveredPlanet);
    const openBlackBox = useStore(state => state.openBlackBox);
    const playHover = useSoundFX().playHover;
    const playClick = useSoundFX().playClick;

    // Define items based on Lore
    const dockItems = [
        { id: 'profile', label: 'IDENTITY', icon: '✦', color: LORE.SECTORS.PROFILE.visual.color, target: 'profile' },
        { id: 'lab01', label: 'PRISM', icon: '◈', color: LORE.SECTORS.LAB_01.visual.color, target: 'lab01' },
        { id: 'lab02', label: 'TERRARIUM', icon: '☘', color: LORE.SECTORS.LAB_02.visual.color, target: 'lab02' },
        { id: 'lab03', label: 'RESONANCE', icon: '♬', color: LORE.SECTORS.LAB_03.visual.color, target: 'lab03' },
        { id: 'lab04', label: 'GLITCH', icon: '⚡', color: LORE.SECTORS.LAB_04.visual.color, target: 'lab04' },
        { id: 'blackbox', label: 'BLACK BOX', icon: '◼', color: '#06b6d4', target: 'blackbox', isModal: true },
    ];

    const handleHover = (id) => {
        setHoveredPlanet(id);
        playHover();
    };

    const handleLeave = () => {
        setHoveredPlanet(null);
    };

    const handleClick = (item) => {
        playClick();
        // Black Box는 모달로 열기
        if (item.isModal && item.target === 'blackbox') {
            openBlackBox();
            return;
        }
        // warpTo action handles state transition with delay
        warpTo(item.target);
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
            {/* Dock Container - Removed solid BG for Floating Look */}
            <div className="flex items-end gap-4 px-6 py-2 rounded-full transition-all">
                {dockItems.map((item) => (
                    <Item
                        key={item.id}
                        item={item}
                        onHover={handleHover}
                        onLeave={handleLeave}
                        onClick={handleClick}
                    />
                ))}
            </div>
        </div>
    );
};

const Item = ({ item, onHover, onLeave, onClick }) => {
    return (
        <motion.button
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.1, y: -10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onClick(item)}
            onMouseEnter={() => onHover(item.id)}
            onMouseLeave={onLeave}
            className="group relative flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/40 transition-all shadow-lg overflow-visible"
            style={{
                boxShadow: `0 4px 20px ${item.color}20`
            }}
        >
            {/* Active Glow Ring */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: `0 0 25px ${item.color}60`, border: `1px solid ${item.color}` }}
            />

            <span className="text-xl md:text-2xl filter drop-shadow-md z-10 transition-colors group-hover:text-white" style={{ color: item.color }}>
                {item.icon}
            </span>

            {/* Label Tooltip - Floating Above */}
            <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 pointer-events-none">
                <div className="px-3 py-1 text-[10px] md:text-xs font-bold font-mono tracking-widest bg-black/90 backdrop-blur text-white border-l-2 shadow-xl whitespace-nowrap"
                    style={{ borderLeftColor: item.color }}>
                    {item.label}
                </div>
            </div>
        </motion.button>
    );
};

export default NavigationDock;
