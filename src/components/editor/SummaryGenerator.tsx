import React, { useState } from 'react';
import { Sparkles, Loader2, RefreshCw, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { generateSummary } from '@/services/aiService';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';

interface SummaryGeneratorProps {
    jobTitle: string;
    onSelect: (summary: string) => void;
}

export const SummaryGenerator: React.FC<SummaryGeneratorProps> = ({ jobTitle, onSelect }) => {
    const { currentResume } = useResumeStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedOptions, setGeneratedOptions] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [error, setError] = useState<string>('');

    const handleGenerate = async () => {
        const titleToUse = jobTitle || currentResume.personalInfo.title;
        if (!titleToUse) {
            setError('Please enter a Job Title in Personal Info first.');
            return;
        }

        setIsGenerating(true);
        setError('');
        setSelectedIndex(null);
        setIsCollapsed(false);

        try {
            const skills = currentResume.skills?.technical || [];
            const p1 = generateSummary(titleToUse, 5, skills);
            const p2 = generateSummary(titleToUse, 3, skills);
            const p3 = generateSummary(titleToUse, 8, skills);

            const results = await Promise.all([p1, p2, p3]);
            setGeneratedOptions(results);
        } catch (err) {
            setError('Failed to generate summary. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSelectOption = (option: string, index: number) => {
        onSelect(option);
        setSelectedIndex(index);
        // Automatically collapse options after selection to keep editor clean
        setIsCollapsed(true);
    };

    return (
        <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    AI Writer
                </h3>
                <div className="flex items-center gap-2">
                    {generatedOptions.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-purple-50 transition-colors"
                        >
                            {isCollapsed ? (
                                <>
                                    <span>Show Options ({generatedOptions.length})</span>
                                    <ChevronDown className="h-3.5 w-3.5" />
                                </>
                            ) : (
                                <>
                                    <span>Hide Options</span>
                                    <ChevronUp className="h-3.5 w-3.5" />
                                </>
                            )}
                        </button>
                    )}
                    <CustomButton
                        variant="outline"
                        size="sm"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                {generatedOptions.length > 0 ? <RefreshCw className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                                {generatedOptions.length > 0 ? 'Regenerate' : 'Generate with AI'}
                            </>
                        )}
                    </CustomButton>
                </div>
            </div>

            {error && (
                <p className="text-xs text-destructive">{error}</p>
            )}

            {/* Collapsed view summary badge */}
            {generatedOptions.length > 0 && isCollapsed && selectedIndex !== null && (
                <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between bg-purple-50/80 border border-purple-200 rounded-lg p-2.5 text-xs text-purple-900"
                >
                    <div className="flex items-center gap-2 truncate">
                        <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                        <span className="font-medium shrink-0">Applied Option #{selectedIndex + 1}</span>
                        <span className="text-purple-600 truncate border-l border-purple-200 pl-2">
                            "{generatedOptions[selectedIndex]}"
                        </span>
                    </div>
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="text-purple-700 hover:text-purple-900 font-semibold underline text-xs shrink-0 ml-2"
                    >
                        Change
                    </button>
                </motion.div>
            )}

            {/* Expanded options view */}
            <AnimatePresence>
                {generatedOptions.length > 0 && !isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid gap-3"
                    >
                        {generatedOptions.map((option, i) => {
                            const isSelected = selectedIndex === i;
                            return (
                                <Card
                                    key={i}
                                    className={`cursor-pointer transition-all group ${
                                        isSelected
                                            ? 'border-purple-500 bg-purple-50/60 shadow-sm ring-1 ring-purple-400'
                                            : 'hover:border-purple-300 hover:shadow-md'
                                    }`}
                                    onClick={() => handleSelectOption(option, i)}
                                >
                                    <CardContent className="p-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`text-sm ${isSelected ? 'text-purple-950 font-medium' : 'text-muted-foreground group-hover:text-foreground'} transition-colors`}>
                                                {option}
                                            </p>
                                            {isSelected && (
                                                <span className="flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full shrink-0">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />
                                                    Selected
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
