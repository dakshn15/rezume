import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useResumeStore } from '@/store/resumeStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useAuthStore } from '@/store/authStore';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { EditorStepper, EditorStep, EDITOR_STEPS } from '@/components/editor/EditorStepper';
import { ContentStep } from '@/components/editor/ContentStep';
import { AIToolsStep } from '@/components/editor/AIToolsStep';
import { CustomizeStep } from '@/components/editor/CustomizeStep';
import { FinalizeStep } from '@/components/editor/FinalizeStep';
import { CustomButton } from '@/components/ui/custom-button';
import { toast } from 'sonner';
import {
  FileText, ArrowLeft, Save, Loader2, Eye, EyeOff, X,
  ZoomIn, ZoomOut, Maximize2, Minimize2, Pencil
} from 'lucide-react';

// A4 size in pixels at 96 DPI
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export type ViewMode = 'fit-page' | 'fit-width' | 'custom';

const Editor: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Stores
  const { currentResume, setTemplate, saveResume, renameResume, isSaving, undo, redo, canUndo, canRedo } =
    useResumeStore();
  const { templateSettings } = useSettingsStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Title state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(currentResume.name || 'Untitled Resume');

  useEffect(() => {
    setTitleText(currentResume.name || 'Untitled Resume');
  }, [currentResume.name]);

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    const trimmed = titleText.trim() || 'Untitled Resume';
    setTitleText(trimmed);
    renameResume(currentResume.id, trimmed);
  };

  // Step state
  const [activeStep, setActiveStep] = useState<EditorStep>('content');
  const [completedSteps, setCompletedSteps] = useState<Set<EditorStep>>(new Set());

  // Preview & View Controls
  const previewRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.5);
  const [viewMode, setViewMode] = useState<ViewMode>('fit-page');
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Apply template from URL params on mount
  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      setTemplate(templateId);
    }
  }, [searchParams, setTemplate]);

  // Compute scale based on container bounds and selected view mode
  const computeScale = useCallback(() => {
    if (!previewContainerRef.current) return;

    const containerWidth = previewContainerRef.current.clientWidth;
    const containerHeight = previewContainerRef.current.clientHeight - 40; // Subtract preview header height
    const paddingX = 32; // 16px padding on left & right
    const paddingY = 32; // 16px padding on top & bottom

    const availWidth = Math.max(100, containerWidth - paddingX);
    const availHeight = Math.max(100, containerHeight - paddingY);

    if (viewMode === 'fit-page') {
      const scaleW = availWidth / A4_WIDTH_PX;
      const scaleH = availHeight / A4_HEIGHT_PX;
      const fitPageScale = Math.min(scaleW, scaleH);
      setPreviewScale(Math.max(0.2, Math.min(0.9, fitPageScale)));
    } else if (viewMode === 'fit-width') {
      const fitWidthScale = availWidth / A4_WIDTH_PX;
      setPreviewScale(Math.max(0.25, Math.min(1.1, fitWidthScale)));
    }
  }, [viewMode]);

  useEffect(() => {
    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, [computeScale]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
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
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [canUndo, canRedo, undo, redo]);

  // Step navigation
  const goToStep = (step: EditorStep) => {
    const currentIndex = EDITOR_STEPS.findIndex((s) => s.id === activeStep);
    const targetIndex = EDITOR_STEPS.findIndex((s) => s.id === step);
    if (targetIndex > currentIndex) {
      setCompletedSteps((prev) => new Set([...prev, activeStep]));
    }
    setActiveStep(step);
  };

  const goNext = () => {
    const currentIndex = EDITOR_STEPS.findIndex((s) => s.id === activeStep);
    if (currentIndex < EDITOR_STEPS.length - 1) {
      goToStep(EDITOR_STEPS[currentIndex + 1].id);
    }
  };

  const goPrev = () => {
    const currentIndex = EDITOR_STEPS.findIndex((s) => s.id === activeStep);
    if (currentIndex > 0) {
      goToStep(EDITOR_STEPS[currentIndex - 1].id);
    }
  };

  const [activeContentSection, setActiveContentSection] = useState<string>('personal');

  const navigateToSection = (sectionId: string) => {
    if (sectionId) {
      setActiveContentSection(sectionId);
    }
    setActiveStep('content');
  };

  const handleSave = async () => {
    if (!isAuthenticated()) {
      toast.info('Login to save your resume to the cloud.');
      return;
    }
    try {
      await saveResume(currentResume);
      toast.success('Resume saved!');
    } catch {
      toast.error('Failed to save.');
    }
  };

  const handleZoomIn = () => {
    setViewMode('custom');
    setPreviewScale((prev) => Math.min(1.2, prev + 0.05));
  };

  const handleZoomOut = () => {
    setViewMode('custom');
    setPreviewScale((prev) => Math.max(0.25, prev - 0.05));
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden select-none">
      <Helmet>
        <title>
          {currentResume.personalInfo?.name
            ? `${currentResume.personalInfo.name} — Editor | Rezumely`
            : 'Resume Editor | Rezumely'}
        </title>
      </Helmet>

      {/* ========== TOP BAR ========== */}
      <header className="py-2 border-b bg-card/95 backdrop-blur-sm flex flex-wrap items-center justify-between px-2 sm:px-4 shrink-0 z-20 gap-2 overflow-hidden">
        {/* Left */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
          <Link
            to="/templates"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm font-medium shrink-0"
            title="Choose Template"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden md:inline">Templates</span>
          </Link>
          <div className="hidden md:block h-4 w-px bg-border shrink-0" />
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-7 h-7 rounded-md bg-gradient-primary flex items-center justify-center shrink-0">
              <FileText className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            {isEditingTitle ? (
              <input
                type="text"
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') {
                    setTitleText(currentResume.name || 'Untitled Resume');
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
                className="text-xs sm:text-sm font-semibold bg-muted px-2 py-0.5 rounded border border-primary outline-none max-w-[120px] sm:max-w-[160px] md:max-w-[200px]"
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                title="Click to title/rename your resume"
                className="flex items-center gap-1 text-xs sm:text-sm font-semibold hover:bg-muted/70 rounded transition-colors group text-left min-w-0"
              >
                <span className="truncate max-w-[90px] sm:max-w-[140px] md:max-w-[180px]">
                  {currentResume.name || 'Untitled Resume'}
                </span>
                <Pencil className="h-3 w-3 text-muted-foreground opacity-50 group-hover:opacity-100 shrink-0 transition-opacity" />
              </button>
            )}
          </div>
        </div>

        {/* Center — Stepper */}
        <div className="flex justify-center min-w-0 px-1">
          <EditorStepper
            activeStep={activeStep}
            onStepChange={goToStep}
            completedSteps={completedSteps}
          />
        </div>

        {/* Right */}
        <div className="sm:flex hidden items-center gap-1.5 sm:gap-2 shrink-0">

          {isAuthenticated() && (
            <CustomButton
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-1.5 flex h-8 px-2.5 text-xs shrink-0"
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Save
            </CustomButton>
          )}
        </div>
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Panel — Step Content */}
        <div
          className={`flex-1 min-w-0 overflow-hidden ${
            showMobilePreview ? 'hidden lg:block' : 'block'
          }`}
        >
          {activeStep === 'content' && <ContentStep onNext={goNext} initialSection={activeContentSection} />}
          {activeStep === 'ai-tools' && <AIToolsStep onNext={goNext} onPrev={goPrev} />}
          {activeStep === 'customize' && <CustomizeStep onNext={goNext} onPrev={goPrev} />}
          {activeStep === 'finalize' && (
            <FinalizeStep
              onPrev={goPrev}
              onNavigateToSection={navigateToSection}
              previewRef={previewRef as React.RefObject<HTMLDivElement>}
            />
          )}
        </div>

        {/* Right Panel — Live Preview */}
        <div
          ref={previewContainerRef}
          className={`lg:flex flex-[0_0_30%] border-l bg-gradient-to-b from-muted/50 to-background flex-col shrink-0 ${
            showMobilePreview
              ? 'fixed inset-0 top-14 z-40 bg-background flex w-full'
              : 'hidden'
          }`}
        >
          {/* Live Preview Toolbar Header */}
          <div className="py-2 border-b bg-card/90 backdrop-blur-sm flex items-center justify-between px-3 shrink-0 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <Eye className="h-3.5 w-3.5 text-primary" />
              <span>Live Preview</span>
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">
                {Math.round(previewScale * 100)}%
              </span>
            </div>

            {/* View Mode & Zoom Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setViewMode('fit-page')}
                className={`flex items-center gap-2 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  viewMode === 'fit-page'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/70 hover:bg-muted text-muted-foreground'
                }`}
                title="Fit full page in view without scrolling"
              >
                <Minimize2 className="h-3 w-3 inline" />
                <span className='sm:inline hidden'>Fit Page</span>
              </button>

              <button
                onClick={() => setViewMode('fit-width')}
                className={`flex items-center gap-2 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  viewMode === 'fit-width'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/70 hover:bg-muted text-muted-foreground'
                }`}
                title="Fit document width to container"
              >
                <Maximize2 className="h-3 w-3 inline" />
                <span className='sm:inline hidden'>Fit Width</span>
              </button>

              <div className="h-3.5 w-px bg-border mx-0.5" />

              <button
                onClick={handleZoomOut}
                className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={handleZoomIn}
                className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>

              {/* Close button on mobile preview overlay */}
              {showMobilePreview && (
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="lg:hidden ml-2 p-1.5 rounded-full bg-muted text-foreground hover:bg-muted/80"
                  title="Close Preview"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Scaled Preview Render Area */}
          <div className="flex-1 overflow-auto scrollbar-thin bg-gradient-to-b from-muted/30 to-background flex justify-center p-3 sm:p-4">
            <div
              style={{
                width: `${A4_WIDTH_PX * previewScale}px`,
                height: `${A4_HEIGHT_PX * previewScale}px`,
              }}
              className="relative shrink-0 shadow-2xl rounded-sm overflow-hidden bg-white transition-all duration-200"
            >
              <div
                ref={previewRef}
                style={{
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                  fontFamily: templateSettings.fontFamily,
                  width: `${A4_WIDTH_PX}px`,
                  minWidth: `${A4_WIDTH_PX}px`,
                  maxWidth: `${A4_WIDTH_PX}px`,
                  minHeight: `${A4_HEIGHT_PX}px`,
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

        {/* Floating Mobile Preview Pill Button */}
        {!showMobilePreview && (
          <div className="lg:hidden fixed bottom-4 right-4 z-50">
            <button
              onClick={() => setShowMobilePreview(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground shadow-xl font-semibold text-xs transition-transform active:scale-95 hover:scale-105"
            >
              <Eye className="h-4 w-4" />
              Preview Resume
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Editor;
