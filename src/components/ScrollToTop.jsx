import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from 'lenis/react';

export default function ScrollToTop() {
    const { pathname } = useLocation();
    const lenis = useLenis();

    useEffect(() => {
        if (lenis) {
            // Force lenis to jump to top immediately
            lenis.scrollTo(0, { immediate: true });
        } else {
            // Fallback for native scroll
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "auto"
            });
        }
    }, [pathname, lenis]);

    return null;
}
