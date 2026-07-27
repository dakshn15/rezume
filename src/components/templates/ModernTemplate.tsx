import React from 'react';
import { Resume } from '@/data/resumeModel';
import { TemplateSettings } from '@/store/settingsStore';
import { formatDateRange } from '@/utils/helpers';
import { Mail, Phone, MapPin, Linkedin, Globe, Github, ExternalLink } from 'lucide-react';

interface TemplateProps {
  resume: Resume;
  settings: TemplateSettings;
}

// Utility to convert hex color to rgba string (used for print borders with alpha)
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
    case 'xs': return { base: '10px', name: '20px', title: '12px', section: '10px', small: '9px' };
    case 'small': return { base: '11px', name: '22px', title: '13px', section: '11px', small: '10px' };
    case 'xl': return { base: '15px', name: '30px', title: '17px', section: '14px', small: '13px' };
    case 'large': return { base: '14px', name: '28px', title: '16px', section: '13px', small: '12px' };
    default: return { base: '12px', name: '24px', title: '14px', section: '12px', small: '11px' };
  }
};

const LinkWrapper: React.FC<{ href?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ href, children, className, style }) => {
  if (!href) return <span className={className} style={style}>{children}</span>;
  const url = href.includes('@') ? `mailto:${href}` : (href.startsWith('http') ? href : `https://${href}`);
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`${className} hover:underline cursor-pointer`} style={style}>
      {children}
    </a>
  );
};

