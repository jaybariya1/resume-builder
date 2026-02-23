import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Plus, FileText, Edit3, Trash2, Calendar,
  Briefcase, Sparkles, ChevronRight, Search,
  Clock, LogOut, TrendingUp, Zap, Eye, User,
} from "lucide-react";

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function ResumeCard({ resume, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const content = resume.content || {};
  const role = content.role || "";

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card hover:border-orange-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => onEdit(resume.id)}
    >
      {/* Icon */}
      <div className="flex h-12 w-10 flex-shrink-0 flex-col items-center justify-center gap-1 rounded-lg bg-orange-50 border border-orange-100">
        <FileText className="h-4 w-4 text-orange-600" />
        <div className="flex gap-0.5">
          {[1,2,3].map(i => <div key={i} className="h-0.5 w-1 rounded-full bg-orange-300" />)}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground truncate">
          {resume.title || "Untitled Resume"}
        </h3>
        {role && <p className="text-xs text-muted-foreground truncate mt-0.5">{role}</p>}
        <div className="flex items-center gap-1 mt-1.5">
          <Clock className="h-3 w-3 text-muted-foreground/60" />
          <span className="text-xs text-muted-foreground/60">{timeAgo(resume.updated_at)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 hover:border-orange-300 hover:text-orange-600"
          onClick={() => onEdit(resume.id)}
        >
          <Edit3 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
          disabled={deleting}
          onClick={async () => {
            if (!window.confirm("Delete this resume?")) return;
            setDeleting(true);
            await onDelete(resume.id);
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <Card className="border-orange-100">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
            <Icon className="h-4 w-4 text-orange-600" />
          </div>
          <TrendingUp className="h-3.5 w-3.5 text-muted-foreground/40" />
        </div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="text-xs font-medium text-muted-foreground mt-0.5">{label}</div>
        {sub && <div className="text-xs text-muted-foreground/60 mt-0.5">{sub}</div>}
      </CardContent>
    </Card>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 mb-4">
        <FileText className="h-7 w-7 text-orange-600" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No resumes yet</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
        Create your first AI-powered resume and start landing interviews faster.
      </p>
      <Button
        onClick={onCreate}
        className="gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 shadow-md"
      >
        <Plus className="h-4 w-4" />
        Create Resume
      </Button>
    </div>
  );
}

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/auth"); return; }
    setUser(user);
    const { data, error } = await supabase
      .from("resumes").select("id, title, updated_at, content")
      .eq("user_id", user.id).order("updated_at", { ascending: false });
    if (!error) setResumes(data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("resumes").delete().eq("id", id);
    if (!error) setResumes(prev => prev.filter(r => r.id !== id));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const filtered = resumes.filter(r => (r.title || "").toLowerCase().includes(search.toLowerCase()));
  const userMeta = user?.user_metadata || {};
  const displayName = userMeta.full_name || userMeta.name || user?.email?.split("@")[0] || "there";
  const firstName = displayName.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const uniqueRoles = new Set(resumes.map(r => r.content?.role).filter(Boolean)).size;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">

      {/* NAV — matches Header.jsx exactly */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button onClick={() => navigate("/")} className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              AI Resume Builder
            </button>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {greeting}, <span className="font-semibold text-foreground">{firstName}</span>
              </span>
              <Button
                onClick={() => navigate("/resume/new")}
                className="gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 shadow-md"
              >
                <Plus className="h-4 w-4" />
                New Resume
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2 text-muted-foreground hover:text-orange-600">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* PAGE HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-orange-700 bg-orange-50 border-orange-200 text-xs font-semibold">
              Dashboard
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            {greeting}, {firstName}
          </h1>
          <p className="text-muted-foreground">
            {resumes.length === 0
              ? "Start by creating your first resume."
              : `You have ${resumes.length} resume${resumes.length !== 1 ? "s" : ""}. Keep building!`}
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FileText} label="Total Resumes" value={resumes.length} sub="in workspace" />
          <StatCard icon={Sparkles} label="AI-Enhanced" value={resumes.length} sub="auto-optimized" />
          <StatCard icon={Calendar} label="Last Edited" value={resumes.length > 0 ? timeAgo(resumes[0].updated_at) : "—"} sub="most recent" />
          <StatCard icon={Briefcase} label="Roles Targeted" value={uniqueRoles} sub="unique positions" />
        </div>

        {/* MAIN TWO-COL */}
        <div className="grid gap-8 lg:grid-cols-3">

          {/* RESUMES — takes 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-orange-100 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Briefcase className="h-4 w-4 text-orange-600" />
                      My Resumes
                      {filtered.length > 0 && (
                        <span className="text-xs font-normal text-muted-foreground">({filtered.length})</span>
                      )}
                    </CardTitle>
                    <CardDescription>Manage and edit all your resume versions</CardDescription>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search…"
                      className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border/60 bg-background focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200 w-40 transition-all"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {filtered.length === 0 && !search && <EmptyState onCreate={() => navigate("/resume/new")} />}

                {filtered.length === 0 && search && (
                  <div className="py-12 text-center">
                    <p className="text-sm text-muted-foreground">No results for "<strong>{search}</strong>"</p>
                  </div>
                )}

                <div className="space-y-2">
                  {filtered.map(resume => (
                    <ResumeCard
                      key={resume.id}
                      resume={resume}
                      onEdit={id => navigate(`/resume/${id}`)}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>

                {resumes.length > 0 && (
                  <button
                    onClick={() => navigate("/resume/new")}
                    className="mt-3 w-full py-3 rounded-xl border-2 border-dashed border-orange-200 text-sm font-medium text-orange-500 hover:bg-orange-50 hover:border-orange-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create another resume
                  </button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* SIDEBAR — 1 col */}
          <div className="space-y-5">

            {/* Quick Actions */}
            <Card className="border-orange-100 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Button
                  onClick={() => navigate("/resume/new")}
                  className="w-full justify-start gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0"
                >
                  <Plus className="h-4 w-4" /> New Resume
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 border-orange-100 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50">
                  <Eye className="h-4 w-4" /> View Templates
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 border-orange-100 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50">
                  <Sparkles className="h-4 w-4" /> AI Suggestions
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tip */}
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-800">Pro Tip</span>
                </div>
                <p className="text-xs text-orange-700/80 leading-relaxed mb-3">
                  Tailor your resume keywords to match each job description for better ATS results and more interviews.
                </p>
                <button
                  onClick={() => navigate("/resume/new")}
                  className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  Try it now <ChevronRight className="h-3 w-3" />
                </button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            {resumes.length > 0 && (
              <Card className="border-orange-100 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    <Clock className="h-3.5 w-3.5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {resumes.slice(0, 4).map(resume => (
                      <div key={resume.id} className="flex items-start gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {resume.title || "Untitled"}
                          </p>
                          <p className="text-xs text-muted-foreground">Edited {timeAgo(resume.updated_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account */}
            <Card className="border-orange-100 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white text-sm font-bold flex-shrink-0">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full justify-start gap-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 text-xs"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
