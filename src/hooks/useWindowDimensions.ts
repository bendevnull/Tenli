import { useState, useEffect } from 'react';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;
        
        function handleResize() {
            // Debounce resize events to avoid excessive re-renders
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                setWindowDimensions(getWindowDimensions());
            }, 150); // Wait 150ms after last resize event
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    return windowDimensions;
}
