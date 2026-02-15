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
    // <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg min-h-[1100px] text-slate-800">
    //   {/* HEADER SECTION */}
    //   <header className="border-b-2 border-blue-600 pb-5 mb-6">
    //     <h1 className="text-4xl font-bold uppercase tracking-tight text-slate-900">
    //       {firstName} <span className="text-blue-600">{lastName}</span>
    //     </h1>
    //     <p className="text-xl font-medium text-slate-600 mt-1">{role}</p>

    //     {/* CONTACT INFO GRID */}
    //     <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-slate-600">
    //       <div>📧 {email}</div>
    //       <div>📞 {phone}</div>
    //       <div>📍 {location}</div>
    //       {website && <div>🌐 {website}</div>}
    //     </div>

    //     {/* SOCIAL LINKS */}
    //     <div className="flex flex-wrap gap-4 mt-3 text-xs font-semibold text-blue-700">
    //       {linkedin && <a href={linkedin} target="_blank">LINKEDIN</a>}
    //       {github && <a href={github} target="_blank">GITHUB</a>}
    //       {portfolio && <a href={portfolio} target="_blank">PORTFOLIO</a>}
    //     </div>
    //   </header>

    //   {/* SUMMARY */}
    //   {summary && (
    //     <section className="mb-8">
    //       <h2 className="text-lg font-bold uppercase text-blue-600 mb-2 border-b">Summary</h2>
    //       <p className="text-sm leading-relaxed">{summary}</p>
    //     </section>
    //   )}

    //   {/* EXPERIENCE */}
    //   <section className="mb-8">
    //     <h2 className="text-lg font-bold uppercase text-blue-600 mb-3 border-b">Experience</h2>
    //     {experience.length > 0 ? (
    //       experience.map((exp, index) => (
    //         <div key={index} className="mb-4">
    //           <div className="flex justify-between items-baseline">
    //             <h3 className="font-bold text-slate-900">{exp.role}</h3>
    //             <span className="text-xs font-medium text-slate-500">{exp.duration}</span>
    //           </div>
    //           <div className="text-sm font-semibold text-slate-700">{exp.company}</div>
    //           <p className="text-sm mt-1 text-slate-600" dangerouslySetInnerHTML={{ __html: exp.description }}></p>
    //         </div>
    //       ))
    //     ) : (
    //       <p className="text-xs text-slate-400">No experience added yet.</p>
    //     )}
    //   </section>

    //   <div className="grid grid-cols-12 gap-8">
    //     {/* LEFT COLUMN: EDUCATION */}
    //     <div className="col-span-7">
    //       <section className="mb-8">
    //         <h2 className="text-lg font-bold uppercase text-blue-600 mb-3 border-b">Education</h2>
    //         {education.map((edu, index) => (
    //           <div key={index} className="mb-3">
    //             <h3 className="font-bold text-sm text-slate-900">{edu.degree}</h3>
    //             <div className="text-xs text-slate-700">{edu.school}</div>
    //             <div className="text-xs text-slate-500">{edu.year}</div>
    //           </div>
    //         ))}
    //       </section>
    //     </div>

    //     {/* RIGHT COLUMN: SKILLS */}
    //     <div className="col-span-5">
    //       <section>
    //         <h2 className="text-lg font-bold uppercase text-blue-600 mb-3 border-b">Skills</h2>
    //         <div className="flex flex-wrap gap-2">
    //           {skills.map((skill, index) => (
    //             <span 
    //               key={index} 
    //               className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200"
    //             >
    //               {skill}
    //             </span>
    //           ))}
    //         </div>
    //       </section>
    //     </div>
    //   </div>
    // </div>


    // <div className="min-h-screen bg-gray-100 ">
    //   <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
    //     {/* Header Section */}
    //     <div className="bg-gradient-to-r  p-8">
    //       <header className="mb-4">
        
    //     <h1 className="text-xl font-bold">
    //       {resumeData.firstName} {resumeData.lastName}
    //     </h1>

    //     <p className="text-gray-600 text-xs mt-1">
    //       {resumeData.phone} • {resumeData.email} • {resumeData.location} •{" "}
    //       <span className="text-blue-600">{resumeData.linkedin}</span>
    //     </p>
    //   </header>
          
    //       {/* Contact Info */}
    //       <div className="flex flex-wrap gap-4 text-sm">
    //         {resumeData.email && (
    //           <div className="flex items-center gap-2">
    //             <Mail size={16} />
    //             <span>{resumeData.email}</span>
    //           </div>
    //         )}
    //         {resumeData.phone && (
    //           <div className="flex items-center gap-2">
    //             <Phone size={16} />
    //             <span>{resumeData.phone}</span>
    //           </div>
    //         )}
    //         {resumeData.location && (
    //           <div className="flex items-center gap-2">
    //             <MapPin size={16} />
    //             <span>{resumeData.location}</span>
    //           </div>
    //         )}
    //       </div>
          
    //       {/* Links */}
    //       <div className="flex flex-wrap gap-4 text-sm mt-3">
    //         {resumeData.linkedin && (
    //           <div className="flex items-center gap-2">
    //             <Linkedin size={16} />
    //             <span>{resumeData.linkedin}</span>
    //           </div>
    //         )}
    //         {resumeData.github && (
    //           <div className="flex items-center gap-2">
    //             <Github size={16} />
    //             <span>{resumeData.github}</span>
    //           </div>
    //         )}
    //         {resumeData.portfolio && (
    //           <div className="flex items-center gap-2">
    //             <Globe size={16} />
    //             <span>{resumeData.portfolio}</span>
    //           </div>
    //         )}
    //       </div>
    //     </div>

    //     {/* Main Content */}
    //     <div className="p-8">
    //       {/* Summary */}
    //       {resumeData.summary && (
    //         <section className="mb-8">
    //           <h2 className="text-2xl font-bold text-gray-800 mb-3 pb-2 border-b-2 border-blue-600">
    //             Professional Summary
    //           </h2>
    //           <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
    //         </section>
    //       )}

    //       {/* Experience */}
    //       {resumeData.experience && resumeData.experience.length > 0 && (
    //         <section className="mb-8">
    //           <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600 flex items-center gap-2">
    //             <Briefcase size={24} />
    //             Work Experience
    //           </h2>
    //           <div className="space-y-6">
    //             {resumeData.experience.map((exp) => (
    //               <div key={exp.id} className="relative pl-4 border-l-2 border-blue-200">
    //                 <div className="mb-2">
    //                   <h3 className="text-xl font-semibold text-gray-800">{exp.title}</h3>
    //                   <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
    //                   <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
    //                     <span className="flex items-center gap-1">
    //                       <MapPin size={14} />
    //                       {exp.location}
    //                     </span>
    //                     <span>
    //                       {exp.startDate} - {exp.current ? "Present" : exp.endDate}
    //                     </span>
    //                   </div>
    //                 </div>
    //                 <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: exp.description }} />
    //               </div>
    //             ))}
    //           </div>
    //         </section>
    //       )}

    //       {/* Education */}
    //       {resumeData.education && resumeData.education.length > 0 && (
    //         <section className="mb-8">
    //           <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600 flex items-center gap-2">
    //             <GraduationCap size={24} />
    //             Education
    //           </h2>
    //           <div className="space-y-4">
    //             {resumeData.education.map((edu) => (
    //               <div key={edu.id} className="relative pl-4 border-l-2 border-blue-200">
    //                 <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
    //                 <p className="text-blue-600 font-medium">{edu.school}</p>
    //                 <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
    //                   <span className="flex items-center gap-1">
    //                     <MapPin size={14} />
    //                     {edu.location}
    //                   </span>
    //                   <span>{edu.graduationDate}</span>
    //                 </div>
    //                 <div className="">
    //                     <p className="text-gray-700 mt-1" dangerouslySetInnerHTML={{ __html: edu.description }} ></p>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         </section>
    //       )}

    //       {/* Projects */}
    //       {resumeData.project && resumeData.project.length > 0 && (
    //         <section className="mb-8">
    //           <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600 flex items-center gap-2">
    //             <FolderGit2 size={24} />
    //             Projects
    //           </h2>
    //           <div className="space-y-4">
    //             {resumeData.project.map((project) => (
    //               <div key={project.id} className="relative pl-4 border-l-2 border-blue-200">
    //                 <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
    //                 {project.url && (
    //                   <a
    //                     href={project.url}
    //                     target="_blank"
    //                     rel="noopener noreferrer"
    //                     className="text-blue-600 hover:underline"
    //                   >
    //                     {project.url}
    //                   </a>
    //                 )}
    //                 {project.description && (
    //                   <p className="text-blue-600 font-medium">{project.description}</p>
    //                 )}
    //                 {project.location && (
    //                   <p className="text-gray-700 mt-1">{project.location}</p>
    //                 )}
    //                 <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
    //                   <span>{project.startDate} - {project.endDate}</span>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         </section>
    //       )}

    //       {/* Skills */}
    //       {resumeData.skills && resumeData.skills.length > 0 && (
    //         <section>
    //           <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600">
    //             Skills
    //           </h2>
    //           <div className="flex flex-wrap gap-2">
    //             {resumeData.skills.map((skill, index) => (
    //               <span
    //                 key={index}
    //                 className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
    //               >
    //                 {skill.name}
    //               </span>
    //             ))}
    //           </div>
    //         </section>
    //       )}
    //     </div>
    //   </div>

      
    // </div>

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