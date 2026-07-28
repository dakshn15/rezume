import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const DEFAULT_MODEL = 'gemini-2.0-flash';

// Simple in-memory response cache to eliminate duplicate API calls (1 hour TTL)
const aiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const getCached = (key: string): any | null => {
    const entry = aiCache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
        aiCache.delete(key);
        return null;
    }
    return entry.data;
};

const setCache = (key: string, data: any) => {
    // Limit cache size to prevent memory leaks
    if (aiCache.size > 500) {
        const oldestKey = aiCache.keys().next().value;
        if (oldestKey) aiCache.delete(oldestKey);
    }
    aiCache.set(key, { data, timestamp: Date.now() });
};

/**
 * Helper: retry a function on 429 rate-limit errors with fast exponential backoff.
 */
const withRetry = async <T>(fn: () => Promise<T>, maxRetries = 2, baseDelay = 800): Promise<T> => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            const status = error?.status || error?.code || error?.response?.status;
            const isRateLimit = status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');

            if (isRateLimit && attempt < maxRetries) {
                const delay = baseDelay * Math.pow(1.5, attempt);
                console.log(`Rate limited. Retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${maxRetries})`);
                await new Promise(r => setTimeout(r, delay));
                continue;
            }
            throw error;
        }
    }
    throw new Error('Max retries exceeded');
};

/**
 * Helper: send a prompt to Gemini with fast token limits and return the text response.
 */
const askGemini = async (prompt: string, systemInstruction?: string, maxTokens = 300): Promise<string> => {
    const cacheKey = `text:${systemInstruction || ''}:${prompt}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const result = await withRetry(async () => {
        const modelWithSystem = genAI.getGenerativeModel({
            model: DEFAULT_MODEL,
            systemInstruction,
            generationConfig: {
                maxOutputTokens: maxTokens,
                temperature: 0.7,
            },
        });

        const res = await modelWithSystem.generateContent(prompt);
        return res.response.text();
    });

    setCache(cacheKey, result);
    return result;
};

/**
 * Helper: send a prompt to Gemini and parse fast JSON response with token limits.
 */
const askGeminiJSON = async (prompt: string, systemInstruction?: string, maxTokens = 400): Promise<any> => {
    const cacheKey = `json:${systemInstruction || ''}:${prompt}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const result = await withRetry(async () => {
        const modelWithSystem = genAI.getGenerativeModel({
            model: DEFAULT_MODEL,
            systemInstruction: systemInstruction || 'You are a helpful assistant. Output valid JSON only.',
            generationConfig: {
                responseMimeType: 'application/json',
                maxOutputTokens: maxTokens,
                temperature: 0.6,
            },
        });

        const res = await modelWithSystem.generateContent(prompt);
        let text = res.response.text();

        // Strip markdown code block wrappers if present
        if (text.startsWith('```')) {
            const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (match && match[1]) {
                text = match[1];
            }
        }

        return JSON.parse(text);
    });

    setCache(cacheKey, result);
    return result;
};

// ─── AI Service Functions ────────────────────────────────────────────

let summaryCallCounter = 0;
export const generateSummary = async (jobTitle: string, experience: number, skills: string[]): Promise<string> => {
    try {
        const prompt = `Generate a 3-sentence high-impact ATS summary for a ${jobTitle} with ${experience} yrs exp. Key skills: ${skills.join(', ')}.`;
        return await askGemini(prompt, 'You are an expert resume summary writer.', 250);
    } catch (error) {
        console.error('Gemini API Error (Summary) - using template fallback:', error);
        const skillText = skills.length > 0 ? `, specializing in ${skills.slice(0, 3).join(', ')}` : '';
        const templates = [
            `${jobTitle} with ${experience}+ years of experience building scalable, high-performance solutions${skillText}. Proven track record of architecting clean, maintainable systems that reduce downtime and accelerate release velocity. Thrives in collaborative, fast-moving environments.`,
            `${jobTitle} bringing ${experience}+ years of industry experience${skillText}. Experienced across the full product lifecycle in agile engineering teams, delivering features ahead of schedule while driving code quality and robust testing standards.`,
            `${jobTitle} with a ${experience}+-year track record of shipping production-grade applications${skillText}. Combines strong technical depth with product intuition to deliver reliable, user-centered solutions.`,
        ];
        return templates[summaryCallCounter++ % templates.length];
    }
};

export const improveExperience = async (content: string): Promise<string> => {
    try {
        const prompt = `Rewrite this resume bullet point to be concise, impactful, action-oriented with metrics where possible: "${content}". Return ONLY the improved bullet point string.`;
        return await askGemini(prompt, 'You are an expert resume editor. Return improved text only.', 120);
    } catch (error) {
        console.error('Gemini API Error (Experience) - returning original:', error);
        return content;
    }
};

