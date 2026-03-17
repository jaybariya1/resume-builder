import React, { useContext, useState } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Button } from "../../ui/button";
import RichTextEditor from "../TextEditor";
import AIAssistModal from "../AIAssistModal";
import { Sparkles, RefreshCw, Lightbulb } from "lucide-react";
import { generateSummary, suggestJobTitles } from "../../../services/aiGenerator";

const SummaryStep = () => {
  const { resumeData, setResumeData, setIsGenerating } = useContext(ResumeInfoContext);
  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [loadingTitles, setLoadingTitles] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const handleInputChange = (name, value) => {
    setResumeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSuggestTitles = async () => {
    setLoadingTitles(true);
    try {
      const titles = await suggestJobTitles({
        skills: resumeData.skills,
        experience: resumeData.experience,
      });
      setTitleSuggestions(titles);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTitles(false);
    }
  };

  const handleAIGenerate = async (userPrompt, mode) => {
    setIsGenerating(true);
    try {
      const result = await generateSummary({
        role: resumeData.role,
        firstName: resumeData.firstName,
        lastName: resumeData.lastName,
        skills: resumeData.skills,
        experience: resumeData.experience,
        currentText: mode === "improve" ? resumeData.summary : "",
        userPrompt,
        mode,
      });
      return result;
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-1">Professional Summary</h3>
        <p className="text-xs text-muted-foreground">A strong summary helps recruiters instantly understand your value.</p>
      </div>

      {/* Role field with title suggestions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Job Title / Role</label>
          <Button variant="ghost" size="sm" onClick={handleSuggestTitles} disabled={loadingTitles}
            className="text-xs gap-1.5 text-orange-600 hover:text-orange-700 hover:bg-orange-50 h-7 px-2">
            {loadingTitles ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Lightbulb className="w-3 h-3" />}
            Suggest titles
          </Button>
        </div>
        <input
          type="text"
          value={resumeData.role || ""}
          onChange={(e) => handleInputChange("role", e.target.value)}
          placeholder="e.g. Senior Software Engineer"
          className="w-full px-3 py-2 text-sm rounded-[var(--radius)] border border-[#fde3c8] bg-white focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all"
        />
        {titleSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-3 bg-[#fff7ed] border border-[#fde3c8] rounded-[var(--radius)]">
            <p className="w-full text-xs font-medium text-orange-700 mb-1">Click a title to apply:</p>
            {titleSuggestions.map((title) => (
              <button key={title} onClick={() => { handleInputChange("role", title); setTitleSuggestions([]); }}
                className="text-xs px-2.5 py-1 rounded-full bg-white border border-orange-200 text-orange-700 hover:bg-orange-100 transition-all">
                {title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Summary editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Summary</label>
          <Button
            onClick={() => setAiOpen(true)}
            size="sm"
            className="gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600 h-7 text-xs"
          >
            <Sparkles className="w-3 h-3" />
            AI Assistant
          </Button>
        </div>
        <RichTextEditor
          value={resumeData?.summary}
          onChange={(content) => handleInputChange("summary", content)}
        />
      </div>

      <AIAssistModal
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        hasContent={!!resumeData.summary}
        contextLabel="Summary"
        contextHint={resumeData.role ? `For: ${resumeData.role}` : ""}
        onGenerate={handleAIGenerate}
        onApply={(result) => handleInputChange("summary", result)}
        disabled={!resumeData.role}
        disabledHint="Enter a Job Title / Role above first to enable AI generation."
      />
    </div>
  );
};

export default SummaryStep;
