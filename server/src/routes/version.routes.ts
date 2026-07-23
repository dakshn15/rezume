import express from 'express';
import { createVersion, getVersions, restoreVersion, deleteVersion } from '../controllers/version.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// Version Management Routes (Mounted at /api/versions):
// POST /:resumeId - Create a new version snapshot
// GET /:resumeId - List all versions for a resume
// POST /:resumeId/restore/:versionId - Restore a specific version
// DELETE /:resumeId/:versionId - Delete a version snapshot

router.post('/:resumeId', authenticateToken, createVersion);
router.get('/:resumeId', authenticateToken, getVersions);
router.post('/:resumeId/restore/:versionId', authenticateToken, restoreVersion);
router.delete('/:resumeId/:versionId', authenticateToken, deleteVersion);

export default router;
