"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => { }, containerRef);
        const runHeroAnimation = () => {
            ctx.add(() => {
                // Text Reveal
                gsap.from(".hero-char", {
                    y: "100%",
                    opacity: 0,
                    duration: 1,
                    stagger: 0.05,
                    ease: "power3.out"
                });
            });
        };

        if (!document.body.classList.contains("is-loading")) {
            runHeroAnimation();
        } else {
            window.addEventListener("loader:complete", runHeroAnimation, { once: true });
        }

        return () => {
            window.removeEventListener("loader:complete", runHeroAnimation);
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className="hero-section"
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
                paddingTop: "60px" // Space for header
            }}
        >
            {/* Hero Title */}
            <div style={{ textAlign: "center", color: "var(--foreground)" }}>
                <h1
                    ref={textRef}
                    style={{
                        fontSize: "10vw",
                        fontWeight: 800,
                        lineHeight: 0.9,
                        letterSpacing: "-0.05em",
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    {/* Split text for stagger */}
                    {"ARCH STUDIO".split("").map((char, i) => (
                        <span key={i} className="hero-char" style={{ display: "inline-block" }}>
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </h1>
                <p style={{ marginTop: "2rem", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "2px" }}>
                    Brutalist Minimalism
                </p>
            </div>
        </section>
    );
}
