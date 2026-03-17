import React from "react";

const Template2 = ({ data, accentColor = "#f97316" }) => {
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
  } = data;

  return (
    <main
      id="resume-preview"
      className="w-[794px] min-h-[1123px] mx-auto bg-white text-black flex text-[1.0417em] leading-relaxed"
      style={{ fontFamily: fontFamily || "'Inter', sans-serif", fontSize: fontSize ? `${fontSize}px` : '12px' }}
    >
      {/* LEFT SIDEBAR */}
      <aside
        className="w-[240px] min-h-full flex-shrink-0 text-white p-7 flex flex-col gap-6"
        style={{ backgroundColor: "#1e293b" }}
      >
        {/* Name + Role */}
        <div>
          <h1 className="text-[1.8333em] font-bold leading-tight text-white">
            {firstName} {lastName}
          </h1>
          {role && (
            <p className="text-[1.0em] mt-1" style={{ color: "#94a3b8" }}>
              {role}
            </p>
          )}
        </div>

        {/* Contact */}
        {(email || phone || location || linkedin || github || portfolio || website) && (
          <div>
            <h2
              className="text-[0.75em] uppercase tracking-widest font-semibold mb-2"
              style={{ color: accentColor }}
            >
              Contact
            </h2>
            <div className="flex flex-col gap-1.5" style={{ color: "#cbd5e1" }}>
              {email && <span className="text-[0.9167em] break-all">{email}</span>}
              {phone && <span className="text-[0.9167em]">{phone}</span>}
              {location && <span className="text-[0.9167em]">{location}</span>}
              {linkedin && <span className="text-[0.9167em] break-all">{linkedin}</span>}
              {github && <span className="text-[0.9167em] break-all">{github}</span>}
              {portfolio && <span className="text-[0.9167em] break-all">{portfolio}</span>}
              {website && <span className="text-[0.9167em] break-all">{website}</span>}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.filter((s) => s.name).length > 0 && (
          <div>
            <h2
              className="text-[0.75em] uppercase tracking-widest font-semibold mb-2"
              style={{ color: accentColor }}
            >
              {sectionTitles[4] || "Skills"}
            </h2>
            <div className="space-y-2">
              {skills
                .filter((s) => s.name)
                .map((skill) => {
                  const filled = (skill.level ?? 2) + 1;
                  const levelLabel = ["Beginner", "Intermediate", "Advanced", "Expert"][skill.level ?? 2];
                  return (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[0.8333em] font-medium" style={{ color: "#e2e8f0" }}>{skill.name}</span>
                        {!hideSkillLevel && <span className="text-[0.6667em]" style={{ color: "#94a3b8" }}>{levelLabel}</span>}
                      </div>
                      {!hideSkillLevel && (
                        <div className="flex gap-0.5">
                          {[0, 1, 2, 3].map(i => (
                            <div
                              key={i}
                              className="flex-1 h-1 rounded-full"
                              style={{ backgroundColor: i < filled ? accentColor : "#475569" }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Education */}
        {education.filter((e) => e.degree || e.school).length > 0 && (
          <div>
            <h2
              className="text-[0.75em] uppercase tracking-widest font-semibold mb-2"
              style={{ color: accentColor }}
            >
              {sectionTitles[3] || "Education"}
            </h2>
            {education.map((edu) => {
              if (!edu.degree && !edu.school) return null;
              return (
                <div key={edu.id} className="mb-3">
                  <p className="font-semibold text-[0.9167em] text-white">{edu.degree}</p>
                  <p className="text-[0.8333em]" style={{ color: "#94a3b8" }}>
                    {edu.school}
                  </p>
                  {edu.graduationDate && (
                    <p className="text-[0.8333em]" style={{ color: "#64748b" }}>
                      {edu.graduationDate}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </aside>

      {/* RIGHT MAIN */}
      <div className="flex-1 p-8 flex flex-col gap-6">
        {/* Summary */}
        {summary && (
          <section>
            <h2
              className="text-[0.8333em] uppercase tracking-widest font-bold mb-2 pb-1 border-b"
              style={{ color: accentColor, borderColor: accentColor + "44" }}
            >
              {sectionTitles[1] || "Profile"}
            </h2>
            <div
              className="text-gray-700 preview leading-relaxed"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          </section>
        )}

        {/* Experience */}
        {experience.filter((e) => e.title || e.company).length > 0 && (
          <section>
            <h2
              className="text-[0.8333em] uppercase tracking-widest font-bold mb-3 pb-1 border-b"
              style={{ color: accentColor, borderColor: accentColor + "44" }}
            >
              {sectionTitles[2] || "Experience"}
            </h2>
            {experience.map((exp) => {
              if (!exp.title && !exp.company) return null;
              return (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-[1.0833em] text-gray-900">{exp.title}</p>
                    <span className="text-[0.8333em] text-gray-500">
                      {exp.startDate} {exp.startDate && "–"} {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-[0.9167em] font-medium" style={{ color: accentColor }}>
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.description && (
                    <div
                      className="preview mt-1 text-gray-600 text-[1.0em]"
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* Projects */}
        {project.filter((p) => p.title).length > 0 && (
          <section>
            <h2
              className="text-[0.8333em] uppercase tracking-widest font-bold mb-3 pb-1 border-b"
              style={{ color: accentColor, borderColor: accentColor + "44" }}
            >
              {sectionTitles[5] || "Projects"}
            </h2>
            {project.map((proj) => {
              if (!proj.title) return null;
              return (
                <div key={proj.id} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-[1.0833em] text-gray-900">
                      {proj.title}
                      {proj.url && (
                        <span className="text-[0.8333em] font-normal ml-2" style={{ color: accentColor }}>
                          {proj.url}
                        </span>
                      )}
                    </p>
                  </div>
                  {proj.description && (
                    <div
                      className="preview mt-1 text-gray-600 text-[1.0em]"
                      dangerouslySetInnerHTML={{ __html: proj.description }}
                    />
                  )}
                </div>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
};

export default Template2;
