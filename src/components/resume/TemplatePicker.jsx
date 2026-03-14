import React, { useState, useEffect } from "react";
import { X, Check, Palette } from "lucide-react";
import Template1 from "./templates/Template1/Template1";
import Template2 from "./templates/Template2/Template2";
import Template3 from "./templates/Template3/Template3";
import Template4 from "./templates/Template4/Template4";
import Template5 from "./templates/Template5/Template5";
// import Template6 from "./templates/Template6/Template6";

// ─── Sample resume data (Sebastian Bennett from the PDF) ──────────────────────
const SAMPLE_DATA = {
  firstName: "Sebastian",
  lastName: "Bennett",
  email: "hello@reallygreatsite.com",
  phone: "+123-456-7890",
  city: "Any City",
  country: "",
  location: "123 Anywhere St., Any City",
  role: "Professional Accountant",
  summary:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitationullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor inreprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  linkedin: "",
  github: "",
  portfolio: "",
  website: "",
  experience: [
    {
      id: "e1",
      title: "Senior Accountant",
      company: "Salford & Co.",
      location: "New York, NY",
      startDate: "2033",
      endDate: "2035",
      current: false,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitationullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      id: "e2",
      title: "Financial Accountant",
      company: "Salford & Co.",
      location: "New York, NY",
      startDate: "2030",
      endDate: "2033",
      current: false,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitationullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
  ],
  education: [
    {
      id: "ed1",
      degree: "Senior Accountant",
      school: "Borcelle University",
      location: "",
      graduationDate: "2030",
      gpa: "",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitationullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      id: "ed2",
      degree: "Bachelor of Commerce",
      school: "Borcelle University",
      location: "",
      graduationDate: "2026",
      gpa: "",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitationullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
  ],
  skills: [
    { id: "s1", name: "Financial Accounting", level: 3 },
    { id: "s2", name: "Auditing", level: 3 },
    { id: "s3", name: "Financial Reporting", level: 2 },
    { id: "s4", name: "Tax Compliance", level: 2 },
    { id: "s5", name: "Microsoft Excel", level: 3 },
    { id: "s6", name: "QuickBooks", level: 2 },
  ],
  project: [],
  hideSkillLevel: false,
  certifications: [],
  languages: [],
  volunteer: [],
  awards: [],
};

// ─── Template registry ────────────────────────────────────────────────────────
const TEMPLATES = [
  { id: "modern",      name: "Classic",      description: "Clean & ATS-friendly",      accent: "#1e293b", tag: "Popular",   Component: Template1 },
  { id: "sidebar",     name: "Executive",    description: "Dark sidebar, two-column",   accent: "#f97316", tag: "Bold",      Component: Template2 },
  { id: "elegant",     name: "Elegant",      description: "Serif, purple accents",      accent: "#7c3aed", tag: "Refined",   Component: Template3 },
  { id: "minimal",     name: "Fresh",        description: "Green minimal borders",      accent: "#16a34a", tag: "Modern",    Component: Template4 },
  { id: "traditional", name: "Traditional",  description: "Classic serif, date-left",   accent: "#000000", tag: "Classic",   Component: Template5 },
  // { id: "minimalist",  name: "Minimalist",   description: "B&W centered, dark footer",  accent: "#1c1c1c", tag: "Minimal",   Component: Template6 },
];

// ─── Scaled live preview thumbnail ───────────────────────────────────────────
// The real template renders at 794px wide. We scale it down to fit a 120×156px box.
const THUMB_W = 120;
const THUMB_H = 156;
const TEMPLATE_W = 794;
const SCALE = THUMB_W / TEMPLATE_W;

function LiveThumb({ Component }) {
  return (
    <div
      style={{
        width: THUMB_W,
        height: THUMB_H,
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Wrapper that scales the full-size template down */}
      <div
        style={{
          transformOrigin: "top left",
          transform: `scale(${SCALE})`,
          width: TEMPLATE_W,
          // Let height be natural — clipped by parent overflow:hidden
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <Component data={SAMPLE_DATA} />
      </div>
    </div>
  );
}

// ─── Main TemplatePicker ──────────────────────────────────────────────────────
const TemplatePicker = ({ isOpen, onClose, selectedId, onSelect }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => setAnimateIn(true));
    else setAnimateIn(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 9998,
          opacity: animateIn ? 1 : 0,
          transition: "opacity 0.25s ease",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "420px",
          backgroundColor: "#ffffff",
          zIndex: 9999,
          transform: animateIn ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          display: "flex", flexDirection: "column",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.15)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid #f1f5f9", background: "linear-gradient(135deg,#fff,#fafaf8)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#f97316,#ef4444)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Palette size={16} color="white" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>Choose Template</h2>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Pick a style for your resume</p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#f8fafc"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Template list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {TEMPLATES.map((t, index) => {
            const isSelected = selectedId === t.id;
            const isHovered = hoveredId === t.id;

            return (
              <div
                key={t.id}
                onClick={() => { onSelect(t.id); onClose(); }}
                onMouseEnter={() => setHoveredId(t.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  cursor: "pointer",
                  borderRadius: 14,
                  border: `2px solid ${isSelected ? t.accent : isHovered ? "#e2e8f0" : "#f1f5f9"}`,
                  backgroundColor: isSelected ? `${t.accent}08` : "white",
                  padding: "12px",
                  display: "flex", gap: "14px", alignItems: "center",
                  transition: "all 0.18s ease",
                  transform: isHovered && !isSelected ? "translateY(-1px)" : "none",
                  boxShadow: isSelected
                    ? `0 0 0 1px ${t.accent}30, 0 4px 16px ${t.accent}15`
                    : isHovered ? "0 4px 16px rgba(0,0,0,0.07)" : "none",
                }}
              >
                {/* Live thumbnail */}
                <div
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                    border: `1px solid ${isSelected ? t.accent + "40" : "#e8ecef"}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  <LiveThumb Component={t.Component} />
                  {isSelected && (
                    <div style={{ position: "absolute", inset: 0, backgroundColor: `${t.accent}18`, borderRadius: 7 }} />
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{t.name}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: t.accent, backgroundColor: `${t.accent}15`, padding: "2px 6px", borderRadius: 20 }}>
                      {t.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.5 }}>{t.description}</p>

                  {/* Accent swatch */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: t.accent }} />
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>Accent color</span>
                  </div>

                  {isSelected && (
                    <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 5, color: t.accent, fontSize: 12, fontWeight: 600 }}>
                      <Check size={13} strokeWidth={2.5} /> Currently selected
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #f1f5f9", backgroundColor: "#fafaf8" }}>
          <p style={{ fontSize: 11.5, color: "#94a3b8", textAlign: "center", margin: 0 }}>
            Your content stays the same when switching templates
          </p>
        </div>
      </div>
    </>
  );
};

export default TemplatePicker;
