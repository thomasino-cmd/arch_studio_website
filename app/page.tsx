"use client";

import Hero from "@/components/home/Hero";
import ProjectGallery from "@/components/home/ProjectGallery";

export default function Home() {
  return (
    <main>
      {/* Main Content */}
      <div
        style={{
          backgroundColor: "var(--background)",
          marginBottom: "50vh", // Must match Footer height to reveal it
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          boxShadow: "0 50px 50px rgba(0,0,0,0.5)" // Shadow to separate from footer
        }}
      >
        <Hero />
        <ProjectGallery />
      </div>
    </main>
  );
}
