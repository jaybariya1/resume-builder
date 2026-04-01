import React from "react";

const Template9 = ({ data, accentColor = "#000000" }) => {
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
      <h2 className="text-[1em] font-bold text-black" style={{ fontVariant: "small-caps", letterSpacing: "0.04em" }}>
        {children}
      </h2>
      <div className="h-[1px] bg-black mt-1" />
    </div>
  );

  /* Bullet dot skill rating (filled / empty circles) */
  const DotRating = ({ level = 2 }) => {
    const filled = level + 1; // 0–3 index → 1–4 filled
    return (
      <div className="flex gap-0.5 items-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="inline-block w-2 h-2 rounded-full border border-black"
            style={{ backgroundColor: i < filled ? accentColor || "#000" : "transparent" }}
          />
        ))}
      </div>
    );
  };

  /* Two-column entry: date-left (narrow) + content-right */
  const TwoColRow = ({ dateTop, dateBottom, children }) => (
    <div className="flex gap-4 mb-4">
      <div className="w-[120px] flex-shrink-0 text-[0.875em] text-black leading-snug pt-0.5">
        {dateTop && <div>{dateTop}</div>}
        {dateBottom && <div className="text-gray-500">{dateBottom}</div>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );

  return (
    <main
      id="resume-preview"
      className="w-[794px] min-h-[1123px] mx-auto bg-white text-black"
      style={{
        fontFamily: fontFamily || "'Georgia', 'Times New Roman', serif",
        fontSize: fontSize ? `${fontSize}px` : "12px",
        padding: "48px 56px",
      }}
    >
      {/* ── HEADER ── */}
      <header className="mb-5">
        <div className="flex items-baseline gap-4 flex-wrap">
          <h1 className="text-[2.3333em] font-bold leading-none text-black">
            {firstName} {lastName}
          </h1>
          {role && (
            <span className="text-[1.3333em] font-light italic text-gray-700">{role}</span>
          )}
        </div>

        {/* contact two-column */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-0.5 mt-2 text-[0.875em] text-black">
          {fullLocation && (
            <span className="flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {fullLocation}
            </span>
          )}
          {email && (
            <span className="flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              {email}
            </span>
          )}
          {phone && (
            <span className="flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              {phone}
            </span>
          )}
          {linkedin && (
            <span className="flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              {linkedin}
            </span>
          )}
        </div>
      </header>

      {/* ── PROFILE / SUMMARY ── */}
      {summary && (
        <section className="mb-5">
          <SectionTitle>{sectionTitles[1] || "Profile"}</SectionTitle>
          <div
            className="text-[0.9583em] leading-[1.6] text-black preview"
            style={{ textAlign: "justify" }}
            dangerouslySetInnerHTML={{ __html: summary }}
          />
        </section>
      )}

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
              <TwoColRow
                key={exp.id}
                dateTop={dateRange}
                dateBottom={exp.location || ""}
              >
                <p className="font-bold text-[1em] text-black">{exp.title}</p>
                {exp.company && (
                  <p className="text-[0.9167em] italic text-gray-600">{exp.company}</p>
                )}
                {exp.description && (
                  <div
                    className="mt-1 text-[0.9167em] text-black leading-[1.5] preview"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                )}
              </TwoColRow>
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
              <TwoColRow
                key={edu.id}
                dateTop={dateRange}
                dateBottom={edu.location || ""}
              >
                <p className="font-bold text-[1em] text-black">{edu.degree}</p>
                {edu.school && (
                  <p className="text-[0.9167em] italic text-gray-600">{edu.school}</p>
                )}
                {edu.description && (
                  <div
                    className="mt-1 text-[0.9167em] text-black preview"
                    dangerouslySetInnerHTML={{ __html: edu.description }}
                  />
                )}
              </TwoColRow>
            );
          })}
        </section>
      )}

      {/* ── SKILLS (dot-rating two-column) ── */}
      {skills.filter(s => s.name).length > 0 && (
        <section className="mb-5">
          <SectionTitle>{sectionTitles[4] || "Skills"}</SectionTitle>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {skills.filter(s => s.name).map((skill) => (
              <div key={skill.id} className="flex items-center justify-between gap-2">
                <span className="text-[0.9583em] text-black">{skill.name}</span>
                {!hideSkillLevel && <DotRating level={skill.level ?? 3} />}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── LANGUAGES ── */}
      {languages.filter(l => l.name).length > 0 && (
        <section className="mb-5">
          <SectionTitle>{sectionTitles[6] || "Languages"}</SectionTitle>
          <div className="flex flex-wrap gap-x-8 gap-y-1 text-[0.9583em] text-black">
            {languages.map((lang, i) => (
              <span key={i}>
                • <span className="font-semibold">{lang.name}</span>
                {lang.level && <span className="text-gray-600"> — {lang.level}</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── AWARDS ── */}
      {awards.filter(a => a.title || a.name).length > 0 && (
        <section className="mb-5">
          <SectionTitle>{sectionTitles[8] || "Awards"}</SectionTitle>
          <div className="space-y-2">
            {awards.map((award, i) => (
              <div key={i}>
                <p className="font-bold text-[0.9583em] text-black">{award.title || award.name}</p>
                {(award.issuer || award.organization) && (
                  <p className="text-[0.875em] italic text-gray-600">{award.issuer || award.organization}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CERTIFICATIONS ── */}
      {certifications.filter(c => c.name).length > 0 && (
        <section className="mb-5">
          <SectionTitle>{sectionTitles[7] || "Certifications"}</SectionTitle>
          <div className="flex flex-wrap gap-x-8 gap-y-1 text-[0.9583em] text-black">
            {certifications.filter(c => c.name).map((cert, i) => (
              <span key={i}>• {cert.name}</span>
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
              <TwoColRow key={proj.id} dateTop={dateRange}>
                <p className="font-bold text-[1em] text-black">
                  {proj.title}
                  {proj.url && (
                    <span className="font-normal text-[0.875em] ml-2 italic text-gray-400">{proj.url}</span>
                  )}
                </p>
                {proj.description && (
                  <div
                    className="mt-1 text-[0.9167em] text-black preview"
                    dangerouslySetInnerHTML={{ __html: proj.description }}
                  />
                )}
              </TwoColRow>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default Template9;
