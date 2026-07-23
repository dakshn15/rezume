import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { CustomButton } from '@/components/ui/custom-button';
import { CustomInput } from '@/components/ui/custom-input';
import { CustomTextarea } from '@/components/ui/custom-textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SummaryGenerator } from '@/components/editor/SummaryGenerator';
import { ExperienceGenerator } from '@/components/editor/ExperienceGenerator';
import { sampleResumes } from '@/data/sampleResumes';
import { defaultResume } from '@/data/resumeModel';
import { nanoid } from 'nanoid';
import {
  User, FileText, Briefcase, GraduationCap, Wrench,
  FolderGit2, Plus, Trash2, Award, Heart,
  Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar,
  Building2, CheckCircle2, RotateCcw, Sparkles,
} from 'lucide-react';

interface ContentStepProps {
  onNext: () => void;
  initialSection?: string;
}

export const ContentStep: React.FC<ContentStepProps> = ({ onNext, initialSection = 'personal' }) => {
  const currentResume = useResumeStore((state) => state.currentResume);
  const {
    updatePersonalInfo,
    updateSummary,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    updateSkills,
    addProject,
    updateProject,
    deleteProject,
    setCurrentResume,
    addCertification,
    updateCertification,
    deleteCertification,
    updateAdditional,
    renameResume,
  } = useResumeStore();

  const resume = React.useMemo(() => ({
    ...defaultResume,
    ...currentResume,
    personalInfo: { ...defaultResume.personalInfo, ...(currentResume?.personalInfo || {}) },
    skills: { ...defaultResume.skills, ...(currentResume?.skills || {}) },
    experience: currentResume?.experience || [],
    education: currentResume?.education || [],
    projects: currentResume?.projects || [],
    additional: { ...defaultResume.additional, ...(currentResume?.additional || {}) },
  }), [currentResume]);

  const [activeSection, setActiveSection] = useState(initialSection);
  const [showSamples, setShowSamples] = useState(false);

  React.useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  const sections = [
    { id: 'personal', label: 'Personal', icon: User, color: '#3b82f6' },
    { id: 'summary', label: 'Summary', icon: FileText, color: '#8b5cf6' },
    { id: 'experience', label: 'Experience', icon: Briefcase, color: '#10b981' },
    { id: 'education', label: 'Education', icon: GraduationCap, color: '#f59e0b' },
    { id: 'skills', label: 'Skills', icon: Wrench, color: '#ec4899' },
    { id: 'projects', label: 'Projects', icon: FolderGit2, color: '#6366f1' },
    { id: 'certifications', label: 'Certifications', icon: Award, color: '#eab308' },
    { id: 'additional', label: 'Additional', icon: Heart, color: '#ef4444' },
  ];

  const getSectionStatus = (sectionId: string) => {
    switch (sectionId) {
      case 'personal': return resume.personalInfo?.name && resume.personalInfo?.email;
      case 'summary': return !!resume.summary;
      case 'experience': return (resume.experience || []).length > 0;
      case 'education': return (resume.education || []).length > 0;
      case 'skills': return (resume.skills?.technical || []).length > 0;
      case 'projects': return (resume.projects || []).length > 0;
      case 'certifications': return (resume.additional?.certifications || []).length > 0;
      case 'additional':
        return (resume.additional?.awards || []).length > 0 ||
          (resume.additional?.volunteer || []).length > 0 ||
          (resume.additional?.hobbies || []).length > 0;
      default: return false;
    }
  };

  const loadSample = (index: number) => {
    setCurrentResume(sampleResumes[index]);
    setShowSamples(false);
  };

  const resetResume = () => {
    setCurrentResume({ ...defaultResume, id: nanoid() });
    setShowSamples(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      {/* Mobile Top Horizontal Section Bar */}
      <div className="flex md:hidden border-b bg-card px-2 py-2 items-center justify-between gap-1.5 shrink-0 z-30 relative">
        {/* Section Pills (Horizontally Scrollable) */}
        <div className="flex-1 overflow-x-auto scrollbar-none flex items-center gap-1.5 pr-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            const isComplete = getSectionStatus(section.id);
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{section.label}</span>
                {isComplete && (
                  <CheckCircle2 className={`h-3 w-3 ${isActive ? 'text-white' : 'text-green-500'}`} />
                )}
              </button>
            );
          })}
        </div>

        <div className="h-4 w-px bg-border shrink-0" />

        {/* Samples & Reset Dropdown (Outside Overflow Container) */}
        <div className="relative shrink-0">
          <CustomButton
            variant="outline"
            size="sm"
            onClick={() => setShowSamples(!showSamples)}
            className="gap-1 text-xs px-2 h-7"
          >
            <Sparkles className="h-3 w-3" />
            Samples
          </CustomButton>
          <AnimatePresence>
            {showSamples && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute right-0 top-full mt-1.5 bg-card border rounded-xl shadow-xl py-1.5 w-48 z-50"
              >
                <div className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Load Sample Resume
                </div>
                {sampleResumes.map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => loadSample(i)}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors truncate block"
                  >
                    {sample.personalInfo.name}
                  </button>
                ))}
                <Separator className="my-1" />
                <button
                  onClick={resetResume}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors text-destructive font-medium"
                >
                  <RotateCcw className="h-3 w-3 inline mr-1.5" />
                  Reset to Default
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop Section Navigation Sidebar */}
      <div className="hidden md:flex w-[210px] border-r bg-card shrink-0 flex-col overflow-hidden">
        {/* Samples / Reset */}
        <div className="p-3 border-b space-y-2">
          <div className="relative">
            <CustomButton
              variant="outline"
              size="sm"
              onClick={() => setShowSamples(!showSamples)}
              className="w-full gap-2 text-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Load Sample
            </CustomButton>
            <AnimatePresence>
              {showSamples && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 top-full mt-1 bg-card border rounded-lg shadow-lg py-1.5 w-full z-50"
                >
                  {sampleResumes.map((sample, i) => (
                    <button
                      key={i}
                      onClick={() => loadSample(i)}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors truncate block"
                    >
                      {sample.personalInfo.name}
                    </button>
                  ))}
                  <Separator className="my-1" />
                  <button
                    onClick={resetResume}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors text-muted-foreground"
                  >
                    <RotateCcw className="h-3 w-3 inline mr-1.5" />
                    Reset All
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Section list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            const isComplete = getSectionStatus(section.id);
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-all text-left relative ${isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted'
                  }`}
              >
                <div
                  className="p-1.5 rounded-md"
                  style={{
                    backgroundColor: isActive ? section.color : 'transparent',
                    color: isActive ? 'white' : 'inherit',
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="flex-1 truncate">{section.label}</span>
                {isComplete && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto lg:p-6 p-4 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* ========== PERSONAL INFO ========== */}
              {activeSection === 'personal' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="sm:text-2xl text-xl font-bold mb-2">Personal Information</h2>
                    <p className="text-sm text-muted-foreground">
                      Your basic contact details and professional links
                    </p>
                  </div>
                  <Card>
                    <CardHeader><CardTitle>Basic Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <CustomInput
                        label="Full Name"
                        value={resume.personalInfo.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          updatePersonalInfo({ name: val });
                          if (val.trim() && (currentResume.name === 'Untitled Resume' || !currentResume.name)) {
                            renameResume(currentResume.id, `${val.trim()}'s Resume`);
                          }
                        }}
                        placeholder="John Doe"
                        leftIcon={<User className="h-4 w-4" />}
                      />
                      <CustomInput
                        label="Professional Title"
                        value={resume.personalInfo.title}
                        onChange={(e) => updatePersonalInfo({ title: e.target.value })}
                        placeholder="Software Engineer"
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <CustomInput
                        label="Email"
                        type="email"
                        value={resume.personalInfo.email}
                        onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                        placeholder="john@example.com"
                        leftIcon={<Mail className="h-4 w-4" />}
                      />
                      <CustomInput
                        label="Phone"
                        value={resume.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        leftIcon={<Phone className="h-4 w-4" />}
                      />
                      <CustomInput
                        label="Location"
                        value={resume.personalInfo.location}
                        onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                        placeholder="San Francisco, CA"
                        leftIcon={<MapPin className="h-4 w-4" />}
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Professional Links</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <CustomInput
                        label="LinkedIn"
                        value={resume.personalInfo.linkedin || ''}
                        onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                        placeholder="linkedin.com/in/johndoe"
                        leftIcon={<Linkedin className="h-4 w-4" />}
                      />
                      <CustomInput
                        label="GitHub"
                        value={resume.personalInfo.github || ''}
                        onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                        placeholder="github.com/johndoe"
                        leftIcon={<Github className="h-4 w-4" />}
                      />
                      <CustomInput
                        label="Website"
                        value={resume.personalInfo.website || ''}
                        onChange={(e) => updatePersonalInfo({ website: e.target.value })}
                        placeholder="johndoe.com"
                        leftIcon={<Globe className="h-4 w-4" />}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ========== SUMMARY ========== */}
              {activeSection === 'summary' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="sm:text-2xl text-xl font-bold mb-2">Professional Summary</h2>
                    <p className="text-sm text-muted-foreground">
                      Write a compelling summary highlighting your experience
                    </p>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <SummaryGenerator
                        jobTitle={resume.personalInfo.title}
                        onSelect={(summary) => updateSummary(summary)}
                      />
                      <CustomTextarea
                        label="Summary"
                        value={resume.summary}
                        showCount
                        maxLength={500}
                        onChange={(e) => updateSummary(e.target.value)}
                        placeholder="Experienced software engineer with 5+ years..."
                        className="min-h-[200px]"
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ========== EXPERIENCE ========== */}
              {activeSection === 'experience' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="sm:text-2xl text-xl font-bold mb-2">Work Experience</h2>
                      <p className="text-sm text-muted-foreground">
                        Add your professional work history
                      </p>
                    </div>
                    <CustomButton
                      variant="outline"
                      size="sm"
                      onClick={() => addExperience({
                        company: '', position: '', startDate: '', endDate: '',
                        current: false, description: '', achievements: []
                      })}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </CustomButton>
                  </div>

                  {resume.experience.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No experience added yet</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {resume.experience.map((exp, i) => (
                        <Card key={exp.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle>Experience {i + 1}</CardTitle>
                              <button
                                onClick={() => deleteExperience(exp.id)}
                                className="text-destructive hover:bg-destructive/10 p-2 rounded-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <CustomInput
                                label="Company"
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                                leftIcon={<Building2 className="h-4 w-4" />}
                              />
                              <CustomInput
                                label="Position"
                                value={exp.position}
                                onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <CustomInput
                                label="Start Date"
                                type="month"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                                leftIcon={<Calendar className="h-4 w-4" />}
                              />
                              <CustomInput
                                label="End Date"
                                type="month"
                                value={exp.endDate}
                                disabled={exp.current}
                                onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                                leftIcon={<Calendar className="h-4 w-4" />}
                              />
                            </div>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                              <input
                                type="checkbox"
                                checked={exp.current}
                                onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                                className="rounded"
                              />
                              Currently working here
                            </label>
                            <ExperienceGenerator
                              role={exp.position}
                              onAddPoints={(points) => {
                                const newAchievements = [...exp.achievements, ...points];
                                updateExperience(exp.id, { achievements: newAchievements });
                              }}
                            />
                            <CustomTextarea
                              label="Achievements (one per line)"
                              value={exp.achievements.join('\n')}
                              onChange={(e) => updateExperience(exp.id, {
                                achievements: e.target.value.split('\n').filter(Boolean)
                              })}
                              className="min-h-[100px]"
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========== EDUCATION ========== */}
              {activeSection === 'education' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="sm:text-2xl text-xl font-bold mb-2">Education</h2>
                      <p className="text-sm text-muted-foreground">
                        Add your educational background
                      </p>
                    </div>
                    <CustomButton
                      variant="outline"
                      size="sm"
                      onClick={() => addEducation({
                        institution: '', degree: '', field: '',
                        startDate: '', endDate: '', gpa: ''
                      })}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </CustomButton>
                  </div>

                  {resume.education.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No education added yet</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {resume.education.map((edu, i) => (
                        <Card key={edu.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle>Education {i + 1}</CardTitle>
                              <button
                                onClick={() => deleteEducation(edu.id)}
                                className="text-destructive hover:bg-destructive/10 p-2 rounded-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <CustomInput
                              label="Institution"
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <CustomInput
                                label="Degree"
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                              />
                              <CustomInput
                                label="Field"
                                value={edu.field}
                                onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <CustomInput
                                label="Start"
                                type="month"
                                value={edu.startDate}
                                onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                              />
                              <CustomInput
                                label="End"
                                type="month"
                                value={edu.endDate}
                                onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                              />
                            </div>
                            <CustomInput
                              label="GPA (optional)"
                              value={edu.gpa || ''}
                              onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========== SKILLS ========== */}
              {activeSection === 'skills' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="sm:text-2xl text-xl font-bold mb-2">Skills</h2>
                    <p className="text-sm text-muted-foreground">
                      List your technical and professional skills
                    </p>
                  </div>
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader><CardTitle>Technical Skills</CardTitle></CardHeader>
                      <CardContent>
                        <CustomTextarea
                          label="Skills (comma-separated)"
                          value={resume.skills.technical.join(', ')}
                          onChange={(e) => updateSkills({
                            technical: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          })}
                          placeholder="React, TypeScript, Node.js..."
                          className="min-h-[100px]"
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader><CardTitle>Languages</CardTitle></CardHeader>
                      <CardContent>
                        <CustomTextarea
                          label="Languages (comma-separated)"
                          value={resume.skills.languages.join(', ')}
                          onChange={(e) => updateSkills({
                            languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          })}
                          placeholder="English (Native), Spanish (Fluent)..."
                          className="min-h-[100px]"
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader><CardTitle>Soft Skills</CardTitle></CardHeader>
                      <CardContent>
                        <CustomTextarea
                          label="Soft Skills (comma-separated)"
                          value={resume.skills.softSkills.join(', ')}
                          onChange={(e) => updateSkills({
                            softSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          })}
                          placeholder="Leadership, Communication..."
                          className="min-h-[100px]"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* ========== PROJECTS ========== */}
              {activeSection === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="sm:text-2xl text-xl font-bold mb-2">Projects</h2>
                      <p className="text-sm text-muted-foreground">
                        Showcase your portfolio projects
                      </p>
                    </div>
                    <CustomButton
                      variant="outline"
                      size="sm"
                      onClick={() => addProject({
                        name: '', description: '', technologies: [], url: ''
                      })}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </CustomButton>
                  </div>

                  {resume.projects.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        <FolderGit2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No projects added yet</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {resume.projects.map((proj, i) => (
                        <Card key={proj.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle>Project {i + 1}</CardTitle>
                              <button
                                onClick={() => deleteProject(proj.id)}
                                className="text-destructive hover:bg-destructive/10 p-2 rounded-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <CustomInput
                              label="Name"
                              value={proj.name}
                              onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                            />
                            <CustomTextarea
                              label="Description"
                              value={proj.description}
                              onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                              className="min-h-[100px]"
                            />
                            <CustomInput
                              label="Technologies (comma-separated)"
                              value={proj.technologies.join(', ')}
                              onChange={(e) => updateProject(proj.id, {
                                technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                              })}
                            />
                            <CustomInput
                              label="URL"
                              value={proj.url || ''}
                              onChange={(e) => updateProject(proj.id, { url: e.target.value })}
                              leftIcon={<Globe className="h-4 w-4" />}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========== CERTIFICATIONS ========== */}
              {activeSection === 'certifications' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="sm:text-2xl text-xl font-bold mb-2">Certifications</h2>
                      <p className="text-sm text-muted-foreground">
                        Add your professional certifications
                      </p>
                    </div>
                    <CustomButton
                      variant="outline"
                      size="sm"
                      onClick={() => addCertification({
                        name: '', issuer: '', date: '', url: ''
                      })}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </CustomButton>
                  </div>

                  {resume.additional.certifications.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        <Award className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No certifications added yet</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {resume.additional.certifications.map((cert, i) => (
                        <Card key={cert.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle>Certification {i + 1}</CardTitle>
                              <button
                                onClick={() => deleteCertification(cert.id)}
                                className="text-destructive hover:bg-destructive/10 p-2 rounded-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <CustomInput
                              label="Name"
                              value={cert.name}
                              onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                            />
                            <CustomInput
                              label="Issuer"
                              value={cert.issuer}
                              onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <CustomInput
                                label="Date"
                                type="month"
                                value={cert.date}
                                onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                              />
                              <CustomInput
                                label="URL (optional)"
                                value={cert.url || ''}
                                onChange={(e) => updateCertification(cert.id, { url: e.target.value })}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========== ADDITIONAL ========== */}
              {activeSection === 'additional' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="sm:text-2xl text-xl font-bold mb-2">Additional Information</h2>
                    <p className="text-sm text-muted-foreground">
                      Awards, volunteer work, and hobbies
                    </p>
                  </div>
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader><CardTitle>Awards & Honors</CardTitle></CardHeader>
                      <CardContent>
                        <CustomTextarea
                          label="Awards (one per line)"
                          value={resume.additional.awards.join('\n')}
                          onChange={(e) => updateAdditional('awards', e.target.value.split('\n').filter(Boolean))}
                          className="min-h-[100px]"
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader><CardTitle>Volunteer Work</CardTitle></CardHeader>
                      <CardContent>
                        <CustomTextarea
                          label="Volunteer Work (one per line)"
                          value={resume.additional.volunteer.join('\n')}
                          onChange={(e) => updateAdditional('volunteer', e.target.value.split('\n').filter(Boolean))}
                          className="min-h-[100px]"
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader><CardTitle>Hobbies & Interests</CardTitle></CardHeader>
                      <CardContent>
                        <CustomTextarea
                          label="Hobbies (comma-separated)"
                          value={resume.additional.hobbies.join(', ')}
                          onChange={(e) => updateAdditional('hobbies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                          className="min-h-[100px]"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Next Step button */}
          <div className="flex justify-end lg:pt-4 lg:pb-8 pb-12">
            <CustomButton variant="primary" onClick={onNext} className="gap-2">
              Next: AI Tools
              <Sparkles className="h-4 w-4" />
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};
