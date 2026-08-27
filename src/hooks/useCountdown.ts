// src/hooks/useCountdown.ts
import { useState, useEffect } from "react";

export const useCountdown = (initialSeconds: number) => {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        if (seconds <= 0) return;
        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [seconds]);

    return seconds;
};
