import React from "react";

/* ── Icon helpers (inline SVGs to avoid lucide import issues at scale) ─── */
const IconSummary = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-3 9H7v-2h3v2zm0-4H7v-2h3v2zm6 4h-5v-2h5v2zm0-4h-5v-2h5v2z"/>
  </svg>
);
const IconExp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 6h-2.18c.07-.44.18-.88.18-1.35C18 2.99 16.5 1.5 14.65 1.5c-1.2 0-2.16.69-2.78 1.76L12 4.2l-.87-2.94C10.51 2.19 9.55 1.5 8.35 1.5 6.5 1.5 5 2.99 5 4.65c0 .47.11.91.18 1.35H3c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h17c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5.35-3c.74 0 1.35.61 1.35 1.35 0 .75-.61 1.35-1.35 1.35S13.3 5.1 13.3 4.35C13.3 3.61 13.91 3 14.65 3zM8.35 3c.74 0 1.35.61 1.35 1.35 0 .75-.61 1.35-1.35 1.35-.74 0-1.35-.6-1.35-1.35C7 3.61 7.61 3 8.35 3zM20 19H3V8h17v11z"/>
  </svg>
);
const IconEdu = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L1 9l4 2.18V15c0 3.31 5.35 4.5 7 4.5S19 18.31 19 15v-3.82L21 10v7h2V9L12 3zm3.5 8.71L12 13.5l-3.5-1.79V9.79L12 11.5l3.5-1.79v1.21zM12 5.24L18.14 9 12 12.76 5.86 9 12 5.24z"/>
  </svg>
);
const IconSkills = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);
const IconLang = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.9 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
  </svg>
);
const IconCert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
  </svg>
);

