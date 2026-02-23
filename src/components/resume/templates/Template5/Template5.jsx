import React from "react";

const S = {
  page: {
    width: "794px",
    minHeight: "1123px",
    backgroundColor: "#fff",
    color: "#000",
    padding: "48px 60px 48px 60px",
    fontFamily: "'Times New Roman', 'Georgia', serif",
    fontSize: "11.5px",
    lineHeight: "1.4",
    boxSizing: "border-box",
  },
  name: {
    textAlign: "center",
    fontFamily: "'Times New Roman', serif",
    fontSize: "26px",
    fontWeight: "bold",
    margin: "0 0 5px 0",
    letterSpacing: "0.01em",
  },
  contactLine: {
    textAlign: "center",
    fontSize: "11px",
    margin: "0 0 8px 0",
    color: "#000",
  },
  headerRule: {
    border: "none",
    borderTop: "1.5px solid #000",
    margin: "0 0 10px 0",
  },
  sectionBlock: {
    marginBottom: "6px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "flex-end",
    gap: "0",
    marginBottom: "4px",
  },
  sectionTitle: {
    fontFamily: "'Times New Roman', serif",
    fontSize: "12px",
    fontWeight: "bold",
    fontVariant: "small-caps",
    letterSpacing: "0.08em",
    color: "#000",
    margin: 0,
    lineHeight: "1",
    flexShrink: 0,
  },
  sectionRule: {
    flex: 1,
    height: "1px",
    backgroundColor: "#000",
    marginLeft: "6px",
    alignSelf: "center",
  },
  row: {
    display: "flex",
    gap: "0",
    marginBottom: "8px",
  },
  dateCol: {
    width: "102px",
    flexShrink: 0,
    fontFamily: "'Times New Roman', serif",
    fontSize: "11.5px",
    color: "#000",
    paddingTop: "0",
    lineHeight: "1.4",
  },
  contentCol: {
    flex: 1,
    minWidth: 0,
  },
  companyRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "0",
  },
  companyName: {
    fontFamily: "'Times New Roman', serif",
    fontSize: "11.5px",
    fontWeight: "bold",
    fontVariant: "small-caps",
    letterSpacing: "0.04em",
    color: "#000",
  },
  locationText: {
    fontFamily: "'Times New Roman', serif",
    fontSize: "11.5px",
    color: "#000",
    fontWeight: "normal",
  },
  jobTitle: {
    fontFamily: "'Times New Roman', serif",
    fontSize: "11.5px",
    fontStyle: "italic",
    color: "#000",
    margin: "0",
  },
  bulletList: {
    margin: "2px 0 0 0",
    paddingLeft: "16px",
    listStyleType: "disc",
    fontFamily: "'Times New Roman', serif",
    fontSize: "11.5px",
    lineHeight: "1.45",
    color: "#000",
  },
  plainText: {
    fontFamily: "'Times New Roman', serif",
    fontSize: "11.5px",
    lineHeight: "1.45",
    color: "#000",
    margin: "2px 0 0 0",
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatMonthYear(val) {
  if (!val) return "";
  if (val.includes("-")) {
    const [y, m] = val.split("-");
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[parseInt(m,10)-1]} ${y}`;
  }
  return val;
}

function dateRange(start, end, current) {
  const s = formatMonthYear(start);
  const e = current ? "Present" : formatMonthYear(end);
  if (s && e) return `${s}–${e}`;
  return s || e || "";
}

// Renders HTML description — strips outer <p> tags and shows as bullet list if <ul><li> present
function Description({ html }) {
  if (!html || html === "<p></p>" || html === "<p><br></p>") return null;

  if (html.includes("<li>")) {
    return (
      <div
        style={{
          margin: "2px 0 0 0",
          fontFamily: "'Times New Roman', serif",
          fontSize: "11.5px",
          lineHeight: "1.45",
          color: "#000",
        }}
        className="preview"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return (
    <div
      style={S.plainText}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// Section wrapper with small-caps title + right rule
function Section({ title, children }) {
  return (
    <div style={S.sectionBlock}>
      <div style={S.sectionHeader}>
        <h2 style={S.sectionTitle}>{title}</h2>
        <div style={S.sectionRule} />
      </div>
      {children}
    </div>
  );
}

// A row with date on left, content on right
function DateRow({ date, children }) {
  return (
    <div style={S.row}>
      <div style={S.dateCol}>{date}</div>
      <div style={S.contentCol}>{children}</div>
    </div>
  );
}

// ─── Main template ──────────────────────────────────────────────────────────

const Template5 = ({ data }) => {
  const {
    firstName = "",
    lastName = "",
    email = "",
    phone = "",
    location = "",
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
  } = data;

  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  const contactParts = [
    location, phone, email, linkedin, github, portfolio, website,
  ].filter(Boolean);

  const activeExperience = experience.filter(e => e.title || e.company);
  const activeEducation = education.filter(e => e.degree || e.school);
  const activeProjects = project.filter(p => p.title);
  const skillNames = skills.filter(s => s.name).map(s => s.name);

  return (
    <main id="resume-preview" style={S.page}>

      {/* ── HEADER ── */}
      {fullName && <h1 style={S.name}>{fullName}</h1>}

      {contactParts.length > 0 && (
        <p style={S.contactLine}>
          {contactParts.map((part, i) => (
            <span key={i}>
              {i > 0 && <span style={{ margin: "0 5px" }}>·</span>}
              {part}
            </span>
          ))}
        </p>
      )}

      <hr style={S.headerRule} />

      {/* ── EXPERIENCE ── */}
      {activeExperience.length > 0 && (
        <Section title="Experience">
          {activeExperience.map((exp) => {
            const range = dateRange(exp.startDate, exp.endDate, exp.current);
            return (
              <DateRow key={exp.id} date={range}>
                {/* Company + location */}
                {exp.company && (
                  <div style={S.companyRow}>
                    <span style={S.companyName}>{exp.company}</span>
                    {exp.location && <span style={S.locationText}>{exp.location}</span>}
                  </div>
                )}
                {/* Job title */}
                {exp.title && <p style={S.jobTitle}>{exp.title}</p>}
                {/* Bullets */}
                <Description html={exp.description} />
              </DateRow>
            );
          })}
        </Section>
      )}

      {/* ── EDUCATION ── */}
      {activeEducation.length > 0 && (
        <Section title="Education">
          {activeEducation.map((edu) => {
            const range = dateRange(edu.startDate, edu.graduationDate, false);
            return (
              <DateRow key={edu.id} date={range}>
                {edu.school && (
                  <div style={S.companyRow}>
                    <span style={S.companyName}>{edu.school}</span>
                    {edu.location && <span style={S.locationText}>{edu.location}</span>}
                  </div>
                )}
                {edu.degree && <p style={S.jobTitle}>{edu.degree}</p>}
                <Description html={edu.description} />
              </DateRow>
            );
          })}
        </Section>
      )}

      {/* ── PROJECTS ── */}
      {activeProjects.length > 0 && (
        <Section title="Projects">
          {activeProjects.map((proj) => {
            const range = dateRange(proj.startDate, proj.endDate, proj.current);
            return (
              <DateRow key={proj.id} date={range}>
                <div style={S.companyRow}>
                  <span style={S.companyName}>{proj.title}</span>
                  {proj.organization && <span style={S.locationText}>{proj.organization}</span>}
                </div>
                {proj.url && (
                  <p style={{ ...S.jobTitle, fontStyle: "normal", fontSize: "10.5px", color: "#333" }}>
                    {proj.url}
                  </p>
                )}
                <Description html={proj.description} />
              </DateRow>
            );
          })}
        </Section>
      )}

      {/* ── OTHER / SKILLS ── */}
      {skillNames.length > 0 && (
        <Section title="Other">
          <div style={{ paddingLeft: "102px" }}>
            <ul style={S.bulletList}>
              <li>
                <span style={{ fontWeight: "normal" }}>Technical Skills: </span>
                {skillNames.join(", ")}
              </li>
            </ul>
          </div>
        </Section>
      )}

    </main>
  );
};

export default Template5;
