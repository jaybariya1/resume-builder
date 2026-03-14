import React, { useRef, useState, useContext } from "react";
import {
  FileText, Upload, Linkedin, ArrowRight, X, Sparkles,
  ArrowLeft, CheckCircle, AlertCircle, Loader2,
} from "lucide-react";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";
import { supabase } from "../../lib/supabaseClient";

// ─── Option definitions ───────────────────────────────────────────────────────
const OPTIONS = [
  {
    id: "scratch",
    icon: FileText,
    title: "Start from scratch",
    description: "Build your resume step-by-step with AI assistance.",
    badge: "Most popular",
    badgeColor: "text-orange-600 bg-orange-50 border-orange-200",
    cardStyle: "bg-gradient-to-br from-orange-50 to-white border-orange-200 hover:border-orange-400",
    iconStyle: "bg-gradient-to-br from-orange-500 to-red-500",
  },
  {
    id: "upload",
    icon: Upload,
    title: "Upload existing resume",
    description: "Import a PDF and let AI parse and fill your resume.",
    badge: "Quick start",
    badgeColor: "text-sky-600 bg-sky-50 border-sky-200",
    cardStyle: "bg-gradient-to-br from-sky-50 to-white border-sky-200 hover:border-sky-400",
    iconStyle: "bg-gradient-to-br from-sky-500 to-blue-600",
  },
  {
    id: "linkedin",
    icon: Linkedin,
    title: "Import from LinkedIn",
    description: "Paste your LinkedIn URL and auto-fill your profile.",
    badge: "Fastest",
    badgeColor: "text-blue-700 bg-blue-50 border-blue-200",
    cardStyle: "bg-gradient-to-br from-blue-50 to-white border-blue-200 hover:border-blue-400",
    iconStyle: "bg-[#0077b5]",
  },
];

// ─── Helper: extract text from PDF using pdf.js CDN ──────────────────────────
async function extractPdfText(file) {
  // Load pdf.js from CDN dynamically
  if (!window.pdfjsLib) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return fullText;
}

// ─── Helper: call Supabase AI edge function ───────────────────────────────────
async function callAIParser(type, payload) {
  const { data, error } = await supabase.functions.invoke("ai-resume", {
    body: { type, payload },
  });
  if (error) throw new Error(error.message || "AI parsing failed");
  if (!data?.success) throw new Error(data?.error || "AI returned an error");
  return data.data;
}

// ─── Skill level string → index number ───────────────────────────────────────
const LEVEL_MAP = { beginner: 0, intermediate: 1, advanced: 2, expert: 3 };
function levelToIndex(level) {
  if (typeof level === "number") return Math.min(3, Math.max(0, level));
  return LEVEL_MAP[(level || "").toLowerCase()] ?? 1;
}

