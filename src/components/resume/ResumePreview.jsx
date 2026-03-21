import React, { useContext } from "react";
import { TEMPLATES } from './templates';
import { ResumeInfoContext } from "../../context/ResumeInfoContext";

const ResumePreview = ({ selectedId = "modern", accentColor }) => {
  const { resumeData } = useContext(ResumeInfoContext);
  const SelectedTemplate = TEMPLATES[selectedId]?.component;

  if (!SelectedTemplate) {
    return <div className="flex items-center justify-center h-full text-gray-400">Template not found</div>;
  }

  return <SelectedTemplate data={resumeData} accentColor={accentColor} />;
};

export default ResumePreview;
