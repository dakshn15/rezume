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

export const templateInfo = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Two-column layout with sidebar, perfect for tech professionals',
    color: '#1e3a5f',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional single-column design, ideal for conservative industries',
    color: '#000000',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean design with maximum white space and ATS compatibility',
    color: '#6b7280',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold colors and timeline design for creative professionals',
    color: '#7c3aed',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean, corporate-focused layout standard for business roles',
    color: '#2563eb',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated layout emphasizing leadership and high-level achievements',
    color: '#1e293b',
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Tailored for software engineers, highlighting tech stacks and projects',
    color: '#10b981',
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Traditional CV format suited for research and higher education',
    color: '#000000',
  },
];
