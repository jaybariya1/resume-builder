import React, { use } from "react";
import { useContext } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Plus, X, Trash, GraduationCap } from "lucide-react";
import RichTextEditor from "../TextEditor";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import { generateContent } from "../../../services/aiGenerator";


const EducationStep = () => {
  const { resumeData } = useContext(ResumeInfoContext);
  const { setResumeData } = useContext(ResumeInfoContext);
  const { setIsGenerating } = useContext(ResumeInfoContext);
  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      degree: "",
      school: "",
      location: "",
      graduationDate: "",
      gpa: "",
    };
    setResumeData({
      ...resumeData,
      education: [...resumeData?.education, newEdu],
    });
  };

  useEffect(() => {
    if (!resumeData) return null;
    if (!Array.isArray(resumeData.education)) {
      resumeData.education = [];
    }
    if (resumeData.education.length === 0) {
      addEducation(); // Add a default education if none exists
    }
  }, []);

  // if (!resumeData) return null;
  // if (!Array.isArray(resumeData.education)) {
  //   resumeData.education = [];
  // }
  // if (resumeData.education.length === 0) {
  //   addEducation(); // Add a default education if none exists
  // }
  // if (!resumeData.education) {
  //   resumeData.education = [];
  // }

  const updateEducation = (id, field, value) => {
    setResumeData({
      ...resumeData,
      education: resumeData?.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };
  const removeEducation = (id) => {
    setResumeData({
      ...resumeData,
      education: resumeData?.education.filter((edu) => edu.id !== id),
    });
  };

  const handleDescriptionChange = (id, newDescription) => {
    const updatedEducation = resumeData.education.map((edu) =>
      edu.id === id ? { ...edu, description: newDescription } : edu
    );
    setResumeData({ ...resumeData, education: updatedEducation });
  };

  const handleGenerate = async (id, type, input) => {
      try {
        setIsGenerating(true);
        console.log("Generating content for type:", type, "with input:", input);
  
        const content = await generateContent({ type, input });
        console.log(typeof content, content);
        console.log(content);
  
        
        handleDescriptionChange(id, content);
      } finally {
        setIsGenerating(false);
      }
    };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3>Education</h3>
        {/* <Button onClick={addEducation} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button> */}
      </div>

      {resumeData.education.map((edu, index) => (
        <Card key={edu.id} className="border-orange-200">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Education #{index + 1}</CardTitle>
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="text-red-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </Button> */}
              <Trash
                size={18}
                className="cursor-pointer text-gray-500 hover:text-primary"
                onClick={() => removeEducation(edu.id)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Degree</Label>
                <Input
                  value={edu.degree}
                  className={"my-2"}
                  onChange={(e) =>
                    updateEducation(edu.id, "degree", e.target.value)
                  }
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>
              <div>
                <Label>School</Label>
                <Input
                  value={edu.school}
                  className={"my-2"}
                  onChange={(e) =>
                    updateEducation(edu.id, "school", e.target.value)
                  }
                  placeholder="University of Technology"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={edu.location}
                  className={"my-2"}
                  onChange={(e) =>
                    updateEducation(edu.id, "location", e.target.value)
                  }
                  placeholder="Boston, MA"
                />
              </div>
              <div>
                <Label>Graduation Date</Label>
                <Input
                  type="month"
                  value={edu.graduationDate}
                  className={"my-2"}
                  onChange={(e) =>
                    updateEducation(edu.id, "graduationDate", e.target.value)
                  }
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between my-2">
                <Label>Description</Label>
                <Button
                  onClick={() =>
                    handleGenerate(edu.id, "description", {
                      role: resumeData.role,
                      education: resumeData.education,
                    })
                  }
                  variant="outline"
                  size="sm"
                  className=" bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Optimize
                </Button>
              </div>

              <RichTextEditor
                value={edu.description}
                onChange={(newDescription) =>
                  handleDescriptionChange(edu.id, newDescription)
                }
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <button
        onClick={addEducation}
        className="w-full py-3 rounded-lg border-2 border-dashed border-orange-300 text-orange-500 hover:bg-orange-50 font-medium"
      >
        + Add Another Education
      </button>

      {resumeData.education.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No education added yet.</p>
          <Button onClick={addEducation} className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Your Education
          </Button>
        </div>
      )}
    </div>
  );
};

export default EducationStep;
