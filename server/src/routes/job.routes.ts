
import express from 'express';
import { analyzeMatch } from '../controllers/job.controller';
import { optionalAuthToken } from '../middleware/auth.middleware';

const router = express.Router();

router.use(optionalAuthToken);

router.post('/analyze', analyzeMatch);

export default router;
