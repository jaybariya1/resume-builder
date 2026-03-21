import React, { useState, useContext, useEffect } from "react";
import { Type, Layout, Check, Lock } from "lucide-react";
import Template1 from "./templates/Template1/Template1";
import Template2 from "./templates/Template2/Template2";
import Template3 from "./templates/Template3/Template3";
import Template4 from "./templates/Template4/Template4";
import Template5 from "./templates/Template5/Template5";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";

// ─── Sample data ──────────────────────────────────────────────────────────────
const SAMPLE = {
  firstName: "Sebastian", lastName: "Bennett",
  email: "hello@reallygreatsite.com", phone: "+123-456-7890",
  city: "Any City", country: "", location: "123 Anywhere St., Any City",
  role: "Professional Accountant",
  summary: "Results-driven accountant with 5+ years of experience in financial reporting, auditing, and compliance. Proven track record of delivering accurate financial statements.",
  linkedin: "", github: "", portfolio: "", website: "",
  experience: [
    { id: "e1", title: "Senior Accountant", company: "Salford & Co.", location: "New York, NY", startDate: "2033", endDate: "2035", current: false, description: "<ul><li>Led month-end close process, reducing cycle time by 20%</li><li>Managed 40+ client accounts with 100% on-time reporting</li></ul>" },
    { id: "e2", title: "Financial Accountant", company: "Salford & Co.", location: "New York, NY", startDate: "2030", endDate: "2033", current: false, description: "<ul><li>Prepared financial statements for quarterly audits</li><li>Streamlined reconciliation, saving 8 hours per month</li></ul>" },
  ],
  education: [
    { id: "ed1", degree: "M.Com Accounting", school: "Borcelle University", location: "", graduationDate: "2030", gpa: "", description: "" },
    { id: "ed2", degree: "B.Com Finance", school: "Borcelle University", location: "", graduationDate: "2026", gpa: "", description: "" },
  ],
  skills: [
    { id: "s1", name: "Financial Accounting", level: 3 }, { id: "s2", name: "Auditing", level: 3 },
    { id: "s3", name: "Financial Reporting", level: 2 }, { id: "s4", name: "Tax Compliance", level: 2 },
    { id: "s5", name: "Microsoft Excel", level: 3 }, { id: "s6", name: "QuickBooks", level: 2 },
  ],
  project: [], hideSkillLevel: false, certifications: [], languages: [], volunteer: [], awards: [],
};

// ─── Templates — supportsColor flags which ones allow accent customization ────
const TEMPLATES = [
  { id: "modern",      name: "Classic",     Component: Template1, defaultAccent: "#1e293b", tags: ["ATS"],         supportsColor: false },
  { id: "sidebar",     name: "Executive",   Component: Template2, defaultAccent: "#f97316", tags: ["Two column"],  supportsColor: true  },
  { id: "elegant",     name: "Elegant",     Component: Template3, defaultAccent: "#7c3aed", tags: [],              supportsColor: true  },
  { id: "minimal",     name: "Fresh",       Component: Template4, defaultAccent: "#16a34a", tags: ["ATS"],         supportsColor: true  },
  { id: "traditional", name: "Traditional", Component: Template5, defaultAccent: "#000000", tags: [],              supportsColor: false },
];

const FILTER_TAGS = ["All", "Two column", "ATS"];

