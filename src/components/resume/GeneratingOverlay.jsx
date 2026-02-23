import { useContext } from "react";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";

export default function GeneratingOverlay() {
  const { isGenerating } = useContext(ResumeInfoContext);

  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-sm font-medium text-gray-700">
        Generating content...
      </p>
    </div>
  );
}
