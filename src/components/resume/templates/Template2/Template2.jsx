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
  } = data;

  return (
    <main
      id="resume-preview"
      className="w-[794px] min-h-[1123px] mx-auto bg-white text-black flex text-[12.5px] leading-relaxed"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* LEFT SIDEBAR */}
      <aside
        className="w-[240px] min-h-full flex-shrink-0 text-white p-7 flex flex-col gap-6"
        style={{ backgroundColor: "#1e293b" }}
      >
        {/* Name + Role */}
        <div>
          <h1 className="text-[22px] font-bold leading-tight text-white">
            {firstName} {lastName}
          </h1>
          {role && (
            <p className="text-[12px] mt-1" style={{ color: "#94a3b8" }}>
              {role}
            </p>
          )}
        </div>

        {/* Contact */}
        {(email || phone || location || linkedin || github || portfolio || website) && (
          <div>
            <h2
              className="text-[9px] uppercase tracking-widest font-semibold mb-2"
              style={{ color: accentColor }}
            >
              Contact
            </h2>
            <div className="flex flex-col gap-1.5" style={{ color: "#cbd5e1" }}>
              {email && <span className="text-[11px] break-all">{email}</span>}
              {phone && <span className="text-[11px]">{phone}</span>}
              {location && <span className="text-[11px]">{location}</span>}
              {linkedin && <span className="text-[11px] break-all">{linkedin}</span>}
              {github && <span className="text-[11px] break-all">{github}</span>}
              {portfolio && <span className="text-[11px] break-all">{portfolio}</span>}
              {website && <span className="text-[11px] break-all">{website}</span>}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.filter((s) => s.name).length > 0 && (
          <div>
            <h2
              className="text-[9px] uppercase tracking-widest font-semibold mb-2"
              style={{ color: accentColor }}
            >
              Skills
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
                        <span className="text-[10px] font-medium" style={{ color: "#e2e8f0" }}>{skill.name}</span>
                        {!hideSkillLevel && <span className="text-[8px]" style={{ color: "#94a3b8" }}>{levelLabel}</span>}
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
              className="text-[9px] uppercase tracking-widest font-semibold mb-2"
              style={{ color: accentColor }}
            >
              Education
            </h2>
            {education.map((edu) => {
              if (!edu.degree && !edu.school) return null;
              return (
                <div key={edu.id} className="mb-3">
                  <p className="font-semibold text-[11px] text-white">{edu.degree}</p>
                  <p className="text-[10px]" style={{ color: "#94a3b8" }}>
                    {edu.school}
                  </p>
                  {edu.graduationDate && (
                    <p className="text-[10px]" style={{ color: "#64748b" }}>
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
              className="text-[10px] uppercase tracking-widest font-bold mb-2 pb-1 border-b"
              style={{ color: accentColor, borderColor: accentColor + "44" }}
            >
              Profile
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
              className="text-[10px] uppercase tracking-widest font-bold mb-3 pb-1 border-b"
              style={{ color: accentColor, borderColor: accentColor + "44" }}
            >
              Experience
            </h2>
            {experience.map((exp) => {
              if (!exp.title && !exp.company) return null;
              return (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-[13px] text-gray-900">{exp.title}</p>
                    <span className="text-[10px] text-gray-500">
                      {exp.startDate} {exp.startDate && "–"} {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium" style={{ color: accentColor }}>
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.description && (
                    <div
                      className="preview mt-1 text-gray-600 text-[12px]"
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
              className="text-[10px] uppercase tracking-widest font-bold mb-3 pb-1 border-b"
              style={{ color: accentColor, borderColor: accentColor + "44" }}
            >
              Projects
            </h2>
            {project.map((proj) => {
              if (!proj.title) return null;
              return (
                <div key={proj.id} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-[13px] text-gray-900">
                      {proj.title}
                      {proj.url && (
                        <span className="text-[10px] font-normal ml-2" style={{ color: accentColor }}>
                          {proj.url}
                        </span>
                      )}
                    </p>
                  </div>
                  {proj.description && (
                    <div
                      className="preview mt-1 text-gray-600 text-[12px]"
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
