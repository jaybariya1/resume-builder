import React, { useContext } from "react";
import { TEMPLATES } from './templates';
import { ResumeInfoContext } from "../../context/ResumeInfoContext";

/**
 * ResumePreview
 *
 * Two modes:
 *  1. Editor mode (no `data` prop)  — reads from ResumeInfoContext, used inside the editor.
 *  2. Thumbnail mode (`data` prop)  — renders the supplied data directly, used in Dashboard cards.
 *
 * When `scale` is provided the whole template is CSS-scaled down so it fits
 * inside a smaller container while keeping the real A4 pixel dimensions intact
 * (794 × 1123 px).  The outer wrapper is sized to match the visible footprint.
 */
const ResumePreview = ({ selectedId, accentColor, data, scale }) => {
  const ctx = useContext(ResumeInfoContext);

  // Resolve data: prop wins over context
  const resolvedData = data ?? ctx?.resumeData ?? {};

  // Resolve template: prop wins; fall back to what's stored inside the data
  const resolvedTemplateId = selectedId || resolvedData.templateId || "modern";

  // Resolve accent: prop wins; fall back to what's stored inside the data
  const resolvedAccent = accentColor || resolvedData.accent;

  const SelectedTemplate = TEMPLATES[resolvedTemplateId]?.component;

  if (!SelectedTemplate) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-xs">
        Template not found
      </div>
    );
  }

  // A4 dimensions that every template is built against
  const A4_W = 794;
  const A4_H = 1123;

  if (scale != null) {
    // Scaled thumbnail: wrap in a fixed-size box and CSS-transform the template
    const visibleW = Math.round(A4_W * scale);
    const visibleH = Math.round(A4_H * scale);

    return (
      <div
        style={{
          width: visibleW,
          height: visibleH,
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: A4_W,
            height: A4_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        >
          <SelectedTemplate data={resolvedData} accentColor={resolvedAccent} />
        </div>
      </div>
    );
  }

  // Normal (full-size) mode — used inside the editor
  return <SelectedTemplate data={resolvedData} accentColor={resolvedAccent} />;
};

export default ResumePreview;
