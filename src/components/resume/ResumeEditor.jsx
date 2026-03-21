import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";

const RESUME_WIDTH = 794;
const RESUME_HEIGHT = 1123;
import { useNavigate, useParams } from "react-router-dom";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";
import { useAuth } from "../../context/AuthContext";
import { TEMPLATES } from "./templates";
import ResumePreview from "./ResumePreview";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import SummaryStep from "./steps/SummaryStep";
import ExperienceStep from "./steps/ExperienceStep";
import EducationStep from "./steps/EducationStep";
import SkillsStep from "./steps/SkillsStep";
import ProjectStep from "./steps/ProjectStep";
import AdditionalStep from "./steps/AdditionalStep";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  LayoutDashboard,
  Download,
  User,
  Award,
  Plus,
  FolderGit2,
  FileText,
  Briefcase,
  GraduationCap,
  LogOut,
  ChevronDown,
  Pencil,
  Monitor,
  Sliders,
  RotateCcw,
  GripVertical,
  ChevronUp,
  Lock,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { debounce, isEqual } from "lodash";
import GeneratingOverlay from "./GeneratingOverlay";
import TemplatePicker from "./TemplatePicker";
import CustomizePanel from "./CustomizePanel";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import { useExport } from "../../hooks/useExport";
import { ScrollContext } from "../../context/ScrollContext";

// ─── Step definitions (id matches index for sectionTitles map) ───────────────
const STEP_DEFS = [
  {
    id: 0,
    key: "personal",
    defaultTitle: "Personal Info",
    icon: User,
    fixed: "top",
  },
  {
    id: 1,
    key: "summary",
    defaultTitle: "Professional Summary",
    icon: FileText,
    fixed: false,
  },
  {
    id: 2,
    key: "experience",
    defaultTitle: "Experience",
    icon: Briefcase,
    fixed: false,
  },
  {
    id: 3,
    key: "education",
    defaultTitle: "Education",
    icon: GraduationCap,
    fixed: false,
  },
  { id: 4, key: "skills", defaultTitle: "Skills", icon: Award, fixed: false },
  {
    id: 5,
    key: "project",
    defaultTitle: "Project",
    icon: FolderGit2,
    fixed: false,
  },
  {
    id: 6,
    key: "additional",
    defaultTitle: "Additional Sections",
    icon: Plus,
    fixed: "bottom",
  },
];

const DEFAULT_MIDDLE_ORDER = [1, 2, 3, 4, 5]; // ids of draggable steps

