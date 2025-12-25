import React, { useEffect, useRef, useState } from 'react';

const HoloAvatar = ({ isSpeaking }) => {
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const animationFrameId = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = '/assets/avatar_yesol.png';

        img.onload = () => {
            console.log("HoloAvatar: Image loaded successfully");
            imageRef.current = img;
            setImageLoaded(true);
            animate();
        };

        img.onerror = () => {
            console.error("HoloAvatar: Failed to load image from /assets/avatar_yesol.png");
        };

        let frame = 0;

        const animate = () => {
            frame++;
            const w = canvas.width;
            const h = canvas.height;

            // Clear
            ctx.clearRect(0, 0, w, h);

            if (imageRef.current) {
                const glitchX = Math.random() < 0.05 ? (Math.random() - 0.5) * 4 : 0;

                // 1. Draw base image
                ctx.globalAlpha = 1.0;
                ctx.drawImage(imageRef.current, glitchX, 0, w, h);

                // 2. Apply Hologram Tint (Light Cyan overlay with 'screen' mode)
                // This keeps the facial features visible while adding a glow
                ctx.globalCompositeOperation = 'screen';
                ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
                ctx.fillRect(0, 0, w, h);

                // 3. Reset composite
                ctx.globalCompositeOperation = 'source-over';

                // 4. Scanlines (Subtle dark lines)
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                for (let y = 0; y < h; y += 2) {
                    ctx.fillRect(0, y, w, 1);
                }

                // 5. Bright Scanline Sweep
                const scanLineY = (frame * 1.5) % h;
                const gradient = ctx.createLinearGradient(0, scanLineY - 5, 0, scanLineY + 5);
                gradient.addColorStop(0, 'transparent');
                gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.4)');
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, scanLineY - 5, w, 10);

                // 6. Speaking reaction (Brightness Pulse)
                if (isSpeaking) {
                    const pulse = 0.2 + Math.sin(frame * 0.15) * 0.15;
                    ctx.fillStyle = `rgba(0, 255, 255, ${pulse})`;
                    ctx.fillRect(0, 0, w, h);

                    // Add some digital 'noise' bars during speaking
                    if (Math.random() < 0.2) {
                        ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
                        ctx.fillRect(0, Math.random() * h, w, 2);
                    }
                }
            }

            animationFrameId.current = requestAnimationFrame(animate);
        };

        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [isSpeaking]);

    return (
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.4)] bg-slate-900">
            {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            <canvas
                ref={canvasRef}
                width={128}
                height={128}
                className="w-full h-full object-cover"
                style={{ filter: 'contrast(1.2) brightness(1.1)' }}
            />
            {/* Hologram Overlay Ring */}
            <div className="absolute inset-0 rounded-full border border-cyan-400/20 pointer-events-none"></div>
            {/* Ambient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/40 to-transparent pointer-events-none shadow-inner"></div>
        </div>
    );
};

export default HoloAvatar;
