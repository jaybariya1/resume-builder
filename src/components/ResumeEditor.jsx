import React, { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { supabase } from "../lib/supabaseClient";
import {
  ResumeInfoContext,
  ResumeInfoProvider,
} from "../context/ResumeInfoContext";
import { Progress } from "./ui/progress";
import ResumePreview from "./ResumePreview";
import PersonalInfoStep from "./PersonalInfoStep";
import ExperienceStep from "./ExperienceStep";
import EducationStep from "./EducationStep";
import SkillsStep from "./SkillsStep";
import { TEMPLATES } from "../components/templates";
import SummaryStep from "./SummaryStep";
import AdditionalStep from "./AdditionalStep";
import ProjectStep from "./ProjectStep";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import GeneratingOverlay from "./GeneratingOverlay";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useRef } from "react";
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import { useCallback } from "react";

// import { ResumeInfoProvider } from "../context/ResumeInfoContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Brain,
  Grid,
  Download,
  Eye,
  Plus,
  X,
  LayoutDashboard,
  Sparkles,
  FileText,
  ArrowLeft,
  Home,
  Github,
  Linkedin,
  Globe,
  Code,
  Palette,
  PenTool,
  BarChart3,
  Megaphone,
  FolderGit2,
} from "lucide-react";
import { set } from "lodash";

export default function ResumeEditor({ mode}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [value, setValue] = useState();
  const [selectedId, setSelectedId] = useState("modern");
  const SelectedTemplate = TEMPLATES[selectedId].component;
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
    { id: 5, title: "Additional Sections", icon: Plus },
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

  // 🔹 Auto-save to DB after typing stops
  // useEffect(() => {
  //   if (!resumeData || Object.keys(resumeData).length === 0) return;

  //   const timer = setTimeout(() => {

  //     if (mode === "edit") {
  //       saveResume(mode, resumeId);
  //     } else if (mode === "create") {
  //       saveResume(mode, null);
  //     }
  //   }, 1500);
  //   return () => clearTimeout(timer);
  // }, [resumeData]);

const isSaving = useRef(false);



  // ... inside ResumeEditor component ...

// 1. Reference to track the actual data persisted in DB

// 2. The Save Function
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
    console.log("id:", id);
    console.log("currentData.id:", currentData.id);
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
      console.log("Setting ID from response:", response, currentData);
    }
    // CRITICAL: Update the reference with the data we JUST saved
    lastSavedVersion.current = JSON.parse(JSON.stringify(currentData));
    setSaveStatus('Saved');
  } catch (error) {
    console.error("Autosave error:", error);
    setSaveStatus('Error');
  } finally {
    isSaving.current = false; // UNLOCK: Allow the next save to happens
  }
};

// 3. The Debouncer (Stable)
const debouncedSave = useCallback(
  debounce((data) => saveToDatabase(data), 1500),
  [mode, id] // Only recreate if mode or ID changes
);

// 4. The Watcher Effect
useEffect(() => {
  // Logic to handle the first time data is loaded from Supabase
  if (resumeData && Object.keys(resumeData).length > 0) {
    
    // If this is the very first time we get data (loading from DB),
    // set it as our "base" version and don't save.
    if (isInitialMount.current) {
      lastSavedVersion.current = JSON.parse(JSON.stringify(resumeData));
      isInitialMount.current = false;
      return;
    }

    // Check if the data is actually different from our last save
    if (!isEqual(resumeData, lastSavedVersion.current)) {
      setSaveStatus('Typing...');
      debouncedSave(resumeData);
    }
  }
}, [resumeData, debouncedSave]);

// 5. Clean up debounce on unmount
useEffect(() => {
  return () => debouncedSave.cancel();
}, [debouncedSave]);




  const handleNavigateAway = async (path) => {
    // await saveResume(mode, mode === "edit" ? resumeId : null);
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
    // 1. Target the div that contains the resume
    const element = document.getElementById("resume-preview-id");

    // 2. Options for high quality
    const options = {
      scale: 2, // Increases resolution
      useCORS: true, // Helps with images/icons
      logging: false,
    };

    html2canvas(element, options).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // 3. Create PDF (A4 size)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // 4. THE DIRECT DOWNLOAD
      pdf.save("my-resume.pdf");
    });
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
        return (
          <AdditionalStep
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            steps={steps}
            setSteps={setSteps}
          />
        );
      default:
        return <PersonalInfoStep />;
    }
  };

  return (
    <div>
      <GeneratingOverlay />
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
              <div className="">
                <button onClick={downloadPDF}>Download Resume</button>
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
                    <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
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
                {/* <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Live Preview</h3>
                  <aside>
        {Object.values(TEMPLATES).map(t => (
          // <button key={t.id} onClick={() => setSelectedId(t.id)}>
          //   Select {t.name}
          // </button>
                  <Button key={t.id} onClick={() => setSelectedId(t.id)} variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Template
                  </Button>
        ))}
      </aside>
                </div> */}
                <div className="bg-white shadow-lg">
                  <div id="resume-preview-id">
                    <ResumePreview />
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
