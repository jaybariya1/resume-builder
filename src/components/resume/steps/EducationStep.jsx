import React, { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Plus, Trash, GraduationCap, GripVertical, Sparkles, ChevronUp } from "lucide-react";
import RichTextEditor from "../TextEditor";
import { generateContent } from "../../../services/aiGenerator";
import { useDragSort } from "../../../hooks/useDragSort";
import { useScrollContext } from "../../../context/ScrollContext";

const EducationStep = () => {
  const { resumeData, setResumeData, setIsGenerating } = useContext(ResumeInfoContext);
  const [collapsed, setCollapsed] = useState({});

  const addEducation = () => {
    const newId = Date.now().toString();
    setResumeData((prev) => ({
      ...prev,
      education: [...(prev.education || []), {
        id: newId, degree: "", school: "", location: "", graduationDate: "", gpa: "", description: "",
      }],
    }));
    setCollapsed(prev => ({ ...prev, [newId]: false }));
  };

  useEffect(() => {
    if (!resumeData.education || resumeData.education.length === 0) addEducation();
  }, []);

  const updateEducation = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => edu.id === id ? { ...edu, [field]: value } : edu),
    }));
  };

  const removeEducation = (id) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
    setCollapsed(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const toggleCollapse = (id) =>
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));

  const handleGenerate = async (id, type, input) => {
    try {
      setIsGenerating(true);
      const content = await generateContent({ type, input });
      updateEducation(id, "description", content);
    } finally {
      setIsGenerating(false);
    }
  };

  const education = resumeData.education || [];

  const { startAutoScroll, updatePointer, stopAutoScroll } = useScrollContext();

  const { getDragProps, overIndex } = useDragSort(
    education,
    (reordered) => setResumeData((prev) => ({ ...prev, education: reordered })),
    { collapsed, setCollapsed, getId: (item) => item.id },
    { startAutoScroll, updatePointer, stopAutoScroll }
  );

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-semibold text-foreground mb-1">Education</h3>
        <p className="text-xs text-muted-foreground">
          Drag <GripVertical className="inline w-3 h-3" /> to reorder entries.
        </p>
      </div>

      {education.map((edu, index) => {
        const isCollapsed = !!collapsed[edu.id];
        const isOver      = overIndex === index;
        const label       = [edu.degree, edu.school].filter(Boolean).join(" · ") || `Education #${index + 1}`;

        return (
          <div
            key={edu.id}
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
                onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}
                className="flex-shrink-0 p-1 rounded hover:bg-red-50 text-stone-300 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <Trash size={14} />
              </button>
              <button
                onClick={() => toggleCollapse(edu.id)}
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
                    <Label className="text-xs">Degree</Label>
                    <Input value={edu.degree} className="mt-1 h-9 text-sm"
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      placeholder="Bachelor of Science in Computer Science" />
                  </div>
                  <div>
                    <Label className="text-xs">School</Label>
                    <Input value={edu.school} className="mt-1 h-9 text-sm"
                      onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                      placeholder="University of Technology" />
                  </div>
                  <div>
                    <Label className="text-xs">Location</Label>
                    <Input value={edu.location} className="mt-1 h-9 text-sm"
                      onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                      placeholder="Boston, MA" />
                  </div>
                  <div>
                    <Label className="text-xs">Graduation Date</Label>
                    <Input type="month" value={edu.graduationDate} className="mt-1 h-9 text-sm"
                      onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs">Description</Label>
                    <Button
                      onClick={() => handleGenerate(edu.id, "description", { role: resumeData.role, education: resumeData.education })}
                      size="sm"
                      className="h-7 text-xs gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600"
                    >
                      <Sparkles className="w-3 h-3" /> AI Optimize
                    </Button>
                  </div>
                  <RichTextEditor value={edu.description} onChange={(val) => updateEducation(edu.id, "description", val)} />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <Button variant="outline" onClick={addEducation} className="w-full border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400">
        <Plus className="h-4 w-4" /> Add Another Education
      </Button>

      {education.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No education added yet.</p>
        </div>
      )}
    </div>
  );
};

export default EducationStep;
