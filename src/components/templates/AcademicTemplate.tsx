import React from 'react';
import { Resume } from '@/data/resumeModel';
import { formatDateRange } from '@/utils/helpers';
import { TemplateSettings } from '@/store/settingsStore';

const getFontSize = (size: string) => {
    switch (size) {
        case 'small': return { base: '11px', heading: '12px', title: '18px' };
        case 'large': return { base: '14px', heading: '16px', title: '24px' };
        default: return { base: '12px', heading: '14px', title: '20px' };
    }
};

interface TemplateProps {
    resume: Resume;
    settings?: TemplateSettings;
}

export const AcademicTemplate: React.FC<TemplateProps> = ({ resume, settings }) => {
    const { personalInfo, summary, experience, education, skills, projects, additional } = resume;
    const merged = { fontFamily: '"Times New Roman", Times, serif', fontSize: 'medium', primaryColor: '#000000', ...(settings || {}) } as TemplateSettings;
    const fonts = getFontSize(merged.fontSize);

    return (
        <div
            className="resume-paper w-full box-border bg-white text-black p-10"
            style={{ fontFamily: merged.fontFamily, fontSize: fonts.base, lineHeight: 1.3 }}
        >
            {/* Header */}
            <div className="text-center mb-6">
                <h1
                    className="font-bold uppercase mb-1"
                    style={{ fontSize: fonts.title, color: merged.primaryColor }}
                >
                    {personalInfo.name || 'Your Name'}
                </h1>

                <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5 mt-2">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                    {personalInfo.location && <span>• {personalInfo.location}</span>}
                </div>
                {(personalInfo.linkedin || personalInfo.website) && (
                    <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5">
                        {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                        {personalInfo.website && <span>• {personalInfo.website}</span>}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {/* Education (Prioritized in Academic CV) */}
                {education.length > 0 && (
                    <section>
                        <h3
                            className="uppercase font-bold border-b-2 border-black mb-2 pb-0.5"
                            style={{ fontSize: fonts.heading, color: merged.primaryColor }}
                        >
                            Education
                        </h3>
                        <div className="space-y-3">
                            {education.map((edu) => (
                                <div key={edu.id} className="print-break-inside-avoid">
                                    <div className="flex justify-between items-end font-bold">
                                        <span>{edu.degree} in {edu.field}</span>
                                        <span className="font-normal">{formatDateRange(edu.startDate, edu.endDate, false)}</span>
                                    </div>
                                    <div className="italic">{edu.institution}</div>
                                    {edu.gpa && <div>GPA: {edu.gpa}</div>}
                                    {edu.achievements && edu.achievements.length > 0 && (
                                        <div className="mt-1 pl-4">
                                            {edu.achievements.map((ach, i) => (
                                                <div key={i}>{ach}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Research / Experience */}
                {experience.length > 0 && (
                    <section>
                        <h3
                            className="uppercase font-bold border-b-2 border-black mb-2 pb-0.5"
                            style={{ fontSize: fonts.heading, color: merged.primaryColor }}
                        >
                            Academic & Professional Experience
                        </h3>
                        <div className="space-y-3">
                            {experience.map((exp) => (
                                <div key={exp.id} className="print-break-inside-avoid mt-2">
                                    <div className="flex justify-between items-end font-bold">
                                        <span>{exp.position}</span>
                                        <span className="font-normal">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                                    </div>
                                    <div className="italic">{exp.company}</div>
                                    {exp.description && <p className="mt-1">{exp.description}</p>}
                                    {exp.achievements.length > 0 && (
                                        <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5">
                                            {exp.achievements.map((achievement, i) => (
                                                <li key={i}>{achievement}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Summary (Often replaced by Research Interests in Academic, we use Summary here) */}
                {summary && (
                    <section>
                        <h3
                            className="uppercase font-bold border-b-2 border-black mb-2 pb-0.5"
                            style={{ fontSize: fonts.heading, color: merged.primaryColor }}
                        >
                            Research Interests / Profile
                        </h3>
                        <p className="text-justify">{summary}</p>
                    </section>
                )}

                {/* Projects / Publications */}
                {projects.length > 0 && (
                    <section>
                        <h3
                            className="uppercase font-bold border-b-2 border-black mb-2 pb-0.5"
                            style={{ fontSize: fonts.heading, color: merged.primaryColor }}
                        >
                            Selected Projects & Publications
                        </h3>
                        <div className="space-y-3">
                            {projects.map((project) => (
                                <div key={project.id} className="print-break-inside-avoid">
                                    <span className="font-bold">{project.name}.</span>{' '}
                                    {project.description}
                                    {project.url && <span className="italic ml-1">Available at: {project.url}</span>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Honors & Awards (Certifications map to this in the builder) */}
                {additional.certifications.length > 0 && (
                    <section>
                        <h3
                            className="uppercase font-bold border-b-2 border-black mb-2 pb-0.5"
                            style={{ fontSize: fonts.heading, color: merged.primaryColor }}
                        >
                            Honors, Awards & Grants
                        </h3>
                        <ul className="list-none space-y-1">
                            {additional.certifications.map((cert) => (
                                <li key={cert.id} className="print-break-inside-avoid flex">
                                    <span className="w-24 shrink-0">{cert.date}</span>
                                    <span><span className="font-bold">{cert.name}</span>, {cert.issuer}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Technical Skills */}
                {skills.technical.length > 0 && (
                    <section>
                        <h3
                            className="uppercase font-bold border-b-2 border-black mb-2 pb-0.5"
                            style={{ fontSize: fonts.heading, color: merged.primaryColor }}
                        >
                            Technical Skills
                        </h3>
                        <p>{skills.technical.join(', ')}</p>
                    </section>
                )}
            </div>
        </div>
    );
};
