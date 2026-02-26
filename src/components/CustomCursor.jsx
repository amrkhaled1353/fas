import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            // Check if hovering over clickable elements
            if (
                e.target.tagName.toLowerCase() === 'button' ||
                e.target.tagName.toLowerCase() === 'a' ||
                e.target.closest('button') ||
                e.target.closest('a')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    // Don't render on touch devices
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
        return null;
    }

    const variants = {
        default: {
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
            scale: 1,
            backgroundColor: 'transparent',
        },
        hover: {
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
            scale: 1.5,
            backgroundColor: 'rgba(209, 191, 174, 0.2)', // primary color with transparency
        },
    };

    return (
        <>
            {/* Inner Dot */}
            <motion.div
                className="cursor-dot"
                animate={{
                    x: mousePosition.x - 4,
                    y: mousePosition.y - 4,
                }}
                transition={{ type: 'tween', ease: 'linear', duration: 0 }}
            />
            {/* Outer Ring */}
            <motion.div
                className="cursor-ring"
                variants={variants}
                animate={isHovering ? "hover" : "default"}
                transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.5 }}
            />
        </>
    );
};

export default CustomCursor;
