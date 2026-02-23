import React, { useEffect, useContext, useState } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import RichTextEditor from "../TextEditor";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Plus, Trash, Sparkles, RefreshCw, Wand2, Briefcase } from "lucide-react";
import { generateExperienceBullets, improveExperience } from "../../../services/aiGenerator";

const ExperienceStep = () => {
  const { resumeData, setResumeData, setIsGenerating } = useContext(ResumeInfoContext);
  const [generatingId, setGeneratingId] = useState(null); // which card is generating
  const [improvingId, setImprovingId] = useState(null);

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [...(resumeData?.experience || []), {
        id: Date.now().toString(), title: "", company: "", location: "",
        startDate: "", endDate: "", current: false, description: "",
      }],
    });
  };

  useEffect(() => {
    if (!resumeData.experience || resumeData.experience.length === 0) addExperience();
  }, []);

  const updateExperience = (id, field, value) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) => exp.id === id ? { ...exp, [field]: value } : exp),
    });
  };

  const removeExperience = (id) => {
    setResumeData({ ...resumeData, experience: resumeData.experience.filter((exp) => exp.id !== id) });
  };

  const handleGenerate = async (exp) => {
    setGeneratingId(exp.id);
    setIsGenerating(true);
    try {
      const result = await generateExperienceBullets({
        jobTitle: exp.title,
        company: exp.company,
        skills: resumeData.skills,
        currentText: exp.description,
      });
      if (result) updateExperience(exp.id, "description", result);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingId(null);
      setIsGenerating(false);
    }
  };

  const handleImprove = async (exp) => {
    if (!exp.description) return;
    setImprovingId(exp.id);
    setIsGenerating(true);
    try {
      const result = await improveExperience({ jobTitle: exp.title, currentText: exp.description });
      if (result) updateExperience(exp.id, "description", result);
    } catch (err) {
      console.error(err);
    } finally {
      setImprovingId(null);
      setIsGenerating(false);
    }
  };

  const experiences = resumeData.experience || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-1">Work Experience</h3>
        <p className="text-xs text-muted-foreground">Add your work history. AI can generate or improve bullet points for each role.</p>
      </div>

      {experiences.map((exp, index) => (
        <Card key={exp.id} className="border-orange-200">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-semibold text-foreground">Experience #{index + 1}</CardTitle>
              <button onClick={() => removeExperience(exp.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                <Trash size={15} />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Job Title</Label>
                <Input value={exp.title} className="mt-1 h-9 text-sm"
                  onChange={(e) => updateExperience(exp.id, "title", e.target.value)} placeholder="Software Engineer" />
              </div>
              <div>
                <Label className="text-xs">Company</Label>
                <Input value={exp.company} className="mt-1 h-9 text-sm"
                  onChange={(e) => updateExperience(exp.id, "company", e.target.value)} placeholder="Tech Corp" />
              </div>
              <div>
                <Label className="text-xs">Location</Label>
                <Input value={exp.location} className="mt-1 h-9 text-sm"
                  onChange={(e) => updateExperience(exp.id, "location", e.target.value)} placeholder="San Francisco, CA" />
              </div>
              <div>
                <Label className="text-xs">Start Date</Label>
                <Input type="month" value={exp.startDate} className="mt-1 h-9 text-sm"
                  onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">End Date</Label>
                <Input type="month" value={exp.endDate} disabled={exp.current} className="mt-1 h-9 text-sm"
                  onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} />
              </div>
              <div className="flex items-center gap-2 mt-5">
                <input type="checkbox" id={`current-${exp.id}`} checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, "current", e.target.checked)} className="cursor-pointer" />
                <Label htmlFor={`current-${exp.id}`} className="text-xs cursor-pointer">Currently working here</Label>
              </div>
            </div>

            {/* Description with AI buttons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs">Description</Label>
                <div className="flex gap-1.5">
                  {/* Generate from scratch */}
                  <Button variant="outline" size="sm" disabled={generatingId === exp.id || !exp.title}
                    onClick={() => handleGenerate(exp)}
                    className="h-7 text-xs gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600">
                    {generatingId === exp.id
                      ? <><RefreshCw className="w-3 h-3 animate-spin" /> Generating…</>
                      : <><Sparkles className="w-3 h-3" /> AI Write</>}
                  </Button>
                  {/* Improve existing */}
                  {exp.description && (
                    <Button variant="outline" size="sm" disabled={improvingId === exp.id}
                      onClick={() => handleImprove(exp)}
                      className="h-7 text-xs gap-1 border-orange-300 text-orange-600 hover:bg-orange-50">
                      {improvingId === exp.id
                        ? <><RefreshCw className="w-3 h-3 animate-spin" /> Improving…</>
                        : <><Wand2 className="w-3 h-3" /> Improve</>}
                    </Button>
                  )}
                </div>
              </div>
              {!exp.title && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1 mb-2">
                  💡 Enter a Job Title to unlock AI writing
                </p>
              )}
              <RichTextEditor value={exp.description} onChange={(val) => updateExperience(exp.id, "description", val)} />
            </div>
          </CardContent>
        </Card>
      ))}

      <button onClick={addExperience}
        className="w-full py-3 rounded-lg border-2 border-dashed border-orange-300 text-orange-500 hover:bg-orange-50 font-medium text-sm transition-all">
        + Add Another Experience
      </button>

      {experiences.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No work experience added yet.</p>
        </div>
      )}
    </div>
  );
};

export default ExperienceStep;
