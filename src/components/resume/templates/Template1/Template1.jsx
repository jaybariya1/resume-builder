import React, { useContext } from "react";

const Template1 = ({ data }) => {
  // const { resumeData } = useContext(ResumeInfoContext);
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
  const hasHeaderInfo =
    firstName || lastName || email || phone || location;

  return (


    <main
      id="resume-preview"
      className="w-[794px] min-h-[1123px] mx-auto bg-white text-black p-16 text-[13px] leading-relaxed"
    >

      {/* ================= HEADER ================= */}
      {hasHeaderInfo && (
        <header className="mb-4">
          {(firstName || lastName) && (
            <h1 className="text-[30px] font-bold">
              {firstName} {lastName}
            </h1>
          )}


          {(email || phone || location || linkedin || github || portfolio || website) && (
            <p className="text-gray-600 mb-6 space-x-2">
              {email && <span>{email}</span>}
              {phone && <span>• {phone}</span>}
              {location && <span>• {location}</span>}
              {linkedin && <span>• {linkedin}</span>}
              {github && <span>• {github}</span>}
              {portfolio && <span>• {portfolio}</span>}
              {website && <span>• {website}</span>}
            </p>
          )}
          {role && (
            <p className="font-medium text-gray-800 text-[15px] mt-1">{role}</p>
          )}
        </header>
      )}

      {/* ================= SUMMARY ================= */}
      {summary && (
        <section className="mb-6">
          {/* <h2 className="section-title">Summary</h2> */}
          <p className="mt-2 text-gray-700 preview" dangerouslySetInnerHTML={{ __html: summary }}></p>
        </section>
      )}

      {/* ================= SKILLS ================= */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="section-title text-[15px]">SKILLS</h2>

          <div className="mt-2 flex flex-wrap gap-2">
            {skills
              .filter(s => s.name)
              .map(skill => (
                <span
                  key={skill.id}
                  className="border px-2 py-1 rounded text-xs"
                >
                  {skill.name}
                </span>
              ))}
          </div>
        </section>
      )}

      {/* ================= EXPERIENCE ================= */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="section-title text-[15px]">EXPERIENCE</h2>

          {experience.map(exp => {
            if (!exp.title && !exp.company) return null;

            return (
              <div key={exp.id} className="mt-1">
                <p className="font-semibold text-[15px]">
                  {exp.title}
                  {exp.company && ` • ${exp.company}`}
                </p>

                <p className="text-xs text-gray-600">
                  {exp.location && <span>{exp.location}</span>}
                  {(exp.startDate || exp.endDate) && (
                    <span>
                      {" "}
                      | {exp.startDate} –{" "}
                      {exp.current ? "Present" : exp.endDate}
                    </span>
                  )}
                </p>

                {exp.description && (
                  <div
                    className="mt-2 text-gray-700 preview"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* ================= PROJECTS ================= */}
      {project.length > 0 && (
        <section className="mb-6">
          <h2 className="section-title text-[15px]">PROJECTS</h2>

          {project.map(proj => {
            if (!proj.title) return null;

            return (
              <div key={proj.id} className="mt-1">
                <p className="font-semibold text-[15px]">
                  {proj.title}
                  {proj.url && (
                    <span className="text-xs text-blue-600 ml-2">
                      {proj.url}
                    </span>
                  )}
                </p>

                <p className="text-xs text-gray-600">
                  {proj.organization && <span>{proj.organization}</span>}
                  {(proj.starDate || proj.endDate) && (
                    <span>
                      {" "}
                      | {proj.starDate} –{" "}
                      {proj.current ? "Present" : proj.endDate}
                    </span>
                  )}
                </p>

                {proj.description && (
                  <div
                    className="preview mt-2 text-gray-700"
                    dangerouslySetInnerHTML={{ __html: proj.description }}
                  />
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* ================= EDUCATION ================= */}
      {education.length > 0 && (
        <section>
          <h2 className="section-title text-[15px]">EDUCATION</h2>

          {education.map(edu => {
            if (!edu.degree && !edu.school) return null;

            return (
              <div key={edu.id} className="mt-1">
                <p className="font-semibold text-[15px]">
                  {edu.degree}
                  {edu.school && ` • ${edu.school}`}
                </p>

                <p className="text-xs text-gray-600">
                  {edu.location && <span>{edu.location}</span>}
                  {edu.graduationDate && (
                    <span> | {edu.graduationDate}</span>
                  )}
                </p>
                {edu.description && (
                  <div
                    className="preview mt-2 text-gray-700"
                    dangerouslySetInnerHTML={{ __html: edu.description }}
                  />
                )}
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default Template1;