"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

function SmoothScroll({ children }: { children: React.ReactNode }) {
    const Lenis = ReactLenis as any;
    return (
        <Lenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            {children}
        </Lenis>
    );
}

export default SmoothScroll;
