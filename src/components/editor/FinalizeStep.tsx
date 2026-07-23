import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useAuthStore } from '@/store/authStore';
import { calculateATSScore } from '@/utils/atsScore';
import { exportToPDF, ExportProgress } from '@/utils/pdfExport';
import { ProgressRing } from '@/components/ui/progress-ring';
import { CustomButton } from '@/components/ui/custom-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VersionHistory } from '@/components/editor/VersionHistory';
import { toast } from 'sonner';
import {
  Download, CheckCircle2, XCircle, ArrowLeft, Save,
  Clock, Loader2, FileText, User, Briefcase, GraduationCap,
  Wrench, FolderGit2, Award, Heart, AlertTriangle,
} from 'lucide-react';
import { defaultResume } from '@/data/resumeModel';

interface FinalizeStepProps {
  onPrev: () => void;
  onNavigateToSection: (section: string) => void;
  previewRef: React.RefObject<HTMLDivElement>;
}

export const FinalizeStep: React.FC<FinalizeStepProps> = ({
  onPrev,
  onNavigateToSection,
  previewRef,
}) => {
  const { currentResume, saveResume, isSaving } = useResumeStore();
  const { exportSettings } = useSettingsStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);

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

  const { score } = React.useMemo(
    () => calculateATSScore(resume),
    [resume]
  );

  const checklist = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: User,
      filled: !!resume.personalInfo?.name && !!resume.personalInfo?.email,
      detail: resume.personalInfo?.name || 'Not filled',
    },
    {
      id: 'summary',
      label: 'Summary',
      icon: FileText,
      filled: !!resume.summary,
      detail: resume.summary ? `${resume.summary.length} chars` : 'Not filled',
    },
    {
      id: 'experience',
      label: 'Experience',
      icon: Briefcase,
      filled: resume.experience.length > 0,
      detail: `${resume.experience.length} entries`,
    },
    {
      id: 'education',
      label: 'Education',
      icon: GraduationCap,
      filled: resume.education.length > 0,
      detail: `${resume.education.length} entries`,
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: Wrench,
      filled: (resume.skills?.technical || []).length > 0,
      detail: `${(resume.skills?.technical || []).length} skills`,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderGit2,
      filled: resume.projects.length > 0,
      detail: `${resume.projects.length} projects`,
      optional: true,
    },
    {
      id: 'certifications',
      label: 'Certifications',
      icon: Award,
      filled: (resume.additional?.certifications || []).length > 0,
      detail: `${(resume.additional?.certifications || []).length} certs`,
      optional: true,
    },
    {
      id: 'additional',
      label: 'Additional',
      icon: Heart,
      filled:
        (resume.additional?.awards || []).length > 0 ||
        (resume.additional?.volunteer || []).length > 0 ||
        (resume.additional?.hobbies || []).length > 0,
      detail: 'Awards, volunteer, hobbies',
      optional: true,
    },
  ];

  const filledCount = checklist.filter((c) => c.filled).length;
  const requiredComplete = checklist.filter((c) => !c.optional && c.filled).length;
  const requiredTotal = checklist.filter((c) => !c.optional).length;

  const getScoreColor = () => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  const handleExportPDF = async () => {
    if (!previewRef?.current) {
      toast.error('Preview not available. Please try again.');
      return;
    }

    setIsExporting(true);
    try {
      const filename = `${resume.personalInfo?.name || 'resume'}-resume.pdf`;
      await exportToPDF(previewRef.current, filename, exportSettings, setExportProgress);
      toast.success('PDF downloaded successfully!');
    } catch {
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  const handleSave = async () => {
    try {
      await saveResume(currentResume);
      toast.success('Resume saved to cloud!');
    } catch {
      toast.error('Failed to save resume.');
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto lg:p-6 p-4 py-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="sm:text-2xl text-xl font-bold mb-2">Review & Export</h2>
              <p className="text-sm text-muted-foreground">
                Check your resume completeness and download
              </p>
            </div>
          </div>
        </motion.div>

        {/* ATS Score Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center gap-6">
                <ProgressRing progress={score} size={80} color={getScoreColor()} />
                <div>
                  <h3 className="text-lg font-bold">ATS Score: {score}/100</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {score >= 80
                      ? 'Excellent! Your resume is well-optimized for ATS.'
                      : score >= 50
                        ? 'Good start. Check AI Tools for improvement tips.'
                        : 'Needs work. Add more content and keywords to improve.'}
                  </p>
                  {score < 80 && (
                    <p className="text-xs text-warning mt-2 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Go back to AI Tools for detailed recommendations
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Completion Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <CardTitle>Completion Checklist</CardTitle>
                <span className="text-sm font-medium text-muted-foreground">
                  {filledCount}/{checklist.length} sections
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                  style={{ width: `${(filledCount / checklist.length) * 100}%` }}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {checklist.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigateToSection(item.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                  >
                    {item.filled ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground/40 shrink-0" />
                    )}
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${item.filled ? '' : 'text-muted-foreground'}`}>
                          {item.label}
                        </span>
                        {item.optional && (
                          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            Optional
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{item.detail}</span>
                    </div>
                    <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      Edit →
                    </span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Export & Save */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Export progress */}
              {exportProgress && exportProgress.status !== 'complete' && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{exportProgress.message}</p>
                    <div className="w-full h-1.5 bg-muted rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${exportProgress.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <CustomButton
                variant="primary"
                className="w-full gap-2 h-12 text-base"
                onClick={handleExportPDF}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Download PDF
                  </>
                )}
              </CustomButton>

              {requiredComplete < requiredTotal && (
                <p className="text-xs text-center text-muted-foreground">
                  ⚠️ Some required sections are incomplete. Your PDF will still download.
                </p>
              )}

              {isAuthenticated() && (
                <div className="flex gap-3 pt-2">
                  <CustomButton
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save to Cloud
                  </CustomButton>
                  <CustomButton
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => setShowVersionHistory(true)}
                  >
                    <Clock className="h-4 w-4" />
                    Version History
                  </CustomButton>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-start lg:pt-4 lg:pb-8 pb-12">
          <CustomButton variant="outline" onClick={onPrev} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back: Customize
          </CustomButton>
        </div>
      </div>

      {/* Version History panel */}
      {showVersionHistory && (
        <VersionHistory onClose={() => setShowVersionHistory(false)} />
      )}
    </div>
  );
};
