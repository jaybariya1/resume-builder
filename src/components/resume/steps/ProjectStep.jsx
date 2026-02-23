import React, { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Plus, Trash, Sparkles, RefreshCw, Wand2 } from "lucide-react";
import RichTextEditor from "../TextEditor";
import { generateProjectDescription, improveExperience } from "../../../services/aiGenerator";

const ProjectStep = () => {
  const { resumeData, setResumeData, setIsGenerating } = useContext(ResumeInfoContext);
  const [generatingId, setGeneratingId] = useState(null);
  const [improvingId, setImprovingId] = useState(null);

  const addProject = () => {
    setResumeData({
      ...resumeData,
      project: [...(resumeData?.project || []), {
        id: Date.now().toString(), title: "", url: "", organization: "",
        location: "", startDate: "", endDate: "", current: false,
        description: "", tech: "",
      }],
    });
  };

  useEffect(() => {
    if (!resumeData.project || resumeData.project.length === 0) addProject();
  }, []);

  const updateProject = (id, field, value) => {
    setResumeData({
      ...resumeData,
      project: resumeData.project.map((p) => p.id === id ? { ...p, [field]: value } : p),
    });
  };

  const removeProject = (id) => {
    setResumeData({ ...resumeData, project: resumeData.project.filter((p) => p.id !== id) });
  };

  const handleGenerate = async (proj) => {
    setGeneratingId(proj.id);
    setIsGenerating(true);
    try {
      const result = await generateProjectDescription({
        projectTitle: proj.title,
        projectTech: proj.tech || "",
        currentText: proj.description,
      });
      if (result) updateProject(proj.id, "description", result);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingId(null);
      setIsGenerating(false);
    }
  };

  const handleImprove = async (proj) => {
    if (!proj.description) return;
    setImprovingId(proj.id);
    setIsGenerating(true);
    try {
      const result = await improveExperience({ jobTitle: proj.title, currentText: proj.description });
      if (result) updateProject(proj.id, "description", result);
    } catch (err) {
      console.error(err);
    } finally {
      setImprovingId(null);
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-1">Projects</h3>
        <p className="text-xs text-muted-foreground">Showcase your projects. AI can generate impactful descriptions for each one.</p>
      </div>

      {(resumeData.project || []).map((proj, index) => (
        <Card key={proj.id} className="border-orange-200">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-semibold">Project #{index + 1}</CardTitle>
              <button onClick={() => removeProject(proj.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                <Trash size={15} />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Project Title</Label>
                <Input value={proj.title} className="mt-1 h-9 text-sm"
                  onChange={(e) => updateProject(proj.id, "title", e.target.value)} placeholder="My Awesome App" />
              </div>
              <div>
                <Label className="text-xs">Project URL</Label>
                <Input value={proj.url} className="mt-1 h-9 text-sm"
                  onChange={(e) => updateProject(proj.id, "url", e.target.value)} placeholder="github.com/..." />
              </div>
              <div>
                <Label className="text-xs">Technologies Used</Label>
                <Input value={proj.tech || ""} className="mt-1 h-9 text-sm"
                  onChange={(e) => updateProject(proj.id, "tech", e.target.value)}
                  placeholder="React, Node.js, PostgreSQL" />
              </div>
              <div>
                <Label className="text-xs">Organization</Label>
                <Input value={proj.organization} className="mt-1 h-9 text-sm"
                  onChange={(e) => updateProject(proj.id, "organization", e.target.value)} placeholder="Open Source" />
              </div>
              <div>
                <Label className="text-xs">Start Date</Label>
                <Input type="month" value={proj.startDate} className="mt-1 h-9 text-sm"
                  onChange={(e) => updateProject(proj.id, "startDate", e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">End Date</Label>
                <Input type="month" value={proj.endDate} disabled={proj.current} className="mt-1 h-9 text-sm"
                  onChange={(e) => updateProject(proj.id, "endDate", e.target.value)} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id={`current-${proj.id}`} checked={proj.current}
                onChange={(e) => updateProject(proj.id, "current", e.target.checked)} className="cursor-pointer" />
              <Label htmlFor={`current-${proj.id}`} className="text-xs cursor-pointer">Currently working on this</Label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs">Description</Label>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" disabled={generatingId === proj.id || !proj.title}
                    onClick={() => handleGenerate(proj)}
                    className="h-7 text-xs gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600">
                    {generatingId === proj.id
                      ? <><RefreshCw className="w-3 h-3 animate-spin" /> Generating…</>
                      : <><Sparkles className="w-3 h-3" /> AI Write</>}
                  </Button>
                  {proj.description && (
                    <Button variant="outline" size="sm" disabled={improvingId === proj.id}
                      onClick={() => handleImprove(proj)}
                      className="h-7 text-xs gap-1 border-orange-300 text-orange-600 hover:bg-orange-50">
                      {improvingId === proj.id
                        ? <><RefreshCw className="w-3 h-3 animate-spin" /> Improving…</>
                        : <><Wand2 className="w-3 h-3" /> Improve</>}
                    </Button>
                  )}
                </div>
              </div>
              {!proj.title && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1 mb-2">
                  💡 Enter a Project Title to unlock AI writing
                </p>
              )}
              <RichTextEditor value={proj.description} onChange={(val) => updateProject(proj.id, "description", val)} />
            </div>
          </CardContent>
        </Card>
      ))}

      <button onClick={addProject}
        className="w-full py-3 rounded-lg border-2 border-dashed border-orange-300 text-orange-500 hover:bg-orange-50 font-medium text-sm transition-all">
        + Add Another Project
      </button>
    </div>
  );
};

export default ProjectStep;
