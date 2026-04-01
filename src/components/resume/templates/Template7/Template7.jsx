import React from "react";

const Template7 = ({ data, accentColor = "#22c55e" }) => {
  const {
    firstName = "",
    lastName = "",
    email = "",
    phone = "",
    location = "",
    city = "",
    country = "",
    summary = "",
    role = "",
    linkedin = "",
    github = "",
    portfolio = "",
    website = "",
    experience = [],
    education = [],
    skills = [],
    project = [],
    certifications = [],
    languages = [],
    awards = [],
    hideSkillLevel = false,
    fontFamily,
    fontSize,
    sectionTitles = {},
  } = data;

  const fullLocation = location || [city, country].filter(Boolean).join(", ");

  const SectionTitle = ({ children }) => (
    <div className="mb-3">
      <h2
        className="text-[1.0833em] font-bold"
        style={{ color: accentColor }}
      >
        {children}
      </h2>
      <div className="h-[2px] mt-0.5 w-12" style={{ backgroundColor: accentColor }} />
    </div>
  );

  /* date-left + content-right row used by experience & education */
  const TwoColEntry = ({ dateTop, dateBottom, children }) => (
    <div className="flex gap-5 mb-5">
      {/* left date column */}
      <div className="flex-shrink-0 w-[140px] text-[0.8333em] text-gray-500 leading-snug pt-0.5">
        {dateTop && <div>{dateTop}</div>}
        {dateBottom && <div>{dateBottom}</div>}
      </div>
      {/* right content */}
      <div className="flex-1">{children}</div>
    </div>
  );

  return (
    <main
      id="resume-preview"
      className="w-[794px] min-h-[1123px] mx-auto bg-white text-black"
      style={{
        fontFamily: fontFamily || "'Inter', 'Arial', sans-serif",
        fontSize: fontSize ? `${fontSize}px` : "12px",
        padding: "44px 52px",
      }}
    >
      {/* ── HEADER ── */}
      <header className="mb-6">
        <div className="flex items-baseline gap-4 flex-wrap">
          <h1 className="text-[2.6667em] font-black leading-none text-black">
            {firstName} {lastName}
          </h1>
          {role && (
            <span
              className="text-[1.5em] font-light italic"
              style={{ color: accentColor }}
            >
              {role}
            </span>
          )}
        </div>

        {/* contact icons row */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-3 text-[0.8333em] text-gray-600">
          {email && (
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              {email}
            </span>
          )}
          {phone && (
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              {phone}
            </span>
          )}
          {fullLocation && (
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {fullLocation}
            </span>
          )}
          {linkedin && (
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              {linkedin}
            </span>
          )}
        </div>
      </header>

      {/* ── PROFESSIONAL EXPERIENCE ── */}
      {experience.filter(e => e.title || e.company).length > 0 && (
        <section className="mb-5">
          <SectionTitle>{sectionTitles[2] || "Professional Experience"}</SectionTitle>
          {experience.map((exp) => {
            if (!exp.title && !exp.company) return null;
            const dateRange = [
              exp.startDate,
              exp.startDate && (exp.endDate || exp.current) ? "–" : null,
              exp.current ? "Present" : exp.endDate,
            ].filter(Boolean).join(" ");
            return (
              <TwoColEntry
                key={exp.id}
                dateTop={dateRange}
                dateBottom={exp.location || ""}
              >
                <p className="font-bold text-[1.0833em] text-black">
                  {exp.title}
                  {exp.company && (
                    <span className="font-normal italic text-gray-500">, {exp.company}</span>
                  )}
                </p>
                {exp.description && (
                  <div
                    className="mt-1 text-[0.9167em] text-gray-700 leading-[1.55] preview"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                )}
              </TwoColEntry>
            );
          })}
        </section>
      )}

      {/* ── EDUCATION ── */}
      {education.filter(e => e.degree || e.school).length > 0 && (
        <section className="mb-5">
          <SectionTitle>{sectionTitles[3] || "Education"}</SectionTitle>
          {education.map((edu) => {
            if (!edu.degree && !edu.school) return null;
            const dateRange = edu.startDate && edu.graduationDate
              ? `${edu.startDate} – ${edu.graduationDate}`
              : edu.graduationDate || edu.startDate || "";
            return (
              <TwoColEntry
                key={edu.id}
                dateTop={dateRange}
                dateBottom={edu.location || ""}
              >
                <p className="font-bold text-[1.0833em] text-black">{edu.degree}</p>
                {edu.school && (
                  <p className="text-[0.9167em] italic text-gray-600">{edu.school}</p>
                )}
                {edu.description && (
                  <div
                    className="mt-1 text-[0.9167em] text-gray-700 preview"
                    dangerouslySetInnerHTML={{ __html: edu.description }}
                  />
                )}
              </TwoColEntry>
            );
          })}
        </section>
      )}

      {/* ── SKILLS ── */}
      {skills.filter(s => s.name).length > 0 && (
        <section className="mb-5">
          <SectionTitle>{sectionTitles[4] || "Skills"}</SectionTitle>
          <div className="grid grid-cols-3 gap-x-4 gap-y-1">
            {skills.filter(s => s.name).map((skill) => (
              <div key={skill.id} className="flex items-center gap-2 text-[0.9167em] text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                {skill.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── LANGUAGES ── */}
      {languages.filter(l => l.name).length > 0 && (
        <section className="mb-5">
          <SectionTitle>{sectionTitles[6] || "Languages"}</SectionTitle>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[0.9167em] text-gray-700">
            {languages.map((lang, i) => (
              <span key={i}>
                <span className="font-bold">{lang.name}</span>
                {lang.level && <span className="text-gray-500"> — {lang.level}</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── PROJECTS ── */}
      {project.filter(p => p.title).length > 0 && (
        <section className="mb-5">
          <SectionTitle>{sectionTitles[5] || "Projects"}</SectionTitle>
          {project.map((proj) => {
            if (!proj.title) return null;
            const dateRange = [
              proj.startDate,
              proj.startDate && (proj.endDate || proj.current) ? "–" : null,
              proj.current ? "Present" : proj.endDate,
            ].filter(Boolean).join(" ");
            return (
              <TwoColEntry key={proj.id} dateTop={dateRange}>
                <p className="font-bold text-[1.0833em] text-black">
                  {proj.title}
                  {proj.url && (
                    <span className="font-normal text-[0.8333em] ml-2 text-gray-400">{proj.url}</span>
                  )}
                </p>
                {proj.description && (
                  <div
                    className="mt-1 text-[0.9167em] text-gray-700 preview"
                    dangerouslySetInnerHTML={{ __html: proj.description }}
                  />
                )}
              </TwoColEntry>
            );
          })}
        </section>
      )}

      {/* ── CERTIFICATIONS ── */}
      {certifications.filter(c => c.name).length > 0 && (
        <section className="mb-5">
          <SectionTitle>{sectionTitles[7] || "Certifications"}</SectionTitle>
          <div className="grid grid-cols-3 gap-x-4 gap-y-1">
            {certifications.filter(c => c.name).map((cert, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[0.9167em] text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                {cert.name}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default Template7;
