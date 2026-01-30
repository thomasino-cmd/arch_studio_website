"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "50vh", // Fixed height for simplicity in MVP
                backgroundColor: "#1a1a1a",
                color: "#fff",
                zIndex: -1, // Behind main content
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "2rem"
            }}
        >
            <div style={{ textAlign: "center" }}>
                <h2 style={{ fontSize: "10vw", lineHeight: 0.9, fontWeight: "bold" }}>LET'S TALK</h2>
                <div style={{ marginTop: "2rem", display: "flex", gap: "2rem", justifyContent: "center", fontSize: "1.2rem" }}>
                    <Link href="mailto:hello@archstudio.com">hello@archstudio.com</Link>
                    <Link href="/instagram">Instagram</Link>
                    <Link href="/linkedin">LinkedIn</Link>
                </div>
                <div style={{ marginTop: "4rem", opacity: 0.5, fontSize: "0.9rem" }}>
                    &copy; {new Date().getFullYear()} Arch Studio. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
