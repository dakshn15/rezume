import React from 'react';
import { Resume } from '@/data/resumeModel';
import { TemplateSettings } from '@/store/settingsStore';
import { formatDateRange } from '@/utils/helpers';
import { Mail, Phone, MapPin, Linkedin, Globe, Github, ExternalLink } from 'lucide-react';

interface TemplateProps {
  resume: Resume;
  settings: TemplateSettings;
}

const getFontSize = (size: string) => {
  switch (size) {
    case 'small': return { base: '11px', name: '22px', title: '13px', section: '11px', small: '10px' };
    case 'large': return { base: '14px', name: '28px', title: '16px', section: '13px', small: '12px' };
    default: return { base: '12px', name: '24px', title: '14px', section: '12px', small: '11px' };
  }
};

const LinkWrapper: React.FC<{ href?: string; children: React.ReactNode; className?: string }> = ({ href, children, className }) => {
  if (!href) return <span className={className}>{children}</span>;
  const url = href.includes('@') ? `mailto:${href}` : (href.startsWith('http') ? href : `https://${href}`);
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`${className} hover:underline cursor-pointer`}>
      {children}
    </a>
  );
};

export const ModernTemplate: React.FC<TemplateProps> = ({ resume, settings }) => {
  const { personalInfo, summary, experience, education, skills, projects, additional } = resume;
  const fonts = getFontSize(settings.fontSize);

  return (
    <div 
      className="bg-white shadow-xl print:shadow-none" 
      style={{ 
        fontFamily: settings.fontFamily,
        fontSize: fonts.base,
        width: '210mm',
        minHeight: '297mm',
        lineHeight: 1.5,
      }}
    >
      <div className="flex min-h-[297mm]">
        {/* Sidebar */}
        <div 
          className="w-[72mm] text-white p-6 print:!bg-[var(--primary-color)]" 
          style={{ backgroundColor: settings.primaryColor }}
        >
          {/* Photo placeholder */}
          {settings.showPhoto && (
            personalInfo.photo ? (
              <div className="w-28 h-28 mx-auto mb-5 rounded-full overflow-hidden border-3 border-white/30">
                <img src={personalInfo.photo} alt={personalInfo.name} className="w-full h-full object-cover" data-photo />
              </div>
            ) : (
              <div className="w-28 h-28 mx-auto mb-5 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold" data-photo>
                {personalInfo.name ? personalInfo.name.split(' ').map(n => n[0]).join('') : 'YN'}
              </div>
            )
          )}

          {/* Contact */}
          <div className="mb-6">
            <h3 className="font-semibold uppercase tracking-wider mb-3 text-white/90 border-b border-white/20 pb-2" style={{ fontSize: fonts.section }}>
              Contact
            </h3>
            <div className="space-y-2.5" style={{ fontSize: fonts.small }}>
              {personalInfo.email && (
                <LinkWrapper href={personalInfo.email} className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-white/70" />
                  <span className="break-all">{personalInfo.email}</span>
                </LinkWrapper>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-white/70" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-white/70" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <LinkWrapper href={personalInfo.linkedin} className="flex items-center gap-2.5">
                  <Linkedin className="h-4 w-4 shrink-0 text-white/70" />
                  <span className="break-all">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </LinkWrapper>
              )}
              {personalInfo.website && (
                <LinkWrapper href={personalInfo.website} className="flex items-center gap-2.5">
                  <Globe className="h-4 w-4 shrink-0 text-white/70" />
                  <span className="break-all">{personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </LinkWrapper>
              )}
              {personalInfo.github && (
                <LinkWrapper href={personalInfo.github} className="flex items-center gap-2.5">
                  <Github className="h-4 w-4 shrink-0 text-white/70" />
                  <span className="break-all">{personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </LinkWrapper>
              )}
            </div>
          </div>

          {/* Skills */}
          {(skills.technical.length > 0 || skills.languages.length > 0 || skills.softSkills.length > 0) && (
            <div className="mb-6">
              <h3 className="font-semibold uppercase tracking-wider mb-3 text-white/90 border-b border-white/20 pb-2" style={{ fontSize: fonts.section }}>
                Skills
              </h3>
              {skills.technical.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2 text-white/70" style={{ fontSize: fonts.small }}>Technical</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.technical.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white/15 rounded-md" style={{ fontSize: '10px' }}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {skills.languages.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2 text-white/70" style={{ fontSize: fonts.small }}>Languages</h4>
                  <div className="space-y-1">
                    {skills.languages.map((lang, i) => (
                      <div key={i} style={{ fontSize: fonts.small }}>{lang}</div>
                    ))}
                  </div>
                </div>
              )}
              {skills.softSkills.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-white/70" style={{ fontSize: fonts.small }}>Soft Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.softSkills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white/15 rounded-md" style={{ fontSize: '10px' }}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Certifications */}
          {additional.certifications.length > 0 && (
            <div>
              <h3 className="font-semibold uppercase tracking-wider mb-3 text-white/90 border-b border-white/20 pb-2" style={{ fontSize: fonts.section }}>
                Certifications
              </h3>
              <div className="space-y-3">
                {additional.certifications.map((cert) => (
                  <div key={cert.id}>
                    <div className="font-medium" style={{ fontSize: fonts.small }}>
                      {cert.url ? (
                        <LinkWrapper href={cert.url}>{cert.name}</LinkWrapper>
                      ) : cert.name}
                    </div>
                    <div className="text-white/60" style={{ fontSize: '10px' }}>{cert.issuer} • {cert.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-7">
          {/* Header */}
          <div className="mb-6">
            <h1 className="font-bold mb-1" style={{ fontSize: fonts.name, color: settings.primaryColor }}>
              {personalInfo.name || 'Your Name'}
            </h1>
            <h2 className="font-medium" style={{ fontSize: fonts.title, color: settings.accentColor }}>
              {personalInfo.title || 'Professional Title'}
            </h2>
          </div>

          {/* Summary */}
          {summary && (
            <div className="mb-6">
              <h3 
                className="font-semibold uppercase tracking-wider mb-2.5 pb-1.5 border-b-2"
                style={{ fontSize: fonts.section, color: settings.primaryColor, borderColor: `${settings.primaryColor}30` }}
              >
                Professional Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div className="mb-6">
              <h3 
                className="font-semibold uppercase tracking-wider mb-2.5 pb-1.5 border-b-2"
                style={{ fontSize: fonts.section, color: settings.primaryColor, borderColor: `${settings.primaryColor}30` }}
              >
                Experience
              </h3>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                        <div className="font-medium" style={{ fontSize: fonts.small, color: settings.accentColor }}>{exp.company}</div>
                      </div>
                      <div className="text-gray-500 shrink-0 ml-4" style={{ fontSize: fonts.small }}>
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </div>
                    </div>
                    {exp.description && <p className="text-gray-600 mt-1" style={{ fontSize: fonts.small }}>{exp.description}</p>}
                    {exp.achievements.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {exp.achievements.map((achievement, i) => (
                          <li 
                            key={i} 
                            className="text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0"
                            style={{ fontSize: fonts.small, '--tw-before-color': settings.accentColor } as any}
                          >
                            {achievement}
                          </li>
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
            <div className="mb-6">
              <h3 
                className="font-semibold uppercase tracking-wider mb-2.5 pb-1.5 border-b-2"
                style={{ fontSize: fonts.section, color: settings.primaryColor, borderColor: `${settings.primaryColor}30` }}
              >
                Education
              </h3>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h4>
                        <div className="font-medium" style={{ fontSize: fonts.small, color: settings.accentColor }}>{edu.institution}</div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className="text-gray-500" style={{ fontSize: fonts.small }}>
                          {formatDateRange(edu.startDate, edu.endDate, false)}
                        </div>
                        {edu.gpa && <div className="text-gray-500" style={{ fontSize: fonts.small }}>GPA: {edu.gpa}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h3 
                className="font-semibold uppercase tracking-wider mb-2.5 pb-1.5 border-b-2"
                style={{ fontSize: fonts.section, color: settings.primaryColor, borderColor: `${settings.primaryColor}30` }}
              >
                Projects
              </h3>
              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-900">
                        {project.url ? (
                          <LinkWrapper href={project.url} className="flex items-center gap-1">
                            {project.name}
                            <ExternalLink className="h-3 w-3" style={{ color: settings.accentColor }} />
                          </LinkWrapper>
                        ) : project.name}
                      </h4>
                    </div>
                    <p className="text-gray-600 mt-0.5" style={{ fontSize: fonts.small }}>{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded" style={{ fontSize: '10px' }}>{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
