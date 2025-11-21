import { useEffect } from "react";
import type { RefObject } from "react";

interface UseIntersectionObserverProps {
    target: RefObject<Element>;
    onIntersect: () => void;
    enabled?: boolean;
    rootMargin?: string;
    threshold?: number | number[];
}

export default function useIntersectionObserver({
    target,
    onIntersect,
    enabled = true,
    rootMargin = "0px",
    threshold = 1,
}: UseIntersectionObserverProps) {
    useEffect(() => {
        if (!enabled) return;
        if (!target?.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        onIntersect();
                    }
                });
            },
            {
                root: null,
                rootMargin,
                threshold,
            }
        );

        observer.observe(target.current);

        return () => {
            observer.disconnect();
        };
    }, [target, enabled, rootMargin, threshold, onIntersect]);
}
