import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini Client (free tier: 15 RPM on gemini-2.0-flash)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

/**
 * Helper: retry a function on 429 rate-limit errors with exponential backoff.
 */
const withRetry = async <T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 2000): Promise<T> => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            const status = error?.status || error?.code || error?.response?.status;
            const isRateLimit = status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');

            if (isRateLimit && attempt < maxRetries) {
                const delay = baseDelay * Math.pow(2, attempt);
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
 * Helper: send a prompt to Gemini and return the text response.
 */
const askGemini = async (prompt: string, systemInstruction?: string): Promise<string> => {
    return withRetry(async () => {
        const modelWithSystem = systemInstruction
            ? genAI.getGenerativeModel({ model: 'gemini-2.0-flash', systemInstruction })
            : model;

        const result = await modelWithSystem.generateContent(prompt);
        const response = result.response;
        return response.text();
    });
};

/**
 * Helper: send a prompt to Gemini and parse the JSON response.
 */
const askGeminiJSON = async (prompt: string, systemInstruction?: string): Promise<any> => {
    return withRetry(async () => {
        const modelWithSystem = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: systemInstruction || 'You are a helpful assistant.',
            generationConfig: {
                responseMimeType: 'application/json',
            },
        });

        const result = await modelWithSystem.generateContent(prompt);
        let text = result.response.text();

        // Strip markdown blocks if Gemini returns them despite mimeType
        if (text.startsWith('```')) {
            const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (match && match[1]) {
                text = match[1];
            }
        }

        try {
            return JSON.parse(text);
        } catch (parseError) {
            console.error("Failed to parse Gemini JSON. Raw text:", text);
            throw new Error("Invalid JSON returned by AI.");
        }
    });
};

// ─── AI Service Functions ────────────────────────────────────────────

let summaryCallCounter = 0; // Ensures unique fallback summaries per call
export const generateSummary = async (jobTitle: string, experience: number, skills: string[]): Promise<string> => {
    try {
        const prompt = `Generate a professional resume summary for a ${jobTitle} with ${experience} years of experience. Key skills: ${skills.join(', ')}. The summary should be concise, impact-oriented, and optimized for ATS systems. Limit to 3-4 sentences.`;

        return await askGemini(prompt, 'You are an expert career consultant and professional resume writer.');
    } catch (error) {
        console.error('Gemini API Error (Summary) - using template fallback:', error);
        const skillText = skills.length > 0 ? `, specializing in ${skills.slice(0, 3).join(', ')}` : '';

        // Pool of varied summaries — cycle based on experience to ensure different options
        const templates = [
            `${jobTitle} with ${experience}+ years of experience building scalable, high-performance solutions${skillText}. Proven ability to translate complex business requirements into clean technical architectures that reduce system downtime and accelerate delivery cycles. Thrives in fast-paced environments where quality and speed go hand in hand.`,

            `${jobTitle} bringing ${experience}+ years of industry experience${skillText}. Comfortable working across the full product lifecycle in agile, cross-functional teams and consistently delivering projects ahead of schedule. Focused on writing maintainable code, driving test coverage, and creating user experiences that measurably improve engagement.`,

            `${jobTitle} with a ${experience}+-year track record of designing and shipping products used by thousands of users${skillText}. Balances technical depth with user empathy to build solutions that are both reliable and intuitive. Enjoys mentoring junior engineers and fostering a culture of continuous learning within engineering teams.`,

            `${jobTitle} with ${experience}+ years of professional experience delivering end-to-end solutions across modern technology stacks${skillText}. Experienced in leading migration projects, optimizing database performance, and integrating third-party services. Stays current with emerging technologies and applies them to solve real-world problems.`,

            `${jobTitle} with ${experience}+ years of hands-on technical experience and strong communication skills${skillText}. Background includes building microservices architectures, implementing security best practices, and championing DevOps culture. Consistently meets ambitious targets while maintaining high code quality standards.`,
        ];

        return templates[summaryCallCounter++ % templates.length];
    }
};

export const improveExperience = async (content: string): Promise<string> => {
    try {
        const prompt = `Rewrite the following resume bullet point to be more professional, action-oriented, and impactful. Use strong action verbs and quantify results where possible. Keep it concise. Only return the improved text, nothing else.

Original: "${content}"`;

        return await askGemini(prompt, 'You are an expert resume editor.');
    } catch (error) {
        console.error('Gemini API Error (Experience) - returning original:', error);
        return content; // Return original text as fallback
    }
};