// ─── Section title inline editor ─────────────────────────────────────────────
function SectionTitleEditor({
  stepId,
  title,
  defaultTitle,
  onCommit,
  onReset,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const inputRef = useRef(null);
  const isModified = title !== defaultTitle;

  useEffect(() => {
    if (editing) {
      setDraft(title);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [editing]);

  const commit = () => {
    const t = draft.trim();
    if (t) onCommit(t);
    setEditing(false);
  };

  return (
    <span className="flex items-center gap-1 group/title flex-1 min-w-0">
      {editing ? (
        <span className="relative inline-flex items-center">
          <span
            aria-hidden
            className="invisible absolute whitespace-pre text-sm font-semibold pointer-events-none"
          >
            {draft.length >= 7 ? draft : "XXXXXXX"}
          </span>
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setEditing(false);
            }}
            style={{ width: `max(${Math.max(7, draft.length)}ch, 7ch)` }}
            className="border-b-2 outline-none focus:border-[#f97316] selection:bg-orange-100 text-sm font-semibold bg-transparent"
          />
        </span>
      ) : (
        <>
          <span className="truncate">{title}</span>
          {!isModified && (
            <button
              onClick={() => setEditing(true)}
              title="Edit section title"
              className="opacity-0 group-hover/title:opacity-100 flex-shrink-0 p-0.5 rounded text-stone-400 hover:text-orange-500 hover:bg-orange-50 transition-all duration-150"
            >
              <Pencil size={12} />
            </button>
          )}
          {isModified && (
            <button
              onClick={onReset}
              title="Reset to default title"
              className="opacity-0 group-hover/title:opacity-100 flex-shrink-0 p-0.5 rounded text-stone-400 hover:text-orange-500 hover:bg-orange-50 transition-all duration-150"
            >
              <RotateCcw size={12} />
            </button>
          )}
        </>
      )}
    </span>
  );
}

// ─── Step content renderer ────────────────────────────────────────────────────
function StepContent({ stepId }) {
  switch (stepId) {
    case 0:
      return <PersonalInfoStep />;
    case 1:
      return <SummaryStep />;
    case 2:
      return <ExperienceStep />;
    case 3:
      return <EducationStep />;
    case 4:
      return <SkillsStep />;
    case 5:
      return <ProjectStep />;
    case 6:
      return <AdditionalStep />;
    default:
      return null;
  }
}

// ─── Collapsible section card ─────────────────────────────────────────────────
function SectionCard({
  stepDef,
  title,
  defaultTitle,
  dragging,
  isOver,
  dragHandleProps,
  onTitleCommit,
  onTitleReset,
  collapsed,
  onToggleCollapse,
}) {
  const Icon = stepDef.icon;
  const fixed = stepDef.fixed;

  return (
    <div
      className={`
        bg-white border rounded-xl shadow-sm overflow-hidden transition-all duration-150
        ${isOver ? "ring-2 ring-orange-400 ring-offset-2 scale-[1.005]" : ""}
        ${dragging ? "opacity-40 shadow-lg" : "border-orange-200"}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-50 to-white border-b border-orange-100">
        {/* Drag handle or lock icon */}
        {fixed ? (
          <div
            className="flex-shrink-0 p-1 text-stone-300"
            title={fixed === "top" ? "Always first" : "Always last"}
          >
            <Lock size={13} />
          </div>
        ) : (
          <div
            {...dragHandleProps}
            className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-orange-100 text-stone-300 hover:text-orange-500 transition-colors"
            title="Drag to reorder section"
          >
            <GripVertical size={15} />
          </div>
        )}

        <Icon className="w-4 h-4 text-orange-500 flex-shrink-0" />

        <SectionTitleEditor
          stepId={stepDef.id}
          title={title}
          defaultTitle={defaultTitle}
          onCommit={onTitleCommit}
          onReset={onTitleReset}
        />

        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="flex-shrink-0 ml-auto p-1 rounded hover:bg-orange-100 text-stone-400 hover:text-orange-500 transition-colors"
          title={collapsed ? "Expand" : "Collapse"}
        >
          <ChevronUp
            size={15}
            className={`transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="p-4">
          <StepContent stepId={stepDef.id} />
        </div>
      )}
    </div>
  );
}

