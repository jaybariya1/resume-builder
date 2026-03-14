import React from "react";
import { TEMPLATES } from './templates';
import { useContext } from "react";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";

const ResumePreview = ({ selectedId = "modern", accentColor }) => {
  const { resumeData } = useContext(ResumeInfoContext);
  const SelectedTemplate = TEMPLATES[selectedId]?.component;

  if (!SelectedTemplate) {
    return <div>Template not found</div>;
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <SelectedTemplate data={resumeData} accentColor={accentColor} />
    </div>
  );
};

export default ResumePreview;
