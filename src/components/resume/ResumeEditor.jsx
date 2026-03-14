import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";
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
import { LayoutDashboard, Briefcase, GraduationCap, Home, Download, Eye, User, Award, Plus, FolderGit2, FileText } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { debounce, isEqual } from "lodash";
import GeneratingOverlay from "./GeneratingOverlay";
import TemplatePicker from "./TemplatePicker";



export default function ResumeEditor({ mode}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [value, setValue] = useState();
  const [selectedId, setSelectedId] = useState("modern");
  const navigate = useNavigate();
  const { resumeData, setResumeData, saveResume, loadResumeById } =
    useContext(ResumeInfoContext);
  const { id } = useParams();
  const user = supabase.auth.getUser();
  const saveTimeout = React.useRef(null);
  const lastSaved = React.useRef(null);
  const isDirtyRef = useRef(false);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const isInitialMount = useRef(true);
  const lastSavedVersion = useRef(null);
  


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

    
    
    // CREATE MODE → reset
    if (mode === "create") {
      setResumeData({
        id: null,
        title: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
        role: "",
        linkedin: "",
        github: "",
        portfolio: "",
        website: "",
        experience: [],
        education: [],
        skills: [],
        project: [],
      });
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
    if (!element) {
      console.error("Resume preview element not found");
      return;
    }

    // Collect all stylesheets so Tailwind renders identically in the print window
    const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map((l) => `<link rel="stylesheet" href="${l.href}" />`)
      .join("\n");

    const inlineStyles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules).map((r) => r.cssText).join("\n");
        } catch {
          return ""; // skip cross-origin sheets (already linked above)
        }
      })
      .join("\n");

    const name = (resumeData.firstName || resumeData.lastName)
      ? `${resumeData.firstName || ""}-${resumeData.lastName || ""}-resume`
          .replace(/^-|-$/g, "").replace(/--+/g, "-")
      : "my-resume";

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=794" />
  <title>${name}</title>
  ${styleLinks}
  <style>
    ${inlineStyles}

    /* Force colors to print exactly as shown */
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    html {
      margin: 0;
      padding: 0;
      background: white;
    }

    body {
      margin: 0;
      padding: 0;
      background: white;
      /* The resume is 794px wide — set the body to match so the browser
         treats it as one A4-width "page" with no extra whitespace */
      width: 794px;
    }

    /* Remove any wrapper padding/bg the preview adds */
    #resume-preview {
      margin: 0 !important;
      box-shadow: none !important;
    }

    @media print {
      html, body {
        margin: 0;
        padding: 0;
        width: 794px;
      }

      /* A4 at 96dpi = 794 x 1123px. margin:0 removes browser header/footer. */
      @page {
        size: A4 portrait;
        margin: 0;
      }

      #resume-preview {
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  ${element.outerHTML}
  <script>
    // Trigger print once all assets (fonts, images) are loaded
    window.onload = function () {
      setTimeout(function () {
        window.print();
        window.close();
      }, 800);
    };
  </script>
</body>
</html>`);

    printWindow.document.close();
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
        {/* Navigation Header */}
        <div className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16">
          <div className="container mx-auto px-4 h-16 flex items-center">
            <div className="flex justify-between w-full items-center">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    AI Resume Builder
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTemplatePicker(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 14px",
                    borderRadius: "8px",
                    border: "1.5px solid #fed7aa",
                    backgroundColor: "white",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#ea580c",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#fff7ed"; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "white"; }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                  </svg>
                  Templates
                </button>
                <button onClick={downloadPDF} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #f97316, #ef4444)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "white",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  Download
                </button>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigateAway("/dashboard")}
                  className="gap-2 hover:text-orange-600"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
                <div className="h-7 w-0.25 bg-border"></div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigateAway("/")}
                  className="gap-2 hover:text-orange-600"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </div>
              {/* <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Auto-saved</span>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </div> */}
            </div>
          </div>
        </div>

        <div className="w-full flex-1 min-h-0 ">
          {/* <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
              Create Your Resume
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Build a professional resume with AI-powered optimization
            </p> */}

          {/* Progress Bar */}
          {/* <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div> */}

          {/* Step Navigation */}

          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
          })}

          <div className="grid grid-cols-1 lg:grid-cols-4 h-[calc(100vh-64px)]">
            {/* Form Section */}
            <div
              className="lg:col-span-2 rounded-md hide-scrollbar flex flex-col min-h-0"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <Card className="border-orange-200 shadow-lg rounded-md flex flex-col min-h-0  mx-1 mt-1 flex-1">
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

              {/* Navigation Buttons - Sticky */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg p-4 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>

                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    className="lg:hidden"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showPreview ? "Hide" : "Show"} Preview
                  </Button>

                  {currentStep < steps.length - 1 ? (
                    <Button
                      onClick={() =>
                        setCurrentStep(
                          Math.min(steps.length - 1, currentStep + 1),
                        )
                      }
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
            </div>

            {/* Preview Section */}
            <div
              className="lg:col-span-2 hide-scrollbar flex flex-col min-h-0"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div
                className={`flex-1 overflow-y-auto ${
                  showPreview ? "block" : "hidden lg:block"
                } hide-scrollbar min-h-0`}
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div className="bg-white shadow-lg">
                  <div id="resume-preview-id">
                    <ResumePreview selectedId={selectedId} />
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
