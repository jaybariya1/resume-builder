import React from "react";

const Template4 = ({ data }) => {
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
  } = data;

  const contactItems = [email, phone, location, linkedin, github, portfolio, website].filter(Boolean);

  return (
    <main
      id="resume-preview"
      className="w-[794px] min-h-[1123px] mx-auto bg-white text-black text-[12.5px] leading-relaxed"
      style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
    >
      {/* HEADER BAND */}
      <header className="px-10 pt-10 pb-6" style={{ backgroundColor: "#f0fdf4" }}>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-[34px] font-black leading-none" style={{ color: "#14532d" }}>
              {firstName}{" "}
              <span style={{ color: "#16a34a" }}>{lastName}</span>
            </h1>
            {role && (
              <p className="mt-1.5 text-[13px] font-semibold" style={{ color: "#16a34a" }}>
                {role}
              </p>
            )}
          </div>
          {contactItems.length > 0 && (
            <div className="text-right text-[11px] text-gray-600 flex flex-col gap-0.5">
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
        <div className="mt-5 h-[3px] rounded-full" style={{ backgroundColor: "#16a34a" }} />
      </header>

      {/* BODY */}
      <div className="px-10 py-6 flex flex-col gap-5">

        {/* Summary */}
        {summary && (
          <section>
            <h2 className="text-[10px] uppercase tracking-[0.18em] font-bold mb-2" style={{ color: "#16a34a" }}>
              About
            </h2>
            <div
              className="text-gray-700 preview pl-3 border-l-2"
              style={{ borderColor: "#bbf7d0" }}
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          </section>
        )}

        {/* Skills */}
        {skills.filter((s) => s.name).length > 0 && (
          <section>
            <h2 className="text-[10px] uppercase tracking-[0.18em] font-bold mb-2" style={{ color: "#16a34a" }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2 pl-3">
              {skills
                .filter((s) => s.name)
                .map((skill) => (
                  <span
                    key={skill.id}
                    className="text-[11px] px-2.5 py-0.5 rounded"
                    style={{ backgroundColor: "#dcfce7", color: "#166534" }}
                  >
                    {skill.name}
                  </span>
                ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience.filter((e) => e.title || e.company).length > 0 && (
          <section>
            <h2 className="text-[10px] uppercase tracking-[0.18em] font-bold mb-3" style={{ color: "#16a34a" }}>
              Experience
            </h2>
            {experience.map((exp) => {
              if (!exp.title && !exp.company) return null;
              return (
                <div
                  key={exp.id}
                  className="mb-4 pl-3 border-l-2"
                  style={{ borderColor: "#bbf7d0" }}
                >
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-[13px] text-gray-900">{exp.title}</p>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-4">
                      {exp.startDate}{exp.startDate && " – "}{exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-[11.5px] font-semibold" style={{ color: "#16a34a" }}>
                    {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.description && (
                    <div
                      className="preview mt-1.5 text-gray-600 text-[12px]"
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
            <h2 className="text-[10px] uppercase tracking-[0.18em] font-bold mb-3" style={{ color: "#16a34a" }}>
              Projects
            </h2>
            {project.map((proj) => {
              if (!proj.title) return null;
              return (
                <div
                  key={proj.id}
                  className="mb-3 pl-3 border-l-2"
                  style={{ borderColor: "#bbf7d0" }}
                >
                  <p className="font-bold text-[13px] text-gray-900">
                    {proj.title}
                    {proj.url && (
                      <span className="text-[10px] font-normal ml-2" style={{ color: "#16a34a" }}>
                        {proj.url}
                      </span>
                    )}
                  </p>
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

        {/* Education */}
        {education.filter((e) => e.degree || e.school).length > 0 && (
          <section>
            <h2 className="text-[10px] uppercase tracking-[0.18em] font-bold mb-3" style={{ color: "#16a34a" }}>
              Education
            </h2>
            {education.map((edu) => {
              if (!edu.degree && !edu.school) return null;
              return (
                <div
                  key={edu.id}
                  className="mb-3 pl-3 border-l-2"
                  style={{ borderColor: "#bbf7d0" }}
                >
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-[13px] text-gray-900">{edu.degree}</p>
                    {edu.graduationDate && (
                      <span className="text-[10px] text-gray-400 ml-4">{edu.graduationDate}</span>
                    )}
                  </div>
                  <p className="text-[11.5px]" style={{ color: "#16a34a" }}>
                    {edu.school}{edu.location ? ` · ${edu.location}` : ""}
                  </p>
                  {edu.description && (
                    <div
                      className="preview mt-1 text-gray-600 text-[12px]"
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
