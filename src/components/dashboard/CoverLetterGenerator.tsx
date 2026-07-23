import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/custom-button';
import { CustomTextarea } from '@/components/ui/custom-textarea';
import { Loader2, Wand2, Copy, Check } from 'lucide-react';
import api from '@/services/api';
import { useResumeStore } from '@/store/resumeStore';
import { toast } from 'sonner';

export const CoverLetterGenerator = () => {
    const { currentResume } = useResumeStore();
    const [jobDescription, setJobDescription] = useState('');
    const [generatedLetter, setGeneratedLetter] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!jobDescription.trim()) {
            toast.error("Please enter a job description");
            return;
        }

        setLoading(true);
        try {
            let resumeText = `Candidate Name: ${currentResume.personalInfo.name || 'Candidate'}\n`;
            if (currentResume.personalInfo.title) resumeText += `Professional Title: ${currentResume.personalInfo.title}\n`;
            if (currentResume.summary) resumeText += `Summary: ${currentResume.summary}\n`;
            if (currentResume.experience?.length) {
                resumeText += `Experience:\n`;
                currentResume.experience.forEach(exp => {
                    resumeText += `- ${exp.position} at ${exp.company} (${exp.startDate} to ${exp.current ? 'Present' : exp.endDate}): ${exp.description || ''} ${(exp.achievements || []).join('. ')}\n`;
                });
            }
            if (currentResume.education?.length) {
                resumeText += `Education:\n`;
                currentResume.education.forEach(edu => {
                    resumeText += `- ${edu.degree} in ${edu.field} at ${edu.institution}\n`;
                });
            }
            if (currentResume.skills?.technical?.length) {
                resumeText += `Technical Skills: ${currentResume.skills.technical.join(', ')}\n`;
            }

            const response = await api.post('/ai/cover-letter', {
                resumeText,
                resumeId: currentResume.id,
                jobDescription
            });

            setGeneratedLetter(response.data.content);
            toast.success("Cover letter generated!");
        } catch (error) {
            console.error("Cover Letter Error:", error);
            toast.error("Failed to generate cover letter");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLetter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Copied to clipboard");
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-2">
                    <Wand2 className="h-5 w-5 text-purple-500" />
                    AI Cover Letter
                </CardTitle>
                <CardDescription>
                    Generate a tailored cover letter based on your resume and a job description.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Job Description</label>
                    <CustomTextarea
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="min-h-[100px] text-xs"
                    />
                </div>

                <CustomButton
                    onClick={handleGenerate}
                    disabled={loading || !jobDescription}
                    className="w-full"
                    isLoading={loading}
                >
                    {loading ? 'Generating...' : 'Generate Cover Letter'}
                </CustomButton>

                {generatedLetter && (
                    <div className="space-y-2 pt-4 border-t animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Generated Letter</label>
                            <CustomButton
                                variant="outline"
                                size="sm"
                                onClick={handleCopy}
                                className="h-8 px-2 text-xs"
                            >
                                {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                                {copied ? 'Copied' : 'Copy'}
                            </CustomButton>
                        </div>
                        <CustomTextarea
                            value={generatedLetter}
                            onChange={(e) => setGeneratedLetter(e.target.value)}
                            className="min-h-[300px] text-sm leading-relaxed"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
