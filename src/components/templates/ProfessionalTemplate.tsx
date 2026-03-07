import React from 'react';
import { Resume } from '@/data/resumeModel';
import { formatDateRange } from '@/utils/helpers';
import { TemplateSettings } from '@/store/settingsStore';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const getFontSize = (size: string) => {
    switch (size) {
        case 'small': return { base: '12px', heading: '14px', title: '22px' };
        case 'large': return { base: '16px', heading: '18px', title: '28px' };
        default: return { base: '14px', heading: '16px', title: '24px' };
    }
};

interface TemplateProps {
    resume: Resume;
    settings?: TemplateSettings;
}

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ resume, settings }) => {
    const { personalInfo, summary, experience, education, skills, projects, additional } = resume;
    const merged = { fontFamily: 'Inter, sans-serif', fontSize: 'medium', primaryColor: '#2563eb', ...(settings || {}) } as TemplateSettings;
    const fonts = getFontSize(merged.fontSize);

    return (
        <div
            className="resume-paper w-full box-border bg-white text-gray-800"
            style={{ fontFamily: merged.fontFamily, fontSize: fonts.base, lineHeight: '21px' }}
        >
            {/* Header section with accent top border */}
            <div
                className="w-full pt-8 pb-6 px-10 border-b relative"
                style={{ borderColor: `${merged.primaryColor}20` }}
            >
                <div
                    className="absolute top-0 left-0 w-full h-2"
                    style={{ backgroundColor: merged.primaryColor }}
                />

                <h1
                    className="font-bold tracking-tight mb-1 uppercase"
                    style={{ fontSize: fonts.title, color: merged.primaryColor }}
                >
                    {personalInfo.name || 'Your Name'}
                </h1>

                {personalInfo.title && (
                    <h2 className="text-gray-600 font-medium tracking-wide pb-3 uppercase text-sm">
                        {personalInfo.title}
                    </h2>
                )}

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-gray-500 mt-2">
                    {personalInfo.email && (
                        <div className="flex items-center gap-1.5 hover:text-gray-800 transition-colors">
                            <Mail size={12} style={{ color: merged.primaryColor }} />
                            <span>{personalInfo.email}</span>
                        </div>
                    )}
                    {personalInfo.phone && (
                        <div className="flex items-center gap-1.5 hover:text-gray-800 transition-colors">
                            <Phone size={12} style={{ color: merged.primaryColor }} />
                            <span>{personalInfo.phone}</span>
                        </div>
                    )}
                    {personalInfo.location && (
                        <div className="flex items-center gap-1.5 hover:text-gray-800 transition-colors">
                            <MapPin size={12} style={{ color: merged.primaryColor }} />
                            <span>{personalInfo.location}</span>
                        </div>
                    )}
                    {personalInfo.linkedin && (
                        <div className="flex items-center gap-1.5 hover:text-gray-800 transition-colors">
                            <Linkedin size={12} style={{ color: merged.primaryColor }} />
                            <span>{personalInfo.linkedin.replace('https://www.linkedin.com/in/', '')}</span>
                        </div>
                    )}
                    {personalInfo.website && (
                        <div className="flex items-center gap-1.5 hover:text-gray-800 transition-colors">
                            <Globe size={12} style={{ color: merged.primaryColor }} />
                            <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-10 py-6 space-y-7">
                {/* Summary */}
                {summary && (
                    <section>
                        <h3
                            className="uppercase font-bold tracking-widest mb-3 pb-1 border-b"
                            style={{ fontSize: fonts.heading, color: merged.primaryColor, borderColor: `${merged.primaryColor}30` }}
                        >
                            Professional Summary
                        </h3>
                        <p className="text-justify text-sm leading-relaxed text-gray-700">{summary}</p>
                    </section>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <section>
                        <h3
                            className="uppercase font-bold tracking-widest mb-4 pb-1 border-b"
                            style={{ fontSize: fonts.heading, color: merged.primaryColor, borderColor: `${merged.primaryColor}30` }}
                        >
                            Experience
                        </h3>
                        <div className="space-y-5">
                            {experience.map((exp) => (
                                <div key={exp.id} className="print-break-inside-avoid">
                                    <div className="flex justify-between items-end mb-1">
                                        <h4 className="font-bold text-gray-900">{exp.position}</h4>
                                        <span
                                            className="text-xs font-semibold px-2 py-0.5 rounded-sm"
                                            style={{ backgroundColor: `${merged.primaryColor}15`, color: merged.primaryColor }}
                                        >
                                            {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                                        </span>
                                    </div>
                                    <div className="text-gray-600 font-medium text-sm mb-2">{exp.company}</div>
                                    {exp.description && <p className="text-sm text-gray-700 mb-2">{exp.description}</p>}
                                    {exp.achievements.length > 0 && (
                                        <ul className="list-disc list-inside text-sm space-y-1 ml-1 text-gray-700">
                                            {exp.achievements.map((achievement, i) => (
                                                <li key={i} className="pl-1">
                                                    <span className="-ml-1">{achievement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education & Skills Grid */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Education */}
                    {education.length > 0 && (
                        <section>
                            <h3
                                className="uppercase font-bold tracking-widest mb-4 pb-1 border-b"
                                style={{ fontSize: fonts.heading, color: merged.primaryColor, borderColor: `${merged.primaryColor}30` }}
                            >
                                Education
                            </h3>
                            <div className="space-y-4">
                                {education.map((edu) => (
                                    <div key={edu.id} className="print-break-inside-avoid">
                                        <h4 className="font-bold text-gray-900 leading-tight mb-1">{edu.degree} in {edu.field}</h4>
                                        <div className="text-gray-600 font-medium text-sm mb-1">{edu.institution}</div>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>{formatDateRange(edu.startDate, edu.endDate, false)}</span>
                                            {edu.gpa && <span className="font-semibold bg-gray-100 px-1.5 rounded text-gray-700">GPA: {edu.gpa}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {(skills.technical.length > 0 || skills.languages.length > 0) && (
                        <section>
                            <h3
                                className="uppercase font-bold tracking-widest mb-4 pb-1 border-b"
                                style={{ fontSize: fonts.heading, color: merged.primaryColor, borderColor: `${merged.primaryColor}30` }}
                            >
                                Core Skills
                            </h3>
                            <div className="space-y-3">
                                {skills.technical.length > 0 && (
                                    <div>
                                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Technical</div>
                                        <div style={{ display: 'block', lineHeight: '28px' }}>
                                            {skills.technical.map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-sm border border-gray-200"
                                                    style={{ display: 'inline-block', marginRight: '6px', marginBottom: '6px' }}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {skills.softSkills.length > 0 && (
                                    <div>
                                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 mt-3">Interpersonal</div>
                                        <div className="text-sm text-gray-700 leading-relaxed">
                                            {skills.softSkills.join(', ')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>

                {/* Projects */}
                {projects.length > 0 && (
                    <section>
                        <h3
                            className="uppercase font-bold tracking-widest mb-4 pb-1 border-b"
                            style={{ fontSize: fonts.heading, color: merged.primaryColor, borderColor: `${merged.primaryColor}30` }}
                        >
                            Key Projects
                        </h3>
                        <div className="grid grid-cols-2 gap-5">
                            {projects.slice(0, 4).map((project) => (
                                <div key={project.id} className="print-break-inside-avoid bg-gray-50 p-3 rounded border border-gray-100">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-gray-900">{project.name}</h4>
                                    </div>
                                    <p className="text-xs text-gray-700 mb-2 line-clamp-3">{project.description}</p>
                                    {project.technologies.length > 0 && (
                                        <div className="text-[10px] font-medium text-gray-500 truncate">
                                            {project.technologies.join(' • ')}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};
