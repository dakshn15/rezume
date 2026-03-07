import React from 'react';
import { Resume } from '@/data/resumeModel';
import { formatDateRange } from '@/utils/helpers';
import { TemplateSettings } from '@/store/settingsStore';
import { Github, Code2, Terminal, Database, Globe } from 'lucide-react';

const getFontSize = (size: string) => {
    switch (size) {
        case 'small': return { base: '12px', heading: '14px', title: '24px', mono: '11px' };
        case 'large': return { base: '16px', heading: '18px', title: '32px', mono: '15px' };
        default: return { base: '14px', heading: '16px', title: '28px', mono: '13px' };
    }
};

interface TemplateProps {
    resume: Resume;
    settings?: TemplateSettings;
}

export const DeveloperTemplate: React.FC<TemplateProps> = ({ resume, settings }) => {
    const { personalInfo, summary, experience, education, skills, projects } = resume;
    const merged = { fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: 'medium', primaryColor: '#10b981', ...(settings || {}) } as TemplateSettings;
    const fonts = getFontSize(merged.fontSize);

    return (
        <div
            className="resume-paper w-full box-border bg-[#0f172a] text-[#f8fafc]"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: fonts.base, lineHeight: '21px' }}
        >
            {/* Top Banner */}
            <div
                className="w-full h-2"
                style={{ backgroundColor: merged.primaryColor }}
            />

            <div className="p-8">
                {/* Header */}
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#334155] pb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <Terminal size={28} style={{ color: merged.primaryColor }} />
                            <h1
                                className="font-bold tracking-tight"
                                style={{ fontSize: fonts.title }}
                            >
                                {personalInfo.name || 'Your Name'}
                            </h1>
                        </div>
                        {personalInfo.title && (
                            <h2 className="text-[#94a3b8] font-mono text-sm" style={{ fontSize: fonts.mono }}>
                                <span className="text-[#38bdf8]">const</span> role = <span className="text-[#a3e635]">"{personalInfo.title}"</span>;
                            </h2>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5 mt-4 md:mt-0 text-sm font-mono text-[#cbd5e1]" style={{ fontSize: fonts.mono }}>
                        {personalInfo.email && (
                            <div className="flex items-center gap-2 justify-end">
                                <span>{personalInfo.email}</span>
                                <span style={{ color: merged.primaryColor }}>@</span>
                            </div>
                        )}
                        {personalInfo.linkedin && (
                            <div className="flex items-center gap-2 justify-end">
                                <span>{personalInfo.linkedin.replace('https://www.linkedin.com/in/', '')}</span>
                                <Globe size={14} style={{ color: merged.primaryColor }} />
                            </div>
                        )}
                        {/* Treat website as GitHub for dev template if it looks like one, or just general link */}
                        {personalInfo.website && (
                            <div className="flex items-center gap-2 justify-end">
                                <span>{personalInfo.website.replace('https://github.com/', '')}</span>
                                <Github size={14} style={{ color: merged.primaryColor }} />
                            </div>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
                    {/* Main Column */}
                    <div className="space-y-8">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <Code2 size={20} style={{ color: merged.primaryColor }} />
                                    <h3
                                        className="font-bold font-mono tracking-wide uppercase"
                                        style={{ fontSize: fonts.heading, color: merged.primaryColor }}
                                    >
                                        Experience
                                    </h3>
                                </div>

                                <div className="space-y-6">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="print-break-inside-avoid relative pl-4 border-l-2 border-[#334155]">
                                            <div
                                                className="absolute w-2 h-2 rounded-full -left-[5px] top-1.5"
                                                style={{ backgroundColor: merged.primaryColor }}
                                            />
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-white">{exp.position}</h4>
                                                <span className="text-xs font-mono text-[#94a3b8] bg-[#1e293b] px-2 py-1 rounded">
                                                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                                                </span>
                                            </div>
                                            <div className="text-[#38bdf8] font-medium text-sm mb-3 font-mono">
                                                @{exp.company}
                                            </div>

                                            {exp.description && (
                                                <p className="text-[#94a3b8] text-sm mb-3">
                                                    {exp.description}
                                                </p>
                                            )}

                                            {exp.achievements.length > 0 && (
                                                <ul className="list-none space-y-1.5 text-sm text-[#cbd5e1]">
                                                    {exp.achievements.map((achievement, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-[#a3e635] mt-0.5 font-mono">{">"}</span>
                                                            <span>{achievement}</span>
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
                        {projects.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <Database size={20} style={{ color: merged.primaryColor }} />
                                    <h3
                                        className="font-bold font-mono tracking-wide uppercase"
                                        style={{ fontSize: fonts.heading, color: merged.primaryColor }}
                                    >
                                        Featured Projects
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {projects.map((project) => (
                                        <div key={project.id} className="print-break-inside-avoid bg-[#1e293b] p-4 rounded-lg border border-[#334155]">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-white flex items-center gap-2">
                                                    <Github size={16} />
                                                    {project.name}
                                                </h4>
                                                {project.url && (
                                                    <a href={project.url} className="text-xs text-[#38bdf8] hover:underline font-mono">
                                                        Link↗
                                                    </a>
                                                )}
                                            </div>
                                            <p className="text-sm text-[#94a3b8] mb-3">
                                                {project.description}
                                            </p>
                                            {project.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {project.technologies.map((tech, i) => (
                                                        <span
                                                            key={i}
                                                            className="text-xs font-mono px-2 py-0.5 rounded bg-[#0f172a] text-[#cbd5e1] border border-[#334155]"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Summary */}
                        {summary && (
                            <section className="bg-[#1e293b] p-4 rounded-lg border border-[#334155]">
                                <h3 className="font-mono text-sm text-[#94a3b8] mb-2 uppercase tracking-widest">// About</h3>
                                <p className="text-sm text-[#cbd5e1] leading-relaxed">
                                    {summary}
                                </p>
                            </section>
                        )}

                        {/* Skills */}
                        {(skills.technical.length > 0 || skills.languages.length > 0) && (
                            <section>
                                <h3 className="font-mono text-sm text-[#94a3b8] mb-4 uppercase tracking-widest border-b border-[#334155] pb-2">
                                    {"<Skills />"}
                                </h3>

                                {skills.technical.length > 0 && (
                                    <div className="mb-4">
                                        <div className="text-xs text-[#38bdf8] font-mono mb-2">tech_stack:</div>
                                        <div style={{ display: 'block', lineHeight: '28px' }}>
                                            {skills.technical.map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="text-xs font-mono px-2 py-1 rounded bg-[#1e293b] text-[#a3e635] border border-[#334155]"
                                                    style={{ display: 'inline-block', marginRight: '8px', marginBottom: '8px' }}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {skills.languages.length > 0 && (
                                    <div>
                                        <div className="text-xs text-[#38bdf8] font-mono mb-2">languages:</div>
                                        <div style={{ display: 'block', lineHeight: '28px' }}>
                                            {skills.languages.map((lang, i) => (
                                                <span
                                                    key={i}
                                                    className="text-xs font-mono px-2 py-1 rounded bg-[#1e293b] text-[#cbd5e1] border border-[#334155]"
                                                    style={{ display: 'inline-block', marginRight: '8px', marginBottom: '8px' }}
                                                >
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section>
                                <h3 className="font-mono text-sm text-[#94a3b8] mb-4 uppercase tracking-widest border-b border-[#334155] pb-2">
                                    {"<Education />"}
                                </h3>

                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="print-break-inside-avoid">
                                            <h4 className="font-bold text-[#f8fafc] text-sm mb-1">{edu.degree}</h4>
                                            <div className="text-[#cbd5e1] text-sm mb-1">{edu.field}</div>
                                            <div className="text-[#94a3b8] text-xs font-mono">{edu.institution}</div>
                                            <div className="text-[#64748b] text-xs font-mono mt-1">
                                                {formatDateRange(edu.startDate, edu.endDate, false)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
