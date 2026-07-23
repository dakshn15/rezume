
import { Request, Response } from 'express';
import * as aiService from '../services/ai.service';

export const analyzeMatch = async (req: Request, res: Response) => {
    try {
        const { resumeText, jobDescription } = req.body;

        if (!resumeText || !jobDescription) {
            return res.status(400).json({ message: 'Resume text and Job Description are required' });
        }

        const result = await aiService.analyzeJobMatch(resumeText, jobDescription);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error analyzing job match', error: (error as Error).message });
    }
};

