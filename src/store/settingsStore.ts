import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TemplateSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
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
  autoSave: boolean;
  autoSaveInterval: number;
  
  updateTemplateSettings: (settings: Partial<TemplateSettings>) => void;
  updateExportSettings: (settings: Partial<ExportSettings>) => void;
  toggleTips: () => void;
  toggleAutoSave: () => void;
  setAutoSaveInterval: (interval: number) => void;
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
      autoSave: true,
      autoSaveInterval: 2000,

      updateTemplateSettings: (settings) =>
        set((state) => ({
          templateSettings: { ...state.templateSettings, ...settings },
        })),

      updateExportSettings: (settings) =>
        set((state) => ({
          exportSettings: { ...state.exportSettings, ...settings },
        })),

      toggleTips: () => set((state) => ({ showTips: !state.showTips })),
      toggleAutoSave: () => set((state) => ({ autoSave: !state.autoSave })),
      setAutoSaveInterval: (interval) => set({ autoSaveInterval: interval }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