export const generateExperiencePoints = async (role: string): Promise<string[]> => {
    try {
        const prompt = `Generate 4 professional, action-oriented resume bullet points for a ${role} position. Include metrics where possible. Return strictly a JSON array of strings. Example: ["Led a team of 10...", "Increased revenue by 25%..."]`;

        const parsed = await askGeminiJSON(prompt, 'You are an expert resume writer. Output valid JSON only.');

        if (Array.isArray(parsed)) return parsed;
        // Sometimes wrapped in an object
        if (parsed.points && Array.isArray(parsed.points)) return parsed.points;
        return ['Failed to generate points.'];
    } catch (error) {
        console.error('Gemini API Error (Generate Points) - using template fallback:', error);
        // Role-specific fallback bullet points
        const roleLower = role.toLowerCase();
        if (roleLower.includes('develop') || roleLower.includes('engineer') || roleLower.includes('software')) {
            return [
                `Designed and implemented scalable ${roleLower.includes('front') ? 'frontend' : roleLower.includes('back') ? 'backend' : 'full-stack'} solutions, improving application performance by 40%`,
                `Collaborated with cross-functional teams to deliver 15+ features on schedule, reducing time-to-market by 25%`,
                `Led code review initiatives and established best practices, reducing production bugs by 30%`,
                `Mentored junior developers and conducted technical workshops, improving team productivity by 20%`
            ];
        } else if (roleLower.includes('design')) {
            return [
                `Created user-centered designs for 10+ products, increasing user engagement by 35%`,
                `Conducted user research and usability testing with 50+ participants to inform design decisions`,
                `Developed and maintained a comprehensive design system, reducing design-to-development handoff time by 40%`,
                `Collaborated with product and engineering teams to ship 20+ features with a 95% stakeholder approval rate`
            ];
        } else if (roleLower.includes('manag') || roleLower.includes('lead')) {
            return [
                `Led a team of 8+ professionals, achieving a 95% project delivery rate within budget and timeline`,
                `Implemented process improvements that increased team productivity by 30% and reduced overhead costs by 15%`,
                `Drove strategic initiatives resulting in 25% revenue growth and expanded market presence`,
                `Established KPIs and performance metrics, improving team accountability and achieving 90% goal completion`
            ];
        } else {
            return [
                `Delivered high-impact results in the ${role} role, consistently exceeding performance targets by 20%`,
                `Streamlined key processes, resulting in a 30% improvement in operational efficiency`,
                `Collaborated with stakeholders across departments to drive strategic initiatives and achieve business objectives`,
                `Received recognition for outstanding contributions, including top performer award for two consecutive quarters`
            ];
        }
    }
};

export const calculateATSScore = async (resumeText: string): Promise<any> => {
    try {
        const prompt = `Analyze the following resume text for ATS compatibility. Provide a score out of 100 and a list of specific improvements.

Return the response as a JSON object with this exact structure:
{
    "score": number,
    "feedback": ["string", "string"],
    "missingKeywords": ["string", "string"]
}

Resume Text: "${resumeText.substring(0, 20000)}"`;

        return await askGeminiJSON(prompt, 'You are an ATS (Applicant Tracking System) algorithm expert. Output valid JSON only.');
    } catch (error) {
        console.error('Gemini API Error (ATS Score):', error);
        return { score: 0, feedback: ['AI Analysis failed.'], missingKeywords: [] };
    }
};

export const analyzeJobMatch = async (resumeText: string, jobDescription: string): Promise<any> => {
    try {
        const prompt = `Compare the following Resume against the Job Description (JD).

Resume: "${resumeText.substring(0, 20000)}"

Job Description: "${jobDescription.substring(0, 20000)}"

Analyze for:
1. Keyword matching (hard skills, soft skills, tools).
2. Relevance of experience.

Return a JSON object with this exact structure:
{
    "matchScore": number (0-100),
    "missingKeywords": ["string", "string"],
    "matchingKeywords": ["string", "string"],
    "gapAnalysis": "string (brief explanation of gaps)"
}`;

        return await askGeminiJSON(prompt, 'You are an ATS expert. Output valid JSON only.');
    } catch (error) {
        console.error('Gemini API Error (Job Match) - using keyword fallback:', error);
        // Keyword-based fallback analysis
        const resumeWords = resumeText.toLowerCase().split(/\W+/).filter(w => w.length > 3);
        const jdWords = jobDescription.toLowerCase().split(/\W+/).filter(w => w.length > 3);
        const jdUnique = [...new Set(jdWords)];
        const matching = jdUnique.filter(w => resumeWords.includes(w));
        const missing = jdUnique.filter(w => !resumeWords.includes(w)).slice(0, 10);
        const score = jdUnique.length > 0 ? Math.round((matching.length / jdUnique.length) * 100) : 50;
        return {
            matchScore: Math.min(score, 95),
            missingKeywords: missing,
            matchingKeywords: matching.slice(0, 10),
            gapAnalysis: `Found ${matching.length} matching keywords out of ${jdUnique.length} unique keywords from the job description. Consider adding the missing keywords to improve your match score.`
        };
    }
};

