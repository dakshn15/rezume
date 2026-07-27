export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  github?: string;
  photo?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
  highlights?: string[];
}

export interface Skills {
  technical: string[];
  languages: string[];
  softSkills: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Additional {
  certifications: Certification[];
  awards: string[];
  volunteer: string[];
  hobbies: string[];
}

export interface Resume {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  templateId: string;
  templateSettings?: Partial<import('@/store/settingsStore').TemplateSettings>;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skills;
  projects: Project[];
  additional: Additional;
}

export const defaultResume: Resume = {
  id: '',
  name: 'Untitled Resume',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  templateId: 'modern',
  personalInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    github: '',
    photo: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: {
    technical: [],
    languages: [],
    softSkills: [],
  },
  projects: [],
  additional: {
    certifications: [],
    awards: [],
    volunteer: [],
    hobbies: [],
  },
};

export type SectionType =
  | 'personalInfo'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'additional';

export interface SectionConfig {
  id: SectionType;
  label: string;
  icon: string;
  required: boolean;
}

export const sectionConfigs: SectionConfig[] = [
  { id: 'personalInfo', label: 'Personal Info', icon: 'User', required: true },
  { id: 'summary', label: 'Summary', icon: 'FileText', required: false },
  { id: 'experience', label: 'Experience', icon: 'Briefcase', required: true },
  { id: 'education', label: 'Education', icon: 'GraduationCap', required: true },
  { id: 'skills', label: 'Skills', icon: 'Wrench', required: true },
  { id: 'projects', label: 'Projects', icon: 'FolderGit2', required: false },
  { id: 'additional', label: 'Additional', icon: 'Plus', required: false },
];
