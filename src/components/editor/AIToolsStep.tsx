import React from 'react';
import { motion } from 'framer-motion';
import { ATSScore } from '@/components/editor/ATSScore';
import { JobMatcher } from '@/components/dashboard/JobMatcher';
import { CoverLetterGenerator } from '@/components/dashboard/CoverLetterGenerator';
import { CustomButton } from '@/components/ui/custom-button';
import { Sparkles, Target, Wand2, Palette, ArrowLeft } from 'lucide-react';

interface AIToolsStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export const AIToolsStep: React.FC<AIToolsStepProps> = ({ onNext, onPrev }) => {
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
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="sm:text-2xl text-xl font-bold mb-2">AI-Powered Tools</h2>
              <p className="text-sm text-muted-foreground">
                Optimize your resume with intelligent analysis and content generation
              </p>
            </div>
          </div>
        </motion.div>

        {/* ATS Score — always expanded */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Target className="h-4 w-4" />
              ATS OPTIMIZATION
            </div>
            <ATSScore />
          </div>
        </motion.div>

        {/* Job Matcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Target className="h-4 w-4" />
              JOB MATCH ANALYSIS
            </div>
            <JobMatcher />
          </div>
        </motion.div>

        {/* Cover Letter Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Wand2 className="h-4 w-4" />
              COVER LETTER
            </div>
            <CoverLetterGenerator />
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-between lg:pt-4 lg:pb-8 pb-12 gap-4">
          <CustomButton variant="outline" onClick={onPrev} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back: Content
          </CustomButton>
          <CustomButton variant="primary" onClick={onNext} className="gap-2">
            Next: Customize
            <Palette className="h-4 w-4" />
          </CustomButton>
        </div>
      </div>
    </div>
  );
};