// Preset accent colors per supporting template
const ACCENT_PRESETS = {
  sidebar:  ["#f97316", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#1e293b"],
  elegant:  ["#7c3aed", "#2563eb", "#be185d", "#0f766e", "#b45309", "#1e293b"],
  minimal:  ["#16a34a", "#0891b2", "#7c3aed", "#dc2626", "#d97706", "#1e293b"],
};

const FONTS = [
  { id: "arial",     label: "Arial",           value: "Arial, Helvetica, sans-serif" },
  { id: "georgia",   label: "Georgia",         value: "Georgia, serif" },
  { id: "times",     label: "Times New Roman", value: "'Times New Roman', serif" },
  { id: "trebuchet", label: "Trebuchet MS",    value: "'Trebuchet MS', sans-serif" },
  { id: "verdana",   label: "Verdana",         value: "Verdana, Geneva, sans-serif" },
];
const SIZES = ["10", "11", "12", "13", "14"];

// ─── Thumbnail ────────────────────────────────────────────────────────────────
const THUMB_W = 160;
const THUMB_H = 210;
const SCALE   = THUMB_W / 794;

function LiveThumb({ Component, selected, defaultAccent, accentColor }) {
  const color = accentColor || defaultAccent;
  return (
    <div className="relative overflow-hidden transition-all duration-150" style={{
      width: THUMB_W, height: THUMB_H, borderRadius: 6,
      border: `2px solid ${selected ? "#3b82f6" : "#e5e7eb"}`,
      boxShadow: selected ? "0 0 0 2px #3b82f640" : "0 1px 3px rgba(0,0,0,0.08)",
      backgroundColor: "white", flexShrink: 0,
    }}>
      <div style={{ transformOrigin: "top left", transform: `scale(${SCALE})`, width: 794, pointerEvents: "none", userSelect: "none" }}>
        <Component data={SAMPLE} accentColor={color} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex gap-1 px-2 pb-1.5">
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#f97316", color: "white" }}>PDF</span>
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#f97316", color: "white" }}>DOCX</span>
      </div>
      {selected && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(59,130,246,0.08)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "#3b82f6" }}>
            <Check size={16} color="white" strokeWidth={3} />
          </div>
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, label }) {
  return (
    <button onClick={onClick} className="flex-1 py-3 text-sm font-semibold transition-all border-b-2"
      style={{ color: active ? "#f97316" : "#9ca3af", borderBottomColor: active ? "#f97316" : "transparent", background: "none" }}>
      {label}
    </button>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} className="relative flex-shrink-0 transition-all duration-200"
      style={{ width: 40, height: 24, borderRadius: 99, backgroundColor: on ? "#f97316" : "#d1d5db", border: "none", cursor: "pointer" }}>
      <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200" style={{ left: on ? 18 : 2 }} />
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CustomizePanel({ selectedId, onSelectTemplate, accentColor, onAccentChange }) {
  const { resumeData, setResumeData } = useContext(ResumeInfoContext);
  const [tab, setTab]             = useState("templates");
  const [filter, setFilter]       = useState("All");
  const [selectedFont, setSelectedFont] = useState(() => {
    if (!resumeData?.fontFamily) return "arial";
    const match = FONTS.find(f => f.value === resumeData.fontFamily);
    return match ? match.id : "arial";
  });
  const [selectedSize, setSelectedSize] = useState(() => resumeData?.fontSize || "12");
  const [margin, setMargin]       = useState("Normal");
  const [layout, setLayout]       = useState({ hideSkillLevel: false, compactSpacing: false, showPhoto: false, twoColumn: false });


  // Sync settings from resumeData (important for edit mode where data loads async)
  useEffect(() => {
    if (!resumeData?.id) return; // only sync when a real resume is loaded
    setLayout(prev => ({ ...prev, hideSkillLevel: !!resumeData?.hideSkillLevel }));
    if (resumeData.fontFamily) {
      const match = FONTS.find(f => f.value === resumeData.fontFamily);
      if (match) setSelectedFont(match.id);
    }
    if (resumeData.fontSize) {
      setSelectedSize(resumeData.fontSize);
    }
  }, [resumeData?.id]);

  const currentTemplate = TEMPLATES.find(t => t.id === selectedId);
  const supportsColor   = currentTemplate?.supportsColor ?? false;
  const presets         = ACCENT_PRESETS[selectedId] || [];
  const effectiveAccent = accentColor || currentTemplate?.defaultAccent;

  const handleSelectTemplate = (id) => {
    onSelectTemplate(id);
    const tpl = TEMPLATES.find(t => t.id === id);
    if (!tpl?.supportsColor) {
      // Fixed color templates — clear any custom accent
      onAccentChange(null);
    } else {
      // Apply the template's default accent color immediately
      onAccentChange(tpl.defaultAccent);
    }
  };

  const toggleLayout = (key) => {
    const next = { ...layout, [key]: !layout[key] };
    setLayout(next);
    // Persist ALL layout flags to resumeData so templates can read them
    setResumeData(prev => ({
      ...prev,
      hideSkillLevel: next.hideSkillLevel,
      compactSpacing: next.compactSpacing,
      showPhoto: next.showPhoto,
      twoColumnSkills: next.twoColumn,
    }));
  };

  const applyFont = (fontId) => {
    setSelectedFont(fontId);
    setResumeData(prev => ({ ...prev, fontFamily: FONTS.find(f => f.id === fontId)?.value }));
  };

  const applySize = (size) => {
    setSelectedSize(size);
    setResumeData(prev => ({ ...prev, fontSize: size }));
  };

  const handleMarginChange = (m) => {
    setMargin(m);
    const paddingMap = { Narrow: "32px 40px", Normal: "48px 60px", Wide: "64px 80px" };
    setResumeData(prev => ({ ...prev, pageMargin: paddingMap[m] }));
  };

  const visibleTemplates = filter === "All" ? TEMPLATES : TEMPLATES.filter(t => t.tags.includes(filter));

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tab bar */}
      <div className="flex border-b border-[#fde3c8] flex-shrink-0">
        <TabBtn active={tab === "templates"} onClick={() => setTab("templates")} label="Template & Colors" />
        <TabBtn active={tab === "text"}      onClick={() => setTab("text")}      label="Text" />
        <TabBtn active={tab === "layout"}    onClick={() => setTab("layout")}    label="Layout" />
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

        {/* ══ TEMPLATES & COLORS ══ */}
        {tab === "templates" && (
          <div>
            {/* Accent color row — only shown for templates that support it */}
            <div className="flex items-start gap-3 px-5 py-4 border-b border-[#fde3c8]">
              <span className="text-sm font-medium text-stone-600 flex-shrink-0 pt-1">Main color</span>
              <div className="flex-1">
                {supportsColor ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Preset swatches */}
                    {presets.map((c) => (
                      <button key={c} onClick={() => onAccentChange(c)}
                        className="relative flex items-center justify-center transition-all hover:scale-110"
                        style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: c, border: "none", cursor: "pointer", flexShrink: 0,
                          boxShadow: effectiveAccent === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "none" }}>
                        {effectiveAccent === c && <Check size={12} color="white" strokeWidth={3} />}
                      </button>
                    ))}
                    {/* Custom color picker */}
                    <label className="flex items-center justify-center cursor-pointer transition-all hover:scale-110"
                      style={{ width: 28, height: 28, borderRadius: "50%", border: "2px dashed #d1d5db", backgroundColor: "white", position: "relative", flexShrink: 0 }}>
                      <input type="color" value={effectiveAccent} onChange={e => onAccentChange(e.target.value)}
                        style={{ opacity: 0, position: "absolute", width: 0, height: 0 }} />
                      <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: effectiveAccent }} />
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: currentTemplate?.defaultAccent, flexShrink: 0 }} />
                    <div className="flex items-center gap-1.5 text-xs text-stone-400">
                      <Lock size={11} />
                      <span>This template uses a fixed color scheme</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2 px-5 py-3 flex-wrap border-b border-[#fde3c8]">
              {FILTER_TAGS.map(tag => (
                <button key={tag} onClick={() => setFilter(tag)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{ border: `1.5px solid ${filter === tag ? "#3b82f6" : "#e5e7eb"}`,
                    backgroundColor: filter === tag ? "#eff6ff" : "white",
                    color: filter === tag ? "#1d4ed8" : "#374151" }}>
                  {tag}
                </button>
              ))}
            </div>

            {/* Template grid */}
            <div className="p-5">
              <div className="grid grid-cols-2 gap-x-5 gap-y-6">
                {visibleTemplates.map(({ id, name, Component, defaultAccent, supportsColor: sc }) => {
                  const thumbAccent = selectedId === id ? (accentColor || defaultAccent) : defaultAccent;
                  return (
                    <div key={id} className="flex flex-col items-start gap-2 cursor-pointer" onClick={() => handleSelectTemplate(id)}>
                      <div className="flex items-center justify-between w-full">
                        <p className="text-sm font-semibold text-stone-700">{name}</p>
                        {!sc && <span className="text-[10px] text-stone-400 flex items-center gap-0.5"><Lock size={9} /> Fixed</span>}
                      </div>
                      <LiveThumb Component={Component} selected={selectedId === id} defaultAccent={defaultAccent} accentColor={selectedId === id ? accentColor : null} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══ TEXT ══ */}
        {tab === "text" && (
          <div className="p-5 space-y-6">
            <div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Font Family</p>
              <div className="space-y-2">
                {FONTS.map(({ id, label, value }) => (
                  <button key={id} onClick={() => applyFont(id)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all text-left"
                    style={{ borderColor: selectedFont === id ? "#f97316" : "#f3f4f6", backgroundColor: selectedFont === id ? "#fff7ed" : "white", fontFamily: value }}>
                    <span className="text-sm font-medium text-stone-800">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-400" style={{ fontFamily: value }}>Aa Bb</span>
                      {selectedFont === id && <Check size={14} className="text-orange-500" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Font Size</p>
              <div className="flex gap-2">
                {SIZES.map(s => (
                  <button key={s} onClick={() => applySize(s)}
                    className="flex-1 py-2 rounded-lg border-1 text-sm font-bold transition-all"
                    style={{ borderColor: selectedSize === s ? "#f97316" : "#f3f4f6",
                      backgroundColor: selectedSize === s ? "white" : "white",
                      color: selectedSize === s ? "#f97316" : "#374151" }}>
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-xs text-stone-400 mt-2">Base font size in points — applies to resume content</p>
            </div>

            {/* Live preview */}
            <div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Preview</p>
              <div className="rounded-lg border border-[#fde3c8] p-4 bg-[#fff7ed]">
                <p className="font-bold text-stone-800 mb-0.5"
                  style={{ fontFamily: FONTS.find(f => f.id === selectedFont)?.value, fontSize: `${selectedSize}px` }}>
                  {resumeData?.firstName || "Your"} {resumeData?.lastName || "Name"}
                </p>
                <p className="text-stone-500"
                  style={{ fontFamily: FONTS.find(f => f.id === selectedFont)?.value, fontSize: `${parseInt(selectedSize) - 1}px` }}>
                  {resumeData?.role || "Your Role"} · {resumeData?.email || "email@example.com"}
                </p>
                <p className="text-stone-600 mt-1 line-clamp-2"
                  style={{ fontFamily: FONTS.find(f => f.id === selectedFont)?.value, fontSize: `${parseInt(selectedSize) - 1}px` }}>
                  {resumeData?.summary ? resumeData.summary.replace(/<[^>]+>/g, "").slice(0, 120) + "…" : "Your professional summary will appear here."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ══ LAYOUT ══ */}
        {tab === "layout" && (
          <div className="p-5 space-y-6">
            <div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Section Options</p>
              <div className="space-y-2">
                {[
                  { key: "hideSkillLevel", label: "Hide skill level bars",     desc: "Show only skill names without bars" },
                  { key: "compactSpacing", label: "Compact spacing",           desc: "Reduce gaps between sections" },
                  { key: "showPhoto",      label: "Include photo placeholder", desc: "Add a photo area to the header" },
                  { key: "twoColumn",      label: "Two-column skills",         desc: "Display skills in 2 columns" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all"
                    style={{ borderColor: layout[key] ? "#f97316" : "#f3f4f6", backgroundColor: layout[key] ? "#fff7ed" : "white" }}>
                    <div>
                      <p className="text-sm font-semibold text-stone-800">{label}</p>
                      <p className="text-xs text-stone-400">{desc}</p>
                    </div>
                    <Toggle on={layout[key]} onClick={() => toggleLayout(key)} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Page Margins</p>
              <div className="grid grid-cols-3 gap-2">
                {["Narrow", "Normal", "Wide"].map(m => (
                  <button key={m} onClick={() => handleMarginChange(m)}
                    className="py-2.5 rounded-lg border-2 text-xs font-semibold transition-all"
                    style={{ borderColor: margin === m ? "#f97316" : "#e5e7eb",
                      backgroundColor: margin === m ? "#fff7ed" : "white",
                      color: margin === m ? "#f97316" : "#374151" }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