// ─── Main ResumeEditor ────────────────────────────────────────────────────────
export default function ResumeEditor({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { resumeData, setResumeData, saveResume, loadResumeById } =
    useContext(ResumeInfoContext);

  // ── view / UI state ──────────────────────────────────────────────────────
  const [activeView, setActiveView] = useState("edit");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const userMenuRef = useRef(null);
  const exportMenuRef = useRef(null);
  const titleInputRef = useRef(null);

  // ── export ───────────────────────────────────────────────────────────────
  const { handleExport, exporting } = useExport();

  // ── template / accent ────────────────────────────────────────────────────
  const [selectedId, setSelectedId] = useState("modern");
  const [accentColor, setAccentColor] = useState(null);

  // ── save status ──────────────────────────────────────────────────────────
  const [saveStatus, setSaveStatus] = useState("Saved");
  const isSaving = useRef(false);
  const isInitialMount = useRef(true);
  const lastSavedVersion = useRef(null);

  // ── step order & collapse state ──────────────────────────────────────────
  // middleOrder: array of step ids for the draggable middle sections
  const [middleOrder, setMiddleOrder] = useState(DEFAULT_MIDDLE_ORDER);
  const [collapsed, setCollapsed] = useState({}); // { [stepId]: bool }
  const [stepTitles, setStepTitles] = useState(() =>
    Object.fromEntries(STEP_DEFS.map((s) => [s.id, s.defaultTitle])),
  );

  // ── drag state (section-level) ───────────────────────────────────────────
  const sectionDragIndex = useRef(null);
  const [sectionOverIndex, setSectionOverIndex] = useState(null);

  // ── preview panel scaling ────────────────────────────────────────────────
  const previewPanelRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);

  // ── auto-scroll for drag in the left edit panel ──────────────────────────
  const {
    scrollRef: editScrollRef,
    startAutoScroll,
    updatePointer,
    stopAutoScroll,
  } = useAutoScroll({ edgeSize: 80, speed: 14 });

  // ── step-mode (wizard) for create ───────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(0);

  // Determine display mode: edit=all-at-once, create=wizard
  const isAllAtOnce = mode === "edit";

  // ── user display ─────────────────────────────────────────────────────────
  const displayName =
    user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // ── load resume ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (mode === "edit") loadResumeById(id);
  }, [mode, id]);

  // ── sync template/accent → resumeData ────────────────────────────────────
  useEffect(() => {
    setResumeData((prev) => ({ ...prev, templateId: selectedId }));
  }, [selectedId]);
  useEffect(() => {
    setResumeData((prev) => ({ ...prev, accentColor }));
  }, [accentColor]);

  // ── restore from loaded resume ───────────────────────────────────────────
  useEffect(() => {
    if (!resumeData?.id) return;
    if (resumeData.templateId) setSelectedId(resumeData.templateId);
    if (resumeData.accentColor !== undefined)
      setAccentColor(resumeData.accentColor || null);

    // Restore section titles
    if (resumeData.sectionTitles) {
      setStepTitles((prev) => {
        const next = { ...prev };
        STEP_DEFS.forEach((s) => {
          next[s.id] = resumeData.sectionTitles[s.id] || s.defaultTitle;
        });
        return next;
      });
    }

    // Restore middle order
    if (resumeData.stepOrder && Array.isArray(resumeData.stepOrder)) {
      setMiddleOrder(resumeData.stepOrder);
    }
  }, [resumeData?.id]);

  // ── close user menu on outside click ────────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setShowUserMenu(false);
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target))
        setShowExportMenu(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── focus title input ────────────────────────────────────────────────────
  useEffect(() => {
    if (editingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [editingTitle]);

  // ── preview panel scale ──────────────────────────────────────────────────
  useEffect(() => {
    const updateScale = () => {
      if (!previewPanelRef.current) return;
      const w = previewPanelRef.current.offsetWidth;
      const h = previewPanelRef.current.offsetHeight;
      if (activeView === "preview") {
        setPreviewScale(Math.max(Math.min(w / RESUME_WIDTH, h / RESUME_HEIGHT), 0.1));
      } else {
        setPreviewScale(Math.max(w / RESUME_WIDTH, 0.1));
      }
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (previewPanelRef.current) ro.observe(previewPanelRef.current);
    return () => ro.disconnect();
  }, [activeView]);

  // ── section title helpers ────────────────────────────────────────────────
  const commitSectionTitle = (stepId, newTitle) => {
    setStepTitles((prev) => ({ ...prev, [stepId]: newTitle }));
    setResumeData((prev) => ({
      ...prev,
      sectionTitles: { ...(prev.sectionTitles || {}), [stepId]: newTitle },
    }));
  };

  const resetSectionTitle = (stepId) => {
    const def = STEP_DEFS.find((s) => s.id === stepId)?.defaultTitle || "";
    setStepTitles((prev) => ({ ...prev, [stepId]: def }));
    setResumeData((prev) => {
      const updated = { ...(prev.sectionTitles || {}) };
      delete updated[stepId];
      return { ...prev, sectionTitles: updated };
    });
  };

  // ── middle-order drag handlers ────────────────────────────────────────────
  const getSectionDragProps = (index) => ({
    draggable: true,
    onDragStart: (e) => {
      sectionDragIndex.current = index;
      e.dataTransfer.effectAllowed = "move";
      e.currentTarget.closest("[data-section-card]").style.opacity = "0.4";
    },
    onDragEnd: (e) => {
      e.currentTarget.closest("[data-section-card]").style.opacity = "";
      sectionDragIndex.current = null;
      setSectionOverIndex(null);
      stopAutoScroll();
    },
  });

  const getSectionDropProps = (index) => ({
    onDragOver: (e) => {
      e.preventDefault();
      startAutoScroll(e);
      updatePointer(e);
      if (
        sectionDragIndex.current !== null &&
        sectionDragIndex.current !== index
      ) {
        setSectionOverIndex(index);
      }
    },
    onDragLeave: () => setSectionOverIndex(null),
    onDrop: (e) => {
      e.preventDefault();
      stopAutoScroll();
      const from = sectionDragIndex.current;
      const to = index;
      if (from === null || from === to) {
        setSectionOverIndex(null);
        return;
      }
      const next = [...middleOrder];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      setMiddleOrder(next);
      setResumeData((prev) => ({ ...prev, stepOrder: next }));
      sectionDragIndex.current = null;
      setSectionOverIndex(null);
    },
  });

  // ── save to DB ────────────────────────────────────────────────────────────
  const saveToDatabase = async (currentData) => {
    if (isSaving.current) return;
    // Never auto-save if there's no id -- avoids re-creating a deleted resume
    if (!currentData?.id && mode !== "create") return;
    if (!currentData || isEqual(currentData, lastSavedVersion.current)) {
      setSaveStatus("Saved");
      return;
    }
    setSaveStatus("Saving...");
    try {
      isSaving.current = true;
      let response;
      if (id == undefined) {
        response = await saveResume(
          "create",
          currentData.id || null,
          currentData,
        );
      } else {
        response = await saveResume("edit", id, currentData);
      }
      if (response != null) {
        currentData.id = response;
        setResumeData((prev) => ({ ...prev, id: response }));
      }
      lastSavedVersion.current = JSON.parse(JSON.stringify(currentData));
      setSaveStatus("Saved");
    } catch (err) {
      console.error("Autosave error:", err);
      setSaveStatus("Error");
    } finally {
      isSaving.current = false;
    }
  };

  const debouncedSave = useCallback(
    debounce((data) => saveToDatabase(data), 1500),
    [mode, id],
  );

  useEffect(() => {
    if (resumeData && Object.keys(resumeData).length > 0) {
      if (isInitialMount.current) {
        lastSavedVersion.current = JSON.parse(JSON.stringify(resumeData));
        isInitialMount.current = false;
        return;
      }
      if (!isEqual(resumeData, lastSavedVersion.current)) {
        setSaveStatus("Typing...");
        debouncedSave(resumeData);
      }
    }
  }, [resumeData, debouncedSave]);

  useEffect(() => () => debouncedSave.cancel(), [debouncedSave]);

  useEffect(() => {
    const handler = (e) => {
      // Only save on unload if there is a valid id -- never re-create a deleted resume
      if (resumeData?.id || mode === "create") {
        saveResume(mode, mode === "edit" ? id : null, resumeData);
      }
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [resumeData]);

  // ── export (PDF / DOCX / TXT) handled by useExport hook ─────────────────

  // ── build ordered step list for all-at-once view ──────────────────────────
  const orderedSteps = [
    STEP_DEFS[0],
    ...middleOrder
      .map((id) => STEP_DEFS.find((s) => s.id === id))
      .filter(Boolean),
    STEP_DEFS[6],
  ];

  // ── wizard steps (create mode) ────────────────────────────────────────────
  const wizardSteps = STEP_DEFS;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div>
      <GeneratingOverlay />
      <TemplatePicker
        isOpen={false}
        onClose={() => {}}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <ScrollContext.Provider
        value={{ startAutoScroll, updatePointer, stopAutoScroll }}
      >
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
          {/* ── HEADER ────────────────────────────────────────────────────── */}
          <header className="fixed min-w-screen top-0 z-50 h-14 bg-white border-b border-[#fde3c8] flex items-center px-4 gap-4">
            {/* LEFT: resume title */}
            <div className="flex items-center gap-2 min-w-0 w-[260px] shrink-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                <FileText size={14} className="text-white" />
              </div>
              {editingTitle ? (
                <input
                  ref={titleInputRef}
                  value={resumeData.title || ""}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  onBlur={() => setEditingTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape")
                      setEditingTitle(false);
                  }}
                  placeholder="Untitled Resume"
                  className="flex-1 min-w-0 text-sm font-semibold outline-none border-b-2 border-[#fdba74] focus:border-[#f97316] selection:bg-orange-100 transition-all"
                />
              ) : (
                <button
                  onClick={() => setEditingTitle(true)}
                  className="flex items-center gap-1.5 group flex-1 min-w-0"
                >
                  <span className="text-sm font-semibold pb-0.5 text-stone-800 truncate">
                    {resumeData.title || "Untitled Resume"}
                  </span>
                  <Pencil
                    size={12}
                    className="text-stone-400 group-hover:text-orange-500 flex-shrink-0 transition-colors"
                  />
                </button>
              )}
              <span className="text-[10px] font-medium text-stone-400 flex-shrink-0 hidden sm:block">
                {saveStatus === "Saving..."
                  ? "Saving…"
                  : saveStatus === "Saved"
                    ? "✓ Saved"
                    : saveStatus}
              </span>
            </div>

            {/* CENTER: view toggle */}
            <div className="flex-1 flex justify-center">
              <div className="flex bg-[#fff7ed] border border-[#fde3c8] rounded-lg p-1 gap-1">
                {[
                  { key: "edit", icon: Pencil, label: "Edit" },
                  { key: "customize", icon: Sliders, label: "Customize" },
                  { key: "preview", icon: Monitor, label: "Preview" },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveView(key)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                      activeView === key
                        ? "bg-white text-[#9a3412] shadow-[0_1px_3px_rgba(234,88,12,0.12)]"
                        : "text-[#78716c] hover:text-[#44403c]"
                    }`}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: export dropdown + user */}
            <div className="flex items-center gap-2 w-[260px] flex-shrink-0 justify-end">
              {/* Export dropdown */}
              <div className="relative" ref={exportMenuRef}>
                <Button
                  variant="default"
                  onClick={() => setShowExportMenu((v) => !v)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white pr-3"
                >
                  {exporting ? (
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                  ) : (
                    <Download size={14} />
                  )}
                  Download
                  <ChevronDown size={12} className={`transition-transform duration-150 ${showExportMenu ? "rotate-180" : ""}`} />
                </Button>

                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#fde3c8] overflow-hidden z-50">
                   
                    {[
                      { format: "pdf",  label: "Download as PDF", icon: "📄", color: "#dc2626" },
                      { format: "docx", label: "Download as DOCX",  icon: "📝", color: "#2563eb" },
                      { format: "txt",  label: "Download as TXT",      icon: "📋", color: "#059669" },
                    ].map(({ format, label, desc, icon, color }) => (
                      <button
                        key={format}
                        disabled={!!exporting}
                        onClick={() => { setShowExportMenu(false); handleExport(format); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#fff7ed] transition-colors disabled:opacity-50"
                      >
                        <span className="text-xl leading-none">{icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-stone-800">{label}</p>
                          <p className="text-xs text-stone-400">{desc}</p>
                        </div>
                        {exporting === format && (
                          <svg className="animate-spin flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu((v) => !v)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-lg hover:bg-[#fff7ed] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-stone-700 hidden sm:block max-w-[100px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`text-stone-400 transition-transform duration-150 ${showUserMenu ? "rotate-180" : ""}`}
                  />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-xl border border-[#fde3c8] overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-[#fde3c8] bg-[#fff7ed]">
                      <p className="text-sm font-bold text-stone-800 truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-stone-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/dashboard");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-[#fff7ed] hover:text-[#9a3412] transition-colors"
                      >
                        <LayoutDashboard size={15} className="text-stone-400" />{" "}
                        Dashboard
                      </button>
                      <div className="h-px bg-[#fde3c8] mx-2 my-1" />
                      <button
                        onClick={async () => {
                          await supabase.auth.signOut();
                          navigate("/auth");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#dc2626] hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
          {/* ── END HEADER ─────────────────────────────────────────────── */}

          {/* ── BODY ──────────────────────────────────────────────────────── */}
          <div className="flex-1 min-h-0 mt-14 w-full absolute grid grid-cols-1 lg:grid-cols-4 h-[calc(100vh-56px)]">
            {/* LEFT PANEL */}
            <div
              className={`lg:col-span-2 overflow-y-auto flex flex-col min-h-0 h-full ${activeView === "preview" ? "hidden" : ""}`}
            >
              {/* ── CUSTOMIZE ── */}
              {activeView === "customize" && (
                <div className="flex-1 flex flex-col min-h-0 mx-1 mt-1 border border-orange-200 shadow-lg rounded-xl overflow-hidden">
                  <CustomizePanel
                    selectedId={selectedId}
                    onSelectTemplate={setSelectedId}
                    accentColor={accentColor}
                    onAccentChange={setAccentColor}
                  />
                </div>
              )}

              {/* ── EDIT ── */}
              {activeView === "edit" && (
                <div
                  ref={editScrollRef}
                  className="flex-1 overflow-y-auto px-1 pt-1  space-y-3"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {isAllAtOnce && (
                    <>
                      {/* Info banner */}
                      

                      {orderedSteps.map((stepDef, visualIndex) => {
                        // For draggable middle steps, find their index within middleOrder
                        const middleIdx = middleOrder.indexOf(stepDef.id);
                        const isDraggable = !stepDef.fixed;

                        return (
                          <div
                            key={stepDef.id}
                            data-section-card
                            {...(isDraggable
                              ? getSectionDropProps(middleIdx)
                              : {})}
                            className="transition-all duration-150"
                          >
                            <SectionCard
                              stepDef={stepDef}
                              title={stepTitles[stepDef.id]}
                              defaultTitle={stepDef.defaultTitle}
                              isOver={
                                isDraggable && sectionOverIndex === middleIdx
                              }
                              dragHandleProps={
                                isDraggable
                                  ? getSectionDragProps(middleIdx)
                                  : {}
                              }
                              onTitleCommit={(t) =>
                                commitSectionTitle(stepDef.id, t)
                              }
                              onTitleReset={() => resetSectionTitle(stepDef.id)}
                              collapsed={!!collapsed[stepDef.id]}
                              onToggleCollapse={() =>
                                setCollapsed((prev) => ({
                                  ...prev,
                                  [stepDef.id]: !prev[stepDef.id],
                                }))
                              }
                            />
                          </div>
                        );
                      })}
                    </>
                  )}

                  {!isAllAtOnce && (
                    <>
                      <Card className="relative border-orange-200 mb-1 rounded-md h-[calc(100vh-125px)] flex flex-col">
                        <CardHeader className="flex-shrink-0 pb-3">
                          <CardTitle className="flex items-center gap-2 text-sm">
                            {(() => {
                              const Icon = wizardSteps[currentStep].icon;
                              return (
                                <Icon className="w-4 h-4 text-orange-600 flex-shrink-0" />
                              );
                            })()}
                            <SectionTitleEditor
                              stepId={wizardSteps[currentStep].id}
                              title={stepTitles[wizardSteps[currentStep].id]}
                              defaultTitle={
                                wizardSteps[currentStep].defaultTitle
                              }
                              onCommit={(t) =>
                                commitSectionTitle(
                                  wizardSteps[currentStep].id,
                                  t,
                                )
                              }
                              onReset={() =>
                                resetSectionTitle(wizardSteps[currentStep].id)
                              }
                            />
                          </CardTitle>
                          {/* Step progress dots */}
                          <div className="flex gap-1.5 mt-2">
                            {wizardSteps.map((s, i) => (
                              <button
                                key={s.id}
                                onClick={() => setCurrentStep(i)}
                                className={`h-1.5 rounded-full transition-all duration-200 ${
                                  i === currentStep
                                    ? "w-5 bg-orange-500"
                                    : i < currentStep
                                      ? "w-3 bg-orange-300"
                                      : "w-3 bg-stone-200"
                                }`}
                                title={s.defaultTitle}
                              />
                            ))}
                          </div>
                        </CardHeader>
                        <CardContent
                          className="flex-1 overflow-y-auto hide-scrollbar"
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                        >
                          <StepContent stepId={wizardSteps[currentStep].id} />
                        </CardContent>
                      </Card>

                      {/* Wizard nav */}
                      <div className="sticky bottom-0 fixed bg-white border-t border-gray-200 shadow-lg p-3 flex justify-between rounded-t-md">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setCurrentStep((p) => Math.max(0, p - 1))
                          }
                          disabled={currentStep === 0}
                        >
                          Back
                        </Button>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-stone-400">
                            {currentStep + 1} / {wizardSteps.length}
                          </span>
                          {currentStep < wizardSteps.length - 1 ? (
                            <Button
                              onClick={() =>
                                setCurrentStep((p) =>
                                  Math.min(wizardSteps.length - 1, p + 1),
                                )
                              }
                              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                            >
                              Next
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleExport("pdf")}
                              disabled={!!exporting}
                              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                            >
                              <Download className="w-4 h-4 mr-1" /> {exporting === "pdf" ? "Exporting…" : "Download PDF"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT PANEL — Resume Preview */}
            {activeView === "preview" ? (
              <div
                ref={previewPanelRef}
                className="flex items-center justify-center h-full w-full bg-gray-100 overflow-hidden lg:col-span-4"
              >
                <div
                  id="resume-preview-id"
                  style={{
                    width: RESUME_WIDTH,
                    height: RESUME_HEIGHT,
                    transform: `scale(${previewScale})`,
                    transformOrigin: "center center",
                    flexShrink: 0,
                    boxShadow: "0 4px 32px rgba(0,0,0,0.13)",
                  }}
                >
                  <ResumePreview selectedId={selectedId} accentColor={accentColor} />
                </div>
              </div>
            ) : (
              <div
                ref={previewPanelRef}
                className="flex flex-col items-center h-full w-full bg-gray-100 overflow-x-hidden overflow-y-auto lg:col-span-2"
                style={{ scrollbarWidth: "thin" }}
              >
                <div
                  id="resume-preview-id"
                  style={{
                    width: RESUME_WIDTH,
                    height: RESUME_HEIGHT,
                    transform: `scale(${previewScale})`,
                    transformOrigin: "top center",
                    flexShrink: 0,
                    marginBottom: `${(RESUME_HEIGHT * previewScale) - RESUME_HEIGHT}px`,
                    boxShadow: "0 4px 32px rgba(0,0,0,0.13)",
                  }}
                >
                  <ResumePreview selectedId={selectedId} accentColor={accentColor} />
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollContext.Provider>
    </div>
  );
}
