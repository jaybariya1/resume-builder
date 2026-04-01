import React from "react";

const Template8 = ({ data, accentColor = "#1a1a1a" }) => {
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
    profilePhoto = "",
  } = data;

  const fullLocation = location || [city, country].filter(Boolean).join(", ");

  const contactItems = [
    email && { icon: "mail", text: email },
    phone && { icon: "phone", text: phone },
    fullLocation && { icon: "location", text: fullLocation },
    linkedin && { icon: "linkedin", text: linkedin },
    github && { icon: "github", text: github },
    (portfolio || website) && { icon: "web", text: portfolio || website },
  ].filter(Boolean);

  const ContactIcon = ({ type }) => {
    const icons = {
      mail: <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>,
      phone: <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>,
      location: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>,
      linkedin: <><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></>,
      github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>,
      web: <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></>,
    };
    return (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        {icons[type]}
      </svg>
    );
  };

  const SidebarSection = ({ title, children }) => (
    <div className="mb-5">
      <div
        className="text-[0.8em] font-black uppercase tracking-[0.15em] mb-2 px-3 py-1.5 text-center"
        style={{ backgroundColor: accentColor, color: "#fff" }}
      >
        {title}
      </div>
      <div className="px-1">{children}</div>
    </div>
  );

  const MainSection = ({ title, children }) => (
    <section className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill={accentColor}>
          <path d="M20 6h-2.18c.07-.44.18-.88.18-1.35C18 2.99 16.5 1.5 14.65 1.5c-1.2 0-2.16.69-2.78 1.76L12 4.2l-.87-2.94C10.51 2.19 9.55 1.5 8.35 1.5 6.5 1.5 5 2.99 5 4.65c0 .47.11.91.18 1.35H3c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h17c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>
        </svg>
        <h2 className="text-[0.9167em] font-black uppercase tracking-[0.1em] text-black">
          {title}
        </h2>
      </div>
      <div className="h-[1px] bg-gray-300 mb-3" />
      {children}
    </section>
  );

  return (
    <main
      id="resume-preview"
      className="w-[794px] min-h-[1123px] mx-auto bg-white text-black flex"
      style={{
        fontFamily: fontFamily || "'Arial', 'Helvetica Neue', sans-serif",
        fontSize: fontSize ? `${fontSize}px` : "12px",
      }}
    >
      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-[220px] flex-shrink-0 bg-gray-50 border-r border-gray-200 py-8 px-0">
        {/* Name block */}
        <div className="px-5 mb-6">
          {/* Profile photo */}
          {profilePhoto && (
            <div className="flex justify-center mb-4">
              <img
                src={profilePhoto}
                alt="Profile"
                style={{
                  width: "110px",
                  height: "110px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: `2px solid ${accentColor}`,
                }}
              />
            </div>
          )}
          <h1 className="text-[1.4167em] font-black leading-snug text-black">
            {firstName} {lastName}
          </h1>
          {role && (
            <p className="text-[0.875em] text-gray-500 mt-0.5">{role}</p>
          )}
        </div>

        {/* Contact */}
        {contactItems.length > 0 && (
          <div className="mb-5 px-5">
            <div className="space-y-1.5">
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-[0.8333em] text-gray-600">
                  <span className="flex-shrink-0 mt-0.5">
                    <ContactIcon type={item.icon} />
                  </span>
                  <span className="break-all leading-snug">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.filter(l => l.name).length > 0 && (
          <SidebarSection title={sectionTitles[6] || "Languages"}>
            <div className="space-y-2 px-2">
              {languages.map((lang, i) => (
                <div key={i}>
                  <p className="text-[0.875em] font-bold text-black">{lang.name}</p>
                  {lang.level && (
                    <p className="text-[0.8em] text-gray-500">{lang.level}</p>
                  )}
                </div>
              ))}
            </div>
          </SidebarSection>
        )}

        {/* Certifications (as Courses) */}
        {certifications.filter(c => c.name).length > 0 && (
          <SidebarSection title={sectionTitles[7] || "Courses"}>
            <div className="space-y-3 px-2">
              {certifications.filter(c => c.name).map((cert, i) => (
                <div key={i}>
                  <p className="text-[0.875em] font-bold text-black leading-snug">{cert.name}</p>
                  {cert.issuer && (
                    <p className="text-[0.8em] text-gray-500 mt-0.5">{cert.issuer}</p>
                  )}
                  {cert.date && (
                    <p className="text-[0.75em] text-gray-400 mt-0.5">{cert.date}</p>
                  )}
                  {cert.description && (
                    <p className="text-[0.8em] text-gray-600 mt-1">{cert.description}</p>
                  )}
                </div>
              ))}
            </div>
          </SidebarSection>
        )}

        {/* Skills in sidebar */}
        {skills.filter(s => s.name).length > 0 && (
          <SidebarSection title={sectionTitles[4] || "Skills"}>
            <div className="space-y-1 px-2">
              {skills.filter(s => s.name).map((skill) => (
                <div key={skill.id} className="flex items-center gap-1.5 text-[0.875em] text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                  {skill.name}
                </div>
              ))}
            </div>
          </SidebarSection>
        )}
      </aside>

      {/* ── RIGHT MAIN ── */}
      <div className="flex-1 py-8 px-7">

        {/* Professional Experience */}
        {experience.filter(e => e.title || e.company).length > 0 && (
          <MainSection title={sectionTitles[2] || "Professional Experience"}>
            <div className="space-y-4">
              {experience.map((exp) => {
                if (!exp.title && !exp.company) return null;
                const dateRange = [
                  exp.startDate,
                  exp.startDate && (exp.endDate || exp.current) ? "–" : null,
                  exp.current ? "Present" : exp.endDate,
                ].filter(Boolean).join(" ");
                const loc = exp.location || "";
                return (
                  <div key={exp.id}>
                    <p className="font-bold text-[1.0833em] text-black">{exp.company || exp.title}</p>
                    <p className="text-[0.9167em] text-gray-600 italic">{exp.title}</p>
                    {(dateRange || loc) && (
                      <p className="text-[0.8333em] text-gray-500 mt-0.5">
                        {[dateRange, loc].filter(Boolean).join(" | ")}
                      </p>
                    )}
                    {exp.description && (
                      <div
                        className="mt-1.5 text-[0.9167em] text-gray-700 leading-[1.55] preview"
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </MainSection>
        )}

        {/* Education */}
        {education.filter(e => e.degree || e.school).length > 0 && (
          <MainSection title={sectionTitles[3] || "Education"}>
            <div className="space-y-3">
              {education.map((edu) => {
                if (!edu.degree && !edu.school) return null;
                const dateRange = edu.startDate && edu.graduationDate
                  ? `${edu.startDate} – ${edu.graduationDate}`
                  : edu.graduationDate || edu.startDate || "";
                return (
                  <div key={edu.id}>
                    <p className="font-bold text-[1.0833em] text-black">{edu.degree}</p>
                    {edu.school && (
                      <p className="text-[0.9167em] text-gray-600 italic">{edu.school}</p>
                    )}
                    {dateRange && (
                      <p className="text-[0.8333em] text-gray-500 mt-0.5">{dateRange}</p>
                    )}
                    {edu.description && (
                      <div
                        className="mt-1 text-[0.9167em] text-gray-700 preview"
                        dangerouslySetInnerHTML={{ __html: edu.description }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </MainSection>
        )}

        {/* Summary */}
        {summary && (
          <MainSection title={sectionTitles[1] || "Summary"}>
            <div
              className="text-[0.9167em] text-gray-700 leading-[1.6] preview"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          </MainSection>
        )}

        {/* Projects */}
        {project.filter(p => p.title).length > 0 && (
          <MainSection title={sectionTitles[5] || "Projects"}>
            <div className="space-y-3">
              {project.map((proj) => {
                if (!proj.title) return null;
                return (
                  <div key={proj.id}>
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
                  </div>
                );
              })}
            </div>
          </MainSection>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div
        className="absolute bottom-0 left-0 right-0 text-[0.75em] text-gray-500 flex justify-between px-8 py-3 border-t border-gray-200"
        style={{ position: "absolute" }}
      >
        <span>{firstName} {lastName}</span>
        <span>{email}</span>
        <span>1 / 1</span>
      </div>
    </main>
  );
};

export default Template8;
