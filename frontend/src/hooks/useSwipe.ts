import { useState } from 'react';

export function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
    const [startX, setStartX] = useState<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (startX === null) return;
        const endX = e.changedTouches[0].clientX;
        const distance = startX - endX;
        if (distance > 50) onSwipeLeft();
        if (distance < -50) onSwipeRight();
        setStartX(null);
    };

    return { onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd, className: "touch-manipulation" };
}