export const parseResume = async (text: string): Promise<any> => {
    try {
        const prompt = `Extract data from the following Resume Text and restructure it into this exact JSON format:
{
  "personalInfo": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "title": "string",
    "location": "string",
    "linkedin": "string",
    "website": "string"
  },
  "summary": "string",
  "experience": [
    {
      "id": "exp1",
      "company": "string",
      "position": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or Present",
      "current": boolean,
      "description": "string",
      "achievements": ["string", "string"]
    }
  ],
  "education": [
    {
      "id": "edu1",
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "gpa": "string"
    }
  ],
  "skills": {
    "technical": ["string"],
    "softSkills": ["string"],
    "languages": ["string"]
  },
  "projects": [],
  "additional": { "certifications": [], "awards": [], "volunteer": [], "hobbies": [] }
}

Use unique ids like "exp1", "exp2", "edu1" etc. for each entry.

Resume Text: "${text.substring(0, 20000)}"`;

        return await askGeminiJSON(prompt, 'You are a Resume Parsing API. Output valid JSON only.');
    } catch (error) {
        console.error('Gemini API Error (Parsing) - using text fallback:', error);
        // Regex-based text parser fallback
        return parseResumeFromText(text);
    }
};

/**
 * Fallback: parse resume text using regex patterns when AI is unavailable.
 */
const parseResumeFromText = (text: string): any => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // Extract email
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    const email = emailMatch ? emailMatch[0] : '';

    // Extract phone
    const phoneMatch = text.match(/(\+?\d[\d\s\-().]{7,}\d)/);
    const phone = phoneMatch ? phoneMatch[0].trim() : '';

    // Extract LinkedIn
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
    const linkedin = linkedinMatch ? `https://${linkedinMatch[0]}` : '';

    // Extract website
    const websiteMatch = text.match(/(?:https?:\/\/)?(?:www\.)?(?!linkedin)[\w-]+\.(?:com|dev|io|me|org|net)[\w/]*/i);
    const website = websiteMatch ? websiteMatch[0] : '';

    // Name: usually the first non-empty line
    const name = lines[0] || 'Imported User';

    // Title: usually the second line (if it doesn't look like contact info)
    let title = '';
    if (lines[1] && !lines[1].includes('@') && !lines[1].match(/\d{3}/)) {
        title = lines[1];
    }

    // Extract summary: text near "summary", "objective", or "profile" headers
    let summary = '';
    const summaryIdx = lines.findIndex(l => /^(professional\s+)?summary|objective|profile/i.test(l));
    if (summaryIdx !== -1 && lines[summaryIdx + 1]) {
        summary = lines.slice(summaryIdx + 1, summaryIdx + 4).join(' ').substring(0, 500);
    }

    // Extract skills by looking for common skill-related sections
    const skillsIdx = lines.findIndex(l => /^skills|technical\s+skills|competencies/i.test(l));
    const technicalSkills: string[] = [];
    if (skillsIdx !== -1) {
        for (let i = skillsIdx + 1; i < Math.min(skillsIdx + 10, lines.length); i++) {
            if (/^(experience|education|project|certif)/i.test(lines[i])) break;
            const skills = lines[i].split(/[,|•·]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 40);
            technicalSkills.push(...skills);
        }
    }

    return {
        personalInfo: {
            name,
            email,
            phone,
            title,
            location: '',
            linkedin,
            website,
        },
        summary,
        experience: [],
        education: [],
        skills: {
            technical: technicalSkills.slice(0, 20),
            softSkills: [],
            languages: [],
        },
        projects: [],
        additional: { certifications: [], awards: [], volunteer: [], hobbies: [] },
    };
};

export const generateCoverLetter = async (resumeText: string, jobDescription: string): Promise<string> => {
    try {
        const prompt = `Write a professional, compelling cover letter for the candidate based on their resume and the job description.

Resume:
"${resumeText.substring(0, 20000)}"

Job Description:
"${jobDescription.substring(0, 20000)}"

Format the response as plain text, ready to copy-paste. Do not include markdown or explanations.`;

        return await askGemini(prompt, 'You are a helpful career assistant and expert cover letter writer.');
    } catch (error) {
        console.error('Gemini API Error (Cover Letter) - using template fallback:', error);
        // Template fallback
        const jdSnippet = jobDescription.substring(0, 200);
        return `Dear Hiring Manager,\n\nI am writing to express my strong interest in the position described in your job posting. After reviewing the requirements, I am confident that my skills and experience make me an excellent candidate.\n\n${jdSnippet ? `Your posting mentions: "${jdSnippet}..." — I have direct experience in these areas and am eager to bring my expertise to your team.` : 'I believe my background and qualifications align well with this opportunity.'}\n\nThroughout my career, I have consistently delivered results and demonstrated a commitment to excellence. I am particularly drawn to this role because it aligns with my professional goals and allows me to contribute meaningfully to your organization.\n\nI would welcome the opportunity to discuss how my background and skills would benefit your team. Thank you for considering my application.\n\nSincerely,\n[Your Name]`;
    }
};
