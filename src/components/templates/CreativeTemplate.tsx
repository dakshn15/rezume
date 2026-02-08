import React from 'react';
import { Resume } from '@/data/resumeModel';
import { formatDateRange } from '@/utils/helpers';
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from 'lucide-react';
import { TemplateSettings } from '@/store/settingsStore';

const hexToRgba = (hex: string, alpha = 1) => {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getFontSize = (size: string) => {
  switch (size) {
    case 'small': return { base: '10.5px', heading: '18px', section: '11px' };
    case 'large': return { base: '13px', heading: '22px', section: '13px' };
    default: return { base: '11px', heading: '20px', section: '11px' };
  }
};

interface TemplateProps {
  resume: Resume;
  settings?: TemplateSettings;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ resume, settings }) => {
  const { personalInfo, summary, experience, education, skills, projects, additional } = resume;
  const merged = { fontFamily: 'Inter, sans-serif', fontSize: 'medium', primaryColor: '#7c3aed', accentColor: '#6d28d9', ...(settings || {}) } as TemplateSettings;
  const fonts = getFontSize(merged.fontSize);

  return (
    <div className="resume-paper p-0 leading-relaxed print:shadow-none overflow-hidden" style={{ fontFamily: merged.fontFamily, fontSize: fonts.base }}>
      {/* Header with diagonal accent */}
      <div className="relative text-white px-8 py-8 overflow-hidden" style={{ background: `linear-gradient(90deg, ${merged.accentColor}, ${merged.primaryColor})` }}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-20 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />
        
        <div className="relative">
          <h1 className="font-bold mb-1" style={{ fontSize: fonts.heading }}>{personalInfo.name || 'Your Name'}</h1>
          {personalInfo.title && (
            <h2 className="font-light mb-4" style={{ opacity: 0.9 }}>{personalInfo.title}</h2>
          )}
          <div className="flex flex-wrap gap-4 text-[10px]">
            {personalInfo.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="h-3 w-3" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="h-3 w-3" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-1.5">
                <Linkedin className="h-3 w-3" />
                <span>{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-1.5">
                <Github className="h-3 w-3" />
                <span>{personalInfo.github}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {summary && (
          <div className="mb-6">
            <p className="leading-relaxed border-l-4 pl-4 italic" style={{ borderColor: merged.accentColor, color: '#374151' }}>
              {summary}
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="col-span-2 space-y-6">
            {/* Experience Timeline */}
            {experience.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: merged.primaryColor }}>
                  <span className="w-8 h-0.5" style={{ backgroundColor: merged.accentColor }} />
                  Experience
                </h3>
                <div className="relative">
                  <div className="absolute left-[5px] top-2 bottom-2 w-0.5" style={{ background: `linear-gradient(180deg, ${merged.accentColor}, ${merged.primaryColor})` }} />
                  <div className="space-y-4">
                    {experience.map((exp, index) => (
                      <div key={exp.id} className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-violet-500" />
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900">{exp.position}</h4>
                            <div className="font-medium text-[10px]" style={{ color: merged.accentColor }}>{exp.company}</div>
                          </div>
                          <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                          </span>
                        </div>
                        {exp.achievements.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {exp.achievements.map((achievement, i) => (
                              <li key={i} className="text-gray-600 text-[10px] flex items-start gap-2">
                                <span className="mt-0.5" style={{ color: merged.accentColor }}>▸</span>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: merged.primaryColor }}>
                  <span className="w-8 h-0.5" style={{ backgroundColor: merged.accentColor }} />
                  Projects
                </h3>
                <div className="grid gap-3">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900">{project.name}</h4>
                        {project.url && (
                          <span className="text-[9px]" style={{ color: merged.accentColor }}>{project.url}</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-[10px] mt-1">{project.description}</p>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[9px] font-medium" style={{ backgroundColor: hexToRgba(merged.accentColor, 0.12), color: merged.accentColor }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Education */}
            {education.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: merged.primaryColor }}>
                  <span className="w-4 h-0.5" style={{ backgroundColor: merged.accentColor }} />
                  Education
                </h3>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="rounded-lg p-3" style={{ background: `linear-gradient(90deg, ${hexToRgba(merged.accentColor, 0.06)}, ${hexToRgba(merged.primaryColor, 0.03)})` }}>
                      <h4 className="font-semibold text-gray-900 text-[10px]">{edu.degree}</h4>
                      <div className="text-[9px]" style={{ color: merged.accentColor }}>{edu.field}</div>
                      <div className="text-gray-500 text-[9px] mt-1">{edu.institution}</div>
                      <div className="text-gray-400 text-[9px]">
                        {formatDateRange(edu.startDate, edu.endDate, false)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {(skills.technical.length > 0 || skills.softSkills.length > 0) && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: merged.primaryColor }}>
                  <span className="w-4 h-0.5" style={{ backgroundColor: merged.accentColor }} />
                  Skills
                </h3>
                <div className="space-y-2">
                  {skills.technical.map((skill, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${85 - i * 5}%`, background: `linear-gradient(90deg, ${merged.accentColor}, ${merged.primaryColor})` }}
                        />
                      </div>
                      <span className="text-[9px] text-gray-600 w-20 text-right">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {skills.languages.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: merged.primaryColor }}>
                  <span className="w-4 h-0.5" style={{ backgroundColor: merged.accentColor }} />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {skills.languages.map((lang, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-[9px]">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {additional.certifications.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: merged.primaryColor }}>
                  <span className="w-4 h-0.5" style={{ backgroundColor: merged.accentColor }} />
                  Certifications
                </h3>
                <div className="space-y-2">
                  {additional.certifications.map((cert) => (
                    <div key={cert.id} className="text-[9px]">
                      <div className="font-medium text-gray-900">{cert.name}</div>
                      <div className="text-gray-500">{cert.issuer} • {cert.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
