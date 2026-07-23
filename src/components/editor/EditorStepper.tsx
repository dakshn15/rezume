import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Palette, Download, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type EditorStep = 'content' | 'ai-tools' | 'customize' | 'finalize';

interface StepConfig {
  id: EditorStep;
  label: string;
  icon: React.ElementType;
  description: string;
}

export const EDITOR_STEPS: StepConfig[] = [
  { id: 'content', label: 'Content', icon: FileText, description: 'Fill in your details' },
  { id: 'ai-tools', label: 'AI Tools', icon: Sparkles, description: 'Optimize with AI' },
  { id: 'customize', label: 'Customize', icon: Palette, description: 'Style your resume' },
  { id: 'finalize', label: 'Finalize', icon: Download, description: 'Review & export' },
];

interface EditorStepperProps {
  activeStep: EditorStep;
  onStepChange: (step: EditorStep) => void;
  completedSteps?: Set<EditorStep>;
}

export const EditorStepper: React.FC<EditorStepperProps> = ({
  activeStep,
  onStepChange,
  completedSteps = new Set(),
}) => {
  const activeIndex = EDITOR_STEPS.findIndex((s) => s.id === activeStep);

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 shrink-0 max-w-full py-1">
      {EDITOR_STEPS.map((step, index) => {
        const Icon = step.icon;
        const isActive = step.id === activeStep;
        const isCompleted = completedSteps.has(step.id);
        const isPast = index < activeIndex;

        return (
          <React.Fragment key={step.id}>
            {/* Connector line */}
            {index > 0 && (
              <div
                className={cn(
                  'hidden sm:block h-[2px] w-2 sm:w-3 md:w-5 lg:w-8 xl:w-10 rounded-full shrink-0 transition-colors duration-300',
                  isPast || isActive ? 'bg-primary' : 'bg-border'
                )}
              />
            )}

            {/* Step button */}
            <button
              onClick={() => onStepChange(step.id)}
              title={step.label}
              className={cn(
                'relative flex items-center justify-center gap-1.5 lg:px-3 lg:py-1.5 lg:w-auto lg:h-auto h-7 w-7 rounded-xl transition-all duration-300 shrink-0 group',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {/* Step Icon */}
              <div className="flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5" />
              </div>

              {/* Label — show on lg+, or on active step for md */}
              <span
                className={cn(
                  'text-sm font-medium whitespace-nowrap hidden lg:inline'
                )}
              >
                {step.label}
              </span>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};
