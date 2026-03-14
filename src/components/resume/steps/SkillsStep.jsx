import React, { useState, useContext, useEffect } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card, CardContent } from "../../ui/card";
import { Trash, Plus, Sparkles, RefreshCw } from "lucide-react";
import { suggestSkills } from "../../../services/aiGenerator";

const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];

const levelColors = [
  "bg-blue-400",
  "bg-yellow-400",
  "bg-orange-400",
  "bg-green-500",
];

const levelTextColors = [
  "text-blue-600",
  "text-yellow-600",
  "text-orange-600",
  "text-green-700",
];

const SkillLevelBar = ({ skillId, currentLevel, onChange }) => {
  const [hovered, setHovered] = useState(null);
  const displayLevel = hovered !== null ? hovered : currentLevel;

  return (
    <div className="ml-7 mt-2">
      <p className="text-xs text-muted-foreground mb-1.5">
        Level:{" "}
        <span className={`font-semibold ${levelTextColors[displayLevel]}`}>
          {levels[displayLevel]}
        </span>
      </p>
      <div className="flex gap-1.5">
        {levels.map((label, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(skillId, i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            title={label}
            className={`
              flex-1 h-5 rounded transition-all duration-150 border
              ${i <= displayLevel
                ? `${levelColors[i]} border-transparent`
                : "bg-gray-100 border-gray-200 hover:bg-gray-200"
              }
              ${i === currentLevel && hovered === null ? "ring-2 ring-offset-1 ring-orange-400" : ""}
            `}
          />
        ))}
      </div>
      <div className="flex mt-1">
        {levels.map((label, i) => (
          <p
            key={i}
            className={`flex-1 text-center text-[9px] transition-colors ${
              i === displayLevel ? levelTextColors[i] + " font-semibold" : "text-gray-400"
            }`}
          >
            {label}
          </p>
        ))}
      </div>
    </div>
  );
};

const SkillsStep = () => {
  const { resumeData, setResumeData } = useContext(ResumeInfoContext);
  const hideLevel = resumeData.hideSkillLevel ?? false;
  const setHideLevel = (val) => setResumeData((prev) => ({ ...prev, hideSkillLevel: typeof val === 'function' ? val(prev.hideSkillLevel ?? false) : val }));
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (!resumeData.skills || resumeData.skills.length === 0) {
      setResumeData((prev) => ({
        ...prev,
        skills: [{ id: Date.now().toString(), name: "", level: 2 }],
      }));
    }
  }, []);

  const addSkill = (name = "") => {
    setResumeData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), { id: Date.now().toString(), name, level: 2 }],
    }));
  };

  const removeSkill = (id) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  const updateSkillName = (id, value) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, name: value } : s)),
    }));
  };

  const updateSkillLevel = (id, level) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, level } : s)),
    }));
  };

  const handleSuggestSkills = async () => {
    setLoadingSuggestions(true);
    try {
      const suggestions = await suggestSkills({
        role: resumeData.role,
        skills: resumeData.skills,
        experience: resumeData.experience,
      });
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-1">Skills</h3>
        <p className="text-xs text-muted-foreground">
          Add your skills. Use AI to get suggestions tailored to your role.
        </p>
      </div>

      {/* Toggle level visibility */}
      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={hideLevel}
            onChange={() => setHideLevel((v) => !v)}
            className="sr-only peer"
          />
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
          <Button
            onClick={handleSuggestSkills}
            disabled={loadingSuggestions || !resumeData.role}
            size="sm"
            className="gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600 h-8 text-xs"
          >
            {loadingSuggestions ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" /> Loading…
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" /> Suggest Skills
              </>
            )}
          </Button>
        </div>

        {!resumeData.role && (
          <p className="text-xs text-amber-600">💡 Enter a Job Title in the Summary step first</p>
        )}

        {suggestedSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {suggestedSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => addSuggestedSkill(skill)}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white border border-orange-300 text-orange-700 hover:bg-orange-100 transition-all"
              >
                <Plus className="w-2.5 h-2.5" /> {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Skills list */}
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <Card key={skill.id} className="border-orange-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground w-4">{index + 1}.</span>
                <Input
                  value={skill.name}
                  onChange={(e) => updateSkillName(skill.id, e.target.value)}
                  placeholder="e.g. React, Python, Leadership"
                  className="flex-1 h-8 text-sm"
                />
                <Button variant="ghost" size="icon-sm" onClick={() => removeSkill(skill.id)} title="Remove skill" className="text-muted-foreground hover:text-red-500 hover:bg-red-50 flex-shrink-0 h-6 w-6">
                  <Trash size={13} />
                </Button>
              </div>

              {!hideLevel && (
                <SkillLevelBar
                  skillId={skill.id}
                  currentLevel={skill.level ?? 2}
                  onChange={updateSkillLevel}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={() => addSkill()} className="w-full border-dashed">
        <Plus className="h-4 w-4" /> Add Another Skill
      </Button>
    </div>
  );
};

export default SkillsStep;
