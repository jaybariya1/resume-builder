import React from "react";

const Template3 = ({ data }) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    location,
    summary,
    role,
    linkedin,
    github,
    portfolio,
    website,
    experience = [],
    education = [],
    skills = [],
    project = [],
    hideSkillLevel = false,
  } = data;

  const SectionTitle = ({ children }) => (
    <h2
      className="text-[11px] uppercase tracking-[0.2em] font-semibold mt-6 mb-3"
      style={{ color: "#7c3aed", fontFamily: "Georgia, serif" }}
    >
      {children}
      <div className="mt-1 h-[1.5px]" style={{ backgroundColor: "#7c3aed", opacity: 0.3 }} />
    </h2>
  );

  const contactItems = [email, phone, location, linkedin, github, portfolio, website].filter(Boolean);

  return (
    <main
      id="resume-preview"
      className="w-[794px] min-h-[1123px] mx-auto bg-white text-black p-14 text-[12.5px] leading-relaxed"
      style={{ fontFamily: "Georgia, serif" }}
    >
      {/* TOP ACCENT BAR */}
      <div className="h-1.5 w-full mb-8 rounded-full" style={{ backgroundColor: "#7c3aed" }} />

      {/* HEADER */}
      <header className="mb-2">
        <h1
          className="text-[32px] font-bold leading-tight"
          style={{ color: "#1e1b4b", fontFamily: "Georgia, serif", letterSpacing: "-0.5px" }}
        >
          {firstName} {lastName}
        </h1>
        {role && (
          <p className="text-[14px] mt-1 font-normal italic" style={{ color: "#7c3aed" }}>
            {role}
          </p>
        )}
        {contactItems.length > 0 && (
          <p className="mt-2 text-[11px] text-gray-500">
            {contactItems.join("  ·  ")}
          </p>
        )}
      </header>

      {/* SUMMARY */}
      {summary && (
        <>
          <SectionTitle>Profile</SectionTitle>
          <div
            className="text-gray-700 preview leading-relaxed"
            dangerouslySetInnerHTML={{ __html: summary }}
          />
        </>
      )}

      {/* EXPERIENCE */}
      {experience.filter((e) => e.title || e.company).length > 0 && (
        <>
          <SectionTitle>Experience</SectionTitle>
          {experience.map((exp) => {
            if (!exp.title && !exp.company) return null;
            return (
              <div key={exp.id} className="mb-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[13.5px]" style={{ color: "#1e1b4b" }}>
                      {exp.title}
                    </p>
                    <p className="text-[12px] italic text-gray-600">
                      {exp.company}
                      {exp.location ? `, ${exp.location}` : ""}
                    </p>
                  </div>
                  <span className="text-[10.5px] text-gray-400 whitespace-nowrap ml-4 mt-0.5">
                    {exp.startDate}{exp.startDate && " — "}{exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <div
                    className="preview mt-2 text-gray-700 text-[12px]"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                )}
              </div>
            );
          })}
        </>
      )}

      {/* EDUCATION */}
      {education.filter((e) => e.degree || e.school).length > 0 && (
        <>
          <SectionTitle>Education</SectionTitle>
          {education.map((edu) => {
            if (!edu.degree && !edu.school) return null;
            return (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[13px]" style={{ color: "#1e1b4b" }}>
                      {edu.degree}
                    </p>
                    <p className="text-[12px] italic text-gray-600">
                      {edu.school}
                      {edu.location ? `, ${edu.location}` : ""}
                    </p>
                  </div>
                  {edu.graduationDate && (
                    <span className="text-[10.5px] text-gray-400 ml-4 mt-0.5">
                      {edu.graduationDate}
                    </span>
                  )}
                </div>
                {edu.description && (
                  <div
                    className="preview mt-1 text-gray-700 text-[12px]"
                    dangerouslySetInnerHTML={{ __html: edu.description }}
                  />
                )}
              </div>
            );
          })}
        </>
      )}

      {/* PROJECTS */}
      {project.filter((p) => p.title).length > 0 && (
        <>
          <SectionTitle>Projects</SectionTitle>
          {project.map((proj) => {
            if (!proj.title) return null;
            return (
              <div key={proj.id} className="mb-4">
                <p className="font-bold text-[13px]" style={{ color: "#1e1b4b" }}>
                  {proj.title}
                  {proj.url && (
                    <span className="text-[10px] font-normal italic ml-2 text-gray-500">
                      {proj.url}
                    </span>
                  )}
                </p>
                {proj.description && (
                  <div
                    className="preview mt-1 text-gray-700 text-[12px]"
                    dangerouslySetInnerHTML={{ __html: proj.description }}
                  />
                )}
              </div>
            );
          })}
        </>
      )}

      {/* SKILLS */}
      {skills.filter((s) => s.name).length > 0 && (
        <>
          <SectionTitle>Skills</SectionTitle>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {skills.filter((s) => s.name).map((skill) => {
              const filled = (skill.level ?? 2) + 1;
              const levelLabel = ["Beginner", "Intermediate", "Advanced", "Expert"][skill.level ?? 2];
              return (
                <div key={skill.id}>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium text-gray-800">{skill.name}</span>
                    {!hideSkillLevel && <span className="text-[9px] text-gray-500">{levelLabel}</span>}
                  </div>
                  {!hideSkillLevel && (
                    <div className="flex gap-0.5 mt-0.5">
                      {[0,1,2,3].map(i => (
                        <div key={i} className="flex-1 h-1 rounded-full" style={{ backgroundColor: i < filled ? "#7c3aed" : "#e9d5ff" }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
};

export default Template3;
