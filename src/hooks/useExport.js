/**
 * useExport – PDF, DOCX, and plain-text export for the resume builder.
 *
 * PDF  → print-dialog approach (same quality as the existing download)
 *         but wrapped in a promise so the dropdown can show a spinner.
 * DOCX → built from scratch with the docx npm package (pure JS, no server).
 * TXT  → strips HTML tags and formats sections as readable plain text.
 */

import { useContext, useCallback, useState } from "react";
import { ResumeInfoContext } from "../context/ResumeInfoContext";

// ─── tiny HTML → plain-text helper ───────────────────────────────────────────
function htmlToText(html = "") {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ─── PDF ─────────────────────────────────────────────────────────────────────
function exportPDF(resumeTitle) {
  return new Promise((resolve) => {
    const element = document.getElementById("resume-preview");
    if (!element) { resolve(); return; }

    const styleId = "resume-print-style";
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.textContent = `
      @media print {
        @page { size: 794px 1123px; margin: 0 !important; }
        body > * { display: none !important; }
        #resume-print-container { display: block !important; position: fixed !important; inset: 0 !important; z-index: 99999 !important; background: white !important; }
        #resume-print-container #resume-preview { width: 794px !important; min-height: 1123px !important; margin: 0 !important; box-shadow: none !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        #resume-print-container .mx-auto { margin-left: 0 !important; margin-right: 0 !important; }
      }`;

    let container = document.getElementById("resume-print-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "resume-print-container";
      container.style.display = "none";
      document.body.appendChild(container);
    }

    const parent = element.parentNode;
    const nextSibling = element.nextSibling;
    container.appendChild(element);

    const cleanup = () => {
      nextSibling
        ? parent.insertBefore(element, nextSibling)
        : parent.appendChild(element);
      style.textContent = "";
      resolve();
    };
    window.addEventListener("afterprint", cleanup, { once: true });
    window.print();
  });
}

// ─── TXT ─────────────────────────────────────────────────────────────────────
function exportTXT(data, title) {
  const {
    firstName = "", lastName = "", role = "", email = "", phone = "",
    location = "", city = "", country = "",
    linkedin = "", github = "", portfolio = "",
    summary = "",
    experience = [], education = [], skills = [],
    project = [], certifications = [], languages = [],
    volunteer = [], awards = [],
    sectionTitles = {},
  } = data;

  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const fullLocation = location || [city, country].filter(Boolean).join(", ");
  const lines = [];

  const sec = (key, fallback) => sectionTitles?.[key] || fallback;

  // Header
  lines.push(fullName.toUpperCase());
  if (role) lines.push(role);
  const contact = [email, phone, fullLocation, linkedin, github, portfolio].filter(Boolean);
  if (contact.length) lines.push(contact.join("  |  "));
  lines.push("");

  // Summary
  if (summary) {
    lines.push("─".repeat(60));
    lines.push(sec(1, "PROFESSIONAL SUMMARY").toUpperCase());
    lines.push("─".repeat(60));
    lines.push(htmlToText(summary));
    lines.push("");
  }

  // Experience
  if (experience?.length) {
    lines.push("─".repeat(60));
    lines.push(sec(2, "EXPERIENCE").toUpperCase());
    lines.push("─".repeat(60));
    experience.forEach((exp) => {
      const period = [exp.startDate, exp.current ? "Present" : exp.endDate].filter(Boolean).join(" – ");
      lines.push(`${exp.title || ""}${exp.company ? "  ·  " + exp.company : ""}${period ? "  ·  " + period : ""}`);
      if (exp.location) lines.push(exp.location);
      if (exp.description) lines.push(htmlToText(exp.description));
      lines.push("");
    });
  }

  // Education
  if (education?.length) {
    lines.push("─".repeat(60));
    lines.push(sec(3, "EDUCATION").toUpperCase());
    lines.push("─".repeat(60));
    education.forEach((edu) => {
      lines.push(`${edu.degree || ""}${edu.school ? "  ·  " + edu.school : ""}${edu.graduationDate ? "  ·  " + edu.graduationDate : ""}`);
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
      if (edu.description) lines.push(htmlToText(edu.description));
      lines.push("");
    });
  }

  // Skills
  if (skills?.length) {
    lines.push("─".repeat(60));
    lines.push(sec(4, "SKILLS").toUpperCase());
    lines.push("─".repeat(60));
    lines.push(skills.map((s) => s.name).join(", "));
    lines.push("");
  }

  // Projects
  if (project?.length) {
    lines.push("─".repeat(60));
    lines.push(sec(5, "PROJECTS").toUpperCase());
    lines.push("─".repeat(60));
    project.forEach((p) => {
      lines.push(`${p.name || ""}${p.technologies ? "  ·  " + p.technologies : ""}${p.link ? "  ·  " + p.link : ""}`);
      if (p.description) lines.push(htmlToText(p.description));
      lines.push("");
    });
  }

  // Certifications
  if (certifications?.length) {
    lines.push("─".repeat(60));
    lines.push("CERTIFICATIONS");
    lines.push("─".repeat(60));
    certifications.forEach((c) => {
      lines.push(`${c.name || ""}${c.issuer ? "  ·  " + c.issuer : ""}${c.date ? "  ·  " + c.date : ""}`);
    });
    lines.push("");
  }

  // Languages
  if (languages?.length) {
    lines.push("─".repeat(60));
    lines.push("LANGUAGES");
    lines.push("─".repeat(60));
    lines.push(languages.map((l) => `${l.name}${l.proficiency ? " (" + l.proficiency + ")" : ""}`).join(", "));
    lines.push("");
  }

  // Volunteer
  if (volunteer?.length) {
    lines.push("─".repeat(60));
    lines.push("VOLUNTEER");
    lines.push("─".repeat(60));
    volunteer.forEach((v) => {
      lines.push(`${v.role || ""}${v.organization ? "  ·  " + v.organization : ""}${v.startDate ? "  ·  " + v.startDate : ""}`);
      if (v.description) lines.push(htmlToText(v.description));
      lines.push("");
    });
  }

  // Awards
  if (awards?.length) {
    lines.push("─".repeat(60));
    lines.push("AWARDS & ACHIEVEMENTS");
    lines.push("─".repeat(60));
    awards.forEach((a) => {
      lines.push(`${a.title || ""}${a.issuer ? "  ·  " + a.issuer : ""}${a.date ? "  ·  " + a.date : ""}`);
      if (a.description) lines.push(htmlToText(a.description));
      lines.push("");
    });
  }

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title || "resume"}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── DOCX ─────────────────────────────────────────────────────────────────────
// Built with the `docx` library (https://docx.js.org).
// We dynamically import it so it doesn't bloat the initial bundle.
async function exportDOCX(data, title) {
  const {
    Document, Packer, Paragraph, TextRun, HeadingLevel,
    AlignmentType, BorderStyle, UnderlineType,
    Table, TableRow, TableCell, WidthType, VerticalAlign,
  } = await import("docx");

  const {
    firstName = "", lastName = "", role = "", email = "", phone = "",
    location = "", city = "", country = "",
    linkedin = "", github = "", portfolio = "",
    summary = "",
    experience = [], education = [], skills = [],
    project = [], certifications = [], languages = [],
    volunteer = [], awards = [],
    sectionTitles = {},
  } = data;

  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const fullLocation = location || [city, country].filter(Boolean).join(", ");
  const sec = (key, fallback) => (sectionTitles?.[key] || fallback).toUpperCase();

  const children = [];

  // ── helpers ────────────────────────────────────────────────────────────────
  const sectionHeading = (text) => new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "1e293b", space: 4 } },
    run: { bold: true, size: 22, color: "1e293b" },
  });

  const bodyText = (text, opts = {}) => new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: text || "", size: 20, color: "374151", ...opts })],
  });

  const boldLabel = (label, value, opts = {}) => {
    if (!value) return null;
    return new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: label, bold: true, size: 20 }),
        new TextRun({ text: value, size: 20, color: "374151", ...opts }),
      ],
    });
  };

  // Parse bullet HTML into Paragraph[]
  const htmlToBullets = (html = "") => {
    if (!html) return [];
    const items = [];
    // Extract <li> items
    const liRegex = /<li[^>]*>(.*?)<\/li>/gis;
    let match;
    let hasBullets = false;
    while ((match = liRegex.exec(html)) !== null) {
      hasBullets = true;
      const text = match[1].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
      if (text) items.push(new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 40 },
        children: [new TextRun({ text, size: 20, color: "374151" })],
      }));
    }
    if (!hasBullets) {
      const plain = htmlToText(html);
      if (plain) items.push(new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: plain, size: 20, color: "374151" })],
      }));
    }
    return items;
  };

  // ── Name / header ──────────────────────────────────────────────────────────
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text: fullName || "Your Name", bold: true, size: 36, color: "111827" })],
  }));

  if (role) children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text: role, size: 22, color: "6b7280", italics: true })],
  }));

  const contactParts = [email, phone, fullLocation, linkedin, github, portfolio].filter(Boolean);
  if (contactParts.length) children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [new TextRun({ text: contactParts.join("   |   "), size: 18, color: "6b7280" })],
  }));

  // ── Summary ────────────────────────────────────────────────────────────────
  if (summary) {
    children.push(sectionHeading(sec(1, "Professional Summary")));
    const plain = htmlToText(summary);
    children.push(new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: plain, size: 20, color: "374151" })],
    }));
  }

  // ── Experience ─────────────────────────────────────────────────────────────
  if (experience?.length) {
    children.push(sectionHeading(sec(2, "Experience")));
    experience.forEach((exp) => {
      const period = [exp.startDate, exp.current ? "Present" : exp.endDate].filter(Boolean).join(" – ");
      children.push(new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: exp.title || "", bold: true, size: 22, color: "111827" }),
          exp.company ? new TextRun({ text: `  ·  ${exp.company}`, size: 20, color: "374151" }) : null,
          period ? new TextRun({ text: `  ·  ${period}`, size: 18, color: "6b7280", italics: true }) : null,
        ].filter(Boolean),
      }));
      if (exp.location) children.push(bodyText(exp.location, { color: "9ca3af", italics: true }));
      children.push(...htmlToBullets(exp.description));
      children.push(new Paragraph({ spacing: { after: 80 } }));
    });
  }

  // ── Education ─────────────────────────────────────────────────────────────
  if (education?.length) {
    children.push(sectionHeading(sec(3, "Education")));
    education.forEach((edu) => {
      children.push(new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: edu.degree || "", bold: true, size: 22, color: "111827" }),
          edu.school ? new TextRun({ text: `  ·  ${edu.school}`, size: 20, color: "374151" }) : null,
          edu.graduationDate ? new TextRun({ text: `  ·  ${edu.graduationDate}`, size: 18, color: "6b7280", italics: true }) : null,
        ].filter(Boolean),
      }));
      if (edu.gpa) children.push(bodyText(`GPA: ${edu.gpa}`, { color: "6b7280" }));
      if (edu.description) children.push(...htmlToBullets(edu.description));
      children.push(new Paragraph({ spacing: { after: 80 } }));
    });
  }

  // ── Skills ────────────────────────────────────────────────────────────────
  if (skills?.length) {
    children.push(sectionHeading(sec(4, "Skills")));
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: skills.map((s) => s.name).join("   •   "), size: 20, color: "374151" })],
    }));
  }

  // ── Projects ─────────────────────────────────────────────────────────────
  if (project?.length) {
    children.push(sectionHeading(sec(5, "Projects")));
    project.forEach((p) => {
      children.push(new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: p.name || "", bold: true, size: 22, color: "111827" }),
          p.technologies ? new TextRun({ text: `  ·  ${p.technologies}`, size: 18, color: "6b7280", italics: true }) : null,
          p.link ? new TextRun({ text: `  ·  ${p.link}`, size: 18, color: "2563eb" }) : null,
        ].filter(Boolean),
      }));
      children.push(...htmlToBullets(p.description));
      children.push(new Paragraph({ spacing: { after: 80 } }));
    });
  }

  // ── Certifications ────────────────────────────────────────────────────────
  if (certifications?.length) {
    children.push(sectionHeading("CERTIFICATIONS"));
    certifications.forEach((c) => {
      children.push(new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: c.name || "", bold: true, size: 20, color: "111827" }),
          c.issuer ? new TextRun({ text: `  ·  ${c.issuer}`, size: 18, color: "374151" }) : null,
          c.date ? new TextRun({ text: `  ·  ${c.date}`, size: 18, color: "6b7280" }) : null,
        ].filter(Boolean),
      }));
    });
    children.push(new Paragraph({ spacing: { after: 80 } }));
  }

  // ── Languages ─────────────────────────────────────────────────────────────
  if (languages?.length) {
    children.push(sectionHeading("LANGUAGES"));
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: languages.map((l) => `${l.name}${l.proficiency ? " (" + l.proficiency + ")" : ""}`).join("   •   "), size: 20, color: "374151" })],
    }));
  }

  // ── Volunteer ────────────────────────────────────────────────────────────
  if (volunteer?.length) {
    children.push(sectionHeading("VOLUNTEER"));
    volunteer.forEach((v) => {
      children.push(new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: v.role || "", bold: true, size: 22, color: "111827" }),
          v.organization ? new TextRun({ text: `  ·  ${v.organization}`, size: 20, color: "374151" }) : null,
          v.startDate ? new TextRun({ text: `  ·  ${v.startDate}`, size: 18, color: "6b7280", italics: true }) : null,
        ].filter(Boolean),
      }));
      children.push(...htmlToBullets(v.description));
      children.push(new Paragraph({ spacing: { after: 80 } }));
    });
  }

  // ── Awards ────────────────────────────────────────────────────────────────
  if (awards?.length) {
    children.push(sectionHeading("AWARDS & ACHIEVEMENTS"));
    awards.forEach((a) => {
      children.push(new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: a.title || "", bold: true, size: 22, color: "111827" }),
          a.issuer ? new TextRun({ text: `  ·  ${a.issuer}`, size: 18, color: "374151" }) : null,
          a.date ? new TextRun({ text: `  ·  ${a.date}`, size: 18, color: "6b7280" }) : null,
        ].filter(Boolean),
      }));
      children.push(...htmlToBullets(a.description));
      children.push(new Paragraph({ spacing: { after: 80 } }));
    });
  }

  // ── Build doc & download ──────────────────────────────────────────────────
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 20 },
          paragraph: { spacing: { line: 276 } },
        },
      },
      paragraphStyles: [
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          run: { bold: true, size: 22, color: "1e293b" },
        },
      ],
    },
    sections: [{ properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } }, children }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title || "resume"}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useExport() {
  const { resumeData } = useContext(ResumeInfoContext);
  const [exporting, setExporting] = useState(null); // "pdf" | "docx" | "txt" | null

  const title = resumeData?.title || "resume";

  const handleExport = useCallback(async (format) => {
    setExporting(format);
    try {
      if (format === "pdf") {
        await exportPDF(title);
      } else if (format === "docx") {
        await exportDOCX(resumeData, title);
      } else if (format === "txt") {
        exportTXT(resumeData, title);
      }
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExporting(null);
    }
  }, [resumeData, title]);

  return { handleExport, exporting };
}
