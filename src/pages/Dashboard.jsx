import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  FileText,
  Download,
  Edit3,
  Trash2,
  TrendingUp,
  Eye,
  Calendar,
  Briefcase,
  Target,
  Award,
  Clock,
  BarChart3,
} from "lucide-react";

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("resumes")
      .select("id, title, updated_at, content")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch resumes:", error);
    } else {
      setResumes(data || []);
    }

    setLoading(false);
  };

    if (loading) {
    return <p className="p-6">Loading resumes...</p>;
  }


  const totalViews = resumes.reduce((sum, resume) => sum + resume.views, 0);
  const totalDownloads = resumes.reduce(
    (sum, resume) => sum + resume.downloads,
    0
  );
  const avgAtsScore = Math.round(
    resumes.reduce((sum, resume) => sum + resume.atsScore, 0) / resumes.length
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2">My Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your resumes and track your job search progress
              </p>
            </div>
            <Button onClick={() => navigate('/resume/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Resume
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Resumes
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {resumes.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {resumes.filter((r) => r.status === "completed").length}{" "}
                completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {totalViews}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all resumes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {totalDownloads}
              </div>
              <p className="text-xs text-muted-foreground">PDF downloads</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg ATS Score
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {avgAtsScore}%
              </div>
              <p className="text-xs text-muted-foreground">AI optimization</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Resumes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  My Resumes
                </CardTitle>
                <CardDescription>
                  Manage and track all your resume versions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium truncate">
                            {resume.title}
                          </h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(
                                resume.updated_at
                              ).toLocaleDateString()}
                            </span>
                            {/* <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {resume.views} views
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {resume.downloads} downloads
                            </span> */}
                          </div>
                          {/* <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant={
                                resume.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {resume.status}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs">
                              <Target className="h-3 w-3" />
                              ATS: {resume.atsScore}%
                            </div>
                            <Progress
                              value={resume.atsScore}
                              className="w-16 h-2"
                            />
                          </div> */}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/resume/${resume.id}`)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm"
                        onClick={async () => {
                          const { error } = await supabase
                            .from("resumes")
                            .delete()
                            .eq("id", resume.id); 
                        }}  
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => navigate('/resume/new')}
                  className="w-full justify-start gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create New Resume
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  Browse Templates
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p>Software Engineer Resume downloaded</p>
                      <p className="text-muted-foreground text-xs">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary/60 mt-2"></div>
                    <div>
                      <p>Product Manager CV edited</p>
                      <p className="text-muted-foreground text-xs">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary/40 mt-2"></div>
                    <div>
                      <p>AI optimization completed</p>
                      <p className="text-muted-foreground text-xs">
                        2 days ago
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  AI Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="font-medium text-primary">
                      Boost your ATS score
                    </p>
                    <p className="text-muted-foreground mt-1">
                      Add more industry keywords to improve visibility
                    </p>
                  </div>
                  <div className="p-3 bg-accent/50 rounded-lg">
                    <p className="font-medium">Update your skills</p>
                    <p className="text-muted-foreground mt-1">
                      Consider adding trending technologies to stay competitive
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
