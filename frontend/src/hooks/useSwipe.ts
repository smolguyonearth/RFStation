import { useState } from 'react';

export function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
    const [startX, setStartX] = useState<number | null>(null);

    const handlePointerDown = (e: React.PointerEvent) => setStartX(e.clientX);
    const handlePointerUp = (e: React.PointerEvent) => {
        if (startX === null) return;
        const distance = startX - e.clientX;
        if (distance > 50) onSwipeLeft();
        if (distance < -50) onSwipeRight();
        setStartX(null);
    };

    return { onPointerDown: handlePointerDown, onPointerUp: handlePointerUp, className: "touch-pan-y" };
}