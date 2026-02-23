import { useContext } from "react";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";
import { Sparkles } from "lucide-react";

export default function GeneratingOverlay() {
  const { isGenerating } = useContext(ResumeInfoContext);
  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
      <div className="bg-card rounded-2xl border border-orange-200 shadow-2xl p-8 flex flex-col items-center gap-4 max-w-xs mx-4">
        {/* Animated icon */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-orange-600 animate-pulse" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-orange-300 border-t-orange-600 animate-spin" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">AI is writing…</p>
          <p className="text-sm text-muted-foreground mt-1">Crafting professional content for you</p>
        </div>
        {/* Animated dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-orange-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
