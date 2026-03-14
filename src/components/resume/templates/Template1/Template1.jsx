import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";

const Template1 = ({ data }) => {
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
    experience = [],
    education = [],
    skills = [],
    project = [],
    hideSkillLevel = false,
  } = data;

  const fullLocation = location || [city, country].filter(Boolean).join(", ");
  const hasContact = phone || email || fullLocation || linkedin || github || portfolio;
  const hasName = firstName || lastName;

  // Deduplicate skills by name
  const uniqueSkills = skills.filter((s, i, arr) =>
    s.name && arr.findIndex(x => x.name === s.name) === i
  );

  return (
    <main
      id="resume-preview"
      className="w-[794px] min-h-[1123px] mx-auto bg-white text-black flex flex-col"
      style={{ fontFamily: "'Arial', 'Helvetica Neue', sans-serif" }}
    >
      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="px-18 pt-12 pb-0 text-center">
        {hasName && (
          <h1 className="text-[38px] font-black tracking-[0.14em] uppercase text-black leading-none mb-1.5">
            {firstName} {lastName}
          </h1>
        )}
        {role && (
          <p className="text-[12.5px] font-normal tracking-[0.06em] text-black mb-5">
            {role}
          </p>
        )}

        {/* Top divider */}
        <div className="border-t border-black mb-4" />

        {/* Contact row */}
        {hasContact && (
          <div className="flex items-center justify-center gap-8 text-[11px] text-black mb-4">
            {phone && (
              <span className="flex items-center gap-1.5">
                <Phone size={10} strokeWidth={2.5} />
                {phone}
              </span>
            )}
            {email && (
              <span className="flex items-center gap-1.5">
                <Mail size={10} strokeWidth={2.5} />
                {email}
              </span>
            )}
            {fullLocation && (
              <span className="flex items-center gap-1.5">
                <MapPin size={10} strokeWidth={2.5} />
                {fullLocation}
              </span>
            )}
            {linkedin && (
              <span className="flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                {linkedin}
              </span>
            )}
            {github && (
              <span className="flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
                {github}
              </span>
            )}
            {portfolio && (
              <span className="flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
                {portfolio}
              </span>
            )}
          </div>
        )}

        {/* Bottom divider */}
        <div className="border-t border-black" />
      </header>

      {/* ── BODY ────────────────────────────────────────────── */}
      <div className="px-18 pt-5 flex-1">

        {/* ── ABOUT ME ── */}
        {summary && (
          <section className="mb-5">
            <SectionTitle>About Me</SectionTitle>
            <div
              className="text-[11.5px] leading-[1.7] text-black preview"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          </section>
        )}

        {/* ── EDUCATION ── */}
        {education.filter(e => e.degree || e.school).length > 0 && (
          <section className="mb-5">
            <SectionTitle>Education</SectionTitle>
            <div className="space-y-4">
              {education.map((edu) => {
                if (!edu.degree && !edu.school) return null;
                return (
                  <div key={edu.id}>
                    <p className="text-[10.5px] text-black/60 mb-0.5 tracking-wide">
                      {[edu.school, edu.graduationDate || edu.startDate].filter(Boolean).join(" | ")}
                    </p>
                    <p className="text-[12px] font-bold text-black">{edu.degree}</p>
                    {edu.description && (
                      <div
                        className="mt-1 text-[11.5px] leading-[1.65] text-black preview"
                        dangerouslySetInnerHTML={{ __html: edu.description }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── WORK EXPERIENCE ── */}
        {experience.filter(e => e.title || e.company).length > 0 && (
          <section className="mb-5">
            <SectionTitle>Work Experience</SectionTitle>
            <div className="space-y-4">
              {experience.map((exp) => {
                if (!exp.title && !exp.company) return null;
                const dateRange = [
                  exp.startDate,
                  exp.startDate && (exp.endDate || exp.current) ? "-" : null,
                  exp.current ? "Present" : exp.endDate,
                ].filter(Boolean).join(" ");
                return (
                  <div key={exp.id}>
                    <p className="text-[10.5px] text-black/60 mb-0.5 tracking-wide">
                      {[exp.company, dateRange].filter(Boolean).join(" | ")}
                    </p>
                    <p className="text-[12px] font-bold text-black">{exp.title}</p>
                    {exp.description && (
                      <div
                        className="mt-1 text-[11.5px] leading-[1.65] text-black preview"
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── PROJECTS ── */}
        {project.filter(p => p.title).length > 0 && (
          <section className="mb-5">
            <SectionTitle>Projects</SectionTitle>
            <div className="space-y-4">
              {project.map((proj) => {
                if (!proj.title) return null;
                const dateRange = [
                  proj.startDate,
                  proj.startDate && (proj.endDate || proj.current) ? "-" : null,
                  proj.current ? "Present" : proj.endDate,
                ].filter(Boolean).join(" ");
                return (
                  <div key={proj.id}>
                    <p className="text-[10.5px] text-black/60 mb-0.5 tracking-wide">
                      {[proj.organization, dateRange].filter(Boolean).join(" | ")}
                    </p>
                    <p className="text-[12px] font-bold text-black">
                      {proj.title}
                      {proj.url && (
                        <span className="text-[10px] font-normal text-black/50 ml-2">{proj.url}</span>
                      )}
                    </p>
                    {proj.description && (
                      <div
                        className="mt-1 text-[11.5px] leading-[1.65] text-black preview"
                        dangerouslySetInnerHTML={{ __html: proj.description }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── SKILLS ── */}
        {uniqueSkills.length > 0 && (
          <section className="mb-8">
            <SectionTitle>Skills</SectionTitle>
            <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
              {uniqueSkills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />
                  <span className="text-[11.5px] text-black">{skill.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* ── DARK FOOTER BAR ─────────────────────────────────── */}
      <footer className="h-7 bg-[#1c1c1c] mt-auto" />
    </main>
  );
};

function SectionTitle({ children }) {
  return (
    <div className="mb-3">
      <h2 className="text-[12.5px] font-black tracking-[0.12em] uppercase text-black mb-1.5">
        {children}
      </h2>
      <div className="border-t border-black" />
    </div>
  );
}

export default Template1;
