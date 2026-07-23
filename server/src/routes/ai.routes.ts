import express from 'express';
import { generateSummary, improveContent, atsCheck, generatePoints, generateCoverLetter } from '../controllers/ai.controller';
import { optionalAuthToken } from '../middleware/auth.middleware';

const router = express.Router();

// Allow both authenticated users and guests to access AI features
router.use(optionalAuthToken);

router.post('/summary', generateSummary);
router.post('/improve', improveContent);
router.post('/points', generatePoints);
router.post('/ats-check', atsCheck);
router.post('/cover-letter', generateCoverLetter);

export default router;
