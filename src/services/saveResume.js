async function saveResume(resumeData) {
  const { data, error } = await supabase
    .from("resumes")
    .upsert({
      title: resumeData.title,
      content: resumeData,      // JSON
      updated_at: new Date(),
    });

  if (error) {
    console.error("Save failed", error);
  }
}
