import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../hooks/useStore';

const CustomCursor = () => {
    const hoverState = useStore((state) => state.hoverState);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isDOMHovering, setIsDOMHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Combine DOM hover and 3D hover
    const isHovering = isDOMHovering || hoverState;

    useEffect(() => {
        const mouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
            if (!isVisible) setIsVisible(true);
        };

        window.addEventListener("mousemove", mouseMove);

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                setIsDOMHovering(true);
            } else {
                setIsDOMHovering(false);
            }
        };

        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [isVisible]);

    /* Don't render until mouse moves to prevent top-left glitch */
    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center mix-blend-difference"
            animate={{
                x: mousePosition.x,
                y: mousePosition.y,
                translateX: "-50%",
                translateY: "-50%",
                width: isHovering ? 48 : 32,
                height: isHovering ? 48 : 32,
                backgroundColor: isHovering ? 'rgba(6, 182, 212, 0.1)' : 'rgba(0, 0, 0, 0)',
                borderColor: isHovering ? '#06b6d4' : '#e5e5e5',
                borderRadius: isHovering ? '8px' : '50%'
            }}
            style={{
                borderWidth: '1px',
                borderStyle: 'solid',
            }}
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 28,
                mass: 0.5
            }}
        >
            <motion.div
                className="w-1 h-1 bg-white rounded-full"
                animate={{
                    scale: isHovering ? 0 : 1,
                    opacity: isHovering ? 0 : 1
                }}
            />
        </motion.div>
    );
};

export default CustomCursor;
