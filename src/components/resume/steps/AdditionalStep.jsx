import React from 'react'
import { Button } from "../../ui/button";
import { Plus,FolderGit2 } from "lucide-react";

const AdditionalStep = ({ currentStep, setCurrentStep, steps,setSteps }) => {
    // const addStep = (name,logo) => {
    //     steps[currentStep+1]=({ id: currentStep+1, title: "Additional Sections" , icon: logo});
    //     steps[currentStep].title = name;
    //     steps[currentStep].icon = logo;
    //     setCurrentStep(steps.length - 2);
    // }
    const addStep = (name, logo) => {
  setSteps(prev => {
    const updated = [...prev];

    if (updated.some(step => step.title === name)) {
      return updated; // Step already exists, do not add
    }

    updated[currentStep] = {
      ...updated[currentStep],
      title: name,
      icon: logo,
    };

    updated.splice(currentStep + 1, 0, {
      id: currentStep + 1,
      title: "Additional Sections",
      icon: logo,
    });

    return updated;
  });

  setCurrentStep(steps.length - 1);
};
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p>Here’s description that you can add or skip without it</p>
      </div>
        <div>
            <div className="">
                <Button variant={"ghost"} onClick={() => addStep("Project", FolderGit2)} disabled={steps.some(step => step.title === "Project")}>Project</Button>
            </div>
        </div>
    </div>
  )
}

export default AdditionalStep
