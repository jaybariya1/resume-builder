import React, { useState, useEffect } from "react";
import { X, Check, Palette } from "lucide-react";

// ─── Mini thumbnail previews for each template ───────────────────────────────

const ClassicThumb = () => (
  <div className="w-full h-full bg-white p-3 flex flex-col gap-1.5 font-sans">
    <div className="h-3 w-24 bg-gray-900 rounded-sm" />
    <div className="h-1.5 w-16 bg-gray-400 rounded-sm" />
    <div className="h-px w-full bg-gray-200 my-1" />
    <div className="flex flex-col gap-1">
      {[80, 60, 70, 55, 65].map((w, i) => (
        <div key={i} className="h-1 rounded-sm bg-gray-200" style={{ width: `${w}%` }} />
      ))}
    </div>
    <div className="mt-1.5 h-px w-full bg-gray-100" />
    <div className="flex gap-1 flex-wrap mt-1">
      {[30, 25, 35, 28].map((w, i) => (
        <div key={i} className="h-3 rounded-sm border border-gray-300" style={{ width: `${w}%` }} />
      ))}
    </div>
  </div>
);

const ExecutiveThumb = () => (
  <div className="w-full h-full bg-white flex">
    <div className="w-[38%] h-full p-2 flex flex-col gap-2" style={{ backgroundColor: "#1e293b" }}>
      <div className="h-2.5 w-full rounded-sm bg-white/20" />
      <div className="h-1.5 w-3/4 rounded-sm" style={{ backgroundColor: "#f97316" }} />
      <div className="h-px w-full bg-white/10 my-0.5" />
      <div className="flex flex-col gap-1">
        {[90, 70, 80, 60, 75].map((w, i) => (
          <div key={i} className="h-1 rounded-sm bg-white/20" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-0.5 mt-1">
        {[3, 4, 3, 4, 3].map((w, i) => (
          <div key={i} className="h-2 rounded-full" style={{ width: `${w * 8}px`, backgroundColor: "#334155" }} />
        ))}
      </div>
    </div>
    <div className="flex-1 p-2 flex flex-col gap-1.5">
      <div className="h-1.5 w-full rounded-sm bg-gray-200" />
      <div className="h-1.5 w-4/5 rounded-sm bg-gray-200" />
      <div className="h-px w-full bg-orange-100 my-0.5" />
      <div className="flex justify-between items-center">
        <div className="h-2 w-2/5 rounded-sm bg-gray-800" />
        <div className="h-1 w-1/4 rounded-sm" style={{ backgroundColor: "#f97316" }} />
      </div>
      {[85, 70, 90].map((w, i) => (
        <div key={i} className="h-1 rounded-sm bg-gray-100" style={{ width: `${w}%` }} />
      ))}
    </div>
  </div>
);

const ElegantThumb = () => (
  <div className="w-full h-full bg-white p-3 flex flex-col gap-1.5">
    <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: "#7c3aed" }} />
    <div className="mt-1 h-3.5 w-28 rounded-sm" style={{ backgroundColor: "#1e1b4b" }} />
    <div className="h-1.5 w-16 rounded-sm" style={{ backgroundColor: "#7c3aed", opacity: 0.6 }} />
    <div className="h-1 w-32 rounded-sm bg-gray-300" />
    <div className="mt-1 flex flex-col gap-0.5">
      <div className="flex justify-between items-center">
        <div className="h-1.5 w-2/5 rounded-sm" style={{ backgroundColor: "#7c3aed", opacity: 0.2 }} />
        <div className="text-[4px] text-gray-400 font-serif uppercase tracking-widest">Experience</div>
      </div>
      <div className="h-px w-full" style={{ backgroundColor: "#7c3aed", opacity: 0.2 }} />
    </div>
    <div className="flex flex-col gap-1">
      {[90, 70, 80, 65].map((w, i) => (
        <div key={i} className="h-1 rounded-sm bg-gray-200" style={{ width: `${w}%` }} />
      ))}
    </div>
  </div>
);

const FreshThumb = () => (
  <div className="w-full h-full flex flex-col">
    <div className="px-3 pt-2 pb-1.5" style={{ backgroundColor: "#f0fdf4" }}>
      <div className="flex justify-between items-end">
        <div>
          <div className="h-2.5 w-20 rounded-sm" style={{ backgroundColor: "#14532d" }} />
          <div className="mt-0.5 h-1.5 w-14 rounded-sm" style={{ backgroundColor: "#16a34a" }} />
        </div>
        <div className="flex flex-col gap-0.5 items-end">
          {[16, 20, 14].map((w, i) => (
            <div key={i} className="h-1 rounded-sm bg-gray-300" style={{ width: `${w}px` }} />
          ))}
        </div>
      </div>
      <div className="mt-1.5 h-[2px] w-full rounded-full" style={{ backgroundColor: "#16a34a" }} />
    </div>
    <div className="flex-1 px-3 py-1.5 flex flex-col gap-1.5">
      {[0, 1, 2].map((sec) => (
        <div key={sec} className="flex gap-1.5">
          <div className="w-[2px] rounded-full flex-shrink-0" style={{ backgroundColor: "#bbf7d0" }} />
          <div className="flex flex-col gap-0.5 flex-1">
            <div className="h-1.5 w-3/4 rounded-sm bg-gray-300" />
            <div className="h-1 w-full rounded-sm bg-gray-100" />
            <div className="h-1 w-4/5 rounded-sm bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TraditionalThumb = () => (
  <div style={{ width: "100%", height: "100%", background: "#fff", padding: "7px 6px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
    <div style={{ width: "55%", height: "6px", background: "#111", borderRadius: "1px", marginBottom: "2px" }} />
    <div style={{ width: "80%", height: "2px", background: "#aaa", borderRadius: "1px", marginBottom: "3px" }} />
    <div style={{ width: "100%", height: "1px", background: "#000", marginBottom: "4px" }} />
    {[0,1,2].map(s => (
      <div key={s} style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "2px" }}>
          <div style={{ width: "28px", height: "2.5px", background: "#333", borderRadius: "1px" }} />
          <div style={{ flex: 1, height: "1px", background: "#000" }} />
        </div>
        <div style={{ display: "flex", gap: "4px", marginBottom: "3px" }}>
          <div style={{ width: "22px", height: "2px", background: "#bbb", borderRadius: "1px", marginTop: "2px" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ width: "70%", height: "2.5px", background: "#333", borderRadius: "1px" }} />
            <div style={{ width: "50%", height: "2px", background: "#888", borderRadius: "1px" }} />
            <div style={{ width: "90%", height: "1.5px", background: "#ccc", borderRadius: "1px" }} />
          </div>
        </div>
      </div>
    ))}
  </div>
);


const THUMB_MAP = {
  modern: ClassicThumb,
  sidebar: ExecutiveThumb,
  elegant: ElegantThumb,
  minimal: FreshThumb,
  traditional: TraditionalThumb,
};

// ─── Main TemplatePicker ──────────────────────────────────────────────────────

const TemplatePicker = ({ isOpen, onClose, selectedId, onSelect }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setAnimateIn(true));
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const templates = [
    {
      id: "modern",
      name: "Classic",
      description: "Clean & ATS-friendly",
      accent: "#1e293b",
      tag: "Popular",
    },
    {
      id: "sidebar",
      name: "Executive",
      description: "Dark sidebar, two-column",
      accent: "#f97316",
      tag: "Bold",
    },
    {
      id: "elegant",
      name: "Elegant",
      description: "Serif, purple accents",
      accent: "#7c3aed",
      tag: "Refined",
    },
    {
      id: "minimal",
      name: "Fresh",
      description: "Green minimal borders",
      accent: "#16a34a",
      tag: "Modern",
    },
    {
      id: "traditional",
      name: "Traditional",
      description: "Classic serif, date-left",
      accent: "#000000",
      tag: "Classic",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 9998,
          opacity: animateIn ? 1 : 0,
          transition: "opacity 0.25s ease",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "420px",
          backgroundColor: "#ffffff",
          zIndex: 9999,
          transform: animateIn ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.15)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 24px 20px",
            borderBottom: "1px solid #f1f5f9",
            background: "linear-gradient(135deg, #fff 0%, #fafaf8 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #f97316, #ef4444)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Palette size={16} color="white" />
              </div>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                  Choose Template
                </h2>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                  Pick a style for your resume
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                background: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f8fafc";
                e.currentTarget.style.borderColor = "#cbd5e1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Template Grid */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {templates.map((t, index) => {
            const Thumb = THUMB_MAP[t.id];
            const isSelected = selectedId === t.id;
            const isHovered = hoveredId === t.id;

            return (
              <div
                key={t.id}
                onClick={() => {
                  onSelect(t.id);
                  onClose();
                }}
                onMouseEnter={() => setHoveredId(t.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  cursor: "pointer",
                  borderRadius: "14px",
                  border: `2px solid ${isSelected ? t.accent : isHovered ? "#e2e8f0" : "#f1f5f9"}`,
                  backgroundColor: isSelected ? `${t.accent}08` : "white",
                  padding: "14px",
                  display: "flex",
                  gap: "14px",
                  alignItems: "center",
                  transition: "all 0.18s ease",
                  transform: isHovered && !isSelected ? "translateY(-1px)" : "none",
                  boxShadow: isSelected
                    ? `0 0 0 1px ${t.accent}30, 0 4px 16px ${t.accent}15`
                    : isHovered
                    ? "0 4px 16px rgba(0,0,0,0.07)"
                    : "none",
                  animationDelay: `${index * 60}ms`,
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: "100px",
                    height: "130px",
                    flexShrink: 0,
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: `1px solid ${isSelected ? t.accent + "40" : "#e8ecef"}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    position: "relative",
                  }}
                >
                  <Thumb />
                  {isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: `${t.accent}15`,
                        borderRadius: "7px",
                      }}
                    />
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                      {t.name}
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: t.accent,
                        backgroundColor: `${t.accent}15`,
                        padding: "2px 6px",
                        borderRadius: "20px",
                      }}
                    >
                      {t.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: "12.5px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                    {t.description}
                  </p>

                  {/* Color swatch */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px" }}>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: t.accent,
                      }}
                    />
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>Accent color</span>
                  </div>

                  {isSelected && (
                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        color: t.accent,
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      <Check size={13} strokeWidth={2.5} />
                      Currently selected
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid #f1f5f9",
            backgroundColor: "#fafaf8",
          }}
        >
          <p style={{ fontSize: "11.5px", color: "#94a3b8", textAlign: "center", margin: 0 }}>
            Your content stays the same when switching templates
          </p>
        </div>
      </div>
    </>
  );
};

export default TemplatePicker;
