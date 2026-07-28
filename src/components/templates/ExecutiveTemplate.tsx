import React from 'react';
import { Resume } from '@/data/resumeModel';
import { formatDateRange } from '@/utils/helpers';
import { TemplateSettings } from '@/store/settingsStore';

const getFontSize = (size: string) => {
    switch (size) {
        case 'xs': return { base: '10px', heading: '12px', title: '22px' };
        case 'small': return { base: '11px', heading: '13px', title: '24px' };
        case 'xl': return { base: '16px', heading: '19px', title: '36px' };
        case 'large': return { base: '15px', heading: '17px', title: '32px' };
        default: return { base: '12px', heading: '14px', title: '25px' };
    }
};

interface TemplateProps {
    resume: Resume;
    settings?: TemplateSettings;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ resume, settings }) => {
    const { personalInfo, summary, experience, education, skills, projects, additional } = resume;
    const merged = { fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'medium', primaryColor: '#1e293b', ...(settings || {}) } as TemplateSettings;
    const fonts = getFontSize(merged.fontSize);

    return (
        <div
            className="resume-paper w-full box-border bg-[#fdfbf7] text-[#1c1917]"
            style={{ fontFamily: merged.fontFamily, fontSize: fonts.base, lineHeight: 1.35 }}
        >
            <div className="max-w-[850px] mx-auto px-7 py-5">
                {/* Header */}
                <header className="mb-4 text-center">
                    <h1
                        className="tracking-widest uppercase mb-2 font-semibold"
                        style={{ fontSize: fonts.title, color: merged.primaryColor }}
                    >
                        {personalInfo.name || 'Your Name'}
                    </h1>
                    {personalInfo.title && (
                        <h2 className="text-[#57534e] tracking-[0.2em] uppercase text-sm mb-3 pb-3 border-b border-[#d6d3d1] mx-12">
                            {personalInfo.title}
                        </h2>
                    )}

                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-[#78716c] font-sans tracking-wide">
                        {personalInfo.email && <span>{personalInfo.email}</span>}
                        {personalInfo.phone && <span>| {personalInfo.phone}</span>}
                        {personalInfo.location && <span>| {personalInfo.location}</span>}
                        {personalInfo.linkedin && <span>| {personalInfo.linkedin.replace('https://www.linkedin.com/in/', 'in/')}</span>}
                    </div>
                </header>

                {/* Executive Summary */}
                {summary && (
                    <section className="mb-3">
                        <h3
                            className="uppercase tracking-[0.15em] mb-2 text-center font-bold"
                            style={{ fontSize: fonts.heading, color: merged.primaryColor }}
                        >
                            Executive Profile
                        </h3>
                        <p className="text-justify leading-relaxed text-[#44403c] px-4 font-serif italic text-[0.95em]">
                            {summary}
                        </p>
                    </section>
                )}

                {/* Core Competencies (Skills) */}
                {(skills.technical.length > 0 || skills.softSkills.length > 0) && (
                    <section className="mb-3">
                        <h3
                            className="uppercase tracking-[0.15em] mb-2 text-center font-bold"
                            style={{ fontSize: fonts.heading, color: merged.primaryColor }}
                        >
                            Core Competencies
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 px-4 text-center text-[0.9em] font-sans text-[#57534e]">
                            {[...skills.softSkills, ...skills.technical].slice(0, 12).map((skill, i) => (
                                <div key={i} className="py-0.5 border-b border-[#e7e5e4]">
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Professional Experience */}
                {experience.length > 0 && (
                    <section className="mb-3">
                        <h3
                            className="uppercase tracking-[0.15em] mb-3 text-center font-bold"
                            style={{ fontSize: fonts.heading, color: merged.primaryColor }}
                        >
                            Professional Experience
                        </h3>
                        <div className="space-y-3">
                            {experience.map((exp) => (
                                <div key={exp.id} className="print-break-inside-avoid">
                                    <div className="flex flex-col mb-1">
                                        <div className="flex justify-between items-end mb-0.5">
                                            <h4 className="font-bold text-[#1c1917] text-[1.05em]">{exp.company}</h4>
                                            <span className="text-[#78716c] font-sans text-[0.85em] tracking-wide uppercase">
                                                {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                                            </span>
                                        </div>
                                        <div className="text-[1em] italic" style={{ color: merged.primaryColor }}>
                                            {exp.position}
                                        </div>
                                    </div>

                                    {exp.description && (
                                        <p className="text-[#44403c] mb-1 leading-normal">
                                            {exp.description}
                                        </p>
                                    )}

                                    {exp.achievements.length > 0 && (
                                        <ul className="list-disc list-inside space-y-0.5 ml-2 text-[#44403c]">
                                            {exp.achievements.map((achievement, i) => (
                                                <li key={i} className="pl-1 leading-normal">
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

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <section className="mb-3">
                        <h3
                            className="uppercase tracking-[0.15em] mb-3 text-center font-bold"
                            style={{ fontSize: fonts.heading, color: merged.primaryColor }}
                        >
                            Key Strategic Projects
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                            {projects.map((project) => (
                                <div key={project.id} className="print-break-inside-avoid border-b border-[#e7e5e4] pb-2">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-[#1c1917]">{project.name}</h4>
                                        {project.url && (
                                            <a href={project.url} className="text-xs text-blue-600 hover:underline">Link↗</a>
                                        )}
                                    </div>
                                    <p className="text-[#44403c] text-xs mb-1 leading-normal">{project.description}</p>
                                    {project.technologies.length > 0 && (
                                        <div className="font-sans text-[0.8em] text-[#78716c]">
                                            {project.technologies.join(' • ')}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education & Credentials */}
                {(education.length > 0 || (additional?.certifications && additional.certifications.length > 0)) && (
                    <section>
                        <h3
                            className="uppercase tracking-[0.15em] mb-3 text-center font-bold"
                            style={{ fontSize: fonts.heading, color: merged.primaryColor }}
                        >
                            Education & Credentials
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                            <div>
                                {education.map((edu) => (
                                    <div key={edu.id} className="mb-2 print-break-inside-avoid">
                                        <h4 className="font-bold text-[#1c1917]">{edu.degree} in {edu.field}</h4>
                                        <div className="italic text-[#57534e]">{edu.institution}</div>
                                        <div className="font-sans text-[0.85em] text-[#78716c] tracking-wide uppercase">
                                            {formatDateRange(edu.startDate, edu.endDate, false)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {additional?.certifications && additional.certifications.length > 0 && (
                                <div>
                                    {additional.certifications.map((cert: any, idx: number) => {
                                        const certName = typeof cert === 'string' ? cert : cert.name || '';
                                        const certIssuer = typeof cert === 'object' && cert.issuer ? cert.issuer : '';
                                        const certDate = typeof cert === 'object' && cert.date ? cert.date : '';
                                        return (
                                            <div key={idx} className="mb-2 print-break-inside-avoid">
                                                <h4 className="font-bold text-[#1c1917]">{certName}</h4>
                                                {certIssuer && <div className="italic text-[#57534e]">{certIssuer}</div>}
                                                {certDate && (
                                                    <div className="font-sans text-[0.85em] text-[#78716c] tracking-wide uppercase">
                                                        {certDate}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};
