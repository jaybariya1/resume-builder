import React, { useContext, useState } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Button } from "../../ui/button";
import RichTextEditor from "../TextEditor";
import { Sparkles, RefreshCw, Lightbulb } from "lucide-react";
import { generateSummary, suggestJobTitles } from "../../../services/aiGenerator";

const SummaryStep = () => {
  const { resumeData, setResumeData, setIsGenerating } = useContext(ResumeInfoContext);
  const [isLoading, setIsLoading] = useState(false);
  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [loadingTitles, setLoadingTitles] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (name, value) => {
    setResumeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateSummary = async () => {
    setError("");
    setIsLoading(true);
    setIsGenerating(true);
    try {
      const result = await generateSummary({
        role: resumeData.role,
        firstName: resumeData.firstName,
        lastName: resumeData.lastName,
        skills: resumeData.skills,
        experience: resumeData.experience,
      });
      handleInputChange("summary", result);
    } catch (err) {
      setError("Failed to generate summary. Please try again.");
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
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
        <input type="text" value={resumeData.role || ""} onChange={(e) => handleInputChange("role", e.target.value)}
          placeholder="e.g. Senior Software Engineer"
          className="w-full px-3 py-2 text-sm rounded-lg border border-border/60 bg-background focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200 transition-all" />
        {titleSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-3 bg-orange-50 border border-orange-200 rounded-lg">
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
          <Button onClick={handleGenerateSummary} disabled={isLoading || !resumeData.role} size="sm"
            className="gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600 h-7 text-xs">
            {isLoading ? <><RefreshCw className="w-3 h-3 animate-spin" /> Generating…</> : <><Sparkles className="w-3 h-3" /> AI Generate</>}
          </Button>
        </div>
        {!resumeData.role && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2.5 py-1.5">
            💡 Enter a Job Title above to unlock AI generation
          </p>
        )}
        {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2.5 py-1.5">{error}</p>}
        <RichTextEditor value={resumeData?.summary} onChange={(content) => handleInputChange("summary", content)} />
      </div>
    </div>
  );
};

export default SummaryStep;
