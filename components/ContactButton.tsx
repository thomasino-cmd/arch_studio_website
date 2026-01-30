"use client";

import Link from "next/link";
// import { ArrowRight } from "lucide-react";

export default function ContactButton() {
    return (
        <Link
            href="/contact"
            style={{
                backgroundColor: "var(--cta-orange)",
                padding: "12px 24px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "white",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
                letterSpacing: "0.5px",
                transition: "transform 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
            <span>CONTACT</span>
            {/* Simple CSS Arrow or SVG if lucide not avail. I'll use SVG to be safe since I saw no lucide in package.json */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
            </svg>
        </Link>
    );
}
