import React, { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Plus, Trash, Sparkles, GripVertical, ChevronUp } from "lucide-react";
import RichTextEditor from "../TextEditor";
import AIAssistModal from "../AIAssistModal";
import { generateProjectDescription, improveExperience } from "../../../services/aiGenerator";
import { useDragSort } from "../../../hooks/useDragSort";
import { useScrollContext } from "../../../context/ScrollContext";

const ProjectStep = () => {
  const { resumeData, setResumeData, setIsGenerating } = useContext(ResumeInfoContext);
  const [aiOpenFor, setAiOpenFor] = useState(null);
  const [collapsed, setCollapsed] = useState({});

  const addProject = () => {
    const newId = Date.now().toString();
    setResumeData((prev) => ({
      ...prev,
      project: [...(prev.project || []), {
        id: newId, title: "", url: "", organization: "",
        location: "", startDate: "", endDate: "", current: false,
        description: "", tech: "",
      }],
    }));
    setCollapsed(prev => ({ ...prev, [newId]: false }));
  };

  useEffect(() => {
    if (!resumeData.project || resumeData.project.length === 0) addProject();
  }, []);

  const updateProject = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      project: prev.project.map((p) => p.id === id ? { ...p, [field]: value } : p),
    }));
  };

  const removeProject = (id) => {
    setResumeData((prev) => ({
      ...prev,
      project: prev.project.filter((p) => p.id !== id),
    }));
    setCollapsed(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const toggleCollapse = (id) =>
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));

  const handleAIGenerate = async (proj, userPrompt, mode) => {
    setIsGenerating(true);
    try {
      if (mode === "improve") return await improveExperience({ jobTitle: proj.title, currentText: proj.description, userPrompt });
      return await generateProjectDescription({ projectTitle: proj.title, projectTech: proj.tech || "", currentText: proj.description, userPrompt });
    } finally {
      setIsGenerating(false);
    }
  };

  const projects  = resumeData.project || [];
  const activeProj = projects.find((p) => p.id === aiOpenFor);

  const { startAutoScroll, updatePointer, stopAutoScroll } = useScrollContext();

  const { getDragProps, overIndex } = useDragSort(
    projects,
    (reordered) => setResumeData((prev) => ({ ...prev, project: reordered })),
    { collapsed, setCollapsed, getId: (item) => item.id },
    { startAutoScroll, updatePointer, stopAutoScroll }
  );

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-semibold text-foreground mb-1">Projects</h3>
        <p className="text-xs text-muted-foreground">
          Drag <GripVertical className="inline w-3 h-3" /> to reorder entries.
        </p>
      </div>

      {projects.map((proj, index) => {
        const isCollapsed = !!collapsed[proj.id];
        const isOver      = overIndex === index;
        const label       = [proj.title, proj.tech].filter(Boolean).join(" · ") || `Project #${index + 1}`;

        return (
          <div
            key={proj.id}
            {...getDragProps(index)}
            className={`rounded-xl border bg-white transition-all duration-150
              shadow-[0_2px_8px_rgba(249,115,22,0.08)] hover:shadow-[0_4px_16px_rgba(249,115,22,0.13)]
              ${isOver ? "ring-2 ring-orange-400 ring-offset-2 scale-[1.01] shadow-[0_6px_20px_rgba(249,115,22,0.18)]" : "border-orange-200"}`}
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-50 to-white rounded-t-xl border-b border-orange-100">
              <div className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-orange-100 text-stone-300 hover:text-orange-500 transition-colors flex-shrink-0" title="Drag to reorder">
                <GripVertical size={15} />
              </div>
              <span className="flex-1 text-sm font-semibold text-stone-700 truncate">{label}</span>
              <button
                onClick={(e) => { e.stopPropagation(); removeProject(proj.id); }}
                className="flex-shrink-0 p-1 rounded hover:bg-red-50 text-stone-300 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <Trash size={14} />
              </button>
              <button
                onClick={() => toggleCollapse(proj.id)}
                className="flex-shrink-0 p-1 rounded hover:bg-orange-100 text-stone-400 hover:text-orange-500 transition-colors"
                title={isCollapsed ? "Expand" : "Collapse"}
              >
                <ChevronUp size={15} className={`transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Body */}
            {!isCollapsed && (
              <div className="p-4 space-y-4">
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
                      onChange={(e) => updateProject(proj.id, "tech", e.target.value)} placeholder="React, Node.js, PostgreSQL" />
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
                    <Button size="sm" onClick={() => setAiOpenFor(proj.id)}
                      className="h-7 text-xs gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600">
                      <Sparkles className="w-3 h-3" /> AI Assistant
                    </Button>
                  </div>
                  {!proj.title && (
                    <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1 mb-2">
                      💡 Enter a Project Title to unlock AI writing
                    </p>
                  )}
                  <RichTextEditor value={proj.description} onChange={(val) => updateProject(proj.id, "description", val)} />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <Button variant="outline" onClick={addProject} className="w-full border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400">
        <Plus className="h-4 w-4" /> Add Another Project
      </Button>

      {activeProj && (
        <AIAssistModal
          isOpen={!!aiOpenFor}
          onClose={() => setAiOpenFor(null)}
          hasContent={!!activeProj.description}
          contextLabel="Project description"
          contextHint={[activeProj.title, activeProj.tech].filter(Boolean).join(" · ")}
          onGenerate={(userPrompt, mode) => handleAIGenerate(activeProj, userPrompt, mode)}
          onApply={(result) => { updateProject(activeProj.id, "description", result); setAiOpenFor(null); }}
          disabled={!activeProj.title}
          disabledHint="Enter a Project Title first to enable AI writing."
        />
      )}
    </div>
  );
};

export default ProjectStep;
