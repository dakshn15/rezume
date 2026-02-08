import React from 'react';
import { Resume } from '@/data/resumeModel';
import { formatDateRange } from '@/utils/helpers';
import { TemplateSettings } from '@/store/settingsStore';

const getFontSize = (size: string) => {
  switch (size) {
    case 'small': return { base: '11px', heading: '12px', section: '10px' };
    case 'large': return { base: '14px', heading: '16px', section: '13px' };
    default: return { base: '12px', heading: '14px', section: '11px' };
  }
};

interface TemplateProps {
  resume: Resume;
  settings?: TemplateSettings;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ resume, settings }) => {
  const { personalInfo, summary, experience, education, skills, projects, additional } = resume;
  const merged = { fontFamily: '"Source Serif 4", Georgia, serif', fontSize: 'medium', primaryColor: '#000000', ...(settings || {}) } as TemplateSettings;
  const fonts = getFontSize(merged.fontSize);

  return (
    <div
      className="resume-paper w-full box-border p-8 print:shadow-none"
      style={{ fontFamily: merged.fontFamily, fontSize: fonts.base, lineHeight: 1.45 }}
    >
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-4 mb-4">
        <h1 className="text-2xl font-bold tracking-wide mb-1" style={{ color: merged.primaryColor }}>{personalInfo.name || 'Your Name'}</h1>
        {personalInfo.title && (
          <h2 className="text-sm italic mb-2" style={{ color: '#4b5563' }}>{personalInfo.title}</h2>
        )}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-2 border-b border-gray-300 pb-1" style={{ color: merged.primaryColor, fontSize: fonts.heading }}>
            Professional Summary
          </h3>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-2 border-b border-gray-300 pb-1">
            Professional Experience
          </h3>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <h4 className="font-bold text-black">{exp.position}</h4>
                  <span className="text-[10px] text-gray-600 italic">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <div className="text-gray-700 italic text-[10px] mb-1">{exp.company}</div>
                {exp.description && <p className="text-gray-600 mb-1">{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 ml-2">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-gray-700">{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-2 border-b border-gray-300 pb-1">
            Education
          </h3>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <h4 className="font-bold text-black">{edu.degree} in {edu.field}</h4>
                  <span className="text-[10px] text-gray-600 italic">
                    {formatDateRange(edu.startDate, edu.endDate, false)}
                  </span>
                </div>
                <div className="text-gray-700 italic text-[10px]">
                  {edu.institution}
                  {edu.gpa && <span className="ml-2">• GPA: {edu.gpa}</span>}
                </div>
                {edu.achievements && edu.achievements.length > 0 && (
                  <div className="text-[10px] text-gray-600 mt-0.5">
                    {edu.achievements.join(' • ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(skills.technical.length > 0 || skills.languages.length > 0 || skills.softSkills.length > 0) && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-2 border-b border-gray-300 pb-1">
            Skills
          </h3>
          <div className="space-y-1.5 text-gray-700">
            {skills.technical.length > 0 && (
              <div>
                <span className="font-semibold">Technical:</span> {skills.technical.join(', ')}
              </div>
            )}
            {skills.languages.length > 0 && (
              <div>
                <span className="font-semibold">Languages:</span> {skills.languages.join(', ')}
              </div>
            )}
            {skills.softSkills.length > 0 && (
              <div>
                <span className="font-semibold">Soft Skills:</span> {skills.softSkills.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-2 border-b border-gray-300 pb-1">
            Projects
          </h3>
          <div className="space-y-2">
            {projects.map((project) => (
              <div key={project.id}>
                <h4 className="font-bold text-black">
                  {project.name}
                  {project.url && <span className="font-normal text-[10px] text-gray-600 ml-2">({project.url})</span>}
                </h4>
                <p className="text-gray-600">{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="text-[10px] text-gray-500 italic">
                    Technologies: {project.technologies.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {additional.certifications.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-2 border-b border-gray-300 pb-1">
            Certifications
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {additional.certifications.map((cert) => (
              <div key={cert.id} className="text-gray-700">
                <span className="font-semibold">{cert.name}</span>
                <span className="text-[10px] text-gray-500 ml-1">({cert.issuer}, {cert.date})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
