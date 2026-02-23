import { supabase } from "../lib/supabaseClient";

/**
 * Core caller — invokes the ai-resume Supabase Edge Function
 */
async function callAI(type, payload = {}) {
  const { data, error } = await supabase.functions.invoke("ai-resume", {
    body: { type, payload },
  });

  if (error) {
    console.error(`[AI] Error calling '${type}':`, error);
    throw new Error(error.message || "AI generation failed");
  }

  if (!data?.success) {
    throw new Error(data?.error || "AI returned an unsuccessful response");
  }

  return data.data;
}

/** Generate a professional summary. Returns plain text. */
export async function generateSummary({ role, firstName, lastName, skills, experience }) {
  if (!role) return "Please enter a Job Title / Role first.";
  return await callAI("summary", { role, firstName, lastName, skills, experience });
}

/** Generate experience bullet points. Returns HTML string. */
export async function generateExperienceBullets({ jobTitle, company, skills, currentText }) {
  if (!jobTitle && !company) return null;
  return await callAI("experience", { jobTitle, company, skills, currentText });
}

/** Improve existing experience bullets. Returns HTML string. */
export async function improveExperience({ jobTitle, currentText }) {
  if (!currentText) return null;
  return await callAI("improve_experience", { jobTitle, currentText });
}

/** Generate project description bullets. Returns HTML string. */
export async function generateProjectDescription({ projectTitle, projectTech, currentText }) {
  if (!projectTitle) return null;
  return await callAI("project", { projectTitle, projectTech, currentText });
}

/** Suggest skills for a role. Returns string[]. */
export async function suggestSkills({ role, skills, experience }) {
  if (!role && (!skills || skills.length === 0)) return [];
  return await callAI("skills", { role, skills, experience });
}

/** Suggest job titles. Returns string[]. */
export async function suggestJobTitles({ skills, experience }) {
  return await callAI("job_title", { skills, experience });
}

/** Legacy wrapper for backwards compatibility */
export async function generateContent({ type, input = {} }) {
  const { role, firstName, lastName, skills, experience, education } = input;
  if (!role) return "Please enter a Job Title / Role first.";
  if (type === "summary") {
    return await generateSummary({ role, firstName, lastName, skills, experience });
  }
  if (type === "description") {
    return await generateExperienceBullets({
      jobTitle: role,
      company: input.company || "",
      skills,
      currentText: education || "",
    });
  }
  throw new Error(`Unknown generation type: ${type}`);
}
