
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useLenis } from "@studio-freight/react-lenis";

interface NavigationOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NavigationOverlay({ isOpen, onClose }: NavigationOverlayProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const lenis = useLenis();

    useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;

        // Reset state initially
        gsap.set(panel, { autoAlpha: 0, scale: 0.9, transformOrigin: "top right" });
        // Set separators height to 0 initially
        gsap.set(".separator-line", { scaleY: 0, transformOrigin: "top center" });

        // Create timeline
        const tl = gsap.timeline({ paused: true });

        // Panel Expansion - Even Slower & Fluid
        tl.to(panel, {
            autoAlpha: 1,
            scale: 1,
            duration: 1.4, // Slower (was 1.0)
            ease: "power4.out" // More "friction" / smooth deceleration
        });

        // Staggered Text Reveal
        tl.from(".reveal-text", {
            yPercent: 100,
            duration: 1.0, // Slower (was 0.8)
            ease: "power3.out",
            stagger: 0.1
        }, "-=1.0"); // Overlap significantly with container expansion

        // Separator Lines - Draw after text
        tl.to(".separator-line", {
            scaleY: 1,
            duration: 1.5,
            ease: "power2.inOut",
            stagger: 0.2
        }, "-=0.5");

        timelineRef.current = tl;

    }, []);

    useEffect(() => {
        if (isOpen) {
            // Play at normal speed (which is now configured to be slow/fluid)
            timelineRef.current?.timeScale(1).play();
            lenis?.stop(); // Stop Lenis scrolling
            document.body.style.overflow = "hidden"; // Fallback for body scroll
        } else {
            // Reverse at high speed (2.5x) for quick exit
            timelineRef.current?.timeScale(2.5).reverse();
            lenis?.start(); // Resume Lenis scrolling
            document.body.style.overflow = "";
        }

        return () => {
            lenis?.start(); // Ensure Lenis is started on unmount or if isOpen changes
            document.body.style.overflow = "";
        };
    }, [isOpen, lenis]);

    // Menu Items (Italian)
    const navItems = [
        { label: "Home", href: "/" },
        { label: "Progetti", href: "/projects" },
        { label: "Servizi", href: "/services" },
        { label: "Studio", href: "/studio" },
        { label: "Contatti", href: "/contact" },
    ];

    return (
        <div
            style={{
                position: "fixed",
                inset: 0, // Shorthand for top:0, right:0, bottom:0, left:0
                zIndex: 9980,
                // display: isOpen ? "block" : "none", // Removed to allow exit animation to play
                pointerEvents: isOpen ? "auto" : "none", // Allow/disallow interaction
            }}
            onClick={onClose} // Click outside to close
        >
            <div
                ref={panelRef}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the panel
                style={{
                    position: "absolute", // Changed to absolute as parent is fixed
                    top: "6rem", // More space from top
                    right: "4rem", // More space from right
                    width: "80vw", // Smaller width (was 95vw)
                    maxWidth: "1200px",
                    height: "75vh", // Smaller height
                    backgroundColor: "var(--background)", // Light background
                    border: "solid var(--menu-brown)",
                    borderWidth: "12px 4px", // Think top/bottom, Thin sides? or "Long sides thicker". Landscape = Top/Bottom long.
                    borderRadius: "12px",
                    // zIndex: 9980, // Removed, controlled by parent wrapper
                    padding: "3rem",
                    color: "var(--menu-brown)", // Dark text
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    visibility: "hidden", // GSAP autoAlpha handles this
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
            >

                {/* Grid Layout with Separators */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1px 0.8fr 1px 1fr", // Added columns for lines
                        height: "100%",
                        gap: "0", // Gap handled by columns
                    }}
                >
                    {/* Col 1: Primary Nav */}
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "2rem" }}>
                        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {navItems.map((item, i) => (
                                <div key={i} style={{ overflow: "hidden" }}>
                                    <Link
                                        href={item.href}
                                        className="reveal-text"
                                        onClick={onClose}
                                        style={{
                                            display: "block",
                                            fontFamily: "serif",
                                            fontSize: "3.5rem", // Slightly smaller
                                            lineHeight: 1.1,
                                            color: "var(--menu-brown)",
                                            opacity: item.label === "Home" ? 1 : 0.5,
                                            transition: "opacity 0.3s",
                                            textDecoration: "none"
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                                        onMouseLeave={(e) => {
                                            if (item.label !== "Home") e.currentTarget.style.opacity = "0.5";
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* Separator 1 */}
                    <div className="separator-line" style={{ width: "1px", height: "100%", backgroundColor: "currentColor", opacity: 0.2 }}></div>

                    {/* Col 2: Sub-nav & Socials */}
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "2rem" }}>
                        <div>
                            <div style={{ overflow: "hidden", marginBottom: "1rem" }}>
                                <h3 className="reveal-text" style={{ fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "1rem", opacity: 0.7 }}>PROGETTI</h3>
                            </div>
                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {["Residenziale", "Commerciale", "Interni", "Architettura"].map((cat, i) => (
                                    <li key={i} style={{ overflow: "hidden" }}>
                                        <Link href="#" className="reveal-text" style={{ fontSize: "1rem", fontFamily: "sans-serif", display: "inline-block" }}>{cat}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div style={{ overflow: "hidden", marginBottom: "1rem" }}>
                                <h3 className="reveal-text" style={{ fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "1rem", opacity: 0.7 }}>SEGUICI</h3>
                            </div>
                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {["Instagram", "LinkedIn", "Facebook"].map((social, i) => (
                                    <li key={i} style={{ overflow: "hidden" }}>
                                        <a href="#" className="reveal-text" style={{ fontSize: "1rem", fontFamily: "sans-serif", display: "inline-block" }}>{social}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Separator 2 */}
                    <div className="separator-line" style={{ width: "1px", height: "100%", backgroundColor: "currentColor", opacity: 0.2 }}></div>

                    {/* Col 3: Dynamic Content (Scrollable) */}
                    <div
                        style={{
                            overflowY: "auto",
                            paddingLeft: "2rem",
                            paddingRight: "1rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "2rem",
                            height: "100%",
                            maxHeight: "75vh"
                        }}
                        className="custom-scrollbar"
                    >
                        <div style={{ overflow: "hidden" }}>
                            <h3 className="reveal-text" style={{ fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "1rem", opacity: 0.7 }}>IN EVIDENZA</h3>
                        </div>

                        {/* Card 1 */}
                        <div style={{ overflow: "hidden", borderRadius: "8px" }}>
                            <div className="reveal-text" style={{ backgroundColor: "rgba(62, 47, 40, 0.05)", borderRadius: "8px", overflow: "hidden" }}>
                                <div style={{ height: "150px", backgroundColor: "#ccc" }}>
                                    <img src="https://placehold.co/600x400/3E2F28/ffffff?text=Libro+Bianco" alt="Libro Bianco" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                                <div style={{ padding: "1.5rem" }}>
                                    <h4 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", fontFamily: "serif" }}>LIBRO BIANCO</h4>
                                    <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>Scopri le nostre ultime ricerche sull'architettura sostenibile.</p>
                                    <div style={{ marginTop: "1rem", textTransform: "uppercase", fontSize: "0.8rem", textDecoration: "underline", cursor: "pointer" }}>Scarica</div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div style={{ overflow: "hidden", borderRadius: "8px" }}>
                            <div className="reveal-text" style={{ backgroundColor: "rgba(62, 47, 40, 0.05)", borderRadius: "8px", overflow: "hidden" }}>
                                <div style={{ height: "150px", backgroundColor: "#ccc" }}>
                                    <img src="https://placehold.co/600x400/e3762b/ffffff?text=Video" alt="Video" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                                <div style={{ padding: "1.5rem" }}>
                                    <h4 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", fontFamily: "serif" }}>LA NOSTRA VISIONE</h4>
                                    <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>Un'intervista esclusiva con il nostro architetto principale.</p>
                                    <div style={{ marginTop: "1rem", textTransform: "uppercase", fontSize: "0.8rem", textDecoration: "underline", cursor: "pointer" }}>Guarda</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ overflow: "hidden", borderRadius: "8px" }}>
                            <div className="reveal-text" style={{ backgroundColor: "rgba(62, 47, 40, 0.05)", borderRadius: "8px", overflow: "hidden" }}>
                                <div style={{ height: "150px", backgroundColor: "#ccc" }}>
                                </div>
                                <div style={{ padding: "1.5rem" }}>
                                    <h4 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", fontFamily: "serif" }}>ARCHIVIO 2024</h4>
                                    <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>Retrospettiva dei progetti.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx global>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: rgba(62, 47, 40, 0.05); 
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(62, 47, 40, 0.2); 
                        border-radius: 3px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(62, 47, 40, 0.4); 
                    }
                `}</style>
            </div>
        </div>
    );
}
