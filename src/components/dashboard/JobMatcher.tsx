import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/custom-button';
import { CustomTextarea } from '@/components/ui/custom-textarea';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Loader2, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import { analyzeJobMatch } from '@/services/aiService';
import { useResumeStore } from '@/store/resumeStore';
import { toast } from 'sonner';

export const JobMatcher: React.FC = () => {
    const { currentResume } = useResumeStore();
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleAnalyze = async () => {
        if (!jobDescription.trim()) {
            toast.error('Please enter a job description to analyze.');
            return;
        }

        setIsAnalyzing(true);
        setResult(null);

        try {
            // Construct detailed resume text for analysis
            let resumeText = `${currentResume.personalInfo.name || ''} ${currentResume.personalInfo.title || ''}\n`;
            if (currentResume.summary) resumeText += `${currentResume.summary}\n`;
            (currentResume.experience || []).forEach((exp) => {
                resumeText += `${exp.position || ''} at ${exp.company || ''}: ${exp.description || ''} ${(exp.achievements || []).join(' ')}\n`;
            });
            (currentResume.education || []).forEach((edu) => {
                resumeText += `${edu.degree || ''} in ${edu.field || ''} at ${edu.institution || ''}\n`;
            });
            if (currentResume.skills?.technical?.length) {
                resumeText += `Skills: ${currentResume.skills.technical.join(', ')}\n`;
            }

            const analysis = await analyzeJobMatch(resumeText, jobDescription);
            setResult(analysis);
            toast.success('Job match analysis complete!');
        } catch (error) {
            console.error('Job Match Analysis Error:', error);
            toast.error('Failed to analyze job match. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'success';
        if (score >= 50) return 'warning';
        return 'error';
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-0">
                <CardTitle className="text-lg flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-primary" />
                    Job Matcher
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Paste Job Description</label>
                    <CustomTextarea
                        placeholder="Paste the job description here..."
                        className="min-h-[120px] text-xs resize-none"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                    <CustomButton
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !jobDescription.trim()}
                        className="w-full"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Analyzing Request...
                            </>
                        ) : (
                            'Analyze Match'
                        )}
                    </CustomButton>
                </div>

                {result && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex flex-col gap-4 p-4 bg-muted/30 rounded-lg border">
                            <ProgressRing className='h-16 w-16'
                                progress={result.matchScore}
                                size={64}
                                color={getScoreColor(result.matchScore)}
                            />
                            <div>
                                <h4 className="font-semibold text-lg mb-2">Match Score</h4>
                                <p className="text-xs text-muted-foreground">{result.gapAnalysis}</p>
                            </div>
                        </div>

                        {result.missingKeywords?.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium flex items-center gap-1.5 text-destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    Missing Keywords
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {result.missingKeywords.map((kw: string, i: number) => (
                                        <span key={i} className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs border border-destructive/20">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.matchingKeywords?.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium flex items-center gap-1.5 text-success">
                                    <CheckCircle className="h-4 w-4" />
                                    Top Matches
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {result.matchingKeywords.slice(0, 8).map((kw: string, i: number) => (
                                        <span key={i} className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs border border-success/20">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
