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

interface TemplateRendererProps {
  resume: Resume;
  templateId: string;
  settings?: TemplateSettings;
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
  return <Template resume={resume} settings={mergedSettings} />;
};

export { templateInfo } from '@/data/templateData';


