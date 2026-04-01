import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ResumePreview from "../components/resume/ResumePreview.jsx";
import {
  Plus, FileText, Edit3, Trash2, Copy, Search,
  Sparkles, Briefcase, TrendingUp, BarChart2,
  Download, ChevronDown,
} from "lucide-react";
import { template } from "lodash";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

function completeness(content = {}) {
  const checks = [
    content.firstName || content.lastName,
    content.email,
    content.summary,
    (content.experience || []).some(e => e.title),
    (content.education || []).some(e => e.degree || e.school),
    (content.skills || []).some(e => e.name),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

// ─── Mini Resume Preview Thumbnail ───────────────────────────────────────────

// function ResumePreviewThumb({ content = {} }) {
//   const name = [content.firstName, content.lastName].filter(Boolean).join(" ") || "Your Name";
//   const role = content.role || "";
//   const hasExp = (content.experience || []).some(e => e.title);
//   const hasEdu = (content.education || []).some(e => e.degree || e.school);
//   const hasSummary = !!content.summary;

//   return (
//     <div
//       className="w-full h-full bg-white overflow-hidden select-none"
//       style={{ fontFamily: "Georgia, serif", fontSize: "3.5px", lineHeight: 1.4, color: "#222", padding: "10px 10px" }}
//     >
//       {/* Header */}
//       <div style={{ textAlign: "center", marginBottom: "4px", paddingBottom: "3px", borderBottom: "0.5px solid #ccc" }}>
//         <div style={{ fontSize: "6px", fontWeight: 700, letterSpacing: "0.3px" }}>{name}</div>
//         {role && <div style={{ fontSize: "3.5px", color: "#555", marginTop: "1px" }}>{role}</div>}
//         <div style={{ fontSize: "2.8px", color: "#888", marginTop: "0.5px" }}>
//           {[content.email, content.phone, content.location].filter(Boolean).join("  ·  ")}
//         </div>
//       </div>

//       {hasSummary && (
//         <div style={{ marginBottom: "3px" }}>
//           <div style={{ fontSize: "3px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "0.3px solid #bbb", marginBottom: "1.5px", paddingBottom: "0.5px" }}>Profile</div>
//           <div style={{ fontSize: "2.8px", color: "#444", lineHeight: 1.5 }}>
//             {(content.summary || "").replace(/<[^>]*>/g, "").slice(0, 140)}
//           </div>
//         </div>
//       )}

//       {hasExp && (
//         <div style={{ marginBottom: "3px" }}>
//           <div style={{ fontSize: "3px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "0.3px solid #bbb", marginBottom: "1.5px", paddingBottom: "0.5px" }}>Experience</div>
//           {(content.experience || []).slice(0, 2).map((exp, i) => (
//             <div key={i} style={{ marginBottom: "1.5px" }}>
//               <div style={{ display: "flex", justifyContent: "space-between" }}>
//                 <span style={{ fontSize: "3.2px", fontWeight: 600 }}>{exp.title}</span>
//                 <span style={{ fontSize: "2.5px", color: "#888" }}>{exp.startDate} – {exp.endDate || "Present"}</span>
//               </div>
//               <div style={{ fontSize: "2.8px", color: "#555", marginTop: "0.3px" }}>{exp.company}</div>
//             </div>
//           ))}
//         </div>
//       )}

//       {hasEdu && (
//         <div style={{ marginBottom: "3px" }}>
//           <div style={{ fontSize: "3px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "0.3px solid #bbb", marginBottom: "1.5px", paddingBottom: "0.5px" }}>Education</div>
//           {(content.education || []).slice(0, 1).map((edu, i) => (
//             <div key={i}>
//               <span style={{ fontSize: "3.2px", fontWeight: 600 }}>{edu.degree}</span>
//               <div style={{ fontSize: "2.8px", color: "#555" }}>{edu.school}</div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Skeleton placeholder lines when no content */}
//       {!hasSummary && !hasExp && (
//         <div style={{ display: "flex", flexDirection: "column", gap: "2.5px" }}>
//           {[80, 65, 90, 55, 72, 88, 60].map((w, i) => (
//             <div key={i} style={{ height: "2px", width: `${w}%`, background: "#e5e7eb", borderRadius: "1px" }} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// ─── Resume Card ──────────────────────────────────────────────────────────────

function ResumeCard({ resume, onEdit, onDelete, onDuplicate }) {
  const [deleting, setDeleting] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const confirmRef = React.useRef(null);
  const content = resume.content || {};

  React.useEffect(() => {
    if (!confirmDelete) return;
    const handler = (e) => {
      if (confirmRef.current && !confirmRef.current.contains(e.target))
        setConfirmDelete(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [confirmDelete]);

  const handleDeleteClick = async () => {
    setDeleting(true);
    await onDelete(resume.id);
    setDeleting(false);
    setConfirmDelete(false);
  };

  return (
    <div className="flex gap-4 p-4 rounded-sm border border-gray-200 bg-white hover:shadow-sm transition-all duration-200">

      {/* Left — A4 thumbnail */}
      <div
        className="flex-shrink-0 rounded-sm border border-gray-200 overflow-hidden cursor-pointer hover:border-orange-400 hover:shadow-md transition-all duration-200"
        style={{ width: 200, height: 283 }}
        onClick={() => onEdit(resume.id)}
        title="Open resume"
      >
        <ResumePreview
          data={content}
          selectedId={content.templateId}
          accentColor={content.accent}
          scale={200 / 794}
        />
      </div>

      {/* Right — Info + actions */}
      <div className="flex flex-col flex-1  min-w-0 py-0.5" ref={confirmRef}>
        {/* Title */}
        <div className="flex items-center gap-1 mb-0.5">
          <h2
            className="text-base font-semibold text-xl text-gray-900 leading-snug cursor-pointer hover:text-orange-600 transition-colors truncate"
            onClick={() => onEdit(resume.id)}
          >
            {resume.title || "Untitled"}
          </h2>
          <button
            className="flex-shrink-0 text-gray-400 hover:text-orange-500 transition-colors"
            onClick={() => onEdit(resume.id)}
            title="Edit"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Date */}
        <p className="text-sm text-gray-400 mb-4">
          Updated {formatDate(resume.updated_at)}
        </p>

        {/* Action list */}
        <div className="space-y-2" onClick={e => e.stopPropagation()}>

          {/* Download PDF */}
          <button
            className="flex items-center gap-2.5 text-md text-gray-700 hover:text-orange-600 transition-colors w-full text-left"
            onClick={() => onEdit(resume.id)}
          >
            <div className="w-7 h-7  flex items-center justify-center flex-shrink-0">
              <Download className="h-4.5 w-4.5 text-orange-500" />
            </div>
            Download PDF
          </button>

          {/* Copy */}
          <button
            className="flex items-center gap-2.5 text-md text-gray-700 hover:text-orange-500 transition-colors w-full text-left disabled:opacity-50"
            disabled={duplicating}
            onClick={async () => { setDuplicating(true); await onDuplicate(resume); setDuplicating(false); }}
          >
            <div className="w-7 h-7  flex items-center justify-center flex-shrink-0">
              <Copy className="h-4.5 w-4.5 text-orange-500" />
            </div>
            {duplicating ? "Copying…" : "Copy Resume"}
          </button>

          {/* Delete */}
          {confirmDelete ? (
            <button
              className="flex items-center gap-2.5 text-md text-orange-500    transition-colors w-full text-left disabled:opacity-50"
              disabled={deleting}
              onClick={handleDeleteClick}
            >
              <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                <Trash2 className="h-4.5 w-4.5 text-orange-500" />
              </div>
              {deleting ? "Deleting…" : "Confirm Delete?"}
            </button>
          ) : (
            <button
              className="flex items-center gap-2.5 text-md text-gray-700 hover:text-orange-600 transition-colors w-full text-left group/del"
              onClick={() => setConfirmDelete(true)}
            >
              <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 transition-colors">
                <Trash2 className="h-4.5 w-4.5 text-orange-500 transition-colors" />
              </div>
              Delete Resume
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, Icon, iconBg, iconColor }) {
  return (
    <div className="flex flex-col justify-between p-5 rounded-xl border border-gray-200 bg-white min-h-[96px]">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-500">{label}</p>
        <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon className={`${iconColor}`} style={{ width: 18, height: 18 }} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    setLoading(true);
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) { setLoading(false); return; }
    const { data, error } = await supabase
      .from("resumes")
      .select("id, title, updated_at, content")
      .eq("user_id", u.id)
      .order("updated_at", { ascending: false });
    if (!error) setResumes(data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) return;
    const { error } = await supabase.from("resumes").delete().eq("id", id).eq("user_id", u.id);
    if (!error) {
      setResumes(prev => prev.filter(r => r.id !== id));
      try {
        const draft = JSON.parse(localStorage.getItem("resume_draft") || "{}");
        if (draft?.id === id) localStorage.removeItem("resume_draft");
      } catch (_) {}
    } else {
      alert("Could not delete resume. Please try again.");
    }
  };

  const handleDuplicate = async (resume) => {
    const { data: { user: u } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("resumes")
      .insert({ user_id: u.id, title: `${resume.title || "Untitled"} (Copy)`, content: resume.content, updated_at: new Date().toISOString() })
      .select().single();
    if (!error && data) setResumes(prev => [data, ...prev]);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("auth_session");
    localStorage.removeItem("auth_user");
    navigate("/");
  };

  // Derived
  const userMeta = user?.user_metadata || {};
  const displayName = userMeta.full_name || userMeta.name || user?.email?.split("@")[0] || "there";
  const firstName = displayName.split(" ")[0];
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const avgCompleteness = resumes.length > 0
    ? Math.round(resumes.reduce((s, r) => s + completeness(r.content), 0) / resumes.length)
    : 0;
  const filtered = resumes.filter(r =>
    (r.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.content?.role || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">

      {/* ── TOPBAR ── */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-14 items-center gap-4">

            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-2xl font-bold text-orange-500 flex-shrink-0 hover:text-orange-600 transition-colors mr-2"
            >
              
              AI Resume Builder
            </button>

            {/* Search — center */}
            <div className="flex-1 max-w-lg relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search resumes..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>

            {/* Right */}
            <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
              <button
                onClick={() => {}}
                className="text-sm text-gray-600 hover:text-gray-900 hidden sm:block transition-colors"
              >
                History
              </button>
              <button
                onClick={() => navigate("/resume/new")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
              >
                <Plus className="h-4 w-4" />
                New Resume
              </button>
              <button
                onClick={handleSignOut}
                title={`Sign out (${user?.email})`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors flex-shrink-0"
              >
                {initials}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── PAGE HEADER ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting}, {firstName}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {resumes.length === 0
              ? "Ready to build your first resume?"
              : `You have ${resumes.length} resume${resumes.length !== 1 ? "s" : ""}. Keep building your career!`}
          </p>
        </div>

        {/* ── STATS ── */}
        {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Resumes"
            value={resumes.length}
            Icon={FileText}
            iconBg="bg-blue-50"
            iconColor="text-blue-500"
          />
          <StatCard
            label="Jobs Applied"
            value={0}
            Icon={Briefcase}
            iconBg="bg-green-50"
            iconColor="text-green-500"
          />
          <StatCard
            label="Success Rate"
            value={`${avgCompleteness}%`}
            Icon={TrendingUp}
            iconBg="bg-purple-50"
            iconColor="text-purple-500"
          />
          <StatCard
            label="AI Requests"
            value={resumes.length}
            Icon={BarChart2}
            iconBg="bg-orange-50"
            iconColor="text-orange-500"
          />
        </div> */}

        {/* ── MY RESUMES ── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-lg text-gray-900">My Resumes</h2>
            <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 bg-white hover:border-gray-300 transition-colors">
              All Resumes
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border-2 border-dashed border-gray-200 bg-white">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {search ? `No results for "${search}"` : "No resumes yet"}
              </h3>
              <p className="text-sm text-gray-500 mb-5 max-w-xs">
                {search
                  ? "Try a different search term."
                  : "Create your first AI-powered resume in minutes and start landing more interviews."}
              </p>
              {!search && (
                <button
                  onClick={() => navigate("/resume/new")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  Create Your First Resume
                </button>
              )}
            </div>
          )}

          {/* 2-column cards */}
          {filtered.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map(resume => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={id => navigate(`/resume/${id}`)}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
