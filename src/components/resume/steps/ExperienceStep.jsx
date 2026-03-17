import React, { useEffect, useContext, useState, useCallback } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import RichTextEditor from "../TextEditor";
import AIAssistModal from "../AIAssistModal";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Plus, Trash, Sparkles, Briefcase, GripVertical, ChevronUp } from "lucide-react";
import { generateExperienceBullets, improveExperience } from "../../../services/aiGenerator";
import { useDragSort } from "../../../hooks/useDragSort";
import { useScrollContext } from "../../../context/ScrollContext";

const ExperienceStep = () => {
  const { resumeData, setResumeData, setIsGenerating } = useContext(ResumeInfoContext);
  const [aiOpenFor,  setAiOpenFor]  = useState(null);
  const [collapsed,  setCollapsed]  = useState({});   // { [exp.id]: bool }

  const addExperience = () => {
    const newId = Date.now().toString();
    setResumeData((prev) => ({
      ...prev,
      experience: [...(prev.experience || []), {
        id: newId, title: "", company: "", location: "",
        startDate: "", endDate: "", current: false, description: "",
      }],
    }));
    // New cards start expanded
    setCollapsed(prev => ({ ...prev, [newId]: false }));
  };

  useEffect(() => {
    if (!resumeData.experience || resumeData.experience.length === 0) addExperience();
  }, []);

  const updateExperience = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => exp.id === id ? { ...exp, [field]: value } : exp),
    }));
  };

  const removeExperience = (id) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
    setCollapsed(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const toggleCollapse = (id) =>
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));

  const handleAIGenerate = async (exp, userPrompt, mode) => {
    setIsGenerating(true);
    try {
      if (mode === "improve") return await improveExperience({ jobTitle: exp.title, currentText: exp.description, userPrompt });
      return await generateExperienceBullets({ jobTitle: exp.title, company: exp.company, skills: resumeData.skills, currentText: exp.description, userPrompt });
    } finally {
      setIsGenerating(false);
    }
  };

  const experiences = resumeData.experience || [];
  const activeExp   = experiences.find((e) => e.id === aiOpenFor);

  const { startAutoScroll, updatePointer, stopAutoScroll } = useScrollContext();

  const { getDragProps, overIndex } = useDragSort(
    experiences,
    (reordered) => setResumeData((prev) => ({ ...prev, experience: reordered })),
    { collapsed, setCollapsed, getId: (item) => item.id },
    { startAutoScroll, updatePointer, stopAutoScroll }
  );

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-semibold text-foreground mb-1">Work Experience</h3>
        <p className="text-xs text-muted-foreground">
          Drag <GripVertical className="inline w-3 h-3" /> to reorder entries.
        </p>
      </div>

      {experiences.map((exp, index) => {
        const isCollapsed = !!collapsed[exp.id];
        const isOver      = overIndex === index;
        const label       = [exp.title, exp.company].filter(Boolean).join(" @ ") || `Experience #${index + 1}`;

        return (
          <div
            key={exp.id}
            {...getDragProps(index)}
            className={`rounded-xl border bg-white transition-all duration-150
              shadow-[0_2px_8px_rgba(249,115,22,0.08)] hover:shadow-[0_4px_16px_rgba(249,115,22,0.13)]
              ${isOver ? "ring-2 ring-orange-400 ring-offset-2 scale-[1.01] shadow-[0_6px_20px_rgba(249,115,22,0.18)]" : "border-orange-200"}`}
          >
            {/* ── Card Header ── */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-50 to-white rounded-t-xl border-b border-orange-100">
              {/* Grip */}
              <div className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-orange-100 text-stone-300 hover:text-orange-500 transition-colors flex-shrink-0" title="Drag to reorder">
                <GripVertical size={15} />
              </div>

              {/* Title */}
              <span className="flex-1 text-sm font-semibold text-stone-700 truncate">{label}</span>

              {/* Delete */}
              <button
                onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                className="flex-shrink-0 p-1 rounded hover:bg-red-50 text-stone-300 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <Trash size={14} />
              </button>

              {/* Collapse toggle */}
              <button
                onClick={() => toggleCollapse(exp.id)}
                className="flex-shrink-0 p-1 rounded hover:bg-orange-100 text-stone-400 hover:text-orange-500 transition-colors"
                title={isCollapsed ? "Expand" : "Collapse"}
              >
                <ChevronUp size={15} className={`transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* ── Card Body ── */}
            {!isCollapsed && (
              <div className="p-4 space-y-4">
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

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs">Description</Label>
                    <Button size="sm" onClick={() => setAiOpenFor(exp.id)}
                      className="h-7 text-xs gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600">
                      <Sparkles className="w-3 h-3" /> AI Assistant
                    </Button>
                  </div>
                  {!exp.title && (
                    <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1 mb-2">
                      💡 Enter a Job Title to unlock AI writing
                    </p>
                  )}
                  <RichTextEditor value={exp.description} onChange={(val) => updateExperience(exp.id, "description", val)} />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <Button variant="outline" onClick={addExperience} className="w-full border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400">
        <Plus className="h-4 w-4" /> Add Another Experience
      </Button>

      {experiences.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No work experience added yet.</p>
        </div>
      )}

      {activeExp && (
        <AIAssistModal
          isOpen={!!aiOpenFor}
          onClose={() => setAiOpenFor(null)}
          hasContent={!!activeExp.description}
          contextLabel="Experience description"
          contextHint={[activeExp.title, activeExp.company].filter(Boolean).join(" at ")}
          onGenerate={(userPrompt, mode) => handleAIGenerate(activeExp, userPrompt, mode)}
          onApply={(result) => { updateExperience(activeExp.id, "description", result); setAiOpenFor(null); }}
          disabled={!activeExp.title}
          disabledHint="Enter a Job Title for this experience first to enable AI writing."
        />
      )}
    </div>
  );
};

export default ExperienceStep;
