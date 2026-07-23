import React, { useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
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
    const [error, setError] = useState<string>('');

    const handleGenerate = async () => {
        const titleToUse = jobTitle || currentResume.personalInfo.title;
        if (!titleToUse) {
            setError('Please enter a Job Title in Personal Info first.');
            return;
        }

        setIsGenerating(true);
        setError('');

        try {
            const skills = currentResume.skills?.technical || [];
            // Generate 3 variations
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

    return (
        <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    AI Writer
                </h3>
                <CustomButton
                    variant="outline"
                    size="sm"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Generating...
                        </>
                    ) : (
                        <>
                            {generatedOptions.length > 0 ? <RefreshCw className="h-4 w-4 mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                            {generatedOptions.length > 0 ? 'Regenerate' : 'Generate with AI'}
                        </>
                    )}
                </CustomButton>
            </div>

            {error && (
                <p className="text-xs text-destructive">{error}</p>
            )}

            <AnimatePresence>
                {generatedOptions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid gap-3"
                    >
                        {generatedOptions.map((option, i) => (
                            <Card key={i} className="cursor-pointer hover:border-purple-300 hover:shadow-md transition-all group" onClick={() => onSelect(option)}>
                                <CardContent className="p-3">
                                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                        {option}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
