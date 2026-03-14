import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
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
import { LayoutDashboard, Download, Eye, User, Award, Plus, FolderGit2, FileText, Briefcase, GraduationCap, LogOut, ChevronDown, Pencil, Monitor, Sliders } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { debounce, isEqual } from "lodash";
import GeneratingOverlay from "./GeneratingOverlay";
import TemplatePicker from "./TemplatePicker";
import CustomizePanel from "./CustomizePanel";



export default function ResumeEditor({ mode}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [value, setValue] = useState();
  const [selectedId, setSelectedId] = useState("modern");
  const [accentColor, setAccentColor] = useState(null); // null = use template default
  const [activeView, setActiveView] = useState("edit"); // "edit" | "preview" | "customize"
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const userMenuRef = useRef(null);
  const titleInputRef = useRef(null);
  const navigate = useNavigate();
  const { resumeData, setResumeData, saveResume, loadResumeById } =
    useContext(ResumeInfoContext);
  const { user } = useAuth();
  const { id } = useParams();
  const saveTimeout = React.useRef(null);
  const lastSaved = React.useRef(null);
  const isDirtyRef = useRef(false);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const isInitialMount = useRef(true);
  const lastSavedVersion = useRef(null);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus title input when editing starts
  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTitle]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  


  const [steps, setSteps] = useState([
    { id: 0, title: "Personal Info", icon: User },
    { id: 1, title: "Professional Summary", icon: FileText },
    { id: 2, title: "Experience", icon: Briefcase },
    { id: 3, title: "Education", icon: GraduationCap },
    { id: 4, title: "Skills", icon: Award },
    { id: 5, title: "Project", icon: FolderGit2 },
    { id: 6, title: "Additional Sections", icon: Plus },
  ]);

  useEffect(() => {
    if (mode === "edit") {
      console.log("Loading resume with ID:", id);
      loadResumeById(id);
    }

    
    
  }, [mode, id]);

const isSaving = useRef(false);

const saveToDatabase = async (currentData) => {
  // If data is null or exactly the same as what we last saved, STOP.
  if (isSaving.current) {
    console.log("Save in progress, skipping this attempt...");
    return;
  }

  if (!currentData || isEqual(currentData, lastSavedVersion.current)) {
    setSaveStatus('Saved');
    return;
  }

  setSaveStatus('Saving...');
  try {
    isSaving.current = true;
    let response;
    
    if (id == undefined) {
      response = await saveResume("create", currentData.id ? currentData.id : null, currentData);
    } else {
      // Use currentData.id or resumeId
      response = await saveResume("edit", id, currentData);
    }
    console.log("Auto-save response:", response);
    if (response != null) {
      currentData.id = response;
      setResumeData((prev) => ({ ...prev, id: response }));
    }
    // CRITICAL: Update the reference with the data we JUST saved
    lastSavedVersion.current = JSON.parse(JSON.stringify(currentData));
    setSaveStatus("Saved");
  } catch (error) {
    console.error("Autosave error:", error);
    setSaveStatus("Error");
  } finally {
    isSaving.current = false;
  }
};

const debouncedSave = useCallback(
  debounce((data) => saveToDatabase(data), 1500),
  [mode, id]
);

useEffect(() => {
  // Logic to handle the first time data is loaded from Supabase
  if (resumeData && Object.keys(resumeData).length > 0) {
    
    if (isInitialMount.current) {
      lastSavedVersion.current = JSON.parse(JSON.stringify(resumeData));
      isInitialMount.current = false;
      return;
    }

    if (!isEqual(resumeData, lastSavedVersion.current)) {
      setSaveStatus('Typing...');
      debouncedSave(resumeData);
    }
  }
}, [resumeData, debouncedSave]);

