import React from 'react';
import { Resume } from '@/data/resumeModel';
import { formatDateRange } from '@/utils/helpers';
import { TemplateSettings } from '@/store/settingsStore';

const getFontSize = (size: string) => {
  switch (size) {
    case 'small': return { base: '10.5px', heading: '12px', section: '10px' };
    case 'large': return { base: '13px', heading: '16px', section: '12px' };
    default: return { base: '10.5px', heading: '14px', section: '10px' };
  }
};

interface TemplateProps {
  resume: Resume;
  settings?: TemplateSettings;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ resume, settings }) => {
  const { personalInfo, summary, experience, education, skills, projects, additional } = resume;
  const merged = { fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'medium', primaryColor: '#111827', ...(settings || {}) } as TemplateSettings;
  const fonts = getFontSize(merged.fontSize);

  return (
    <div className="resume-paper p-10 leading-relaxed print:shadow-none" style={{ fontFamily: merged.fontFamily, fontSize: fonts.base, color: '#111827' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="tracking-tight mb-1 font-light" style={{ fontSize: fonts.heading, color: merged.primaryColor }}>{personalInfo.name || 'Your Name'}</h1>
        {personalInfo.title && (
          <h2 className="font-light mb-3" style={{ color: '#6b7280', fontSize: fonts.section }}>{personalInfo.title}</h2>
        )}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-8">
          <p className="leading-relaxed max-w-[600px]" style={{ color: '#374151' }}>{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-8">
          <h3 className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">
            Experience
          </h3>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id} className="grid grid-cols-[140px_1fr] gap-4">
                <div className="text-[10px] text-gray-400">
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{exp.position}</h4>
                  <div className="text-gray-500 text-[10px] mb-2">{exp.company}</div>
                  {exp.achievements.length > 0 && (
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="text-gray-600 text-[10px]">— {achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-8">
          <h3 className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">
            Education
          </h3>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="grid grid-cols-[140px_1fr] gap-4">
                <div className="text-[10px] text-gray-400">
                  {formatDateRange(edu.startDate, edu.endDate, false)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{edu.degree} in {edu.field}</h4>
                  <div className="text-gray-500 text-[10px]">
                    {edu.institution}
                    {edu.gpa && <span className="ml-2">· GPA {edu.gpa}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(skills.technical.length > 0 || skills.languages.length > 0) && (
        <div className="mb-8">
          <h3 className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">
            Skills
          </h3>
          <div className="grid grid-cols-[140px_1fr] gap-4">
            {skills.technical.length > 0 && (
              <>
                <div className="text-[10px] text-gray-400">Technical</div>
                <div className="text-gray-600">{skills.technical.join(' · ')}</div>
              </>
            )}
            {skills.languages.length > 0 && (
              <>
                <div className="text-[10px] text-gray-400">Languages</div>
                <div className="text-gray-600">{skills.languages.join(' · ')}</div>
              </>
            )}
            {skills.softSkills.length > 0 && (
              <>
                <div className="text-[10px] text-gray-400">Other</div>
                <div className="text-gray-600">{skills.softSkills.join(' · ')}</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-8">
          <h3 className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">
            Projects
          </h3>
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="grid grid-cols-[140px_1fr] gap-4">
                <div className="text-[10px] text-gray-400">
                  {project.technologies.slice(0, 2).join(', ')}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <p className="text-gray-600 text-[10px]">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {additional.certifications.length > 0 && (
        <div>
          <h3 className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">
            Certifications
          </h3>
          <div className="space-y-1">
            {additional.certifications.map((cert) => (
              <div key={cert.id} className="grid grid-cols-[140px_1fr] gap-4">
                <div className="text-[10px] text-gray-400">{cert.date}</div>
                <div className="text-gray-600">{cert.name} — {cert.issuer}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
