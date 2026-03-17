import React, { useState, useContext, useEffect } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card, CardContent } from "../../ui/card";
import { Trash, Plus, Sparkles, RefreshCw, GripVertical, ChevronUp } from "lucide-react";
import { suggestSkills } from "../../../services/aiGenerator";
import { useDragSort } from "../../../hooks/useDragSort";
import { useScrollContext } from "../../../context/ScrollContext";

const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];
const levelColors     = ["bg-blue-400", "bg-yellow-400", "bg-orange-400", "bg-green-500"];
const levelTextColors = ["text-blue-600", "text-yellow-600", "text-orange-600", "text-green-700"];

const SkillLevelBar = ({ skillId, currentLevel, onChange }) => {
  const [hovered, setHovered] = useState(null);
  const displayLevel = hovered !== null ? hovered : currentLevel;
  return (
    <div className="mt-2.5">
      <p className="text-xs text-muted-foreground mb-1.5">
        Level: <span className={`font-semibold ${levelTextColors[displayLevel]}`}>{levels[displayLevel]}</span>
      </p>
      <div className="flex gap-1.5">
        {levels.map((label, i) => (
          <button key={i} type="button"
            onClick={() => onChange(skillId, i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            title={label}
            className={`flex-1 h-5 rounded transition-all duration-150 border ${
              i <= displayLevel ? `${levelColors[i]} border-transparent` : "bg-gray-100 border-gray-200 hover:bg-gray-200"
            } ${i === currentLevel && hovered === null ? "ring-2 ring-offset-1 ring-orange-400" : ""}`}
          />
        ))}
      </div>
      <div className="flex mt-1">
        {levels.map((label, i) => (
          <p key={i} className={`flex-1 text-center text-[9px] transition-colors ${
            i === displayLevel ? levelTextColors[i] + " font-semibold" : "text-gray-400"
          }`}>{label}</p>
        ))}
      </div>
    </div>
  );
};

const SkillsStep = () => {
  const { resumeData, setResumeData } = useContext(ResumeInfoContext);
  const hideLevel = resumeData.hideSkillLevel ?? false;
  const setHideLevel = (val) =>
    setResumeData((prev) => ({ ...prev, hideSkillLevel: typeof val === "function" ? val(prev.hideSkillLevel ?? false) : val }));

  const [suggestedSkills,    setSuggestedSkills]    = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [collapsed,          setCollapsed]          = useState({});

  useEffect(() => {
    if (!resumeData.skills || resumeData.skills.length === 0) {
      const newId = Date.now().toString();
      setResumeData((prev) => ({ ...prev, skills: [{ id: newId, name: "", level: 2 }] }));
    }
  }, []);

  const addSkill = (name = "") => {
    const newId = Date.now().toString();
    setResumeData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), { id: newId, name, level: 2 }],
    }));
    setCollapsed(prev => ({ ...prev, [newId]: false }));
  };

  const removeSkill = (id) => {
    setResumeData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== id) }));
    setCollapsed(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const updateSkillName  = (id, value) =>
    setResumeData((prev) => ({ ...prev, skills: prev.skills.map((s) => s.id === id ? { ...s, name: value } : s) }));
  const updateSkillLevel = (id, level) =>
    setResumeData((prev) => ({ ...prev, skills: prev.skills.map((s) => s.id === id ? { ...s, level } : s) }));

  const toggleCollapse = (id) =>
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));

  const handleSuggestSkills = async () => {
    setLoadingSuggestions(true);
    try {
      const suggestions = await suggestSkills({ role: resumeData.role, skills: resumeData.skills, experience: resumeData.experience });
      const existing = new Set((resumeData.skills || []).map((s) => s.name.toLowerCase()));
      setSuggestedSkills(suggestions.filter((s) => !existing.has(s.toLowerCase())));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const addSuggestedSkill = (skillName) => {
    addSkill(skillName);
    setSuggestedSkills((prev) => prev.filter((s) => s !== skillName));
  };

  const skills = resumeData.skills || [];

  const { startAutoScroll, updatePointer, stopAutoScroll } = useScrollContext();

  const { getDragProps, overIndex } = useDragSort(
    skills,
    (reordered) => setResumeData((prev) => ({ ...prev, skills: reordered })),
    { collapsed, setCollapsed, getId: (item) => item.id },
    { startAutoScroll, updatePointer, stopAutoScroll }
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground mb-1">Skills</h3>
        <p className="text-xs text-muted-foreground">
          Add your skills. Drag <GripVertical className="inline w-3 h-3" /> to reorder.
        </p>
      </div>

      {/* Toggle level visibility */}
      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={hideLevel} onChange={() => setHideLevel((v) => !v)} className="sr-only peer" />
          <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-orange-500 transition-colors" />
          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
        </label>
        <span className="text-sm font-medium text-foreground">Hide skill levels</span>
      </div>

      {/* AI Skill Suggestions */}
      <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-foreground">AI Skill Suggestions</p>
            <p className="text-xs text-muted-foreground">Get skill recommendations for your role</p>
          </div>
          <Button onClick={handleSuggestSkills} disabled={loadingSuggestions || !resumeData.role}
            size="sm" className="gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600 h-8 text-xs">
            {loadingSuggestions ? <><RefreshCw className="w-3 h-3 animate-spin" /> Loading…</> : <><Sparkles className="w-3 h-3" /> Suggest Skills</>}
          </Button>
        </div>
        {!resumeData.role && <p className="text-xs text-amber-600">💡 Enter a Job Title in the Summary step first</p>}
        {suggestedSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {suggestedSkills.map((skill) => (
              <button key={skill} onClick={() => addSuggestedSkill(skill)}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white border border-orange-300 text-orange-700 hover:bg-orange-100 transition-all">
                <Plus className="w-2.5 h-2.5" /> {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Skills list */}
      <div className="space-y-2">
        {skills.map((skill, index) => {
          const isCollapsed = !!collapsed[skill.id];
          const isOver      = overIndex === index;
          const showLevel   = !hideLevel;

          return (
            <div
              key={skill.id}
              {...getDragProps(index)}
              className={`rounded-xl border bg-white transition-all duration-150
                shadow-[0_2px_8px_rgba(249,115,22,0.08)] hover:shadow-[0_4px_16px_rgba(249,115,22,0.13)]
                ${isOver ? "ring-2 ring-orange-400 ring-offset-2 scale-[1.01] shadow-[0_6px_20px_rgba(249,115,22,0.18)]" : "border-orange-100"}`}
            >
              {/* Header row — always visible */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-orange-50 to-white rounded-t-xl"
                style={{ borderBottom: (!isCollapsed && showLevel) ? "1px solid #fed7aa" : "none", borderRadius: isCollapsed || !showLevel ? "0.75rem" : "0.75rem 0.75rem 0 0" }}>
                <div className="cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-orange-100 text-stone-300 hover:text-orange-500 transition-colors flex-shrink-0" title="Drag to reorder">
                  <GripVertical size={14} />
                </div>
                <span className="text-xs font-medium text-muted-foreground w-5 flex-shrink-0">{index + 1}.</span>
                <Input
                  value={skill.name}
                  onChange={(e) => updateSkillName(skill.id, e.target.value)}
                  placeholder="e.g. React, Python, Leadership"
                  className="flex-1 h-8 text-sm border-transparent bg-transparent focus:bg-white focus:border-orange-300 transition-all"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); removeSkill(skill.id); }}
                  className="flex-shrink-0 p-0.5 rounded hover:bg-red-50 text-stone-300 hover:text-red-500 transition-colors"
                  title="Remove skill"
                >
                  <Trash size={13} />
                </button>
                {showLevel && (
                  <button
                    onClick={() => toggleCollapse(skill.id)}
                    className="flex-shrink-0 p-0.5 rounded hover:bg-orange-100 text-stone-400 hover:text-orange-500 transition-colors"
                    title={isCollapsed ? "Show level" : "Hide level"}
                  >
                    <ChevronUp size={14} className={`transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>

              {/* Level bar — collapsible */}
              {showLevel && !isCollapsed && (
                <div className="px-4 pb-3 pt-2">
                  <SkillLevelBar skillId={skill.id} currentLevel={skill.level ?? 2} onChange={updateSkillLevel} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button variant="outline" onClick={() => addSkill()} className="w-full border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400">
        <Plus className="h-4 w-4" /> Add Another Skill
      </Button>
    </div>
  );
};

export default SkillsStep;
