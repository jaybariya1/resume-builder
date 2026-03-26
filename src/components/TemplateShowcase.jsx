import React, { useState, useRef, useEffect } from "react";
import Template1 from "./resume/templates/Template1/Template1";
import Template2 from "./resume/templates/Template2/Template2";
import Template3 from "./resume/templates/Template3/Template3";
import Template4 from "./resume/templates/Template4/Template4";
import Template5 from "./resume/templates/Template5/Template5";
import { ChevronLeft, ChevronRight, FileText, Download, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── Sample resume data ───────────────────────────────────────────────────────
const SAMPLE_DATA = {
  firstName: "Richard",
  lastName: "Williams",
  email: "richard.williams@gmail.com",
  phone: "(123) 456-7890",
  city: "New York",
  country: "NY",
  location: "47 W 13th St, New York, NY 10011",
  role: "Senior Financial Advisor",
  summary:
    "Financial Advisor with 7+ years of experience delivering financial investment advisory services to high-value clients. Proven success in managing multi-million dollar portfolios and increasing ROI through skillful strategic planning, consulting, and financial advisory services.",
  linkedin: "linkedin.com/in/richard.williams",
  github: "",
  portfolio: "",
  website: "richard.williams.com",
  experience: [
    {
      id: "e1",
      title: "Senior Financial Advisor",
      company: "Wells Fargo Advisors",
      location: "Houston, TX",
      startDate: "Jan 2019",
      endDate: "Present",
      current: true,
      description:
        "Deliver financial advice to clients, proposing strategies to achieve short- and long-term objectives for investments, insurance, business and estate planning with minimal risk. Develop, review, and optimize investment portfolios for 300+ high-value clients with over $190M AUM.",
    },
    {
      id: "e2",
      title: "Financial Advisor",
      company: "Suntrust Investment Services, Inc.",
      location: "New Orleans, LA",
      startDate: "Jan 2018",
      endDate: "Jan 2019",
      current: false,
      description:
        "Served as a knowledgeable financial advisor to clients, managing an over $20.75M investment portfolio of 90+ individual and corporate clients.",
    },
    {
      id: "e3",
      title: "Financial Advisor",
      company: "Maverick Capital Management",
      location: "New Orleans, LA",
      startDate: "Jan 2017",
      endDate: "Jan 2018",
      current: false,
      description:
        "Served as the primary point of contact for over 15 clients. Managed the portfolios of several major clients with over $8.5M in total assets.",
    },
  ],
  education: [
    {
      id: "ed1",
      degree: "Bachelor of Science in Business Administration",
      school: "Louisiana State University",
      location: "Baton Rouge, LA",
      graduationDate: "Expected Graduation March 2022",
      gpa: "3.7/4.0",
      description: "",
    },
  ],
  skills: [
    { id: "s1", name: "Financial Planning", level: 3 },
    { id: "s2", name: "Investment Advisory", level: 3 },
    { id: "s3", name: "Portfolio Management", level: 2 },
    { id: "s4", name: "Risk Assessment", level: 2 },
    { id: "s5", name: "Client Relations", level: 3 },
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
  {
    id: "modern",
    name: "Classic",
    description: "Clean & ATS-Friendly",
    accent: "#1e293b",
    tag: "Popular",
    Component: Template1,
  },
  {
    id: "sidebar",
    name: "Executive",
    description: "Bold Two-Column Layout",
    accent: "#f97316",
    tag: "Bold",
    Component: Template2,
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Serif, Purple Accents",
    accent: "#7c3aed",
    tag: "Refined",
    Component: Template3,
  },
  {
    id: "minimal",
    name: "Fresh",
    description: "Green Minimal Borders",
    accent: "#16a34a",
    tag: "Modern",
    Component: Template4,
  },
  {
    id: "traditional",
    name: "Traditional",
    description: "Classic Serif Style",
    accent: "#0f172a",
    tag: "Classic",
    Component: Template5,
  },
];

// ─── Card dimensions ──────────────────────────────────────────────────────────
const CARD_W = 280;
const CARD_H = 370;
const TEMPLATE_W = 794;
const SCALE = CARD_W / TEMPLATE_W;

function TemplateCard({ template, isCenter, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  const { Component, name, description, tag, accent } = template;

  const scale = isCenter ? 1 : 0.88;
  const opacity = isCenter ? 1 : 0.65;
  const zIndex = isCenter ? 10 : 1;
  const translateY = isCenter ? 0 : 24;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: CARD_W,
        flexShrink: 0,
        cursor: "pointer",
        transform: `scale(${hovered && isCenter ? 1.02 : scale}) translateY(${translateY}px)`,
        opacity: hovered && !isCenter ? 0.8 : opacity,
        zIndex: zIndex,
        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        position: "relative",
      }}
    >
      {/* Tag */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          zIndex: 20,
          backgroundColor: accent,
          color: "white",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "3px 9px",
          borderRadius: 20,
          boxShadow: `0 2px 8px ${accent}55`,
        }}
      >
        {tag}
      </div>

      {/* "Use Template" overlay on hover */}
      {isCenter && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: "50%",
            transform: `translateX(-50%) translateY(${hovered ? 0 : 12}px)`,
            opacity: hovered ? 1 : 0,
            transition: "all 0.25s ease",
            zIndex: 20,
            backgroundColor: accent,
            color: "white",
            fontSize: 13,
            fontWeight: 700,
            padding: "9px 22px",
            borderRadius: 30,
            whiteSpace: "nowrap",
            boxShadow: `0 4px 20px ${accent}60`,
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <Zap size={14} />
          Use This Template
        </div>
      )}

      {/* Preview frame */}
      <div
        style={{
          width: CARD_W,
          height: CARD_H,
          borderRadius: 14,
          overflow: "hidden",
          border: isCenter
            ? `2px solid ${accent}55`
            : "2px solid #e2e8f0",
          boxShadow: isCenter
            ? `0 20px 60px ${accent}25, 0 8px 24px rgba(0,0,0,0.12)`
            : "0 4px 16px rgba(0,0,0,0.08)",
          backgroundColor: "white",
          position: "relative",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
      >
        {/* Scaled template */}
        <div
          style={{
            transformOrigin: "top left",
            transform: `scale(${SCALE})`,
            width: TEMPLATE_W,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <Component data={SAMPLE_DATA} />
        </div>

        {/* Gradient fade at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background:
              "linear-gradient(to top, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Name + description */}
      <div style={{ marginTop: 14, textAlign: "center" }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: isCenter ? "#0f172a" : "#64748b",
            transition: "color 0.3s",
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 3 }}>
          {description}
        </div>

        {/* Color dot */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
            marginTop: 7,
          }}
        >
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              backgroundColor: accent,
              boxShadow: `0 0 0 2px ${accent}30`,
            }}
          />
          <span style={{ fontSize: 11, color: "#b0b8c4" }}>Accent color</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main TemplateShowcase ────────────────────────────────────────────────────
