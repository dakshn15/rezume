import React from 'react';
import { Link } from 'react-router-dom';
import { useResumeStore } from '@/store/resumeStore';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { CustomButton } from '@/components/ui/custom-button';
import { CustomInput } from '@/components/ui/custom-input';
import { CustomTextarea } from '@/components/ui/custom-textarea';
import { ATSScore } from '@/components/editor/ATSScore';
import { ProgressRing } from '@/components/ui/progress-ring';
import { calculateCompletionPercentage } from '@/utils/helpers';
import { exportToPDF } from '@/utils/pdfExport';
import { useSettingsStore } from '@/store/settingsStore';
import { sampleResumes } from '@/data/sampleResumes';
import { defaultResume } from '@/data/resumeModel';
import { motion, AnimatePresence } from 'framer-motion';
import { nanoid } from 'nanoid';
import { 
  ArrowLeft, Download, Save, User, FileText, Briefcase, 
  GraduationCap, Wrench, FolderGit2, Plus, Trash2, Eye,
  Undo2, Redo2, Award, Heart, Palette, Type, ChevronDown,
  Check, RotateCcw, ZoomIn, ZoomOut, ExternalLink
} from 'lucide-react';

const Editor = () => {
  const { 
    currentResume, updatePersonalInfo, updateSummary, addExperience, updateExperience, 
    deleteExperience, addEducation, updateEducation, deleteEducation, updateSkills, 
    addProject, updateProject, deleteProject, setCurrentResume, addCertification,
    updateCertification, deleteCertification, updateAdditional, undo, redo, canUndo, canRedo
  } = useResumeStore();
  const { exportSettings, templateSettings, updateTemplateSettings } = useSettingsStore();
  const [activeSection, setActiveSection] = React.useState('personal');
  const [isExporting, setIsExporting] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(true);
  const [showStylePanel, setShowStylePanel] = React.useState(false);
  const [zoom, setZoom] = React.useState(0.65);
  const previewRef = React.useRef<HTMLDivElement>(null);
  
  const completion = calculateCompletionPercentage(currentResume);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (canRedo()) redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  // Track changes
  React.useEffect(() => {
    setIsSaved(false);
    const timer = setTimeout(() => setIsSaved(true), 1500);
    return () => clearTimeout(timer);
  }, [currentResume]);

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      await exportToPDF(previewRef.current, `${currentResume.personalInfo.name || 'resume'}.pdf`, exportSettings);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = () => {
    setIsSaved(true);
  };

  const loadSample = (index: number) => {
    setCurrentResume(sampleResumes[index]);
  };

  const resetResume = () => {
    setCurrentResume({ ...defaultResume, id: nanoid() });
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'additional', label: 'Additional', icon: Heart },
  ];

  const colorPresets = [
    { name: 'Navy Blue', primary: '#1e3a5f', accent: '#3b82f6' },
    { name: 'Forest Green', primary: '#14532d', accent: '#22c55e' },
    { name: 'Royal Purple', primary: '#4c1d95', accent: '#8b5cf6' },
    { name: 'Burgundy', primary: '#7f1d1d', accent: '#ef4444' },
    { name: 'Charcoal', primary: '#1f2937', accent: '#6b7280' },
    { name: 'Ocean Teal', primary: '#134e4a', accent: '#14b8a6' },
  ];

  const fontOptions = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Source Serif', value: 'Source Serif 4, serif' },
    { name: 'Playfair Display', value: 'Playfair Display, serif' },
    { name: 'JetBrains Mono', value: 'JetBrains Mono, monospace' },
  ];

  const makeLink = (url: string) => {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.includes('@')) return `mailto:${url}`;
    return `https://${url}`;
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-semibold text-lg">Resume Editor</h1>
            <p className="text-xs text-muted-foreground">
              {isSaved ? 'All changes saved' : 'Saving...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1 border-r pr-3">
            <CustomButton 
              variant="ghost" 
              size="sm" 
              onClick={() => canUndo() && undo()}
              disabled={!canUndo()}
              className="h-9 w-9 p-0"
            >
              <Undo2 className="h-4 w-4" />
            </CustomButton>
            <CustomButton 
              variant="ghost" 
              size="sm" 
              onClick={() => canRedo() && redo()}
              disabled={!canRedo()}
              className="h-9 w-9 p-0"
            >
              <Redo2 className="h-4 w-4" />
            </CustomButton>
          </div>
          
          {/* Progress */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground border-r pr-3">
            <ProgressRing progress={completion} size={32} strokeWidth={3} />
            <span className="hidden sm:inline">{completion}%</span>
          </div>

          {/* Sample & Reset */}
          <div className="relative group">
            <CustomButton variant="outline" size="sm" className="gap-2">
              Load Sample <ChevronDown className="h-3 w-3" />
            </CustomButton>
            <div className="absolute right-0 top-full mt-1 bg-card border rounded-lg shadow-lg py-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {sampleResumes.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => loadSample(i)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  {sample.personalInfo.name}
                </button>
              ))}
              <div className="border-t my-1" />
              <button
                onClick={resetResume}
                className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 text-muted-foreground"
              >
                <RotateCcw className="h-4 w-4" /> Start Fresh
              </button>
            </div>
          </div>

          {/* Style Panel Toggle */}
          <CustomButton 
            variant={showStylePanel ? "default" : "outline"} 
            size="sm" 
            onClick={() => setShowStylePanel(!showStylePanel)}
          >
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Style</span>
          </CustomButton>
          
          {/* Save Button */}
          <CustomButton 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            className="gap-2"
          >
            {isSaved ? <Check className="h-4 w-4 text-green-500" /> : <Save className="h-4 w-4" />}
            <span className="hidden sm:inline">Save</span>
          </CustomButton>
          
          {/* Export */}
          <CustomButton variant="hero" size="sm" onClick={handleExportPDF} isLoading={isExporting}>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Export PDF</span>
          </CustomButton>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Sections */}
        <div className="w-52 border-r bg-card p-3 flex flex-col gap-1 shrink-0 overflow-y-auto">
          <p className="text-xs text-muted-foreground mb-2 px-3 font-medium uppercase tracking-wider">Sections</p>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                activeSection === section.id 
                  ? 'bg-accent text-accent-foreground font-medium' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <section.icon className="h-4 w-4" />
              {section.label}
            </button>
          ))}
          
          <div className="mt-auto pt-4 border-t">
            <ATSScore />
          </div>
        </div>

        {/* Editor Panel */}
        <div className="w-[420px] border-r bg-card overflow-y-auto shrink-0">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeSection} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {activeSection === 'personal' && (
                  <div className="space-y-4">
                    <h2 className="font-semibold text-xl mb-6">Personal Information</h2>
                    <CustomInput label="Full Name" value={currentResume.personalInfo.name} 
                      onChange={(e) => updatePersonalInfo({ name: e.target.value })} placeholder="John Doe" />
                    <CustomInput label="Professional Title" value={currentResume.personalInfo.title}
                      onChange={(e) => updatePersonalInfo({ title: e.target.value })} placeholder="Software Engineer" />
                    <CustomInput label="Email" type="email" value={currentResume.personalInfo.email}
                      onChange={(e) => updatePersonalInfo({ email: e.target.value })} placeholder="john@example.com" />
                    <CustomInput label="Phone" value={currentResume.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo({ phone: e.target.value })} placeholder="+1 (555) 123-4567" />
                    <CustomInput label="Location" value={currentResume.personalInfo.location}
                      onChange={(e) => updatePersonalInfo({ location: e.target.value })} placeholder="San Francisco, CA" />
                    <CustomInput label="LinkedIn URL" value={currentResume.personalInfo.linkedin || ''}
                      onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })} placeholder="linkedin.com/in/johndoe" />
                    <CustomInput label="GitHub URL" value={currentResume.personalInfo.github || ''}
                      onChange={(e) => updatePersonalInfo({ github: e.target.value })} placeholder="github.com/johndoe" />
                    <CustomInput label="Portfolio/Website" value={currentResume.personalInfo.website || ''}
                      onChange={(e) => updatePersonalInfo({ website: e.target.value })} placeholder="johndoe.com" />
                  </div>
                )}

                {activeSection === 'summary' && (
                  <div className="space-y-4">
                    <h2 className="font-semibold text-xl mb-6">Professional Summary</h2>
                    <CustomTextarea label="Summary" value={currentResume.summary} showCount maxLength={500}
                      onChange={(e) => updateSummary(e.target.value)} 
                      placeholder="Write 2-3 sentences about your experience and career goals..."
                      className="min-h-[200px]" />
                    <p className="text-xs text-muted-foreground">
                      Tip: Highlight your years of experience, key skills, and career objective.
                    </p>
                  </div>
                )}

                {activeSection === 'experience' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-xl">Experience</h2>
                      <CustomButton variant="outline" size="sm" onClick={() => addExperience({
                        company: '', position: '', startDate: '', endDate: '', current: false, description: '', achievements: []
                      })}>
                        <Plus className="h-4 w-4" /> Add
                      </CustomButton>
                    </div>
                    {currentResume.experience.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No experience added yet</p>
                        <p className="text-sm">Click "Add" to add your work experience</p>
                      </div>
                    )}
                    {currentResume.experience.map((exp, i) => (
                      <div key={exp.id} className="p-4 border rounded-xl space-y-3 bg-muted/30">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Position {i + 1}</span>
                          <button onClick={() => deleteExperience(exp.id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <CustomInput label="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} />
                        <CustomInput label="Position" value={exp.position} onChange={(e) => updateExperience(exp.id, { position: e.target.value })} />
                        <div className="grid grid-cols-2 gap-3">
                          <CustomInput label="Start Date" type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })} />
                          <CustomInput label="End Date" type="month" value={exp.endDate} disabled={exp.current} onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })} />
                        </div>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, { current: e.target.checked })} className="rounded" />
                          Currently working here
                        </label>
                        <CustomTextarea label="Achievements (one per line)" value={exp.achievements.join('\n')} 
                          onChange={(e) => updateExperience(exp.id, { achievements: e.target.value.split('\n').filter(Boolean) })}
                          placeholder="• Led a team of 5 engineers..."
                          className="min-h-[100px]" />
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === 'education' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-xl">Education</h2>
                      <CustomButton variant="outline" size="sm" onClick={() => addEducation({
                        institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: ''
                      })}>
                        <Plus className="h-4 w-4" /> Add
                      </CustomButton>
                    </div>
                    {currentResume.education.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No education added yet</p>
                      </div>
                    )}
                    {currentResume.education.map((edu, i) => (
                      <div key={edu.id} className="p-4 border rounded-xl space-y-3 bg-muted/30">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Education {i + 1}</span>
                          <button onClick={() => deleteEducation(edu.id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <CustomInput label="Institution" value={edu.institution} onChange={(e) => updateEducation(edu.id, { institution: e.target.value })} />
                        <CustomInput label="Degree" value={edu.degree} onChange={(e) => updateEducation(edu.id, { degree: e.target.value })} />
                        <CustomInput label="Field of Study" value={edu.field} onChange={(e) => updateEducation(edu.id, { field: e.target.value })} />
                        <div className="grid grid-cols-2 gap-3">
                          <CustomInput label="Start" type="month" value={edu.startDate} onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })} />
                          <CustomInput label="End" type="month" value={edu.endDate} onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })} />
                        </div>
                        <CustomInput label="GPA (optional)" value={edu.gpa || ''} onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })} />
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === 'skills' && (
                  <div className="space-y-4">
                    <h2 className="font-semibold text-xl mb-6">Skills</h2>
                    <CustomTextarea label="Technical Skills (comma-separated)" value={currentResume.skills.technical.join(', ')}
                      onChange={(e) => updateSkills({ technical: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} 
                      placeholder="React, TypeScript, Node.js, Python..." />
                    <CustomTextarea label="Languages" value={currentResume.skills.languages.join(', ')}
                      onChange={(e) => updateSkills({ languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} 
                      placeholder="English (Native), Spanish (Fluent)..." />
                    <CustomTextarea label="Soft Skills" value={currentResume.skills.softSkills.join(', ')}
                      onChange={(e) => updateSkills({ softSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} 
                      placeholder="Leadership, Communication, Problem Solving..." />
                  </div>
                )}

                {activeSection === 'projects' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-xl">Projects</h2>
                      <CustomButton variant="outline" size="sm" onClick={() => addProject({
                        name: '', description: '', technologies: [], url: ''
                      })}>
                        <Plus className="h-4 w-4" /> Add
                      </CustomButton>
                    </div>
                    {currentResume.projects.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <FolderGit2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No projects added yet</p>
                      </div>
                    )}
                    {currentResume.projects.map((proj, i) => (
                      <div key={proj.id} className="p-4 border rounded-xl space-y-3 bg-muted/30">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Project {i + 1}</span>
                          <button onClick={() => deleteProject(proj.id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <CustomInput label="Name" value={proj.name} onChange={(e) => updateProject(proj.id, { name: e.target.value })} />
                        <CustomTextarea label="Description" value={proj.description} onChange={(e) => updateProject(proj.id, { description: e.target.value })} />
                        <CustomInput label="Technologies (comma-separated)" value={proj.technologies.join(', ')}
                          onChange={(e) => updateProject(proj.id, { technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                        <CustomInput label="URL" value={proj.url || ''} onChange={(e) => updateProject(proj.id, { url: e.target.value })} />
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === 'certifications' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-xl">Certifications</h2>
                      <CustomButton variant="outline" size="sm" onClick={() => addCertification({
                        name: '', issuer: '', date: '', url: ''
                      })}>
                        <Plus className="h-4 w-4" /> Add
                      </CustomButton>
                    </div>
                    {currentResume.additional.certifications.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Award className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No certifications added yet</p>
                      </div>
                    )}
                    {currentResume.additional.certifications.map((cert, i) => (
                      <div key={cert.id} className="p-4 border rounded-xl space-y-3 bg-muted/30">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Certification {i + 1}</span>
                          <button onClick={() => deleteCertification(cert.id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <CustomInput label="Name" value={cert.name} onChange={(e) => updateCertification(cert.id, { name: e.target.value })} />
                        <CustomInput label="Issuer" value={cert.issuer} onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })} />
                        <CustomInput label="Date" type="month" value={cert.date} onChange={(e) => updateCertification(cert.id, { date: e.target.value })} />
                        <CustomInput label="URL (optional)" value={cert.url || ''} onChange={(e) => updateCertification(cert.id, { url: e.target.value })} />
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === 'additional' && (
                  <div className="space-y-4">
                    <h2 className="font-semibold text-xl mb-6">Additional Information</h2>
                    <CustomTextarea 
                      label="Awards & Honors (one per line)" 
                      value={currentResume.additional.awards.join('\n')}
                      onChange={(e) => updateAdditional('awards', e.target.value.split('\n').filter(Boolean))} 
                      placeholder="Dean's List 2020&#10;Employee of the Month" 
                    />
                    <CustomTextarea 
                      label="Volunteer Work (one per line)" 
                      value={currentResume.additional.volunteer.join('\n')}
                      onChange={(e) => updateAdditional('volunteer', e.target.value.split('\n').filter(Boolean))} 
                      placeholder="Local Food Bank - Weekly volunteer" 
                    />
                    <CustomTextarea 
                      label="Hobbies & Interests (comma-separated)" 
                      value={currentResume.additional.hobbies.join(', ')}
                      onChange={(e) => updateAdditional('hobbies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} 
                      placeholder="Photography, Hiking, Chess" 
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Style Panel */}
        <AnimatePresence>
          {showStylePanel && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r bg-card overflow-hidden shrink-0"
            >
              <div className="p-4 w-[280px]">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Palette className="h-4 w-4" /> Style Settings
                </h3>
                
                {/* Color Presets */}
                <div className="mb-6">
                  <label className="text-sm text-muted-foreground mb-2 block">Color Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => updateTemplateSettings({ primaryColor: preset.primary, accentColor: preset.accent })}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          templateSettings.primaryColor === preset.primary 
                            ? 'border-accent' 
                            : 'border-transparent hover:border-muted'
                        }`}
                      >
                        <div className="flex gap-1 mb-1">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.primary }} />
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.accent }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                <div className="mb-6 space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Primary Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={templateSettings.primaryColor}
                        onChange={(e) => updateTemplateSettings({ primaryColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input 
                        type="text"
                        value={templateSettings.primaryColor}
                        onChange={(e) => updateTemplateSettings({ primaryColor: e.target.value })}
                        className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Accent Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={templateSettings.accentColor}
                        onChange={(e) => updateTemplateSettings({ accentColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input 
                        type="text"
                        value={templateSettings.accentColor}
                        onChange={(e) => updateTemplateSettings({ accentColor: e.target.value })}
                        className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background"
                      />
                    </div>
                  </div>
                </div>

                {/* Font Selection */}
                <div className="mb-6">
                  <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                    <Type className="h-4 w-4" /> Font Family
                  </label>
                  <div className="space-y-1">
                    {fontOptions.map((font) => (
                      <button
                        key={font.name}
                        onClick={() => updateTemplateSettings({ fontFamily: font.value })}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          templateSettings.fontFamily === font.value
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-muted'
                        }`}
                        style={{ fontFamily: font.value }}
                      >
                        {font.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Font Size</label>
                  <div className="flex gap-2">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => updateTemplateSettings({ fontSize: size as 'small' | 'medium' | 'large' })}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                          templateSettings.fontSize === size
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Panel */}
        <div className="flex-1 bg-muted/30 overflow-hidden flex flex-col">
          {/* Preview Toolbar */}
          <div className="h-12 border-b bg-card flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <CustomButton variant="ghost" size="sm" onClick={() => setZoom(Math.max(0.4, zoom - 0.1))} className="h-8 w-8 p-0">
                <ZoomOut className="h-4 w-4" />
              </CustomButton>
              <span className="text-sm text-muted-foreground w-12 text-center">{Math.round(zoom * 100)}%</span>
              <CustomButton variant="ghost" size="sm" onClick={() => setZoom(Math.min(1, zoom + 0.1))} className="h-8 w-8 p-0">
                <ZoomIn className="h-4 w-4" />
              </CustomButton>
            </div>
          </div>
          
          {/* Preview Content */}
          <div className="flex-1 overflow-auto p-8">
            <div className="flex justify-center">
              <div 
                ref={previewRef} 
                style={{ 
                  transform: `scale(${zoom})`, 
                  transformOrigin: 'top center',
                  fontFamily: templateSettings.fontFamily 
                }}
              >
                <TemplateRenderer 
                  resume={currentResume} 
                  templateId={currentResume.templateId}
                  settings={templateSettings}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
