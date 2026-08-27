import { useState, useEffect } from 'react';

export const useCountdown = (initialSeconds: number) => {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft <= 0]);

    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');

    return { timeLeft, formatted: `${m}:${s}` };
};