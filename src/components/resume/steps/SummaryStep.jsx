import React, { useContext } from "react";
import { ResumeInfoContext } from "../context/ResumeInfoContext";
import { Button } from "../../ui/button";
import RichTextEditor from "../../TextEditor";
import { Sparkles } from "lucide-react";
import { generateContent } from "../../aiGenerator";

// import { content } from "html2canvas/dist/types/css/property-descriptors/content";

// import { generateText } from '../lib/aiService';

const SummaryStep = () => {
  const { resumeData, setResumeData } = useContext(ResumeInfoContext);
  const { setIsGenerating } = useContext(ResumeInfoContext);

  //   const generateSummary = async () => {
  //   try {
  //     setIsGenerating(true);

  //     const result = await generateAIContent(); // API call

  //     setResumeData((prev) => ({
  //       ...prev,
  //       summary: result,
  //     }));
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async (type, input) => {
    try {
      setIsGenerating(true);
      console.log("Generating content for type:", type, "with input:", input);

      const content = await generateContent({ type, input });
      console.log(typeof content, content);
      console.log(content);

      // setResumeData((prev) => ({
      //   ...prev,
      //   summary: content,
      // }));
      handleInputChange({ target: { name: "summary", value: content } });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3>Summary</h3>
      </div>
      <Button
        onClick={() => handleGenerate("summary", {
          role: resumeData.role,
          firstName: resumeData.firstName,
          lastName: resumeData.lastName,
          experience: resumeData.experience,
          skills: resumeData.skills,
        })}
        variant="outline"
        size="sm"
        className="mt-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        AI Enhance
      </Button>
      {/* <Textarea
          name="summary"
          value={resumeData?.summary}
          onChange={handleInputChange}
          placeholder="Write a brief professional summary..."
          rows={4}
        /> */}
        
      <RichTextEditor
        value={resumeData?.summary}
        onChange={(content) =>
          handleInputChange({ target: { name: "summary", value: content } })
        }
      />
    </div>
  );
};

export default SummaryStep;
