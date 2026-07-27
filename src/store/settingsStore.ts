import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TemplateSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: 'xs' | 'small' | 'medium' | 'large' | 'xl';
  spacing: 'compact' | 'normal' | 'relaxed';
  showPhoto: boolean;
  showSummary: boolean;
  showProjects: boolean;
  showCertifications: boolean;
  sectionOrder: string[];
}

export interface ExportSettings {
  paperSize: 'a4' | 'letter';
  quality: 'standard' | 'high';
  includePhoto: boolean;
  colorMode: 'color' | 'bw';
}

interface SettingsState {
  templateSettings: TemplateSettings;
  exportSettings: ExportSettings;
  showTips: boolean;
  
  updateTemplateSettings: (settings: Partial<TemplateSettings>) => void;
  updateExportSettings: (settings: Partial<ExportSettings>) => void;
  toggleTips: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      templateSettings: {
        primaryColor: '#1e3a5f',
        secondaryColor: '#3b82f6',
        accentColor: '#3b82f6',
        fontFamily: 'Inter',
        fontSize: 'medium',
        spacing: 'normal',
        showPhoto: true,
        showSummary: true,
        showProjects: true,
        showCertifications: true,
        sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
      },
      exportSettings: {
        paperSize: 'a4',
        quality: 'high',
        includePhoto: true,
        colorMode: 'color',
      },
      showTips: true,

      updateTemplateSettings: (settings) =>
        set((state) => ({
          templateSettings: { ...state.templateSettings, ...settings },
        })),

      updateExportSettings: (settings) =>
        set((state) => ({
          exportSettings: { ...state.exportSettings, ...settings },
        })),

      toggleTips: () => set((state) => ({ showTips: !state.showTips })),
    }),
    {
      name: 'settings-storage',
    }
  )
);
