"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// @ts-ignore
import { Flip } from "gsap/Flip";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, Flip);

const projects = [
    { id: 1, title: "Modern Villa", category: "Residential", image: "/villa.png" },
    { id: 2, title: "Urban Office", category: "Commercial", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" },
    { id: 3, title: "Lake House", category: "Residential", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1200" },
    { id: 4, title: "Art Museum", category: "Public", image: "https://images.unsplash.com/photo-1518998053502-53b8a1998b5e?auto=format&fit=crop&q=80&w=1200" },
    { id: 5, title: "City Library", category: "Public", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1200" },
    { id: 6, title: "Sky Scraper", category: "Commercial", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" },
];

export default function ProjectGallery() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasDealt, setHasDealt] = useState(false);

    // Random rotations for the stack effect
    // Deterministic rotations for the stack effect to prevent hydration mismatches
    const rotations = useRef(projects.map((_, i) => ((i % 2 === 0 ? 1 : -1) * (i + 1) * 0.8) % 4));

    useLayoutEffect(() => {
        const container = containerRef.current;

        if (!container) return;

        document.body.classList.add("is-loading");
        document.body.style.overflow = "hidden";
        let loadHandler: (() => void) | null = null;

        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray<HTMLElement>(".project-item");

            const waitForImages = () => {
                const images = Array.from(container.querySelectorAll("img"));
                if (images.length === 0) {
                    return Promise.resolve();
                }

                return Promise.all(
                    images.map((img) => {
                        if (img.complete) {
                            return Promise.resolve();
                        }

                        return new Promise<void>((resolve) => {
                            const onDone = () => resolve();
                            img.addEventListener("load", onDone, { once: true });
                            img.addEventListener("error", onDone, { once: true });
                        });
                    })
                );
            };

            const runFlipAnimation = () => {
                // 1. Record Initial State (Stacked)
                const state = Flip.getState(items);

                // 2. Change to Final State (Grid)
                container.classList.remove("stack-mode");
                container.classList.add("grid-mode");

                // Unlock scroll ONLY after animation completes to effectively prevent scrolling during transition
                // document.body.style.overflow = "auto"; // Moved to onComplete

                // 3. Animate from State (Stack) to Layout (Grid)
                Flip.from(state, {
                    duration: 2.8,
                    ease: "power3.inOut",
                    stagger: {
                        amount: 0.9,
                        from: "start"
                    },
                    absolute: true,
                    onComplete: () => {
                        setHasDealt(true);
                        document.body.classList.remove("is-loading");
                        document.body.style.overflow = ""; // Restore scroll
                        gsap.set(items, { clearProps: "all" });
                        ScrollTrigger.refresh();
                        window.dispatchEvent(new Event("loader:complete"));
                    }
                });
            };

            const startLoader = () => {
                void waitForImages().then(runFlipAnimation);
            };

            if (document.readyState === "complete") {
                startLoader();
            } else {
                loadHandler = () => startLoader();
                window.addEventListener("load", loadHandler, { once: true });
            }

            // 4. Setup Hover & Idle Animations
            items.forEach((item) => {
                const img = item.querySelector("img");
                if (!img) return;

                // Slow Horizontal Slide (Idle)
                // Panning horizontal inside the box
                gsap.to(img, {
                    xPercent: 10,
                    duration: 10 + Math.random() * 5,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true
                });

                // Hover: Zoom
                item.addEventListener("mouseenter", () => {
                    gsap.to(img, { scale: 1.15, duration: 0.6, ease: "power2.out" });
                });

                item.addEventListener("mouseleave", () => {
                    gsap.to(img, { scale: 1, duration: 0.6, ease: "power2.out" });
                });
            });

        }, containerRef);

        return () => {
            if (loadHandler) {
                window.removeEventListener("load", loadHandler);
            }
            document.body.classList.remove("is-loading");
            document.body.style.overflow = "";
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className="stack-mode"
            data-dealt={hasDealt ? "true" : "false"}
            style={{
                backgroundColor: "var(--background)",
                minHeight: "100vh"
            }}
        >
            <style jsx global>{`
                /* Initial Stack State */
                .stack-mode {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 9999; /* Ensure it covers everything including Hero */
                    overflow: hidden;
                    padding: 0 2rem;
                    background-color: var(--background); /* Ensure opaque background */
                }
                .grid-mode {
                    /* Return to flow */
                    position: relative;
                    z-index: 20;
                    margin-top: -30vh;
                    padding: 6rem 2rem 4rem;
                }
                .stack-mode .gallery-grid {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
                .stack-mode .project-item {
                    position: fixed;
                    top: 40%; /* Moved up from 45% to align better with Hero title area */
                    left: 50%;
                    width: 320px;
                    height: 420px;
                    transform: translate(-50%, -50%) rotate(var(--stack-rotation));
                    z-index: 9005;
                    pointer-events: none;
                }
                /* Stacking order - ensuring higher than Hero */
                .stack-mode .project-item:nth-child(1) { z-index: 9006; }
                .stack-mode .project-item:nth-child(2) { z-index: 9005; }
                .stack-mode .project-item:nth-child(3) { z-index: 9004; }
                .stack-mode .project-item:nth-child(4) { z-index: 9003; }
                .stack-mode .project-item:nth-child(5) { z-index: 9002; }
                .stack-mode .project-item:nth-child(6) { z-index: 9001; }

                /* Final Grid State */
                .grid-mode .gallery-grid {
                    display: flex;
                    gap: 3rem;
                    overflow-x: auto;
                    padding: 1rem 2rem 2rem;
                    scroll-snap-type: x mandatory;
                    scrollbar-width: none;
                    mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
                    -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
                }
                .grid-mode .gallery-grid::-webkit-scrollbar {
                    display: none;
                }
                .grid-mode .project-item {
                    position: relative;
                    width: clamp(260px, 28vw, 360px);
                    flex: 0 0 auto;
                    scroll-snap-align: start;
                    transform: none;
                    pointer-events: auto;
                }
                
                .grid-mode .project-info {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.8s ease, transform 0.8s ease;
                    transition-delay: 0.2s;
                }
                .grid-mode[data-dealt="true"] .project-info {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .stack-mode .project-info {
                    opacity: 0;
                    transform: translateY(20px);
                }

                .section-title {
                    opacity: 0;
                    transform: translateY(10px);
                    transition: opacity 0.8s ease, transform 0.8s ease;
                }
                .grid-mode[data-dealt="true"] .section-title {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Removed loader-title styles */
            `}</style>

            {/* Loader title removed */}

            <div className="gallery-grid">
                {projects.map((project, i) => (
                    <div
                        key={project.id}
                        className="project-item"
                        style={{
                            ["--stack-rotation" as any]: `${rotations.current[i]}deg`
                        }}
                    >
                        <Link href={`/projects/${project.id}`} style={{ display: "block", height: "100%" }}>
                            <div className="img-wrapper" style={{
                                overflow: "hidden",
                                marginBottom: "1rem",
                                borderRadius: "1.5rem",
                                height: "450px",
                                position: "relative"
                            }}>
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    style={{
                                        width: "120%",
                                        height: "100%",
                                        objectFit: "cover",
                                        position: "absolute",
                                        left: "-10%", // To allow xPercent: 10 sliding
                                        willChange: "transform"
                                    }}
                                />
                            </div>
                            <div className="project-info" style={{ borderTop: "1px solid var(--foreground)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <div>
                                    <span style={{ fontSize: "0.8rem", opacity: 0.5, marginRight: "1rem" }}>0{i + 1}</span>
                                    <h3 style={{ fontSize: "1.5rem", fontWeight: "normal", display: "inline-block" }}>{project.title}</h3>
                                </div>
                                <span style={{ fontSize: "1rem", opacity: 0.7 }}>{project.category}</span>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "3rem" }}>
                <h2 className="section-title" style={{ fontSize: "5vw", lineHeight: 1, textTransform: "uppercase", fontWeight: "bold" }}>Selected Works</h2>
            </div>
        </section>
    );
}
