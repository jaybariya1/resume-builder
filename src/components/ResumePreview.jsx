import React, { forwardRef } from "react";
import { useState } from 'react';
import { TEMPLATES } from '../components/templates';
import { useContext } from "react";
import { ResumeInfoContext } from "../context/ResumeInfoContext";
import { Linkedin, Github, Palette, Globe } from "lucide-react";

const ResumePreview = ()=> {
  const { resumeData } = useContext(ResumeInfoContext);
  const [selectedId] = useState("modern");

  const SelectedTemplate = TEMPLATES[selectedId]?.component;

  if (!SelectedTemplate) {
    return <div>Template not found</div>;
  }

  return (
    <div >
      <SelectedTemplate data={resumeData} />
    </div>
  );
};

export default ResumePreview;