const Template6 = ({ data, accentColor = "#d4a017" }) => {
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
    hideSkillLevel = false,
    fontFamily,
    fontSize,
    sectionTitles = {},
  } = data;

  const fullLocation = location || [city, country].filter(Boolean).join(", ");

  const SectionHeader = ({ icon: Icon, children }) => (
    <div className="flex items-center gap-2 mb-1" style={{ color: accentColor }}>
      <Icon />
      <h2 className="text-[0.9167em] font-black uppercase tracking-[0.12em]">{children}</h2>
    </div>
  );

  const Divider = () => (
    <div className="h-[2px] mb-3" style={{ backgroundColor: accentColor }} />
  );

  const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, "");

  return (
    <main
      id="resume-preview"
      className="w-[794px] min-h-[1123px] mx-auto bg-white text-black"
      style={{
        fontFamily: fontFamily || "'Calibri', 'Arial', sans-serif",
        fontSize: fontSize ? `${fontSize}px` : "12px",
        padding: "40px 48px",
      }}
    >
      {/* ── HEADER ── */}
      <header className="mb-5">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1
            className="text-[2.5em] font-black leading-none"
            style={{ color: accentColor }}
          >
            {firstName} {lastName}
          </h1>
          {role && (
            <span className="text-[1.3em] font-light text-gray-700">{role}</span>
          )}
        </div>

        {/* contact row with icons */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2 text-[0.8333em] text-gray-600">
          {email && (
            <span className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              {email}
            </span>
          )}
          {phone && (
            <span className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              {phone}
            </span>
          )}
          {fullLocation && (
            <span className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {fullLocation}
            </span>
          )}
          {linkedin && (
            <span className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              {linkedin}
            </span>
          )}
        </div>
      </header>

      {/* ── SUMMARY ── */}
      {summary && (
        <section className="mb-5">
          <SectionHeader icon={IconSummary}>{sectionTitles[1] || "Summary"}</SectionHeader>
          <Divider />
          <div
            className="text-[0.9167em] leading-[1.6] text-gray-700 preview"
            dangerouslySetInnerHTML={{ __html: summary }}
          />
        </section>
      )}

      {/* ── PROFESSIONAL EXPERIENCE ── */}
      {experience.filter(e => e.title || e.company).length > 0 && (
        <section className="mb-5">
          <SectionHeader icon={IconExp}>{sectionTitles[2] || "Professional Experience"}</SectionHeader>
          <Divider />
          <div className="space-y-4">
            {experience.map((exp) => {
              if (!exp.title && !exp.company) return null;
              const dateRange = [
                exp.startDate,
                exp.startDate && (exp.endDate || exp.current) ? "–" : null,
                exp.current ? "Present" : exp.endDate,
              ].filter(Boolean).join(" ");
              const locationStr = exp.location || "";
              return (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[1em] font-bold text-black">
                        {exp.title}
                        {exp.company && (
                          <span className="font-normal italic text-gray-600">, {exp.company}</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      {dateRange && (
                        <p className="text-[0.875em] font-semibold" style={{ color: accentColor }}>
                          {dateRange}
                        </p>
                      )}
                      {locationStr && (
                        <p className="text-[0.8125em] text-gray-500">{locationStr}</p>
                      )}
                    </div>
                  </div>
                  {exp.description && (
                    <div
                      className="mt-1 text-[0.9167em] leading-[1.55] text-gray-700 preview"
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── EDUCATION ── */}
      {education.filter(e => e.degree || e.school).length > 0 && (
        <section className="mb-5">
          <SectionHeader icon={IconEdu}>{sectionTitles[3] || "Education"}</SectionHeader>
          <Divider />
          <div className="space-y-3">
            {education.map((edu) => {
              if (!edu.degree && !edu.school) return null;
              return (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <p className="text-[1em] font-bold text-black">{edu.degree}</p>
                    {edu.school && (
                      <p className="text-[0.9167em] italic text-gray-600">{edu.school}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    {(edu.graduationDate || edu.startDate) && (
                      <p className="text-[0.875em] font-semibold" style={{ color: accentColor }}>
                        {edu.startDate && edu.graduationDate
                          ? `${edu.startDate} – ${edu.graduationDate}`
                          : edu.graduationDate || edu.startDate}
                      </p>
                    )}
                    {edu.location && (
                      <p className="text-[0.8125em] text-gray-500">{edu.location}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── SKILLS ── */}
      {skills.filter(s => s.name).length > 0 && (
        <section className="mb-5">
          <SectionHeader icon={IconSkills}>{sectionTitles[4] || "Skills"}</SectionHeader>
          <Divider />
          <div className="grid grid-cols-3 gap-x-4 gap-y-1">
            {skills.filter(s => s.name).map((skill) => (
              <div key={skill.id} className="flex items-center gap-1.5 text-[0.9167em] text-gray-700">
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
          <SectionHeader icon={IconLang}>{sectionTitles[6] || "Languages"}</SectionHeader>
          <Divider />
          <div className="flex flex-wrap gap-x-8 gap-y-1 text-[0.9167em] text-gray-700">
            {languages.map((lang, i) => (
              <span key={i}>
                <span className="font-bold">{lang.name}</span>
                {lang.level && <span className="text-gray-500"> — {lang.level}</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── CERTIFICATIONS ── */}
      {certifications.filter(c => c.name).length > 0 && (
        <section className="mb-5">
          <SectionHeader icon={IconCert}>{sectionTitles[7] || "Certificates"}</SectionHeader>
          <Divider />
          <div className="grid grid-cols-3 gap-x-4 gap-y-1">
            {certifications.filter(c => c.name).map((cert, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[0.9167em] text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: accentColor }} />
                {cert.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PROJECTS ── */}
      {project.filter(p => p.title).length > 0 && (
        <section className="mb-5">
          <SectionHeader icon={IconSummary}>{sectionTitles[5] || "Projects"}</SectionHeader>
          <Divider />
          <div className="space-y-3">
            {project.map((proj) => {
              if (!proj.title) return null;
              return (
                <div key={proj.id}>
                  <p className="text-[1em] font-bold text-black">
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
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
};

export default Template6;