// ─── Normalize AI response to exact shape the editor expects ─────────────────
function normalizeResumeData(raw) {
  const experience = (raw.experience || []).map((exp) => ({
    id: Date.now().toString() + Math.random(),
    title: exp.title || exp.jobTitle || "",
    company: exp.company || exp.organization || "",
    location: exp.location || "",
    startDate: exp.startDate || "",
    endDate: exp.endDate || "",
    current: exp.current ?? exp.currentlyWorking ?? false,
    description: exp.description || exp.responsibilities || "",
  }));

  const education = (raw.education || []).map((edu) => ({
    id: Date.now().toString() + Math.random(),
    degree: edu.degree || edu.qualification || "",
    school: edu.school || edu.institution || edu.university || "",
    location: edu.location || "",
    graduationDate: edu.graduationDate || edu.endDate || edu.startDate || "",
    gpa: edu.gpa || "",
    description: edu.description || "",
  }));

  const skills = (raw.skills || []).map((s) => ({
    id: Date.now().toString() + Math.random(),
    name: typeof s === "string" ? s : (s.name || ""),
    level: levelToIndex(typeof s === "string" ? 1 : s.level),
  })).filter((s) => s.name.trim() !== "");

  const project = (raw.project || raw.projects || []).map((p) => ({
    id: Date.now().toString() + Math.random(),
    title: p.title || p.name || "",
    url: p.url || p.link || p.github || "",
    organization: p.organization || p.techStack || "",
    location: p.location || "",
    startDate: p.startDate || "",
    endDate: p.endDate || "",
    current: p.current ?? false,
    description: p.description || "",
  }));

  return {
    firstName: raw.firstName || "",
    lastName: raw.lastName || "",
    email: raw.email || "",
    phone: raw.phone || "",
    city: raw.city || (raw.location || "").split(",")[0]?.trim() || "",
    country: raw.country || (raw.location || "").split(",")[1]?.trim() || "",
    role: raw.role || raw.jobTitle || raw.headline || "",
    summary: raw.summary || raw.about || "",
    linkedin: raw.linkedin || "",
    github: raw.github || "",
    portfolio: raw.portfolio || raw.website || "",
    experience,
    education,
    skills,
    project,
  };
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function ResumeStartModal({ onSelect, onClose }) {
  const { setResumeData } = useContext(ResumeInfoContext);
  const fileInputRef = useRef();

  // view: "options" | "upload" | "linkedin"
  const [view, setView] = useState("options");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [fileName, setFileName] = useState("");

  const reset = () => {
    setStatus("idle");
    setErrorMsg("");
    setParsedData(null);
    setFileName("");
    setLinkedinUrl("");
  };

  const goBack = () => { reset(); setView("options"); };

  // ── Scratch ──────────────────────────────────────────────────────────────
  const handleScratch = () => onSelect("scratch");

  // ── Upload PDF ───────────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setErrorMsg("Only PDF files are supported.");
      setStatus("error");
      return;
    }
    setFileName(file.name);
    setStatus("loading");
    setErrorMsg("");
    try {
      const text = await extractPdfText(file);
      const parsed = await callAIParser("parse_resume", { resumeText: text });
      setParsedData(parsed);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message || "Failed to parse resume. Please try again.");
      setStatus("error");
    }
    // Reset input so the same file can be re-selected if needed
    e.target.value = "";
  };

  const applyUploadedResume = () => {
    if (!parsedData) return;
    const normalized = normalizeResumeData(parsedData);
    localStorage.removeItem("resume_draft");
    setResumeData({
      id: null, title: "", website: "",
      hideSkillLevel: false, certifications: [],
      languages: [], volunteer: [], awards: [],
      ...normalized,
    });
    onSelect("prefilled");
  };

  // ── LinkedIn ─────────────────────────────────────────────────────────────
  const handleLinkedinSubmit = async () => {
    const url = linkedinUrl.trim();
    if (!url) { setErrorMsg("Please enter your LinkedIn URL."); setStatus("error"); return; }
    if (!url.includes("linkedin.com")) {
      setErrorMsg("Please enter a valid LinkedIn profile URL.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const parsed = await callAIParser("parse_linkedin", { linkedinUrl: url });
      setParsedData(parsed);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message || "Failed to import LinkedIn profile. Please try again.");
      setStatus("error");
    }
  };

  const applyLinkedinData = () => {
    if (!parsedData) return;
    const normalized = normalizeResumeData(parsedData);
    localStorage.removeItem("resume_draft");
    setResumeData({
      id: null, title: "", website: "",
      hideSkillLevel: false, certifications: [],
      languages: [], volunteer: [], awards: [],
      ...normalized,
    });
    onSelect("prefilled");
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[calc(100vw-32px)] max-w-[500px] bg-white rounded-xl shadow-2xl p-7 font-sans animate-in fade-in zoom-in-95 duration-200">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
        >
          <X size={16} />
        </button>

        {/* ── VIEW: OPTIONS ───────────────────────────────────────────── */}
        {view === "options" && (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-md bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-200 flex-shrink-0">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">Create a new resume</h2>
                <p className="text-sm text-stone-500">Choose how you'd like to get started</p>
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {OPTIONS.map(({ id, icon: Icon, title, description, badge, badgeColor, cardStyle, iconStyle }) => (
                <button
                  key={id}
                  onClick={() => {
                    if (id === "scratch") handleScratch();
                    else setView(id);
                  }}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 text-left cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 w-full ${cardStyle}`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 ${iconStyle}`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-stone-900">{title}</span>
                      <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>{badge}</span>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed">{description}</p>
                  </div>
                  <ArrowRight size={15} className="text-stone-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── VIEW: UPLOAD ────────────────────────────────────────────── */}
        {view === "upload" && (
          <>
            <BackHeader onBack={goBack} title="Upload Resume" subtitle="We'll parse your PDF and auto-fill the form" />

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            {status === "idle" && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full mt-2 border-2 border-dashed border-sky-300 bg-sky-50 hover:bg-sky-100 hover:border-sky-400 rounded-2xl p-8 flex flex-col items-center gap-3 transition-all cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-md">
                  <Upload size={24} className="text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-stone-800">Click to upload your PDF</p>
                  <p className="text-xs text-stone-400 mt-1">PDF files only · Max 10MB</p>
                </div>
              </button>
            )}

            {status === "loading" && (
              <LoadingState
                fileName={fileName}
                message="Reading your resume with AI…"
                color="text-sky-600"
              />
            )}

            {status === "error" && (
              <ErrorState
                message={errorMsg}
                onRetry={() => { reset(); fileInputRef.current?.click(); }}
                retryLabel="Try another file"
              />
            )}

            {status === "success" && parsedData && (
              <SuccessState
                title="Resume parsed successfully!"
                subtitle={`We extracted your info from "${fileName}"`}
                preview={parsedData}
                onConfirm={applyUploadedResume}
                confirmLabel="Fill my resume with this data"
                confirmStyle="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                onRetry={() => { reset(); fileInputRef.current?.click(); }}
                retryLabel="Upload a different file"
              />
            )}
          </>
        )}

        {/* ── VIEW: LINKEDIN ───────────────────────────────────────────── */}
        {view === "linkedin" && (
          <>
            <BackHeader onBack={goBack} title="Import from LinkedIn" subtitle="Paste your public LinkedIn profile URL" />

            {status === "idle" && (
              <div className="mt-2 space-y-4">
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded bg-[#0077b5] flex items-center justify-center">
                    <Linkedin size={12} className="text-white" />
                  </div>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => { setLinkedinUrl(e.target.value); setErrorMsg(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleLinkedinSubmit()}
                    placeholder="https://linkedin.com/in/your-name"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-blue-400 focus:outline-none text-sm text-stone-800 placeholder:text-stone-300 transition-colors"
                  />
                </div>
                {errorMsg && (
                  <p className="text-xs text-red-500 flex items-center gap-1.5">
                    <AlertCircle size={13} /> {errorMsg}
                  </p>
                )}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-xs text-blue-700 font-semibold mb-1">📌 How to find your LinkedIn URL</p>
                  <p className="text-xs text-blue-600 leading-relaxed">
                    Go to your LinkedIn profile → click "More" → "Copy profile URL". Make sure your profile is set to public.
                  </p>
                </div>
                <button
                  onClick={handleLinkedinSubmit}
                  className="w-full py-3 rounded-xl bg-[#0077b5] hover:bg-[#005885] text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Linkedin size={15} /> Import my LinkedIn profile
                </button>
              </div>
            )}

            {status === "loading" && (
              <LoadingState
                message="Fetching and parsing your LinkedIn profile…"
                color="text-blue-700"
              />
            )}

            {status === "error" && (
              <ErrorState
                message={errorMsg}
                onRetry={() => reset()}
                retryLabel="Try again"
              />
            )}

            {status === "success" && parsedData && (
              <SuccessState
                title="LinkedIn profile imported!"
                subtitle="We extracted your work history and details"
                preview={parsedData}
                onConfirm={applyLinkedinData}
                confirmLabel="Fill my resume with this data"
                confirmStyle="bg-[#0077b5] hover:bg-[#005885]"
                onRetry={() => reset()}
                retryLabel="Try a different URL"
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function BackHeader({ onBack, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={onBack}
        className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors flex-shrink-0"
      >
        <ArrowLeft size={15} />
      </button>
      <div>
        <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">{title}</h2>
        <p className="text-xs text-stone-500">{subtitle}</p>
      </div>
    </div>
  );
}

function LoadingState({ fileName, message, color }) {
  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <Loader2 size={36} className={`animate-spin ${color}`} />
      <div className="text-center">
        <p className="text-sm font-semibold text-stone-700">{message}</p>
        {fileName && <p className="text-xs text-stone-400 mt-1">{fileName}</p>}
      </div>
      <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full animate-pulse ${color.replace("text-", "bg-")}`} style={{ width: "60%" }} />
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry, retryLabel }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="w-14 h-14 rounded-2xl bg-red-50 border-2 border-red-100 flex items-center justify-center">
        <AlertCircle size={28} className="text-red-500" />
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-stone-800">Something went wrong</p>
        <p className="text-xs text-stone-500 mt-1 max-w-[280px] leading-relaxed">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold transition-colors"
      >
        {retryLabel}
      </button>
    </div>
  );
}

function SuccessState({ title, subtitle, preview, onConfirm, confirmLabel, confirmStyle, onRetry, retryLabel }) {
  const name = [preview.firstName, preview.lastName].filter(Boolean).join(" ");
  const expCount = (preview.experience || []).length;
  const eduCount = (preview.education || []).length;
  const skillCount = (preview.skills || []).length;

  return (
    <div className="flex flex-col gap-4 mt-2">
      {/* Success banner */}
      <div className="flex items-center gap-3 p-3.5 rounded-lg bg-green-50 border border-green-200">
        <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-green-800">{title}</p>
          <p className="text-xs text-green-600">{subtitle}</p>
        </div>
      </div>

      {/* Preview chips */}
      <div className="bg-stone-50 rounded-lg p-4 space-y-3">
        {name && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide w-20">Name</span>
            <span className="text-sm font-semibold text-stone-800">{name}</span>
          </div>
        )}
        {preview.email && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide w-20">Email</span>
            <span className="text-sm text-stone-700 truncate">{preview.email}</span>
          </div>
        )}
        {preview.role && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide w-20">Role</span>
            <span className="text-sm text-stone-700">{preview.role}</span>
          </div>
        )}
        <div className="flex gap-2 pt-1 flex-wrap">
          {expCount > 0 && <Chip label={`${expCount} experience${expCount !== 1 ? "s" : ""}`} color="bg-orange-100 text-orange-700" />}
          {eduCount > 0 && <Chip label={`${eduCount} education${eduCount !== 1 ? "s" : ""}`} color="bg-blue-100 text-blue-700" />}
          {skillCount > 0 && <Chip label={`${skillCount} skill${skillCount !== 1 ? "s" : ""}`} color="bg-green-100 text-green-700" />}
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={onConfirm}
        className={`w-full py-3 rounded-xl text-white text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-md ${confirmStyle}`}
      >
        {confirmLabel} →
      </button>
      <button
        onClick={onRetry}
        className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-medium transition-colors"
      >
        {retryLabel}
      </button>
    </div>
  );
}

function Chip({ label, color }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color}`}>{label}</span>
  );
}
