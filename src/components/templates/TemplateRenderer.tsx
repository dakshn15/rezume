import React from 'react';
import { Resume } from '@/data/resumeModel';
import { ModernTemplate } from './ModernTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { DeveloperTemplate } from './DeveloperTemplate';
import { AcademicTemplate } from './AcademicTemplate';
import { TemplateSettings } from '@/store/settingsStore';

import { defaultResume } from '@/data/resumeModel';

interface TemplateRendererProps {
  resume: Resume;
  templateId: string;
  settings?: Partial<TemplateSettings>;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ resume, templateId, settings }) => {
  const defaultSettings: TemplateSettings = {
    primaryColor: '#1e3a5f',
    secondaryColor: '#3b82f6',
    accentColor: '#3b82f6',
    fontFamily: 'Inter, sans-serif',
    fontSize: 'medium',
    spacing: 'normal',
    showPhoto: true,
    showSummary: true,
    showProjects: true,
    showCertifications: true,
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
  };

  const mergedSettings = { ...defaultSettings, ...settings };

  const safeResume: Resume = React.useMemo(() => {
    if (!resume) return defaultResume;
    return {
      ...defaultResume,
      ...resume,
      personalInfo: { ...defaultResume.personalInfo, ...(resume.personalInfo || {}) },
      skills: {
        technical: (resume.skills?.technical || []).filter((s) => typeof s === 'string' && s.trim().length > 0),
        languages: (resume.skills?.languages || []).filter((s) => typeof s === 'string' && s.trim().length > 0),
        softSkills: (resume.skills?.softSkills || []).filter((s) => typeof s === 'string' && s.trim().length > 0),
      },
      experience: (resume.experience || []).map((exp) => ({
        ...exp,
        achievements: (exp.achievements || []).filter((a) => typeof a === 'string' && a.trim().length > 0),
      })),
      education: resume.education || [],
      projects: (resume.projects || []).map((proj) => ({
        ...proj,
        technologies: (proj.technologies || []).filter((t) => typeof t === 'string' && t.trim().length > 0),
      })),
      additional: {
        certifications: resume.additional?.certifications || [],
        awards: (resume.additional?.awards || []).filter((a) => typeof a === 'string' && a.trim().length > 0),
        volunteer: (resume.additional?.volunteer || []).filter((v) => typeof v === 'string' && v.trim().length > 0),
        hobbies: (resume.additional?.hobbies || []).filter((h) => typeof h === 'string' && h.trim().length > 0),
      },
    };
  }, [resume]);

  const templates: Record<string, React.FC<{ resume: Resume; settings: TemplateSettings }>> = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimal: MinimalTemplate,
    creative: CreativeTemplate,
    professional: ProfessionalTemplate,
    executive: ExecutiveTemplate,
    developer: DeveloperTemplate,
    academic: AcademicTemplate,
  };

  const Template = templates[templateId] || ModernTemplate;

  // Return the selected template directly; the outer preview container
  // (Editor previewRef) already sets the paper width/scale/shadow, so we
  // should avoid adding another outer wrapper that can interfere with sizing.
  return <Template resume={safeResume} settings={mergedSettings} />;
};

export { templateInfo } from '@/data/templateData';