export const ModernTemplate: React.FC<TemplateProps> = ({ resume, settings }) => {
  const { personalInfo, summary, experience, education, skills, projects, additional } = resume;
  const fonts = getFontSize(settings.fontSize);

  return (
    <div
      className="resume-template bg-white print:shadow-none"
      style={{
        fontFamily: settings.fontFamily,
        fontSize: fonts.base,
        width: '210mm',
        minHeight: '297mm', // ensure at least one page height but allow content to grow
        display: 'block',
        lineHeight: 1.5,
        boxSizing: 'border-box',
      }}
    >
      <div className="flex" style={{ minHeight: '297mm' }}>
        {/* Sidebar */}
        <div
          className="w-[72mm] text-white p-6"
          style={{ backgroundColor: settings.primaryColor }}
        >
          {/* Photo placeholder */}
          {settings.showPhoto && (
            personalInfo.photo ? (
              <div className="w-28 h-28 mx-auto mb-5 rounded-full overflow-hidden border-3 border-white/30" style={{ border: '3px solid rgba(255,255,255,0.3)' }}>
                <img src={personalInfo.photo} alt={personalInfo.name} className="w-full h-full object-cover" data-photo />
              </div>
            ) : (
              <div className="w-28 h-28 mx-auto mb-5 rounded-full flex items-center justify-center text-3xl font-bold" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} data-photo>
                {personalInfo.name ? personalInfo.name.split(' ').map(n => n[0]).join('') : 'YN'}
              </div>
            )
          )}

          {/* Contact */}
          <div className="mb-6">
            <h3 className="font-semibold uppercase mb-3 text-white/90 pb-2" style={{ fontSize: fonts.section, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
              Contact
            </h3>
            <div className='space-y-2' style={{ fontSize: fonts.small }}>
              {personalInfo.email && (
                <LinkWrapper href={personalInfo.email} className="flex items-center" style={{ marginBottom: '10px' }}>
                  <Mail className="h-4 w-4 shrink-0" style={{ color: 'rgba(255,255,255,0.7)', marginRight: '10px' }} />
                  <span className="break-all">{personalInfo.email}</span>
                </LinkWrapper>
              )}
              {personalInfo.phone && (
                <div className="flex items-center" style={{ marginBottom: '10px' }}>
                  <Phone className="h-4 w-4 shrink-0" style={{ color: 'rgba(255,255,255,0.7)', marginRight: '10px' }} />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center" style={{ marginBottom: '10px' }}>
                  <MapPin className="h-4 w-4 shrink-0" style={{ color: 'rgba(255,255,255,0.7)', marginRight: '10px' }} />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <LinkWrapper href={personalInfo.linkedin} className="flex items-center" style={{ marginBottom: '10px' }}>
                  <Linkedin className="h-4 w-4 shrink-0" style={{ color: 'rgba(255,255,255,0.7)', marginRight: '10px' }} />
                  <span className="break-all">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </LinkWrapper>
              )}
              {personalInfo.website && (
                <LinkWrapper href={personalInfo.website} className="flex items-center" style={{ marginBottom: '10px' }}>
                  <Globe className="h-4 w-4 shrink-0" style={{ color: 'rgba(255,255,255,0.7)', marginRight: '10px' }} />
                  <span className="break-all">{personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </LinkWrapper>
              )}
              {personalInfo.github && (
                <LinkWrapper href={personalInfo.github} className="flex items-center" style={{ marginBottom: '10px' }}>
                  <Github className="h-4 w-4 shrink-0" style={{ color: 'rgba(255,255,255,0.7)', marginRight: '10px' }} />
                  <span className="break-all">{personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </LinkWrapper>
              )}
            </div>
          </div>

          {/* Skills */}
          {(skills.technical.length > 0 || skills.languages.length > 0 || skills.softSkills.length > 0) && (
            <div className="mb-6">
              <h3 className="font-semibold uppercase mb-3 text-white/90 pb-2" style={{ fontSize: fonts.section, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                Skills
              </h3>
              {skills.technical.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2" style={{ fontSize: fonts.small, color: 'rgba(255,255,255,0.7)' }}>Technical</h4>
                  <div className="flex flex-wrap">
                    {skills.technical.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md" style={{ fontSize: '10px', backgroundColor: 'rgba(255,255,255,0.15)', marginRight: '6px', marginBottom: '6px' }}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {skills.languages.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2" style={{ fontSize: fonts.small, color: 'rgba(255,255,255,0.7)' }}>Languages</h4>
                  <div>
                    {skills.languages.map((lang, i) => (
                      <div key={i} style={{ fontSize: fonts.small, marginBottom: '4px' }}>{lang}</div>
                    ))}
                  </div>
                </div>
              )}
              {skills.softSkills.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2" style={{ fontSize: fonts.small, color: 'rgba(255,255,255,0.7)' }}>Soft Skills</h4>
                  <div className="flex flex-wrap">
                    {skills.softSkills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 text-white rounded-md" style={{ fontSize: '10px', backgroundColor: 'rgba(255,255,255,0.15)', marginRight: '6px', marginBottom: '6px' }}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Certifications */}
          {additional?.certifications && additional.certifications.length > 0 && (
            <div>
              <h3 className="font-semibold uppercase mb-3 text-white/90 pb-2" style={{ fontSize: fonts.section, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                Certifications
              </h3>
              <div>
                {additional.certifications.map((cert: any, idx: number) => {
                  const certName = typeof cert === 'string' ? cert : cert?.name || '';
                  const certIssuer = typeof cert === 'object' && cert?.issuer ? cert.issuer : '';
                  const certDate = typeof cert === 'object' && cert?.date ? cert.date : '';
                  const certUrl = typeof cert === 'object' && cert?.url ? cert.url : undefined;
                  return (
                    <div key={idx} style={{ marginBottom: '12px' }}>
                      <div className="font-medium" style={{ fontSize: fonts.small }}>
                        {certUrl ? (
                          <LinkWrapper href={certUrl}>{certName}</LinkWrapper>
                        ) : certName}
                      </div>
                      {(certIssuer || certDate) && (
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>
                          {certIssuer}{certIssuer && certDate ? ' • ' : ''}{certDate}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Main Content: column layout so content area expands when empty */}
        <div className="flex-1 p-7 flex flex-col" style={{ height: '100%' }}>
          {/* Header */}
          <div className="mb-6">
            <h1 className="font-bold mb-1" style={{ fontSize: fonts.name, color: settings.primaryColor }}>
              {personalInfo.name || 'Your Name'}
            </h1>
            <h2 className="font-medium" style={{ fontSize: fonts.title, color: settings.accentColor }}>
              {personalInfo.title || 'Professional Title'}
            </h2>
          </div>

          {/* Flexible content area fills the rest of the page */}
          <div className="flex-1">
            {/* Summary */}
            {summary && (
              <div className="mb-6">
                <h3
                  className="font-semibold uppercase mb-2.5 pb-1.5"
                  style={{ fontSize: fonts.section, color: settings.primaryColor, borderBottom: `2px solid ${hexToRgba(settings.primaryColor, 0.2)}` }}
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
                  className="font-semibold uppercase mb-2.5 pb-1.5"
                  style={{ fontSize: fonts.section, color: settings.primaryColor, borderBottom: `2px solid ${hexToRgba(settings.primaryColor, 0.2)}` }}
                >
                  Experience
                </h3>
                <div>
                  {experience.map((exp) => (
                    <div key={exp.id} className="print-break-inside-avoid" style={{ marginBottom: '16px' }}>
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
                        <ul className="list-disc" style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} style={{ fontSize: fonts.small, marginBottom: '0.25rem', color: '#374151' }}>
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
                  className="font-semibold uppercase mb-2.5 pb-1.5"
                  style={{ fontSize: fonts.section, color: settings.primaryColor, borderBottom: `2px solid ${hexToRgba(settings.primaryColor, 0.2)}` }}
                >
                  Education
                </h3>
                <div>
                  {education.map((edu) => (
                    <div key={edu.id} className="print-break-inside-avoid" style={{ marginBottom: '12px' }}>
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
                  className="font-semibold uppercase mb-2.5 pb-1.5"
                  style={{ fontSize: fonts.section, color: settings.primaryColor, borderBottom: `2px solid ${hexToRgba(settings.primaryColor, 0.2)}` }}
                >
                  Projects
                </h3>
                <div>
                  {projects.map((project) => (
                    <div key={project.id} className="print-break-inside-avoid" style={{ marginBottom: '12px' }}>
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
                      <p className="text-gray-600 mt-0.5" style={{ fontSize: fonts.small, color: '#333' }}>{project.description}</p>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap" style={{ marginTop: '6px' }}>
                          {project.technologies.map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded" style={{ fontSize: '10px', marginRight: '6px', marginBottom: '6px' }}>{tech}</span>
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
    </div>
  );
};