export default function TemplateShowcase({ onSelectTemplate }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const prev = () =>
    setActiveIndex((i) => (i - 1 + TEMPLATES.length) % TEMPLATES.length);
  const next = () =>
    setActiveIndex((i) => (i + 1) % TEMPLATES.length);

  // Build circular order: [...2 before center, center, ...2 after]
  const visibleCount = 5;
  const getOrder = () => {
    const order = [];
    const half = Math.floor(visibleCount / 2);
    for (let offset = -half; offset <= half; offset++) {
      const idx = (activeIndex + offset + TEMPLATES.length) % TEMPLATES.length;
      order.push({ idx, offset });
    }
    return order;
  };

  const ordered = getOrder();

  const handleUseTemplate = (templateId) => {
    if (onSelectTemplate) {
      onSelectTemplate(templateId);
    } else {
      navigate("/resume/new");
    }
  };

  return (
    <section
      style={{
        padding: "72px 0 80px",
        background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Subtle background pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(99,102,241,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(249,115,22,0.04) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: 52, position: "relative" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            backgroundColor: "#fef3c7",
            border: "1px solid #fde68a",
            borderRadius: 30,
            padding: "5px 14px",
            fontSize: 12,
            fontWeight: 700,
            color: "#92400e",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          <FileText size={13} />
          Resume Templates
        </div>

        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 800,
            color: "#0f172a",
            margin: "0 0 12px",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          Choose Your Perfect Template
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "#64748b",
            maxWidth: 480,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Professionally designed templates that get you noticed. ATS-friendly
          and customizable in minutes.
        </p>

        {/* Template count pills */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 20,
          }}
        >
          {TEMPLATES.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActiveIndex(i)}
              style={{
                width: i === activeIndex ? 24 : 8,
                height: 8,
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                backgroundColor: i === activeIndex ? t.accent : "#e2e8f0",
                transition: "all 0.35s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: 24,
          padding: "0 20px 24px",
          minHeight: CARD_H + 80,
        }}
      >
        {ordered.map(({ idx, offset }) => (
          <TemplateCard
            key={TEMPLATES[idx].id}
            template={TEMPLATES[idx]}
            isCenter={offset === 0}
            index={idx}
            onClick={() => {
              if (offset === 0) {
                handleUseTemplate(TEMPLATES[idx].id);
              } else {
                setActiveIndex(idx);
              }
            }}
          />
        ))}
      </div>

      {/* Nav arrows */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          marginTop: 20,
        }}
      >
        <button
          onClick={prev}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "1.5px solid #e2e8f0",
            backgroundColor: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#475569",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#94a3b8";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <ChevronLeft size={18} />
        </button>

        <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>
          {activeIndex + 1} / {TEMPLATES.length}
        </span>

        <button
          onClick={next}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "1.5px solid #e2e8f0",
            backgroundColor: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#475569",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#94a3b8";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Format badges */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginTop: 28,
        }}
      >
        {["PDF", "Word", "TXT"].map((fmt) => (
          <div
            key={fmt}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "5px 12px",
              fontSize: 12.5,
              fontWeight: 600,
              color: "#475569",
            }}
          >
            <Download size={12} />
            {fmt}
          </div>
        ))}
      </div>
    </section>
  );
}
