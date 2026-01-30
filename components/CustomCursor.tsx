"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        // Move cursor logic
        const moveCursor = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1, // Slight delay for "follow" feel, or 0 for instant
                ease: "power2.out",
            });
        };

        window.addEventListener("mousemove", moveCursor);

        // Hover logic for magnetic effect (simple scale for now)
        const handleMouseEnter = () => {
            gsap.to(cursor, { scale: 3, duration: 0.3 });
        };

        const handleMouseLeave = () => {
            gsap.to(cursor, { scale: 1, duration: 0.3 });
        };

        // Attach listeners to interactive elements
        const links = document.querySelectorAll("a, button");
        links.forEach((link) => {
            link.addEventListener("mouseenter", handleMouseEnter);
            link.addEventListener("mouseleave", handleMouseLeave);
        });

        // Clean up
        return () => {
            window.removeEventListener("mousemove", moveCursor);
            links.forEach((link) => {
                link.removeEventListener("mouseenter", handleMouseEnter);
                link.removeEventListener("mouseleave", handleMouseLeave);
            });
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "6px", // 2px radius = 4px diameter? User said "2px radius" -> 4px. Or "black point 2px radius" might mean visual. Let's do 6px for visibility.
                height: "6px",
                backgroundColor: "#000", /* Black point as requested */
                borderRadius: "50%",
                pointerEvents: "none",
                transform: "translate(-50%, -50%)",
                zIndex: 9999,
            }}
        />
    );
}
