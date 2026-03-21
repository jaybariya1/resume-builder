// import { createContext } from "react";

// export const ResumeInfoContext = createContext();

// import { title } from "process";
import React, { createContext, useState } from "react";
import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRef } from "react";

export const ResumeInfoContext = createContext();

const LOCAL_DRAFT_KEY = "resume_draft";

export const ResumeInfoProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState({
    id: null,
    title: "",
    sectionTitles: {},
    stepOrder: [1, 2, 3, 4, 5],
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    role: "",
    linkedin: "",
    github: "",
    portfolio: "",
    website: "",
    experience: [],
    education: [],
    skills: [],
    project: [],
    hideSkillLevel: false,
    certifications: [],
    languages: [],
    volunteer: [],
    awards: [],
  });

  const [inputFields, setInputFields] = useState({
      linkedin: false,
      github: false,
      portfolio: false,
      website: false,
    });

  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);

  // localStorage restore intentionally removed.
  // Data is initialised by CreateResume (scratch/prefilled) or loadResumeById (edit).

  // Only persist when there is an actual saved resume (has an id).
  // This prevents a deleted resume from being re-saved via auto-save.
  useEffect(() => {
    if (resumeData?.id) {
      localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(resumeData));
    }
  }, [resumeData]);

  // Call after a successful delete so stale data cannot re-save the resume.
  const clearDraft = () => {
    localStorage.removeItem(LOCAL_DRAFT_KEY);
    setResumeData((prev) => ({ ...prev, id: null }));
  };



//   const saveResume = async () => {
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) return;

//   const payload = {
//     user_id: user.id,
//     title: resumeData.title || "Untitled Resume",
//     content: resumeData,
//     updated_at: new Date().toISOString(),
//   };

//   if (resumeData.id) payload.id = resumeData.id;

//   const { data, error } = await supabase
//     .from("resumes")
//     .upsert(payload)
//     .select()
//     .single();

//   if (!error && data?.id && !resumeData.id) {
//     setResumeData((prev) => ({ ...prev, id: data.id }));
//   }
// };

const saveResume = async (mode, resumeId, currentData) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const payload = {
    user_id: user.id,
    title: currentData.title || "Untitled Resume",
    content: currentData,
    updated_at: new Date().toISOString(),
  };

  let response;

  if (resumeId !== null) {
    response = await supabase
      .from("resumes")
      .update(payload)
      .eq("id", resumeId)
      .select()
      .single();
  } else {
    response = await supabase
      .from("resumes")
      .insert(payload)
      .select()
      .single();
  }

  const { data, error } = response;

  if (resumeId == null && mode === "create") {
    return data.id;
  }

  if (error) {
    console.error("Save failed:", error);
  }
  return resumeId;
};


const loadResumeById = async (resumeId) => {
    setLoading(true);

    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resumeId)
      .single();

    if (error) {
      console.error("Failed to load resume:", error);
    } else {
      setResumeData({
        ...data.content,
        id: data.id,
        title: data.title,
      });
    }

    setLoading(false);
  };

   

  return (
    <ResumeInfoContext.Provider value={{ resumeData, setResumeData, inputFields, setInputFields, isGenerating, setIsGenerating, saveResume, loading, loadResumeById, clearDraft }}>
      {children}
    </ResumeInfoContext.Provider>
  );
};
