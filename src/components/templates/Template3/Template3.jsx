import React from 'react';
import { useContext } from 'react';
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';
import { Linkedin, Github, Globe, Mail, Phone, MapPin, GraduationCap } from 'lucide-react';
import { Briefcase } from 'lucide-react';
import { FolderGit2 } from 'lucide-react';

const ResumeTemplate = () => {
    const { resumeData } = useContext(ResumeInfoContext);
  return (
    <div className="max-w-[800px] mx-auto bg-white text-black p-8 text-[13px] leading-relaxed font-sans">

      {/* HEADER */}
      <header className="mb-4">
        <h1 className="text-xl font-bold">
          {resumeData.firstName} {resumeData.lastName}
          
        </h1>

        <p className="text-gray-600 text-xs mt-1">
          {resumeData.phone} • {resumeData.email} • {resumeData.location} •{" "}
          <span className="text-blue-600">{resumeData.linkedin}</span>
        </p>
      </header>

      {/* JOB TITLE */}
      <h2 className="font-semibold mt-4">{resumeData.jobTitle}</h2>

      {/* SUMMARY */}
      <p className="mt-2 text-gray-700">
        {resumeData.summary}
      </p>

      {/* SKILLS */}
      <section className="mt-4">
        <h3 className="font-bold uppercase text-xs">Skills</h3>
        <p className="mt-1 text-gray-700">
          {resumeData.skills.join(", ")}
        </p>
      </section>

      {/* EXPERIENCE */}
      <section className="mt-5">
        <h3 className="font-bold uppercase text-xs">Experience</h3>

        {resumeData.experience.map((exp, i) => (
          <div key={i} className="mt-3">
            <p className="font-semibold">
              {exp.company} • {exp.duration} 
            </p>

            <p className="italic text-gray-700">{exp.role}</p>

            <ul className="list-disc ml-5 mt-1 space-y-1">
              {exp.points.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* PROJECTS */}
      <section className="mt-5">
        <h3 className="font-bold uppercase text-xs">Projects</h3>

        {data.projects.map((project, i) => (
          <div key={i} className="mt-2">
            <p className="font-semibold">{project.title}</p>
            <ul className="list-disc ml-5">
              {project.points.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* EDUCATION */}
      <section className="mt-5">
        <h3 className="font-bold uppercase text-xs">Education</h3>
        <p className="font-semibold">{data.degree}</p>
        <p className="text-gray-700">
          {data.university} • {data.educationDuration}
        </p>
      </section>
    </div>
  );
}

export default ResumeTemplate;
