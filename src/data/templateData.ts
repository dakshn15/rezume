export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  color: string;
}

export const templateInfo: TemplateInfo[] = [
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
