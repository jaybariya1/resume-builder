import React, { use } from "react";
import { useContext } from "react";
import { ResumeInfoContext } from "../context/ResumeInfoContext";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Plus, X, Sparkles, Trash, Wand2, Briefcase } from "lucide-react";
import RichTextEditor from "../../TextEditor";
import { useEffect } from "react";



const ProjectStep = () => {
  const { resumeData, setResumeData } = useContext(ResumeInfoContext);
    const addProject = () => {
    const newPrj = {
      id: Date.now().toString(),
      title: "",
        url: "",
        organization: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
    };
    setResumeData({
      ...resumeData,
      project: [...resumeData?.project, newPrj],
    });
  };

  useEffect(() => {
    if (!resumeData.project || resumeData.project.length === 0) {
        addProject(); // Add a default project if none exists
    }
  }, []);

  const updateProject = (id, field, value) => {
    const updatedProjects = resumeData.project.map((prj) =>
      prj.id === id ? { ...prj, [field]: value } : prj
    );
    setResumeData({ ...resumeData, project: updatedProjects });
  };
    const handleDescriptionChange = (id, newDescription) => {
    const updatedProjects = resumeData.project.map((prj) =>
      prj.id === id ? { ...prj, description: newDescription } : prj
    );
    setResumeData({ ...resumeData, project: updatedProjects });
    };
    const removeProject = (id) => {
    const updatedProjects = resumeData.project.filter(
      (prj) => prj.id !== id
    );
    setResumeData({ ...resumeData, project: updatedProjects });
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3>Project</h3>
        {/* <Button onClick={addExperience} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button> */}
      </div>

      {resumeData.project.map((prj, index) => (
        <Card key={prj.id} className="border-orange-200">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Project #{index + 1}</CardTitle>
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
                onClick={() => removeProject(prj.id)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Project Title</Label>
                <Input
                  value={prj.title}
                  className={"my-2"}
                  onChange={(e) =>
                    updateProject(prj.id, "title", e.target.value)
                  }
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <Label>Project URL</Label>
                <Input
                  value={prj.url}
                  className={"my-2"}
                  onChange={(e) =>
                    updateProject(prj.id, "url", e.target.value)
                  }
                  placeholder="Tech Corp"
                />
              </div>
              <div>
                <Label>Organization</Label>
                <Input
                  value={prj.organization}
                  className={"my-2"}
                  onChange={(e) =>
                    updateProject(prj.id, "organization", e.target.value)
                  }
                  placeholder="Open Source"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={prj.location}
                  className={"my-2"}
                  onChange={(e) =>
                    updateProject(prj.id, "location", e.target.value)
                  }
                  placeholder="San Francisco, CA"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={prj.startDate}
                  className={"my-2"}
                  onChange={(e) =>
                    updateProject(prj.id, "startDate", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={prj.endDate}
                  disabled={prj.current}
                  className={"my-2"}
                  onChange={(e) =>
                    updateProject(prj.id, "endDate", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`current-${prj.id}`}
                checked={prj.current}
                onChange={(e) =>
                  updateProject(prj.id, "current", e.target.checked)
                }
                className="cursor-pointer"
              />
              <Label htmlFor={`current-${prj.id}`} className="cursor-pointer">
                i am currently working on this project
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

              <RichTextEditor value={prj.description} onChange={(newDescription) => handleDescriptionChange(prj.id, newDescription)} />

            </div>
          </CardContent>
        </Card>
      ))}

      <button
        onClick={addProject}
        className="w-full py-3 rounded-lg border-2 border-dashed border-orange-300 text-orange-500 hover:bg-orange-50 font-medium"
      >
        + Add Another Project
      </button>

      {resumeData.project.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No projects added yet.</p>
          <Button onClick={addProject} className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Project
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProjectStep
