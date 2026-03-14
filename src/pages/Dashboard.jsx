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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
      className="group relative flex flex-col gap-3 p-4 rounded-lg border border-[#fde3c8] bg-white hover:border-[#fdba74] hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => onEdit(resume.id)}
    >
      {/* Top row */}
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-12 rounded-md bg-[#fff7ed] border border-[#fde3c8] flex flex-col items-center justify-center gap-0.5">
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
          <Button variant="ghost" size="icon-sm" title="Edit" onClick={() => onEdit(resume.id)} className="h-7 w-7 text-muted-foreground hover:text-orange-600">
            <Edit3 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" title="Duplicate" disabled={duplicating} onClick={async () => { setDuplicating(true); await onDuplicate(resume); setDuplicating(false); }} className="h-7 w-7 text-muted-foreground hover:text-orange-500">
            <Copy className="h-3.5 w-3.5" />
          </Button>
          {confirmDelete ? (
            <Button variant="destructive" size="xs" disabled={deleting} onClick={async () => { setDeleting(true); await onDelete(resume.id); setDeleting(false); setConfirmDelete(false); }}>
              {deleting ? "…" : "Sure?"}
            </Button>
          ) : (
            <Button variant="ghost" size="icon-sm" title="Delete" onClick={() => setConfirmDelete(true)} onBlur={() => setTimeout(() => setConfirmDelete(false), 200)} className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-50">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Completeness bar */}
      <CompletenessBar pct={pct} />

      {/* Tags */}
      <div className="flex gap-1.5 flex-wrap">
        {expCount > 0 && (
          <Badge variant="secondary">{expCount} exp</Badge>
        )}
        {skillCount > 0 && (
          <Badge variant="warm">{skillCount} skills</Badge>
        )}
        {pct === 100 && (
          <Badge variant="outline">✓ Complete</Badge>
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
    <div className="flex items-center gap-4 p-4 rounded-lg bg-white border border-[#fde3c8] shadow-sm">
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${colors[accent]} shadow-sm`}>
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
        <div className="w-20 h-20 rounded-lg bg-[#fff7ed] border border-[#fde3c8] flex items-center justify-center">
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
      <Button onClick={onCreate} size="lg">
        <Sparkles className="h-4 w-4" />
        Create Your First Resume
      </Button>
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
            <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm font-bold text-orange-600 flex-shrink-0 hover:text-orange-700 transition-colors">
              <Zap className="h-4 w-4" />
              AI Resume Builder
            </button>

            {/* Search — center */}
            <div className="flex-1 max-w-sm relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search resumes…"
                className="w-full pl-9 pr-4 py-2 text-sm rounded-[var(--radius)] border border-[#fde3c8] bg-[#fff7ed] focus:bg-white focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all"
              />
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="hidden sm:flex">
                <Home className="h-4 w-4" />
                Home
              </Button>
              <Button onClick={() => navigate("/resume/new")}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Resume</span>
                <span className="sm:hidden">New</span>
              </Button>
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
                <Button variant="link" size="sm" onClick={() => navigate("/resume/new")} className="h-auto p-0 text-xs">
                  <Plus className="h-3.5 w-3.5" /> Add new
                </Button>
              )}
            </div>

            {/* Mobile search */}
            <div className="sm:hidden mb-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search resumes…"
                className="w-full pl-9 pr-4 py-2 text-sm rounded-[var(--radius)] border border-[#fde3c8] bg-white focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all"
              />
            </div>

            {filtered.length === 0 && search && (
              <div className="py-12 text-center rounded-2xl border border-dashed border-orange-200 bg-white">
                <p className="text-sm text-muted-foreground">No results for "<strong>{search}</strong>"</p>
                <Button variant="link" size="sm" onClick={() => setSearch("")} className="mt-2 h-auto p-0 text-xs">Clear search</Button>
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
              <Button variant="outline" onClick={() => navigate("/resume/new")} className="mt-4 w-full border-dashed">
                <Plus className="h-4 w-4" /> Create another resume
              </Button>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-4">

            {/* Profile card */}
            <div className="rounded-lg bg-gradient-to-br from-orange-500 to-red-500 p-5 text-white shadow-md">
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
                <div className="bg-white/15 rounded-md p-3 text-center">
                  <p className="text-xl font-bold">{resumes.length}</p>
                  <p className="text-xs text-white/70">Resumes</p>
                </div>
                <div className="bg-white/15 rounded-md p-3 text-center">
                  <p className="text-xl font-bold">{avgCompleteness}%</p>
                  <p className="text-xs text-white/70">Avg Score</p>
                </div>
              </div>
              <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-white/15 hover:bg-white/25 text-sm font-semibold transition-colors">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>

            {/* Quick actions */}
            <div className="rounded-lg bg-white border border-[#fde3c8] p-4 space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</p>
              {[
                { icon: Plus,      label: "New Resume",       action: () => navigate("/resume/new"), variant: "default" },
                { icon: FileText,  label: "Browse Templates", action: () => navigate("/resume/new"), variant: "secondary" },
              ].map(({ icon: Icon, label, action, variant }) => (
                <Button key={label} onClick={action} variant={variant} className="w-full justify-start">
                  <Icon className="h-4 w-4" /> {label}
                </Button>
              ))}
            </div>

            {/* Resume checklist tip */}
            <div className="rounded-lg bg-white border border-[#fde3c8] p-4">
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
                <Button variant="link" size="sm" onClick={() => navigate("/resume/new")} className="mt-4 w-full h-auto p-0 text-xs justify-center">
                  Improve a resume <ChevronRight className="h-3 w-3" />
                </Button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
