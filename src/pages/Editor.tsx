import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { useSettingsStore } from '@/store/settingsStore';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { CustomButton } from '@/components/ui/custom-button';
import { CustomInput } from '@/components/ui/custom-input';
import { CustomTextarea } from '@/components/ui/custom-textarea';
import { ATSScore } from '@/components/editor/ATSScore';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { calculateCompletionPercentage } from '@/utils/helpers';
import { exportToPDF } from '@/utils/pdfExport';
import { sampleResumes } from '@/data/sampleResumes';
import { defaultResume } from '@/data/resumeModel';
import { nanoid } from 'nanoid';
import {
  ArrowLeft, Download, Save, User, FileText, Briefcase,
  GraduationCap, Wrench, FolderGit2, Plus, Trash2, Eye,
  Undo2, Redo2, Award, Heart, Palette, Type, ChevronDown,
  Check, RotateCcw, ZoomIn, ZoomOut, X, Sparkles,
  Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar,
  Building2, CheckCircle2, Circle, Menu, Settings2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { templateInfo } from '@/components/templates/TemplateRenderer';

const Editor = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    currentResume,
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
    undo,
    redo,
    canUndo,
    canRedo,
    setTemplate
  } = useResumeStore();

  const { exportSettings, templateSettings, updateTemplateSettings } = useSettingsStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // State management
  const [activeSection, setActiveSection] = useState('personal');
  const [isExporting, setIsExporting] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [zoom, setZoom] = useState(0.6);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSamples, setShowSamples] = useState(false);

  // Calculate fit-to-width zoom
  const calculateFitZoom = () => {
    if (!previewContainerRef.current) {
      // Fallback calculation
      const containerWidth = 600;
      const padding = 64; // px-4 xl:px-8 = 16px + 32px = 48px each side
      const availableWidth = containerWidth - padding;
      const resumeWidth = 794; // 210mm in pixels at 96dpi
      return Math.min(0.85, (availableWidth / resumeWidth) * 0.9);
    }
    const containerWidth = previewContainerRef.current.offsetWidth;
    const padding = 64; // Account for horizontal padding
    const availableWidth = containerWidth - padding;
    const resumeWidth = 794; // 210mm in pixels at 96dpi
    return Math.min(0.85, (availableWidth / resumeWidth) * 0.9);
  };

  const handleFitToWidth = () => {
    setZoom(calculateFitZoom());
  };

  const completion = calculateCompletionPercentage(currentResume);

  // Keyboard shortcuts
  useEffect(() => {
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

  // Auto-save indicator
  useEffect(() => {
    setIsSaved(false);
    const timer = setTimeout(() => setIsSaved(true), 1500);
    return () => clearTimeout(timer);
  }, [currentResume]);

  // Auto-fit preview on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setZoom(calculateFitZoom());
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Apply template from URL parameter
  useEffect(() => {
    const templateParam = searchParams.get('template');
    if (templateParam && ['modern', 'classic', 'minimal', 'creative'].includes(templateParam)) {
      setTemplate(templateParam);
      // Clean up URL by removing the template parameter
      navigate('/editor', { replace: true });
    }
  }, [searchParams, setTemplate, navigate]);

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      await exportToPDF(
        previewRef.current,
        `${currentResume.personalInfo.name || 'resume'}.pdf`,
        exportSettings
      );
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
    setShowSamples(false);
  };

  const resetResume = () => {
    setCurrentResume({ ...defaultResume, id: nanoid() });
    setShowSamples(false);
  };

  // Section configuration
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

  const colorPresets = [
    { name: 'Navy', primary: '#1e3a5f', accent: '#3b82f6' },
    { name: 'Green', primary: '#14532d', accent: '#22c55e' },
    { name: 'Purple', primary: '#4c1d95', accent: '#8b5cf6' },
    { name: 'Red', primary: '#7f1d1d', accent: '#ef4444' },
    { name: 'Gray', primary: '#1f2937', accent: '#6b7280' },
    { name: 'Teal', primary: '#134e4a', accent: '#14b8a6' },
  ];

  const fontOptions = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Source Serif', value: 'Source Serif 4, serif' },
    { name: 'Playfair', value: 'Playfair Display, serif' },
    { name: 'Mono', value: 'JetBrains Mono, monospace' },
  ];

  const getSectionStatus = (sectionId: string) => {
    switch (sectionId) {
      case 'personal':
        return currentResume.personalInfo.name && currentResume.personalInfo.email;
      case 'summary':
        return !!currentResume.summary;
      case 'experience':
        return currentResume.experience.length > 0;
      case 'education':
        return currentResume.education.length > 0;
      case 'skills':
        return currentResume.skills.technical.length > 0;
      case 'projects':
        return currentResume.projects.length > 0;
      case 'certifications':
        return currentResume.additional.certifications.length > 0;
      case 'additional':
        return currentResume.additional.awards.length > 0 ||
          currentResume.additional.volunteer.length > 0 ||
          currentResume.additional.hobbies.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="hidden md:block">
            <h1 className="font-bold text-lg">Resume Editor</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {isSaved ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Circle className="h-3 w-3 text-yellow-500 animate-pulse" />
                  <span>Saving...</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="hidden sm:flex items-center gap-1 border-r pr-2">
            <button
              onClick={() => canUndo() && undo()}
              disabled={!canUndo()}
              className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => canRedo() && redo()}
              disabled={!canRedo()}
              className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="h-4 w-4" />
            </button>
          </div>
          {/* Samples */}
          <div className="relative">
            <CustomButton
              variant="outline"
              size="sm"
              onClick={() => setShowSamples(!showSamples)}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Samples</span>
            </CustomButton>
            <AnimatePresence>
              {showSamples && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute start-0 top-full mt-2 bg-card border rounded-lg shadow-lg py-2 w-56 z-50"
                >
                  {sampleResumes.map((sample, i) => (
                    <button
                      key={i}
                      onClick={() => loadSample(i)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      {sample.personalInfo.name}
                    </button>
                  ))}
                  <Separator className="my-1" />
                  <button
                    onClick={resetResume}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors text-muted-foreground"
                  >
                    <RotateCcw className="h-4 w-4 inline mr-2" />
                    Reset
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Style Toggle */}
          <CustomButton
            variant={showStylePanel ? "default" : "outline"}
            size="sm"
            onClick={() => setShowStylePanel(!showStylePanel)}
          >
            <Palette className="h-4 w-4" />
          </CustomButton>

          {/* Save */}
          <CustomButton variant="outline" size="sm" onClick={handleSave}>
            {isSaved ? <Check className="h-4 w-4 text-green-500" /> : <Save className="h-4 w-4" />}
          </CustomButton>

          {/* Export */}
          <CustomButton
            variant="primary"
            size="sm"
            onClick={handleExportPDF}
            isLoading={isExporting}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </CustomButton>

          {/* Mobile Menu */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 hover:bg-muted rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Sections */}
        <aside className="hidden md:flex w-64 border-r bg-card flex-col shrink-0">
          <div className="p-4 border-b">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Sections
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{completion}% complete</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin min-h-[150px]">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              const isComplete = getSectionStatus(section.id);
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left relative ${isActive
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
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1">{section.label}</span>
                  {isComplete && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t overflow-y-auto scrollbar-thin">
            <ATSScore />
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="md:hidden fixed left-0 w-64 bg-card border-r z-40 overflow-y-auto h-[calc(100vh-64px)]"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold">Sections</h2>
                <button onClick={() => setShowMobileMenu(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-2 space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        setShowMobileMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      {section.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Editor Area */}
        <main className="flex-1 flex overflow-hidden">
          {/* Form Panel */}
          <div className="flex-1 border-r bg-background overflow-y-auto">
            <div className="max-w-3xl mx-auto lg:p-6 p-4 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Personal Information */}
                  {activeSection === 'personal' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
                        <p className="text-sm text-muted-foreground">
                          Your basic contact details and professional links
                        </p>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle>Basic Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <CustomInput
                            label="Full Name"
                            value={currentResume.personalInfo.name}
                            onChange={(e) => updatePersonalInfo({ name: e.target.value })}
                            placeholder="John Doe"
                            leftIcon={<User className="h-4 w-4" />}
                          />
                          <CustomInput
                            label="Professional Title"
                            value={currentResume.personalInfo.title}
                            onChange={(e) => updatePersonalInfo({ title: e.target.value })}
                            placeholder="Software Engineer"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <CustomInput
                            label="Email"
                            type="email"
                            value={currentResume.personalInfo.email}
                            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                            placeholder="john@example.com"
                            leftIcon={<Mail className="h-4 w-4" />}
                          />
                          <CustomInput
                            label="Phone"
                            value={currentResume.personalInfo.phone}
                            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                            placeholder="+1 (555) 123-4567"
                            leftIcon={<Phone className="h-4 w-4" />}
                          />
                          <CustomInput
                            label="Location"
                            value={currentResume.personalInfo.location}
                            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                            placeholder="San Francisco, CA"
                            leftIcon={<MapPin className="h-4 w-4" />}
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Professional Links</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <CustomInput
                            label="LinkedIn"
                            value={currentResume.personalInfo.linkedin || ''}
                            onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                            placeholder="linkedin.com/in/johndoe"
                            leftIcon={<Linkedin className="h-4 w-4" />}
                          />
                          <CustomInput
                            label="GitHub"
                            value={currentResume.personalInfo.github || ''}
                            onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                            placeholder="github.com/johndoe"
                            leftIcon={<Github className="h-4 w-4" />}
                          />
                          <CustomInput
                            label="Website"
                            value={currentResume.personalInfo.website || ''}
                            onChange={(e) => updatePersonalInfo({ website: e.target.value })}
                            placeholder="johndoe.com"
                            leftIcon={<Globe className="h-4 w-4" />}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Summary */}
                  {activeSection === 'summary' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Professional Summary</h2>
                        <p className="text-sm text-muted-foreground">
                          Write a compelling summary highlighting your experience
                        </p>
                      </div>
                      <Card>
                        <CardContent className="pt-6">
                          <CustomTextarea
                            label="Summary"
                            value={currentResume.summary}
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

                  {/* Experience */}
                  {activeSection === 'experience' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Work Experience</h2>
                          <p className="text-sm text-muted-foreground">
                            Add your professional work history
                          </p>
                        </div>
                        <CustomButton
                          variant="outline"
                          size="sm"
                          onClick={() => addExperience({
                            company: '',
                            position: '',
                            startDate: '',
                            endDate: '',
                            current: false,
                            description: '',
                            achievements: []
                          })}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </CustomButton>
                      </div>

                      {currentResume.experience.length === 0 ? (
                        <Card>
                          <CardContent className="py-12 text-center text-muted-foreground">
                            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p>No experience added yet</p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="space-y-4">
                          {currentResume.experience.map((exp, i) => (
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

                  {/* Education */}
                  {activeSection === 'education' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Education</h2>
                          <p className="text-sm text-muted-foreground">
                            Add your educational background
                          </p>
                        </div>
                        <CustomButton
                          variant="outline"
                          size="sm"
                          onClick={() => addEducation({
                            institution: '',
                            degree: '',
                            field: '',
                            startDate: '',
                            endDate: '',
                            gpa: ''
                          })}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </CustomButton>
                      </div>

                      {currentResume.education.length === 0 ? (
                        <Card>
                          <CardContent className="py-12 text-center text-muted-foreground">
                            <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p>No education added yet</p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="space-y-4">
                          {currentResume.education.map((edu, i) => (
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

                  {/* Skills */}
                  {activeSection === 'skills' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Skills</h2>
                        <p className="text-sm text-muted-foreground">
                          List your technical and professional skills
                        </p>
                      </div>
                      <div className="grid gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Technical Skills</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CustomTextarea
                              label="Skills (comma-separated)"
                              value={currentResume.skills.technical.join(', ')}
                              onChange={(e) => updateSkills({
                                technical: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                              })}
                              placeholder="React, TypeScript, Node.js..."
                              className="min-h-[100px]"
                            />
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle>Languages</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CustomTextarea
                              label="Languages (comma-separated)"
                              value={currentResume.skills.languages.join(', ')}
                              onChange={(e) => updateSkills({
                                languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                              })}
                              placeholder="English (Native), Spanish (Fluent)..."
                              className="min-h-[100px]"
                            />
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle>Soft Skills</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CustomTextarea
                              label="Soft Skills (comma-separated)"
                              value={currentResume.skills.softSkills.join(', ')}
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

                  {/* Projects */}
                  {activeSection === 'projects' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Projects</h2>
                          <p className="text-sm text-muted-foreground">
                            Showcase your portfolio projects
                          </p>
                        </div>
                        <CustomButton
                          variant="outline"
                          size="sm"
                          onClick={() => addProject({
                            name: '',
                            description: '',
                            technologies: [],
                            url: ''
                          })}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </CustomButton>
                      </div>

                      {currentResume.projects.length === 0 ? (
                        <Card>
                          <CardContent className="py-12 text-center text-muted-foreground">
                            <FolderGit2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p>No projects added yet</p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="space-y-4">
                          {currentResume.projects.map((proj, i) => (
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

                  {/* Certifications */}
                  {activeSection === 'certifications' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Certifications</h2>
                          <p className="text-sm text-muted-foreground">
                            Add your professional certifications
                          </p>
                        </div>
                        <CustomButton
                          variant="outline"
                          size="sm"
                          onClick={() => addCertification({
                            name: '',
                            issuer: '',
                            date: '',
                            url: ''
                          })}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </CustomButton>
                      </div>

                      {currentResume.additional.certifications.length === 0 ? (
                        <Card>
                          <CardContent className="py-12 text-center text-muted-foreground">
                            <Award className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p>No certifications added yet</p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="space-y-4">
                          {currentResume.additional.certifications.map((cert, i) => (
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

                  {/* Additional */}
                  {activeSection === 'additional' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Additional Information</h2>
                        <p className="text-sm text-muted-foreground">
                          Awards, volunteer work, and hobbies
                        </p>
                      </div>
                      <div className="grid gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Awards & Honors</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CustomTextarea
                              label="Awards (one per line)"
                              value={currentResume.additional.awards.join('\n')}
                              onChange={(e) => updateAdditional('awards', e.target.value.split('\n').filter(Boolean))}
                              className="min-h-[100px]"
                            />
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle>Volunteer Work</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CustomTextarea
                              label="Volunteer Work (one per line)"
                              value={currentResume.additional.volunteer.join('\n')}
                              onChange={(e) => updateAdditional('volunteer', e.target.value.split('\n').filter(Boolean))}
                              className="min-h-[100px]"
                            />
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle>Hobbies & Interests</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CustomTextarea
                              label="Hobbies (comma-separated)"
                              value={currentResume.additional.hobbies.join(', ')}
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
            </div>
          </div>

          {/* Style Panel */}
          <AnimatePresence>
            {showStylePanel && (
              <motion.aside
                initial={{ width: 0 }}
                animate={{ width: 300 }}
                exit={{ width: 0 }}
                className="border-s bg-card overflow-hidden shrink-0  h-[calc(100vh-64px)] fixed z-20 right-0"
              >
                <div className="lg:p-6 p-4 w-[300px] h-full overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg">Style Settings</h3>
                    <button
                      onClick={() => setShowStylePanel(false)}
                      className="p-1.5 hover:bg-muted rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-semibold mb-3 block">Color Theme</label>
                      <div className="flex gap-2 mb-2">
                        <button
                          onClick={() => updateTemplateSettings({
                            primaryColor: '#1e3a5f',
                            accentColor: '#3b82f6',
                            secondaryColor: '#3b82f6',
                            fontFamily: 'Inter',
                            fontSize: 'medium'
                          })}
                          className="px-3 py-1.5 rounded-lg text-sm bg-muted hover:bg-muted/80"
                        >
                          Reset to default
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {colorPresets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => updateTemplateSettings({
                              primaryColor: preset.primary,
                              accentColor: preset.accent
                            })}
                            className={`p-2 rounded-lg border-2 ${templateSettings.primaryColor === preset.primary
                              ? 'border-primary'
                              : 'border-muted'
                              }`}
                          >
                            <div className="flex gap-1 mb-1">
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: preset.primary }}
                              />
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: preset.accent }}
                              />
                            </div>
                            <span className="text-xs">{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <label className="text-sm font-semibold mb-3 block">Font Family</label>
                      <div className="space-y-2">
                        {fontOptions.map((font) => (
                          <button
                            key={font.name}
                            onClick={() => updateTemplateSettings({ fontFamily: font.value })}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${templateSettings.fontFamily === font.value
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-muted/80'
                              }`}
                            style={{ fontFamily: font.value }}
                          >
                            {font.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <label className="text-sm font-semibold mb-3 block">Font Size</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['small', 'medium', 'large'].map((size) => (
                          <button
                            key={size}
                            onClick={() => updateTemplateSettings({
                              fontSize: size as 'small' | 'medium' | 'large'
                            })}
                            className={`px-3 py-2 rounded-lg text-sm capitalize ${templateSettings.fontSize === size
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                              }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Preview Panel */}
          <div
            ref={previewContainerRef}
            className="hidden lg:flex w-[60%] border-l bg-gradient-to-b from-muted/50 to-background flex-col shrink-0"
          >
            <div className="h-14 border-b bg-card/95 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Live Preview</span>
                {/* Minimal dropdown template selector */}
                <div className="ml-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm bg-muted/60 hover:bg-muted transition border outline-none">
                        <span className="font-medium">{(templateInfo.find(t => t.id === currentResume.templateId)?.name) || 'Template'}</span>
                        <ChevronDown className="h-4 w-4 opacity-70" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={6} align="start" className="w-44">
                      {templateInfo.map((t) => (
                        <DropdownMenuItem
                          key={t.id}
                          onSelect={() => setTemplate(t.id)}
                          className={`flex items-center gap-3 px-3 py-2 ${currentResume.templateId === t.id ? 'bg-primary text-primary-foreground' : ''}`}
                        >
                          <span className="w-3 h-3 rounded-sm" style={{ background: t.color }} />
                          <span className="flex-1 text-sm">{t.name}</span>
                          {currentResume.templateId === t.id && <Check className="h-4 w-4" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  onClick={handleFitToWidth}
                  className="px-2 py-1.5 text-xs hover:bg-muted rounded-lg transition-colors font-medium"
                  title="Fit to Width"
                >
                  Fit
                </button>
                <span className="text-xs font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom(Math.min(1, zoom + 0.1))}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto scrollbar-thin bg-gradient-to-b from-muted/30 to-background">
              <div className="min-h-full py-6 px-4 xl:px-8 flex justify-center">
                <div
                  ref={previewRef}
                  className="shadow-2xl rounded-sm overflow-hidden"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top center',
                    fontFamily: templateSettings.fontFamily,
                    width: '210mm',
                    minWidth: '210mm',
                    maxWidth: '210mm',
                    background: '#ffffff',
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
        </main>
      </div>
    </div>
  );
};

export default Editor;