export const generateExperiencePoints = async (role: string): Promise<string[]> => {
    try {
        const prompt = `Generate 4 concise action-oriented resume bullet points for a ${role} with metrics. Return JSON array of 4 strings.`;
        const parsed = await askGeminiJSON(prompt, 'Output a JSON array of 4 strings.', 300);

        if (Array.isArray(parsed)) return parsed;
        if (parsed.points && Array.isArray(parsed.points)) return parsed.points;
        return ['Failed to generate points.'];
    } catch (error) {
        console.error('Gemini API Error (Generate Points) - using template fallback:', error);
        const roleLower = role.toLowerCase();
        if (roleLower.includes('develop') || roleLower.includes('engineer') || roleLower.includes('software')) {
            return [
                `Designed and implemented scalable backend/frontend solutions, improving system throughput by 35%`,
                `Collaborated with cross-functional teams to deliver 10+ core features, reducing time-to-market by 25%`,
                `Led code review initiatives and established linting standards, reducing production bugs by 30%`,
                `Mentored junior engineers and conducted technical workshops, boosting team productivity by 20%`
            ];
        } else {
            return [
                `Delivered high-impact results in the ${role} role, consistently exceeding performance targets by 20%`,
                `Streamlined key workflows, achieving a 30% improvement in operational efficiency`,
                `Collaborated with key stakeholders to drive strategic initiatives and achieve business objectives`,
                `Received recognition for outstanding contributions and top quarterly performance`
            ];
        }
    }
};

export const calculateATSScore = async (resumeText: string): Promise<any> => {
    try {
        const prompt = `Analyze this resume for ATS compatibility. Score out of 100, brief feedback items, missing keywords. JSON format: {"score": number, "feedback": ["string"], "missingKeywords": ["string"]}. Resume: "${resumeText.substring(0, 5000)}"`;
        return await askGeminiJSON(prompt, 'You are an ATS parser. Return valid JSON only.', 400);
    } catch (error) {
        console.error('Gemini API Error (ATS Score):', error);
        return { score: 75, feedback: ['Ensure section headings are standard.', 'Include quantifiable metrics.'], missingKeywords: ['Project Management', 'Agile'] };
    }
};

export const analyzeJobMatch = async (resumeText: string, jobDescription: string): Promise<any> => {
    try {
        const prompt = `Compare Resume against Job Description. JSON structure: {"matchScore": number, "missingKeywords": ["string"], "matchingKeywords": ["string"], "gapAnalysis": "string"}. Resume: "${resumeText.substring(0, 4000)}" JD: "${jobDescription.substring(0, 4000)}"`;
        return await askGeminiJSON(prompt, 'You are an ATS matcher. Return JSON only.', 500);
    } catch (error) {
        console.error('Gemini API Error (Job Match) - using keyword fallback:', error);
        const resumeWords = resumeText.toLowerCase().split(/\W+/).filter(w => w.length > 3);
        const jdWords = jobDescription.toLowerCase().split(/\W+/).filter(w => w.length > 3);
        const jdUnique = [...new Set(jdWords)];
        const matching = jdUnique.filter(w => resumeWords.includes(w));
        const missing = jdUnique.filter(w => !resumeWords.includes(w)).slice(0, 8);
        const score = jdUnique.length > 0 ? Math.round((matching.length / jdUnique.length) * 100) : 65;
        return {
            matchScore: Math.min(Math.max(score, 40), 95),
            missingKeywords: missing,
            matchingKeywords: matching.slice(0, 8),
            gapAnalysis: `Found ${matching.length} matching keywords out of ${jdUnique.length} target keywords. Add missing hard skills to boost your match score.`
        };
    }
};

export const generateCoverLetter = async (resumeText: string, jobDescription: string): Promise<string> => {
    try {
        const prompt = `Write a concise 3-paragraph professional cover letter for the candidate based on: Resume: "${resumeText.substring(0, 4000)}" Job Description: "${jobDescription.substring(0, 4000)}"`;
        return await askGemini(prompt, 'You are an expert cover letter writer. Return plain text only.', 600);
    } catch (error) {
        console.error('Gemini API Error (Cover Letter) - using template fallback:', error);
        return `Dear Hiring Manager,\n\nI am writing to express my enthusiastic interest in the role described in your job posting. With my technical background and experience delivering high-quality solutions, I am confident in my ability to make an immediate positive impact on your team.\n\nYour posting highlights key requirements that closely match my expertise. In my past roles, I have consistently driven projects to completion, optimized key processes, and collaborated across cross-functional teams to achieve organizational goals.\n\nThank you for considering my application. I look forward to the opportunity to discuss how my background aligns with your vision.\n\nSincerely,\n[Your Name]`;
    }
};
