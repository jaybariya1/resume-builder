import React from "react";

const Template4 = ({ data, accentColor = "#16a34a" }) => {
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

  const contactItems = [email, phone, location, linkedin, github, portfolio, website].filter(Boolean);

  return (
    <main
      id="resume-preview"
      className="w-[794px] min-h-[1123px] mx-auto bg-white text-black text-[1.0417em] leading-relaxed"
      style={{ fontFamily: fontFamily || "'Helvetica Neue', Arial, sans-serif", fontSize: fontSize ? `${fontSize}px` : '12px' }}
    >
      {/* HEADER BAND */}
      <header className="px-10 pt-10 pb-6" style={{ backgroundColor: accentColor + "12" }}>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-[2.8333em] font-black leading-none" style={{ color: accentColor }}>
              {firstName}{" "}
              <span style={{ color: accentColor }}>{lastName}</span>
            </h1>
            {role && (
              <p className="mt-1.5 text-[1.0833em] font-semibold" style={{ color: accentColor }}>
                {role}
              </p>
            )}
          </div>
          {contactItems.length > 0 && (
            <div className="text-right text-[0.9167em] text-gray-600 flex flex-col gap-0.5">
              {email && <span>{email}</span>}
              {phone && <span>{phone}</span>}
              {location && <span>{location}</span>}
              {linkedin && <span>{linkedin}</span>}
              {github && <span>{github}</span>}
              {(portfolio || website) && <span>{portfolio || website}</span>}
            </div>
          )}
        </div>
        {/* green rule */}
        <div className="mt-5 h-[3px] rounded-full" style={{ backgroundColor: accentColor }} />
      </header>

      {/* BODY */}
      <div className="px-10 py-6 flex flex-col gap-5">

        {/* Summary */}
        {summary && (
          <section>
            <h2 className="text-[0.8333em] uppercase tracking-[0.18em] font-bold mb-2" style={{ color: accentColor }}>
              {sectionTitles[1] || "About"}
            </h2>
            <div
              className="text-gray-700 preview pl-3 border-l-2"
              style={{ borderColor: accentColor + "55" }}
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          </section>
        )}

        {/* Skills */}
        {skills.filter((s) => s.name).length > 0 && (
          <section>
            <h2 className="text-[0.8333em] uppercase tracking-[0.18em] font-bold mb-2" style={{ color: accentColor }}>
              {sectionTitles[4] || "Skills"}
            </h2>
            <div className="space-y-1.5 pl-3">
              {skills
                .filter((s) => s.name)
                .map((skill) => {
                  const filled = (skill.level ?? 2) + 1;
                  const levelLabel = ["Beginner", "Intermediate", "Advanced", "Expert"][skill.level ?? 2];
                  return (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center">
                        <span className="text-[0.9167em] font-medium" style={{ color: accentColor }}>{skill.name}</span>
                        {!hideSkillLevel && <span className="text-[0.75em]" style={{ color: accentColor }}>{levelLabel}</span>}
                      </div>
                      {!hideSkillLevel && (
                        <div className="flex gap-0.5 mt-0.5">
                          {[0,1,2,3].map(i => (
                            <div key={i} className="flex-1 h-1 rounded-full" style={{ backgroundColor: i < filled ? accentColor : accentColor + "30" }} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience.filter((e) => e.title || e.company).length > 0 && (
          <section>
            <h2 className="text-[0.8333em] uppercase tracking-[0.18em] font-bold mb-3" style={{ color: accentColor }}>
              {sectionTitles[2] || "Experience"}
            </h2>
            {experience.map((exp) => {
              if (!exp.title && !exp.company) return null;
              return (
                <div
                  key={exp.id}
                  className="mb-4 pl-3 border-l-2"
                  style={{ borderColor: accentColor + "55" }}
                >
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-[1.0833em] text-gray-900">{exp.title}</p>
                    <span className="text-[0.8333em] text-gray-400 whitespace-nowrap ml-4">
                      {exp.startDate}{exp.startDate && " – "}{exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-[0.9583em] font-semibold" style={{ color: accentColor }}>
                    {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.description && (
                    <div
                      className="preview mt-1.5 text-gray-600 text-[1.0em]"
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
            <h2 className="text-[0.8333em] uppercase tracking-[0.18em] font-bold mb-3" style={{ color: accentColor }}>
              {sectionTitles[5] || "Projects"}
            </h2>
            {project.map((proj) => {
              if (!proj.title) return null;
              return (
                <div
                  key={proj.id}
                  className="mb-3 pl-3 border-l-2"
                  style={{ borderColor: accentColor + "55" }}
                >
                  <p className="font-bold text-[1.0833em] text-gray-900">
                    {proj.title}
                    {proj.url && (
                      <span className="text-[0.8333em] font-normal ml-2" style={{ color: accentColor }}>
                        {proj.url}
                      </span>
                    )}
                  </p>
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

        {/* Education */}
        {education.filter((e) => e.degree || e.school).length > 0 && (
          <section>
            <h2 className="text-[0.8333em] uppercase tracking-[0.18em] font-bold mb-3" style={{ color: accentColor }}>
              {sectionTitles[3] || "Education"}
            </h2>
            {education.map((edu) => {
              if (!edu.degree && !edu.school) return null;
              return (
                <div
                  key={edu.id}
                  className="mb-3 pl-3 border-l-2"
                  style={{ borderColor: accentColor + "55" }}
                >
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-[1.0833em] text-gray-900">{edu.degree}</p>
                    {edu.graduationDate && (
                      <span className="text-[0.8333em] text-gray-400 ml-4">{edu.graduationDate}</span>
                    )}
                  </div>
                  <p className="text-[0.9583em]" style={{ color: accentColor }}>
                    {edu.school}{edu.location ? ` · ${edu.location}` : ""}
                  </p>
                  {edu.description && (
                    <div
                      className="preview mt-1 text-gray-600 text-[1.0em]"
                      dangerouslySetInnerHTML={{ __html: edu.description }}
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

export default Template4;
