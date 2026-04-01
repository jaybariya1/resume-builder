import React from "react";

const Template3 = ({ data, accentColor = "#7c3aed" }) => {
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
    fontFamily,
    fontSize,
    sectionTitles = {},
    profilePhoto = "",
  } = data;

  const SectionTitle = ({ children }) => (
    <h2
      className="text-[0.9167em] uppercase tracking-[0.2em] font-semibold mt-6 mb-3"
      style={{ color: accentColor }}
    >
      {children}
      <div className="mt-1 h-[1.5px]" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
    </h2>
  );

  const contactItems = [email, phone, location, linkedin, github, portfolio, website].filter(Boolean);

  return (
    <main
      id="resume-preview"
      className="w-[794px] min-h-[1123px] mx-auto bg-white text-black p-14 text-[1.0417em] leading-relaxed"
      style={{ fontFamily: fontFamily || 'Georgia, serif', fontSize: fontSize ? `${fontSize}px` : '12px' }}
    >
      {/* TOP ACCENT BAR */}
      <div className="h-1.5 w-full mb-8 rounded-full" style={{ backgroundColor: accentColor }} />

      {/* HEADER */}
      <header className="mb-2">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1
              className="text-[2.6667em] font-bold leading-tight"
              style={{ color: "#1e1b4b", letterSpacing: "-0.5px" }}
            >
              {firstName} {lastName}
            </h1>
            {role && (
              <p className="text-[1.1667em] mt-1  italic font-bold" style={{ color: accentColor }}>
                {role}
              </p>
            )}
            {contactItems.length > 0 && (
              <p className="mt-2 text-[0.9167em] text-gray-500">
                {contactItems.join("  ·  ")}
              </p>
            )}
          </div>
          {profilePhoto && (
            <img
              src={profilePhoto}
              alt="Profile"
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                objectFit: "cover",
                border: `3px solid ${accentColor}`,
                flexShrink: 0,
              }}
            />
          )}
        </div>
      </header>

      {/* SUMMARY */}
      {summary && (
        <>
          <SectionTitle><div className="text-[1.25em]">{sectionTitles[1] || "Profile"}</div></SectionTitle>
          <div
            className="text-gray-700 preview leading-relaxed"
            dangerouslySetInnerHTML={{ __html: summary }}
          />
        </>
      )}

      {/* EXPERIENCE */}
      {experience.filter((e) => e.title || e.company).length > 0 && (
        <>
          <SectionTitle ><div className="text-[1.25em] font-bold" style={{ color: accentColor }}>{sectionTitles[2] || "Experience"}</div></SectionTitle>
          {experience.map((exp) => {
            if (!exp.title && !exp.company) return null;
            return (
              <div key={exp.id} className="mb-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[1.125em]" style={{ color: "#1e1b4b" }}>
                      {exp.title}
                    </p>
                    <p className="text-[1.0em] italic text-gray-600">
                      {exp.company}
                      {exp.location ? `, ${exp.location}` : ""}
                    </p>
                  </div>
                  <span className="text-[0.875em] text-gray-400 whitespace-nowrap ml-4 mt-0.5">
                    {exp.startDate}{exp.startDate && " — "}{exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <div
                    className="preview mt-2 text-gray-700 text-[1.0em]"
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
          <SectionTitle><div className="text-[1.25em]">{sectionTitles[3] || "Education"}</div></SectionTitle>
          {education.map((edu) => {
            if (!edu.degree && !edu.school) return null;
            return (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[1.0833em]" style={{ color: "#1e1b4b" }}>
                      {edu.degree}
                    </p>
                    <p className="text-[1 .0em] italic text-gray-600">
                      {edu.school}
                      {edu.location ? `, ${edu.location}` : ""}
                    </p>
                  </div>
                  {edu.graduationDate && (
                    <span className="text-[0.875em] text-gray-400 ml-4 mt-0.5">
                      {edu.graduationDate}
                    </span>
                  )}
                </div>
                {edu.description && (
                  <div
                    className="preview mt-1 text-gray-700 text-[1.0em]"
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
          <SectionTitle><div className="text-[1.25em]">{sectionTitles[5] || "Projects"}</div></SectionTitle>
          {project.map((proj) => {
            if (!proj.title) return null;
            return (
              <div key={proj.id} className="mb-4">
                <p className="font-bold text-[1.0833em]" style={{ color: "#1e1b4b" }}>
                  {proj.title}
                  {proj.url && (
                    <span className="text-[0.8333em] font-normal italic ml-2 text-gray-500">
                      {proj.url}
                    </span>
                  )}
                </p>
                {proj.description && (
                  <div
                    className="preview mt-1 text-gray-700 text-[1.0em]"
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
          <SectionTitle><div className="text-[1.25em]">{sectionTitles[4] || "Skills"}</div></SectionTitle>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {skills.filter((s) => s.name).map((skill) => {
              const filled = (skill.level ?? 2) + 1;
              const levelLabel = ["Beginner", "Intermediate", "Advanced", "Expert"][skill.level ?? 2];
              return (
                <div key={skill.id}>
                  <div className="flex justify-between items-center">
                    <span className="text-[0.9167em] font-medium text-gray-800">{skill.name}</span>
                    {!hideSkillLevel && <span className="text-[0.75em] text-gray-500">{levelLabel}</span>}
                  </div>
                  {!hideSkillLevel && (
                    <div className="flex gap-0.5 mt-0.5">
                      {[0,1,2,3].map(i => (
                        <div key={i} className="flex-1 h-1 rounded-full" style={{ backgroundColor: i < filled ? accentColor : accentColor + "33" }} />
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
  