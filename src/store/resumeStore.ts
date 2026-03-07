import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { Resume, defaultResume, Experience, Education, Project, Certification, Skills } from '@/data/resumeModel';
import { nanoid } from 'nanoid';
import api from '@/services/api';
import { useAuthStore } from './authStore';

interface HistoryState {
  past: Resume[];
  future: Resume[];
}

interface ResumeState {
  currentResume: Resume;
  allResumes: Resume[];
  history: HistoryState;
  isSaving: boolean;
  lastSaved: string | null;

  // Resume actions
  setCurrentResume: (resume: Resume) => void;
  updatePersonalInfo: (info: Partial<Resume['personalInfo']>) => void;
  updateSummary: (summary: string) => void;

  // Experience actions
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  reorderExperience: (startIndex: number, endIndex: number) => void;

  // Education actions
  addEducation: (education: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  reorderEducation: (startIndex: number, endIndex: number) => void;

  // Skills actions
  updateSkills: (skills: Partial<Skills>) => void;
  addSkill: (category: keyof Skills, skill: string) => void;
  removeSkill: (category: keyof Skills, skill: string) => void;

  // Projects actions
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  reorderProjects: (startIndex: number, endIndex: number) => void;

  // Certification actions
  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;

  // Additional actions
  updateAdditional: (field: 'awards' | 'volunteer' | 'hobbies', values: string[]) => void;

  // Template actions
  setTemplate: (templateId: string) => void;

  // Resume management
  createNewResume: (name?: string) => void;
  duplicateResume: (id: string) => void;
  deleteResume: (id: string) => void;
  renameResume: (id: string, name: string) => void;
  loadResume: (id: string) => void;
  importResume: (resume: Resume) => void;

  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // API actions
  fetchResumes: () => Promise<void>;
  saveResume: (resume: Resume) => Promise<void>;

  // Utility
  setSaving: (saving: boolean) => void;
  setLastSaved: (date: string) => void;
}

const saveToHistory = (state: ResumeState): HistoryState => ({
  past: [...state.history.past.slice(-19), { ...state.currentResume }],
  future: [],
});

const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const useResumeStore = create<ResumeState>()(
  devtools(
    persist(
      (set, get) => ({
        currentResume: { ...defaultResume, id: nanoid() },
        allResumes: [],
        history: { past: [], future: [] },
        isSaving: false,
        lastSaved: null,

        setCurrentResume: (resume) => set((state) => ({
          currentResume: resume,
          history: saveToHistory(state),
        })),

        updatePersonalInfo: (info) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            personalInfo: { ...state.currentResume.personalInfo, ...info },
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        updateSummary: (summary) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            summary,
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        // Experience
        addExperience: (experience) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            experience: [...state.currentResume.experience, { ...experience, id: nanoid() }],
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        updateExperience: (id, experience) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            experience: state.currentResume.experience.map((exp) =>
              exp.id === id ? { ...exp, ...experience } : exp
            ),
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        deleteExperience: (id) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            experience: state.currentResume.experience.filter((exp) => exp.id !== id),
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        reorderExperience: (startIndex, endIndex) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            experience: reorder(state.currentResume.experience, startIndex, endIndex),
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        // Education
        addEducation: (education) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            education: [...state.currentResume.education, { ...education, id: nanoid() }],
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        updateEducation: (id, education) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            education: state.currentResume.education.map((edu) =>
              edu.id === id ? { ...edu, ...education } : edu
            ),
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        deleteEducation: (id) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            education: state.currentResume.education.filter((edu) => edu.id !== id),
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        reorderEducation: (startIndex, endIndex) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            education: reorder(state.currentResume.education, startIndex, endIndex),
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        // Skills
        updateSkills: (skills) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            skills: { ...state.currentResume.skills, ...skills },
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        addSkill: (category, skill) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            skills: {
              ...state.currentResume.skills,
              [category]: [...state.currentResume.skills[category], skill],
            },
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        removeSkill: (category, skill) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            skills: {
              ...state.currentResume.skills,
              [category]: state.currentResume.skills[category].filter((s) => s !== skill),
            },
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        // Projects
        addProject: (project) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            projects: [...state.currentResume.projects, { ...project, id: nanoid() }],
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        updateProject: (id, project) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            projects: state.currentResume.projects.map((proj) =>
              proj.id === id ? { ...proj, ...project } : proj
            ),
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        deleteProject: (id) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            projects: state.currentResume.projects.filter((proj) => proj.id !== id),
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        reorderProjects: (startIndex, endIndex) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            projects: reorder(state.currentResume.projects, startIndex, endIndex),
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        // Certifications
        addCertification: (cert) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            additional: {
              ...state.currentResume.additional,
              certifications: [...state.currentResume.additional.certifications, { ...cert, id: nanoid() }],
            },
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        updateCertification: (id, cert) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            additional: {
              ...state.currentResume.additional,
              certifications: state.currentResume.additional.certifications.map((c) =>
                c.id === id ? { ...c, ...cert } : c
              ),
            },
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        deleteCertification: (id) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            additional: {
              ...state.currentResume.additional,
              certifications: state.currentResume.additional.certifications.filter((c) => c.id !== id),
            },
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        // Additional
        updateAdditional: (field, values) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            additional: {
              ...state.currentResume.additional,
              [field]: values,
            },
            updatedAt: new Date().toISOString(),
          },
          history: saveToHistory(state),
        })),

        // Template
        setTemplate: (templateId) => set((state) => ({
          currentResume: {
            ...state.currentResume,
            templateId,
            updatedAt: new Date().toISOString(),
          },
        })),

        // Resume management
        createNewResume: (name = 'Untitled Resume') => {
          const newResume = { ...defaultResume, id: nanoid(), name, createdAt: new Date().toISOString() };
          set((state) => ({
            currentResume: newResume,
            allResumes: [...state.allResumes, newResume],
            history: { past: [], future: [] },
          }));
        },

        duplicateResume: (id) => set((state) => {
          const original = state.allResumes.find((r) => r.id === id);
          if (!original) return state;
          const duplicate = {
            ...original,
            id: nanoid(),
            name: `${original.name} (Copy)`,
            createdAt: new Date().toISOString(),
          };
          return {
            allResumes: [...state.allResumes, duplicate],
            currentResume: duplicate,
          };
        }),

        deleteResume: (id) => set((state) => ({
          allResumes: state.allResumes.filter((r) => r.id !== id),
          currentResume: state.currentResume.id === id
            ? (state.allResumes[0] || { ...defaultResume, id: nanoid() })
            : state.currentResume,
        })),

        renameResume: (id, name) => set((state) => ({
          allResumes: state.allResumes.map((r) => (r.id === id ? { ...r, name } : r)),
          currentResume: state.currentResume.id === id
            ? { ...state.currentResume, name }
            : state.currentResume,
        })),

        loadResume: (id) => set((state) => {
          const resume = state.allResumes.find((r) => r.id === id);
          if (!resume) return state;
          return {
            currentResume: resume,
            history: { past: [], future: [] },
          };
        }),

        importResume: (resume) => set((state) => ({
          currentResume: { ...resume, id: nanoid() },
          allResumes: [...state.allResumes, { ...resume, id: nanoid() }],
          history: { past: [], future: [] },
        })),

        // History
        undo: () => set((state) => {
          if (state.history.past.length === 0) return state;
          const previous = state.history.past[state.history.past.length - 1];
          return {
            currentResume: previous,
            history: {
              past: state.history.past.slice(0, -1),
              future: [state.currentResume, ...state.history.future],
            },
          };
        }),

        redo: () => set((state) => {
          if (state.history.future.length === 0) return state;
          const next = state.history.future[0];
          return {
            currentResume: next,
            history: {
              past: [...state.history.past, state.currentResume],
              future: state.history.future.slice(1),
            },
          };
        }),

        canUndo: () => get().history.past.length > 0,
        canRedo: () => get().history.future.length > 0,

        setSaving: (isSaving) => set({ isSaving }),
        setLastSaved: (lastSaved) => set({ lastSaved }),

        // API Actions
        fetchResumes: async () => {
          if (!useAuthStore.getState().isAuthenticated()) {
            return; // Skip fetching for guests, rely on persisted local state
          }
          try {
            const response = await api.get('/resumes');
            // Assuming backend returns { resumes: Resume[] } or Resume[]
            const fetchedResumes = Array.isArray(response.data) ? response.data : response.data.resumes;
            // Map backend structure to frontend if needed, for now assume matching or parsing JSON
            // If backend stores resumeJson, we need to parse it
            const parsedResumes = fetchedResumes.map((r: any) => ({
              ...r,
              ...(typeof r.resumeJson === 'string' ? JSON.parse(r.resumeJson) : r.resumeJson),
              id: r.id // Ensure ID comes from backend
            }));

            set({ allResumes: parsedResumes });
          } catch (error) {
            console.error('Failed to fetch resumes:', error);
          }
        },

        saveResume: async (resume) => {
          set({ isSaving: true });

          if (!useAuthStore.getState().isAuthenticated()) {
            // Unauthenticated users rely purely on Zustand local persist
            set({
              lastSaved: new Date().toISOString(),
              isSaving: false
            });
            return;
          }

          try {
            // Optimistic update logic:
            // If the ID is a nanoid (length 21 default), it's likely local-only.
            // Backend UUIDs are 36 chars.
            const isLocal = resume.id.length < 30;

            if (isLocal) {
              const response = await api.post('/resumes', {
                title: resume.personalInfo.name || 'Untitled Resume',
                resumeJson: resume
              });

              const newId = response.data.id;

              // Update local state with real backend ID
              set((state) => {
                const updatedResume = { ...resume, id: newId };
                const updatedAll = state.allResumes.map(r => r.id === resume.id ? updatedResume : r);
                return {
                  currentResume: updatedResume,
                  allResumes: updatedAll,
                  lastSaved: new Date().toISOString(),
                  isSaving: false
                };
              });
            } else {
              await api.put(`/resumes/${resume.id}`, {
                title: resume.personalInfo.name || 'Untitled Resume',
                resumeJson: resume
              });

              set({
                lastSaved: new Date().toISOString(),
                isSaving: false
              });
            }

          } catch (error) {
            console.error('Failed to save resume:', error);
            set({ isSaving: false });
          }
        },

      }),
      {
        name: 'resume-storage',
        partialize: (state) => ({
          currentResume: state.currentResume,
          allResumes: state.allResumes,
        }),
      }
    )
  )
);
