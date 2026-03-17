import React, { useState, useEffect, useRef } from "react";
import { Sparkles, RefreshCw, Wand2, X, ChevronRight, Check, Lightbulb } from "lucide-react";
import { Button } from "../ui/button";

/**
 * AIAssistModal
 *
 * Props:
 *  - isOpen        boolean
 *  - onClose       () => void
 *  - hasContent    boolean  – whether the field already has content (shows Improve option)
 *  - contextLabel  string   – e.g. "Summary", "Experience", "Project"
 *  - contextHint   string   – subtitle shown in prompt modal e.g. "Software Engineer at Acme"
 *  - onGenerate    (prompt, mode) => Promise<string>   mode = "generate" | "improve"
 *  - onApply       (result) => void
 *  - disabled      boolean  – e.g. required field missing
 *  - disabledHint  string   – message shown when disabled
 */
export default function AIAssistModal({
  isOpen,
  onClose,
  hasContent,
  contextLabel = "content",
  contextHint = "",
  onGenerate,
  onApply,
  disabled = false,
  disabledHint = "",
}) {
  // "prompt" | "loading" | "result"
  const [phase, setPhase] = useState("prompt");
  const [mode, setMode] = useState("generate"); // "generate" | "improve"
  const [userPrompt, setUserPrompt] = useState("");
  const [result, setResult] = useState("");
  const [refinePrompt, setRefinePrompt] = useState("");
  const [error, setError] = useState("");
  const promptRef = useRef(null);
  const refineRef = useRef(null);

  // Reset every time modal opens
  useEffect(() => {
    if (isOpen) {
      setPhase("prompt");
      setMode("generate");
      setUserPrompt("");
      setResult("");
      setRefinePrompt("");
      setError("");
      setTimeout(() => promptRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Focus refine input when result phase starts
  useEffect(() => {
    if (phase === "result") {
      setTimeout(() => refineRef.current?.focus(), 80);
    }
  }, [phase]);

  if (!isOpen) return null;

  const runGeneration = async (currentMode, extraPrompt) => {
    setError("");
    setPhase("loading");
    try {
      const combined = [userPrompt, extraPrompt].filter(Boolean).join(". ");
      const generated = await onGenerate(combined, currentMode);
      setResult(generated || "");
      setPhase("result");
    } catch (err) {
      setError(err.message || "Generation failed. Please try again.");
      setPhase("prompt");
    }
  };

  const handleGenerate = () => runGeneration("generate", "");
  const handleImprove = () => { setMode("improve"); runGeneration("improve", ""); };
  const handleRegenerate = () => runGeneration(mode, refinePrompt);

  const handleApply = () => {
    onApply(result);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };

  // ── OVERLAY ──────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-orange-500 to-red-500">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">AI Assistant</p>
              {contextHint && (
                <p className="text-white/70 text-[11px] leading-tight truncate max-w-[260px]">{contextHint}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
          >
            <X size={14} className="text-white" />
          </button>
        </div>

        {/* ── PHASE: LOADING ── */}
        {phase === "loading" && (
          <div className="px-5 py-10 flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
              <RefreshCw size={22} className="text-orange-500 animate-spin" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-stone-800 text-sm">
                {mode === "improve" ? "Improving your content…" : "Generating content…"}
              </p>
              <p className="text-xs text-stone-400 mt-1">This usually takes a few seconds</p>
            </div>
          </div>
        )}

        {/* ── PHASE: PROMPT ── */}
        {phase === "prompt" && (
          <div className="px-5 py-5 space-y-4">
            {/* Disabled hint */}
            {disabled && disabledHint && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                <Lightbulb size={13} className="mt-0.5 flex-shrink-0" />
                {disabledHint}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
                Describe your thoughts <span className="font-normal text-stone-400 normal-case tracking-normal">(optional)</span>
              </label>
              <textarea
                ref={promptRef}
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                disabled={disabled}
                placeholder={`e.g. "Focus on leadership skills and highlight 3 years in fintech…"`}
                rows={3}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#fde3c8] bg-[#fff7ed] placeholder:text-stone-400 focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}

            {/* Action buttons */}
            <div className={`flex gap-2 ${hasContent ? "flex-col sm:flex-row" : ""}`}>
              {hasContent ? (
                <>
                  <Button
                    onClick={handleGenerate}
                    disabled={disabled}
                    className="flex-1 gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600 h-9 text-sm"
                  >
                    <Sparkles size={14} />
                    Generate new
                  </Button>
                  <Button
                    onClick={handleImprove}
                    disabled={disabled}
                    variant="outline"
                    className="flex-1 gap-2 border-orange-300 text-orange-600 hover:bg-orange-50 h-9 text-sm"
                  >
                    <Wand2 size={14} />
                    Improve existing
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleGenerate}
                  disabled={disabled}
                  className="w-full gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600 h-10 text-sm font-semibold"
                >
                  <Sparkles size={15} />
                  Generate with AI
                  <ChevronRight size={14} className="ml-auto" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ── PHASE: RESULT ── */}
        {phase === "result" && (
          <div className="px-5 py-5 space-y-4">
            {/* Generated content preview */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Generated {contextLabel}</label>
              <div
                className="text-sm text-stone-700 leading-relaxed bg-[#fff7ed] border border-[#fde3c8] rounded-xl px-4 py-3 max-h-52 overflow-y-auto preview"
                dangerouslySetInnerHTML={{ __html: result }}
              />
            </div>

            {/* Refine input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
                Refine further <span className="font-normal text-stone-400 normal-case tracking-normal">(optional)</span>
              </label>
              <textarea
                ref={refineRef}
                value={refinePrompt}
                onChange={(e) => setRefinePrompt(e.target.value)}
                placeholder={`e.g. "Make it more concise" or "Add metrics and numbers…"`}
                rows={2}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#fde3c8] bg-[#fff7ed] placeholder:text-stone-400 focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 resize-none transition-all"
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleRegenerate(); } }}
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleRegenerate}
                variant="outline"
                className="flex-1 gap-2 border-orange-300 text-orange-600 hover:bg-orange-50 h-9 text-sm"
              >
                <RefreshCw size={13} />
                Regenerate
              </Button>
              <Button
                onClick={handleApply}
                className="flex-1 gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600 h-9 text-sm font-semibold"
              >
                <Check size={14} />
                Apply
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
