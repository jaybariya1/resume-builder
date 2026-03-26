import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, FileText, ArrowRight, Zap, Shield, Download } from "lucide-react";
import TemplateShowcase from "../components/TemplateShowcase";

export default function HomePage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelectTemplate = (templateId) => {
    navigate(`/editor?template=${templateId}`);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #f1f5f9", padding: "0 32px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, #f97316, #ef4444)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={16} color="white" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>AI Resume</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => navigate("/auth")} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #e2e8f0", backgroundColor: "white", fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
              Sign in
            </button>
            <button onClick={() => navigate("/editor")} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #f97316, #ef4444)", fontSize: 14, fontWeight: 600, color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              Build Resume <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 32px 60px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, backgroundColor: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 30, padding: "5px 14px", fontSize: 13, fontWeight: 700, color: "#c2410c", marginBottom: 24 }}>
          <Zap size={13} />
          AI-Powered Resume Builder
        </div>

        <h1 style={{ fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 900, color: "#0f172a", margin: "0 0 20px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          Build Your Perfect Resume<br />
          <span style={{ background: "linear-gradient(135deg, #f97316, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            in Minutes with AI
          </span>
        </h1>

        <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "#64748b", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.65 }}>
          Professional, ATS-optimized resumes crafted by AI. Choose a template, fill in your details, and land your dream job.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <button onClick={() => navigate("/editor")} style={{ padding: "14px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #f97316, #ef4444)", fontSize: 16, fontWeight: 700, color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 24px rgba(249,115,22,0.35)" }}>
            <Sparkles size={18} /> Start Building Free
          </button>
          <button style={{ padding: "14px 32px", borderRadius: 12, border: "1.5px solid #e2e8f0", backgroundColor: "white", fontSize: 16, fontWeight: 600, color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={18} /> See Examples
          </button>
        </div>

        {/* Trust badges */}
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 36, flexWrap: "wrap" }}>
          {[
            { icon: <Shield size={14} />, label: "ATS-Friendly" },
            { icon: <Download size={14} />, label: "PDF & Word Export" },
            { icon: <Zap size={14} />, label: "AI-Powered Content" },
          ].map(({ icon, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", fontWeight: 500 }}>
              <span style={{ color: "#f97316" }}>{icon}</span> {label}
            </div>
          ))}
        </div>
      </section>

      {/* ── TEMPLATE SHOWCASE (below hero) ── */}
      <TemplateShowcase onSelectTemplate={handleSelectTemplate} />

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: "#0f172a", padding: "32px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #f97316, #ef4444)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={14} color="white" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, color: "white" }}>AI Resume</span>
        </div>
        <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>© 2026 AI Resume Builder. All rights reserved.</p>
      </footer>
    </div>
  );
}
