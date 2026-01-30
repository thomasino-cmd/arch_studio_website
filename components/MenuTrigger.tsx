"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface MenuTriggerProps {
    isOpen: boolean;
    onClick: () => void;
}

export default function MenuTrigger({ isOpen, onClick }: MenuTriggerProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const spotRef = useRef<HTMLSpanElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const button = buttonRef.current;
        const spot = spotRef.current;
        if (!button || !spot) return;

        const onMouseMove = (e: MouseEvent) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            gsap.to(spot, {
                x: x,
                y: y,
                duration: 0.2, // fast follow
                ease: "power2.out"
            });
        };

        const onMouseEnter = () => {
            gsap.to(spot, {
                scale: 25, // Expand enough to cover
                duration: 0.6,
                ease: "power2.out"
            });
            gsap.to(textRef.current, { color: "#3E2F28", duration: 0.3 }); // Text becomes dark on light
        };

        const onMouseLeave = () => {
            gsap.to(spot, {
                scale: 0,
                duration: 0.4,
                ease: "power2.in"
            });
            gsap.to(textRef.current, { color: "#ffffff", duration: 0.3 }); // Text back to white
        };

        button.addEventListener("mousemove", onMouseMove);
        button.addEventListener("mouseenter", onMouseEnter);
        button.addEventListener("mouseleave", onMouseLeave);

        return () => {
            button.removeEventListener("mousemove", onMouseMove);
            button.removeEventListener("mouseenter", onMouseEnter);
            button.removeEventListener("mouseleave", onMouseLeave);
        };
    }, []);

    return (
        <button
            ref={buttonRef}
            onClick={onClick}
            style={{
                position: "relative",
                backgroundColor: "var(--menu-brown)",
                padding: "12px 24px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "white",
                overflow: "hidden", // Important for clip effect
                border: "none",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 600,
                letterSpacing: "1px",
                zIndex: 10000 // Ensure above everything
            }}
        >
            {/* Spotlight Circle */}
            <span
                ref={spotRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "var(--hover-cyan)",
                    transform: "translate(-50%, -50%) scale(0)",
                    zIndex: 0,
                    pointerEvents: "none"
                }}
            />

            {/* Icon - Diamond/4 dots */}
            <div style={{ zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
                <div style={{ width: "4px", height: "4px", backgroundColor: "currentColor", borderRadius: "50%" }} />
                <div style={{ width: "4px", height: "4px", backgroundColor: "currentColor", borderRadius: "50%" }} />
                <div style={{ width: "4px", height: "4px", backgroundColor: "currentColor", borderRadius: "50%" }} />
                <div style={{ width: "4px", height: "4px", backgroundColor: "currentColor", borderRadius: "50%" }} />
            </div>

            {/* Text */}
            <span ref={textRef} style={{ zIndex: 1, position: "relative" }}>
                {isOpen ? "CLOSE" : "MENU"}
            </span>
        </button>
    );
}
