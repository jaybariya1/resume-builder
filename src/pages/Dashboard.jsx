import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Plus, FileText, Edit3, Trash2, Copy, Search,
  Clock, LogOut, Sparkles, ChevronRight, LayoutDashboard,
  Briefcase, GraduationCap, Code2, Award, User2,
  TrendingUp, Zap, Home,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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

function CompletenessBar({ pct }) {
  const color = pct >= 80 ? "bg-amber-500" : pct >= 50 ? "bg-orange-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex-1 h-1 rounded-full bg-orange-100 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-medium text-muted-foreground w-7 text-right">{pct}%</span>
    </div>
  );
}

// ─── Resume Card ─────────────────────────────────────────────────────────────

function ResumeCard({ resume, onEdit, onDelete, onDuplicate }) {
  const [deleting, setDeleting] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const content = resume.content || {};
  const pct = completeness(content);
  const skillCount = (content.skills || []).filter(s => s.name).length;
  const expCount = (content.experience || []).filter(e => e.title).length;

  return (
    <div
      className="group relative flex flex-col gap-3 p-4 rounded-2xl border border-orange-100 bg-white hover:border-orange-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={() => onEdit(resume.id)}
    >
      {/* Top row */}
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-100 flex flex-col items-center justify-center gap-0.5">
          <FileText className="h-4 w-4 text-orange-500" />
          <div className="flex gap-0.5">
            {[1,2,3].map(i => <div key={i} className="h-0.5 w-1.5 rounded-full bg-orange-200" />)}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate leading-tight">
            {resume.title || "Untitled Resume"}
          </h3>
          {content.role && (
            <p className="text-xs text-orange-600 font-medium truncate mt-0.5">{content.role}</p>
          )}
          <div className="flex items-center gap-1 mt-1">
            <Clock className="h-3 w-3 text-muted-foreground/50" />
            <span className="text-[11px] text-muted-foreground/60">{timeAgo(resume.updated_at)}</span>
          </div>
        </div>

        {/* Action buttons — always visible on mobile, hover on desktop */}
        <div
          className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0"
          onClick={e => e.stopPropagation()}
        >
          <button
            title="Edit"
            onClick={() => onEdit(resume.id)}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-orange-600 hover:bg-orange-50 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            title="Duplicate"
            disabled={duplicating}
            onClick={async () => {
              setDuplicating(true);
              await onDuplicate(resume);
              setDuplicating(false);
            }}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-orange-500 hover:bg-orange-50 transition-colors disabled:opacity-50"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          {confirmDelete ? (
            <button
              onClick={async () => {
                setDeleting(true);
                await onDelete(resume.id);
                setDeleting(false);
                setConfirmDelete(false);
              }}
              disabled={deleting}
              className="h-7 px-2 flex items-center justify-center rounded-lg bg-red-500 text-white text-[10px] font-semibold transition-colors"
            >
              {deleting ? "…" : "Sure?"}
            </button>
          ) : (
            <button
              title="Delete"
              onClick={() => setConfirmDelete(true)}
              onBlur={() => setTimeout(() => setConfirmDelete(false), 200)}
              className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Completeness bar */}
      <CompletenessBar pct={pct} />

      {/* Tags */}
      <div className="flex gap-1.5 flex-wrap">
        {expCount > 0 && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100">
            {expCount} exp
          </span>
        )}
        {skillCount > 0 && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
            {skillCount} skills
          </span>
        )}
        {pct === 100 && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
            ✓ Complete
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, accent = "orange" }) {
  const colors = {
    orange: "from-orange-500 to-red-500",
    blue:   "from-orange-400 to-orange-500",
    green:  "from-amber-500 to-orange-500",
    purple: "from-red-400 to-red-500",
  };
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-orange-100 shadow-sm">
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${colors[accent]} shadow-sm`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-200 flex items-center justify-center">
          <FileText className="h-9 w-9 text-orange-400" />
        </div>
        <div className="absolute -right-1 -top-1 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
          <Plus className="h-3.5 w-3.5 text-white" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">No resumes yet</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
        Create your first AI-powered resume in minutes and start landing more interviews.
      </p>
      <button
        onClick={onCreate}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:from-orange-600 hover:to-red-600 transition-all"
      >
        <Sparkles className="h-4 w-4" />
        Create Your First Resume
      </button>
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
    const { data, error } = await supabase
      .from("resumes")
      .select("id, title, updated_at, content")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    if (!error) setResumes(data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("resumes").delete().eq("id", id);
    if (!error) setResumes(prev => prev.filter(r => r.id !== id));
  };

  const handleDuplicate = async (resume) => {
    const { data: { user: u } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: u.id,
        title: `${resume.title || "Untitled"} (Copy)`,
        content: resume.content,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
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
  const filtered = resumes.filter(r => (r.title || "").toLowerCase().includes(search.toLowerCase()) || (r.content?.role || "").toLowerCase().includes(search.toLowerCase()));
  const avgCompleteness = resumes.length > 0 ? Math.round(resumes.reduce((s, r) => s + completeness(r.content), 0) / resumes.length) : 0;
  const uniqueRoles = new Set(resumes.map(r => r.content?.role).filter(Boolean)).size;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">

      {/* ── TOPBAR ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex-shrink-0"
            >
              <Zap className="h-4 w-4 text-orange-500" />
              AI Resume Builder
            </button>

            {/* Search — center */}
            <div className="flex-1 max-w-sm relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search resumes…"
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-border/60 bg-orange-50/50 focus:bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => navigate("/")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-orange-50 transition-colors"
              >
                <Home className="h-4 w-4" />
                Home
              </button>
              <button
                onClick={() => navigate("/resume/new")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:from-orange-600 hover:to-red-600 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Resume</span>
                <span className="sm:hidden">New</span>
              </button>
              {/* Avatar */}
              <button
                onClick={handleSignOut}
                title={`Sign out (${user?.email})`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white text-sm font-bold shadow-sm hover:opacity-90 transition-opacity flex-shrink-0"
              >
                {initials || <User2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── PAGE HEADER ── */}
        <div className="mb-8">
          <p className="text-sm text-orange-600 font-semibold mb-1">Dashboard</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {resumes.length === 0
              ? "Ready to build your first resume?"
              : `You have ${resumes.length} resume${resumes.length !== 1 ? "s" : ""}${avgCompleteness > 0 ? ` · avg. ${avgCompleteness}% complete` : ""}`}
          </p>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard icon={FileText}   label="Total Resumes"   value={resumes.length}  accent="orange" />
          <StatCard icon={Briefcase}  label="Roles Targeted"  value={uniqueRoles}     accent="blue"   />
          <StatCard icon={TrendingUp} label="Avg Completeness" value={`${avgCompleteness}%`} accent="green" />
          <StatCard icon={Sparkles}   label="AI-Enhanced"     value={resumes.length}  accent="purple" />
        </div>

        {/* ── MAIN LAYOUT ── */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── RESUMES LIST (2 cols) ── */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-orange-500" />
                My Resumes
                {filtered.length > 0 && (
                  <span className="text-xs font-normal text-muted-foreground">({filtered.length})</span>
                )}
              </h2>
              {resumes.length > 0 && (
                <button
                  onClick={() => navigate("/resume/new")}
                  className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add new
                </button>
              )}
            </div>

            {/* Mobile search */}
            <div className="sm:hidden mb-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search resumes…"
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-orange-200 bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>

            {filtered.length === 0 && search && (
              <div className="py-12 text-center rounded-2xl border border-dashed border-orange-200 bg-white">
                <p className="text-sm text-muted-foreground">No results for "<strong>{search}</strong>"</p>
                <button onClick={() => setSearch("")} className="mt-2 text-xs text-orange-600 hover:underline">Clear search</button>
              </div>
            )}

            {filtered.length === 0 && !search && (
              <div className="rounded-2xl border border-dashed border-orange-200 bg-white/80">
                <EmptyState onCreate={() => navigate("/resume/new")} />
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
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

            {resumes.length > 0 && (
              <button
                onClick={() => navigate("/resume/new")}
                className="mt-4 w-full py-3 rounded-2xl border-2 border-dashed border-orange-300 text-sm font-medium text-orange-600 hover:bg-orange-50 hover:border-orange-400 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" /> Create another resume
              </button>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-4">

            {/* Profile card */}
            <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-5 text-white shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {initials || <User2 className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <p className="font-bold truncate">{displayName}</p>
                  <p className="text-xs text-white/70 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-white/15 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold">{resumes.length}</p>
                  <p className="text-xs text-white/70">Resumes</p>
                </div>
                <div className="bg-white/15 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold">{avgCompleteness}%</p>
                  <p className="text-xs text-white/70">Avg Score</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl bg-white border border-orange-100 p-4 space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</p>
              {[
                { icon: Plus,           label: "New Resume",        action: () => navigate("/resume/new"),  style: "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-sm" },
                { icon: FileText,       label: "Browse Templates",  action: () => navigate("/resume/new"),  style: "bg-orange-50 text-foreground hover:bg-orange-100 border border-orange-100" },
              ].map(({ icon: Icon, label, action, style }) => (
                <button key={label} onClick={action} className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${style}`}>
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>

            {/* Resume checklist tip */}
            <div className="rounded-2xl bg-white border border-orange-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-orange-500" />
                <p className="text-xs font-bold text-foreground uppercase tracking-wider">Resume Checklist</p>
              </div>
              <div className="space-y-2">
                {[
                  { icon: User2,          label: "Personal info",      done: resumes.some(r => r.content?.firstName) },
                  { icon: Briefcase,      label: "Work experience",    done: resumes.some(r => (r.content?.experience || []).length > 0) },
                  { icon: GraduationCap,  label: "Education",          done: resumes.some(r => (r.content?.education || []).length > 0) },
                  { icon: Code2,          label: "Skills added",       done: resumes.some(r => (r.content?.skills || []).length >= 3) },
                  { icon: Award,          label: "Summary written",    done: resumes.some(r => r.content?.summary) },
                ].map(({ icon: Icon, label, done }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-amber-100" : "bg-orange-50"}`}>
                      <Icon className={`h-3 w-3 ${done ? "text-amber-700" : "text-orange-300"}`} />
                    </div>
                    <span className={`text-xs ${done ? "text-foreground font-medium" : "text-muted-foreground"}`}>{label}</span>
                    {done && <span className="ml-auto text-[10px] text-amber-700 font-semibold">✓</span>}
                  </div>
                ))}
              </div>
              {resumes.length > 0 && (
                <button
                  onClick={() => navigate("/resume/new")}
                  className="mt-4 w-full flex items-center justify-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Improve a resume <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
