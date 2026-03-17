import React from "react";

const createStyles = (fontFamily) => ({
  page: {
    width: "794px",
    minHeight: "1123px",
    backgroundColor: "#fff",
    color: "#000",
    padding: "48px 60px",
    fontFamily: fontFamily || "'Times New Roman','Georgia',serif",
    fontSize: "0.9583em",
    lineHeight: "1.4",
    boxSizing: "border-box",
  },
  name: {
    textAlign: "center",
    fontFamily: fontFamily || "'Times New Roman', serif",
    fontSize: "2.1667em",
    fontWeight: "bold",
    margin: "0 0 5px 0",
    letterSpacing: "0.01em",
  },
  contactLine: {
    textAlign: "center",
    fontSize: "0.9167em",
    margin: "0 0 8px 0",
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
    marginBottom: "4px",
  },
  sectionTitle: {
    fontFamily: fontFamily || "'Times New Roman', serif",
    fontSize: "1em",
    fontWeight: "bold",
    fontVariant: "small-caps",
    letterSpacing: "0.08em",
    margin: 0,
  },
  sectionRule: {
    flex: 1,
    height: "1px",
    backgroundColor: "#000",
    marginLeft: "6px",
  },
  row: {
    display: "flex",
    marginBottom: "8px",
  },
  dateCol: {
    width: "102px",
    flexShrink: 0,
    fontFamily: fontFamily || "'Times New Roman', serif",
  },
  contentCol: {
    flex: 1,
  },
  companyRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  companyName: {
    fontFamily: fontFamily || "'Times New Roman', serif",
    fontWeight: "bold",
    fontVariant: "small-caps",
  },
  locationText: {
    fontFamily: fontFamily || "'Times New Roman', serif",
  },
  jobTitle: {
    fontFamily: fontFamily || "'Times New Roman', serif",
    fontStyle: "italic",
    margin: 0,
  },
  plainText: {
    fontFamily: fontFamily || "'Times New Roman', serif",
    margin: "2px 0",
  },
});

function formatMonthYear(val) {
  if (!val) return "";
  if (val.includes("-")) {
    const [y, m] = val.split("-");
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    return `${months[parseInt(m, 10) - 1]} ${y}`;
  }
  return val;
}

function dateRange(start, end, current) {
  const s = formatMonthYear(start);
  const e = current ? "Present" : formatMonthYear(end);
  if (s && e) return `${s}–${e}`;
  return s || e || "";
}

const Template5 = ({ data }) => {

  const {
    firstName = "",
    lastName = "",
    email = "",
    phone = "",
    location = "",
    linkedin = "",
    github = "",
    portfolio = "",
    website = "",
    experience = [],
    education = [],
    skills = [],
    project = [],
    hideSkillLevel = false,
    fontFamily,
    fontSize,
    sectionTitles = {},
  } = data;

  const styles = createStyles(fontFamily);

  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  const contactParts = [
    location, phone, email, linkedin, github, portfolio, website
  ].filter(Boolean);

  const activeExperience = experience.filter(e => e.title || e.company);
  const activeEducation = education.filter(e => e.degree || e.school);
  const activeProjects = project.filter(p => p.title);

  const Section = ({ title, children }) => (
    <div style={styles.sectionBlock}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>{title}</h2>
        <div style={styles.sectionRule} />
      </div>
      {children}
    </div>
  );

  const DateRow = ({ date, children }) => (
    <div style={styles.row}>
      <div style={styles.dateCol}>{date}</div>
      <div style={styles.contentCol}>{children}</div>
    </div>
  );

  const Description = ({ html }) => {
    if (!html) return null;
    return (
      <div
        style={styles.plainText}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  return (
    <main
      id="resume-preview"
      style={{
        ...styles.page,
        fontSize: fontSize ? `${fontSize}px` : styles.page.fontSize
      }}
    >

      {fullName && <h1 style={styles.name}>{fullName}</h1>}

      {contactParts.length > 0 && (
        <p style={styles.contactLine}>
          {contactParts.map((part, i) => (
            <span key={i}>
              {i > 0 && <span style={{ margin: "0 5px" }}>·</span>}
              {part}
            </span>
          ))}
        </p>
      )}

      <hr style={styles.headerRule} />

      {activeExperience.length > 0 && (
        <Section title={sectionTitles[2] || "Experience"}>
          {activeExperience.map(exp => {
            const range = dateRange(exp.startDate, exp.endDate, exp.current);
            return (
              <DateRow key={exp.id} date={range}>
                {exp.company && (
                  <div style={styles.companyRow}>
                    <span style={styles.companyName}>{exp.company}</span>
                    {exp.location && (
                      <span style={styles.locationText}>{exp.location}</span>
                    )}
                  </div>
                )}
                {exp.title && <p style={styles.jobTitle}>{exp.title}</p>}
                <Description html={exp.description} />
              </DateRow>
            );
          })}
        </Section>
      )}

      {activeEducation.length > 0 && (
        <Section title={sectionTitles[3] || "Education"}>
          {activeEducation.map(edu => {
            const range = dateRange(edu.startDate, edu.graduationDate);
            return (
              <DateRow key={edu.id} date={range}>
                {edu.school && (
                  <div style={styles.companyRow}>
                    <span style={styles.companyName}>{edu.school}</span>
                    {edu.location && (
                      <span style={styles.locationText}>{edu.location}</span>
                    )}
                  </div>
                )}
                {edu.degree && <p style={styles.jobTitle}>{edu.degree}</p>}
                <Description html={edu.description} />
              </DateRow>
            );
          })}
        </Section>
      )}

      {activeProjects.length > 0 && (
        <Section title={sectionTitles[5] || "Projects"}>
          {activeProjects.map(proj => {
            const range = dateRange(proj.startDate, proj.endDate, proj.current);
            return (
              <DateRow key={proj.id} date={range}>
                <div style={styles.companyRow}>
                  <span style={styles.companyName}>{proj.title}</span>
                  {proj.organization && (
                    <span style={styles.locationText}>
                      {proj.organization}
                    </span>
                  )}
                </div>

                {proj.url && (
                  <p style={{ ...styles.jobTitle, fontStyle: "normal" }}>
                    {proj.url}
                  </p>
                )}

                <Description html={proj.description} />
              </DateRow>
            );
          })}
        </Section>
      )}

      {skills.filter(s => s.name).length > 0 && (
        <Section title={sectionTitles[4] || "Skills"}>
          <div style={{ paddingLeft: "102px" }}>
            {skills.filter(s => s.name).map(skill => {
              const filled = (skill.level ?? 2) + 1;
              const levelLabel = [
                "Beginner","Intermediate","Advanced","Expert"
              ][skill.level ?? 2];

              return (
                <div key={skill.id} style={{ marginBottom: "4px" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between"
                  }}>
                    <span>{skill.name}</span>
                    {!hideSkillLevel && (
                      <span style={{ fontSize: "0.75em", color: "#6b7280" }}>
                        {levelLabel}
                      </span>
                    )}
                  </div>

                  {!hideSkillLevel && (
                    <div style={{ display: "flex", gap: "2px", marginTop: "2px" }}>
                      {[0,1,2,3].map(i => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: "3px",
                            borderRadius: "9999px",
                            backgroundColor:
                              i < filled ? "#1e293b" : "#e2e8f0"
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}

    </main>
  );
};

export default Template5;