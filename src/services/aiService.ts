import api from './api';

export const generateSummary = async (jobTitle: string, experienceYears: number, skills: string[] = []): Promise<string> => {
    try {
        const response = await api.post('/ai/summary', {
            jobTitle,
            experience: experienceYears,
            skills
        });
        return response.data.summary;
    } catch (error) {
        console.error("AI Service Error:", error);
        return "Failed to generate summary. Please try again.";
    }
};

export const improveContent = async (text: string): Promise<string> => {
    try {
        const response = await api.post('/ai/improve', { content: text });
        return response.data.improved;
    } catch (error) {
        console.error("AI Service Error:", error);
        return text; // Return original if failure
    }
};

export const generateExperiencePoints = async (role: string): Promise<string[]> => {
    try {
        const response = await api.post('/ai/points', { role });
        return response.data.points;
    } catch (error) {
        console.error("AI Service Error:", error);
        return ["Failed to generate points."];
    }
};

export const checkATSScore = async (resumeData: any): Promise<any> => {
    try {
        const response = await api.post('/ai/ats-check', { resumeData });
        return response.data;
    } catch (error) {
        console.error("AI Service Error:", error);
        return { score: 0, feedback: ["Analysis Failed"], missingKeywords: [] };
    }
};

export const analyzeJobMatch = async (resumeText: string, jobDescription: string): Promise<any> => {
    try {
        const response = await api.post('/jobs/analyze', { resumeText, jobDescription });
        return response.data;
    } catch (error) {
        console.error("Job Service Error:", error);
        return { matchScore: 0, missingKeywords: [], matchingKeywords: [], gapAnalysis: "Analysis Failed" };
    }
};
