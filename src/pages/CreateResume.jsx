import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeInfoProvider, ResumeInfoContext } from "../context/ResumeInfoContext";
import ResumeEditor from "../components/resume/ResumeEditor";
import ResumeStartModal from "../components/resume/ResumeStartModal";
import { useParams } from "react-router-dom";

function CreateResumeInner({ mode  }) {
  const navigate = useNavigate();
  const { setResumeData } = useContext(ResumeInfoContext);
  const [ready, setReady] = useState(mode === "edit");

  // Called by modal with the mode chosen
  // "scratch"  → modal did NOT set data, we clear and start empty
  // "prefilled" → modal already called setResumeData with parsed data, just open editor
  const handleSelect = (selectedMode) => {
    if (selectedMode === "scratch") {
      localStorage.removeItem("resume_draft");
      setResumeData({
        id: null, title: "", firstName: "", lastName: "",
        email: "", phone: "", city: "", country: "", location: "",
        summary: "", role: "", linkedin: "", github: "",
        portfolio: "", website: "",
        experience: [], education: [], skills: [], project: [],
        hideSkillLevel: false, certifications: [], languages: [],
        volunteer: [], awards: [],
      });
    }
    // "prefilled": modal already set resumeData + cleared localStorage — just open editor
    setReady(true);
  };

  if (!ready) {
    return (
      <ResumeStartModal
        onSelect={handleSelect}
        onClose={() => navigate("/dashboard")}
      />
    );
  }

  return <ResumeEditor mode={mode} />;
}

export default function CreateResume({ mode }) {
  return (
    <ResumeInfoProvider>
      <CreateResumeInner mode={mode} />
    </ResumeInfoProvider>
  );
}