useEffect(() => {
  return () => debouncedSave.cancel();
}, [debouncedSave]);




  const handleNavigateAway = async (path) => {
    navigate(path);
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      saveResume(mode, mode === "edit" ? resumeId : null);
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [resumeData]);

  const downloadPDF = () => {
    const element = document.getElementById("resume-preview");
    if (!element) return;

    // Inject a one-time print stylesheet into the live document.
    // This hides everything except the resume and resets all layout
    // so Tailwind classes render exactly as they do on screen.
    const styleId = "resume-print-style";
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.textContent = `
      @media print {
        @page {
          size: 794px 1123px;
          margin: 0 !important;
        }

        /* Hide everything on the page */
        body > * {
          display: none !important;
        }

        /* Show only our print container */
        #resume-print-container {
          display: block !important;
          position: fixed !important;
          inset: 0 !important;
          z-index: 99999 !important;
          background: white !important;
        }

        /* The resume main — exact A4 size, no extra margin */
        #resume-print-container #resume-preview {
          width: 794px !important;
          min-height: 1123px !important;
          margin: 0 !important;
          box-shadow: none !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Tailwind mx-auto adds auto margins — kill them in print */
        #resume-print-container .mx-auto {
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
      }
    `;

    // Create or reuse a print container div at the body root
    let container = document.getElementById("resume-print-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "resume-print-container";
      container.style.display = "none";
      document.body.appendChild(container);
    }

    // Move (not clone) the live resume element into the container so all
    // computed styles, Tailwind classes and inline styles are fully intact.
    // We put it back after printing.
    const parent = element.parentNode;
    const nextSibling = element.nextSibling;
    container.appendChild(element);

    const cleanup = () => {
      // Restore element to original position
      if (nextSibling) {
        parent.insertBefore(element, nextSibling);
      } else {
        parent.appendChild(element);
      }
      style.textContent = "";
    };

    // Use afterprint event to restore — works in all modern browsers
    window.addEventListener("afterprint", cleanup, { once: true });

    window.print();
  };

  const renderStepContent = () => {
    switch (steps[currentStep].title) {
      case "Personal Info":
        return <PersonalInfoStep />;
      case "Professional Summary":
        return <SummaryStep />;
      case "Experience":
        return <ExperienceStep />;
      case "Education":
        return <EducationStep />;
      case "Skills":
        return <SkillsStep />;
      case "Project":
        return <ProjectStep />;
      case "Additional Sections":
        return <AdditionalStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  return (
    <div>
      <GeneratingOverlay />
      <TemplatePicker
        isOpen={showTemplatePicker}
        onClose={() => setShowTemplatePicker(false)}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">

        {/* ── NEW HEADER ─────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 h-14 bg-white border-b border-[#fde3c8] flex items-center px-4 gap-4">

          {/* ── LEFT: Resume title ── */}
          <div className="flex items-center gap-2 min-w-0 w-[260px] flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
              <FileText size={14} className="text-white" />
            </div>
            {editingTitle ? (
              <input
                ref={titleInputRef}
                value={resumeData.title || ""}
                onChange={e => setResumeData(prev => ({ ...prev, title: e.target.value }))}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") setEditingTitle(false); }}
                placeholder="Untitled Resume"
                className="flex-1 min-w-0 text-sm font-semibold text-foreground bg-[#fff7ed] border border-[#fdba74] rounded-[var(--radius)] px-2 py-1 outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all"
              />
            ) : (
              <button
                onClick={() => setEditingTitle(true)}
                className="flex items-center gap-1.5 group flex-1 min-w-0"
              >
                <span className="text-sm font-semibold text-stone-800 truncate">
                  {resumeData.title || "Untitled Resume"}
                </span>
                <Pencil size={12} className="text-stone-400 group-hover:text-orange-500 flex-shrink-0 transition-colors" />
              </button>
            )}
            {/* Save status */}
            <span className="text-[10px] font-medium text-stone-400 flex-shrink-0 hidden sm:block">
              {saveStatus === "Saving..." ? "Saving…" : saveStatus === "Saved" ? "✓ Saved" : saveStatus}
            </span>
          </div>

          {/* ── CENTER: Edit / Customize / Preview toggle tabs ── */}
          <div className="flex-1 flex justify-center">
            <div className="flex bg-[#fff7ed] border border-[#fde3c8] rounded-[var(--radius)] p-1 gap-1">
              <button
                onClick={() => setActiveView("edit")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  activeView === "edit"
                    ? "bg-white text-[#9a3412] shadow-[0_1px_3px_rgba(234,88,12,0.12)]"
                    : "text-[#78716c] hover:text-[#44403c]"
                }`}
              >
                <Pencil size={13} />
                Edit
              </button>
              <button
                onClick={() => setActiveView("customize")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  activeView === "customize"
                    ? "bg-white text-[#9a3412] shadow-[0_1px_3px_rgba(234,88,12,0.12)]"
                    : "text-[#78716c] hover:text-[#44403c]"
                }`}
              >
                <Sliders size={13} />
                Customize
              </button>
              <button
                onClick={() => setActiveView("preview")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  activeView === "preview"
                    ? "bg-white text-[#9a3412] shadow-[0_1px_3px_rgba(234,88,12,0.12)]"
                    : "text-[#78716c] hover:text-[#44403c]"
                }`}
              >
                <Monitor size={13} />
                Preview
              </button>
            </div>
          </div>

          {/* ── RIGHT: Download + User menu ── */}
          <div className="flex items-center gap-2 w-[260px] flex-shrink-0 justify-end">

            {/* Download */}
            <Button
              onClick={downloadPDF}
              className=""
              variant="default"
            >
              <Download size={14} />
              Download
            </Button>

            {/* User avatar button */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(v => !v)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-[var(--radius)] hover:bg-[#fff7ed] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                  {initials}
                </div>
                <span className="text-sm font-medium text-stone-700 hidden sm:block max-w-[100px] truncate">{displayName}</span>
                <ChevronDown size={13} className={`text-stone-400 transition-transform duration-150 ${showUserMenu ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-xl border border-[#fde3c8] overflow-hidden z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-[#fde3c8] bg-[#fff7ed]">
                    <p className="text-sm font-bold text-stone-800 truncate">{displayName}</p>
                    <p className="text-xs text-stone-400 truncate">{user?.email}</p>
                  </div>
                  {/* Menu items */}
                  <div className="py-1">
                    <button
                      onClick={() => { setShowUserMenu(false); navigate("/dashboard"); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-[#fff7ed] hover:text-[#9a3412] transition-colors"
                    >
                      <LayoutDashboard size={15} className="text-stone-400" />
                      Dashboard
                    </button>
                    <div className="h-px bg-[#fde3c8] mx-2 my-1" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#dc2626] hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        {/* ── END HEADER ─────────────────────────────────────────────── */}

        <div className="w-full flex-1 min-h-0">

          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
          })}

          <div className="grid grid-cols-1 lg:grid-cols-4 h-[calc(100vh-56px)]">
            {/* Left Panel — Edit form OR Customize panel, hidden in preview */}
            <div
              className={`lg:col-span-2 rounded-md hide-scrollbar flex flex-col min-h-0 ${activeView === "preview" ? "hidden lg:hidden" : ""}`}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {/* ── CUSTOMIZE MODE ── */}
              {activeView === "customize" && (
                <div className="flex-1 flex flex-col min-h-0 mx-1 mt-1 border border-orange-200 shadow-lg rounded-md overflow-hidden">
                  <CustomizePanel selectedId={selectedId} onSelectTemplate={setSelectedId} accentColor={accentColor} onAccentChange={setAccentColor} />
                </div>
              )}

              {/* ── EDIT MODE ── */}
              {activeView === "edit" && (
                <>
                  <Card className="border-orange-200 shadow-lg rounded-md flex flex-col min-h-0 mx-1 mt-1 flex-1">
                    <CardHeader className="flex-shrink-0">
                      <CardTitle className="flex items-center">
                        {(() => {
                          const Icon = steps[currentStep].icon;
                          return <Icon className="w-5 h-5 mr-2 text-orange-600" />;
                        })()}
                        {steps[currentStep].title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent
                      className="flex-1 overflow-y-auto hide-scrollbar min-h-0"
                      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                      {renderStepContent()}
                    </CardContent>
                  </Card>

                  {/* Navigation Buttons */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg p-4 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                    >
                      Back
                    </Button>
                    <div className="space-x-2">
                      {currentStep < steps.length - 1 ? (
                        <Button
                          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        >
                          Next
                        </Button>
                      ) : (
                        <Button onClick={downloadPDF} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                          <Download className="w-4 h-4 mr-2" />
                          Download Resume
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Preview Section — full width in preview mode */}
            <div
              className={`hide-scrollbar flex flex-col min-h-0 ${activeView === "preview" ? "lg:col-span-4" : "lg:col-span-2"}`}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div
                className="flex-1 overflow-y-auto hide-scrollbar min-h-0"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div className="bg-white shadow-lg">
                  <div id="resume-preview-id">
                    <ResumePreview selectedId={selectedId} accentColor={accentColor} />
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
