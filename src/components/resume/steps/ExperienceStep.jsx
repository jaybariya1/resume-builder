import React, { use, useEffect } from "react";
import { useContext } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Plus, X, Sparkles, Trash, Wand2, Briefcase } from "lucide-react";

const ExperienceStep = () => {
  const { resumeData, setResumeData } = useContext(ResumeInfoContext);
  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setResumeData({
      ...resumeData,
      experience: [...resumeData?.experience, newExp],
    });
  };

  useEffect(() => {
    if (!resumeData.experience || resumeData.experience.length === 0) {
      addExperience(); // Add a default experience if none exists
    }
  }, []);

  const updateExperience = (id, field, value) => {
    const updatedExperience = resumeData.experience.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setResumeData({ ...resumeData, experience: updatedExperience });
  };

  const handleDescriptionChange = (id, newDescription) => {
    const updatedExperience = resumeData.experience.map((exp) =>
      exp.id === id ? { ...exp, description: newDescription } : exp
    );
    setResumeData({ ...resumeData, experience: updatedExperience });
  }

  const removeExperience = (id) => {
    const updatedExperience = resumeData.experience.filter(
      (exp) => exp.id !== id
    );
    setResumeData({ ...resumeData, experience: updatedExperience });
  };
  // if (!resumeData) return null;

  // // Ensure experience is always an array
  // if (!Array.isArray(resumeData.experience)) {
  //   resumeData.experience = [];
  // }
  // if (resumeData.experience.length === 0) {
  //   addExperience(); // Add a default experience if none exists
  // }
  // if (!resumeData.experience) {
  //   resumeData.experience = [];
  // }

  const editorRefs = React.useRef({});
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [currentEditingId, setCurrentEditingId] = React.useState(null);
  

  // React.useEffect(() => {
  //   // Initialize editor content when component mounts or description changes
  //   resumeData.experience.forEach((exp) => {
  //     const editor = editorRefs.current[exp.id];
  //     if (editor && editor.innerHTML !== exp.description) {
  //       editor.innerHTML = exp.description;
  //     }
  //   });
  // }, [resumeData.experience]);

  // const handleChange = (html) => {
  //   const editor = editorRefs.current[exp.id];
  //     if (editor && editor.innerHTML !== exp.description) {
  //       editor.innerHTML = exp.description;
  //     }
  // };

  const improveDescription = async (id, currentText) => {
    setIsGenerating(true);
    setCurrentEditingId(id);
    try {
      // TODO: Call your AI function here to improve the text
      // Example: const improvedText = await improveTextWithAI(currentText);
      console.log("AI improvement feature coming soon");
    } catch (error) {
      console.error("Error improving description:", error);
    }
    setIsGenerating(false);
    setCurrentEditingId(null);
  };
  const experiences = resumeData.experience || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3>Work Experience</h3>
        {/* <Button onClick={addExperience} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button> */}
      </div>

      {resumeData.experience.map((exp, index) => (
        <Card key={exp.id} className="border-orange-200">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Experience #{index + 1}</CardTitle>
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(exp.id)}
                className="text-red-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </Button> */}
              <Trash
                size={18}
                className="cursor-pointer text-gray-500 hover:text-primary"
                onClick={() => removeExperience(exp.id)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Job Title</Label>
                <Input
                  value={exp.title}
                  className={"my-2"}
                  onChange={(e) =>
                    updateExperience(exp.id, "title", e.target.value)
                  }
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={exp.company}
                  className={"my-2"}
                  onChange={(e) =>
                    updateExperience(exp.id, "company", e.target.value)
                  }
                  placeholder="Tech Corp"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={exp.location}
                  className={"my-2"}
                  onChange={(e) =>
                    updateExperience(exp.id, "location", e.target.value)
                  }
                  placeholder="San Francisco, CA"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={exp.startDate}
                  className={"my-2"}
                  onChange={(e) =>
                    updateExperience(exp.id, "startDate", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={exp.endDate}
                  disabled={exp.current}
                  className={"my-2"}
                  onChange={(e) =>
                    updateExperience(exp.id, "endDate", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`current-${exp.id}`}
                checked={exp.current}
                onChange={(e) =>
                  updateExperience(exp.id, "current", e.target.checked)
                }
                className="cursor-pointer"
              />
              <Label htmlFor={`current-${exp.id}`} className="cursor-pointer">
                Currently working here
              </Label>
            </div>
            <div>
              <div className="flex justify-between my-2">

              <Label >Description</Label>
              <Button
                variant="outline"
                size="sm"
                className=" bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600"
                >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Optimize
              </Button>
                </div>
              {/* <Textarea
                value={exp.description}
                className={"my-2"}
                onChange={(e) =>
                  updateExperience(exp.id, "description", e.target.value)
                }
                placeholder="Describe your responsibilities and achievements..."
                rows={3}
              /> */}

              <RichTextEditor value={exp.description} onChange={(newDescription) => handleDescriptionChange(exp.id, newDescription)} />

            </div>
          </CardContent>
        </Card>
      ))}

      <button
        onClick={addExperience}
        className="w-full py-3 rounded-lg border-2 border-dashed border-orange-300 text-orange-500 hover:bg-orange-50 font-medium"
      >
        + Add Another Experience
      </button>

      {resumeData.experience.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No work experience added yet.</p>
          <Button onClick={addExperience} className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Experience
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExperienceStep;
