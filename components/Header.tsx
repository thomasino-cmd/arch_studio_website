"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import NavigationOverlay from "./NavigationOverlay";
import MenuTrigger from "./MenuTrigger";
import ContactButton from "./ContactButton";

gsap.registerPlugin(ScrollTrigger);

export default function Header() {
    const headerRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;

        // Smart sticky header
        const showAnim = gsap.from(el, {
            yPercent: -100,
            paused: true,
            duration: 0.3,
            ease: "power2.out"
        }).progress(1);

        ScrollTrigger.create({
            start: "top top",
            end: "max",
            onUpdate: (self) => {
                if (self.direction === -1) {
                    showAnim.play();
                } else {
                    showAnim.reverse();
                }
            }
        });
    }, []);

    return (
        <>
            <header
                ref={headerRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    padding: "2rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    zIndex: 9990,
                    // removed mix-blend-mode to preserve button colors
                }}
            >
                <div style={{ fontWeight: "bold", fontSize: "1.5rem", letterSpacing: "-1px", color: "var(--foreground)" }}>
                    <Link href="/">ARCH STUDIO</Link>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                    <ContactButton />
                    <MenuTrigger isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />
                </div>
            </header>

            <NavigationOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
}
