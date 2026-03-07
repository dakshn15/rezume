import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';


// Create a new version
export const createVersion = async (req: Request, res: Response) => {
    try {
        const resumeId = req.params.resumeId as string;
        const { label } = req.body;
        const userId = (req as any).user?.userId as string;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verify resume belongs to user
        const resume = await prisma.resume.findUnique({
            where: { id: resumeId },
        });

        if (!resume || resume.userId !== userId) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        const version = await prisma.resumeVersion.create({
            data: {
                resumeId,
                label: label || `Version ${new Date().toLocaleString()}`,
                snapshotJson: resume.resumeJson, // Already a string in SQLite
            },
        });

        res.status(201).json(version);
    } catch (error) {
        console.error('Create Version Error:', error);
        res.status(500).json({ message: 'Failed to create version' });
    }
};

// Get all versions for a resume
export const getVersions = async (req: Request, res: Response) => {
    try {
        const resumeId = req.params.resumeId as string;
        const userId = (req as any).user?.userId as string;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const versions = await prisma.resumeVersion.findMany({
            where: {
                resume: {
                    id: resumeId,
                    userId: userId
                }
            },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                label: true,
                createdAt: true,
            }
        });

        res.json(versions);
    } catch (error) {
        console.error('Get Versions Error:', error);
        res.status(500).json({ message: 'Failed to fetch versions' });
    }
};

// Restore a version (Overwrite current resume)
export const restoreVersion = async (req: Request, res: Response) => {
    try {
        const resumeId = req.params.resumeId as string;
        const versionId = req.params.versionId as string;
        const userId = (req as any).user?.userId as string;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const version = await prisma.resumeVersion.findUnique({
            where: { id: versionId },
        });

        if (!version || version.resumeId !== resumeId) {
            return res.status(404).json({ message: 'Version not found' });
        }

        // Verify ownership via resume
        const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
        if (!resume || resume.userId !== userId) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Update resume with version snapshot
        const updatedResume = await prisma.resume.update({
            where: { id: resumeId },
            data: {
                resumeJson: version.snapshotJson,
                updatedAt: new Date(),
            }
        });

        // Parse JSON string back to object for the frontend
        const parsedResume = {
            ...updatedResume,
            resumeJson: typeof updatedResume.resumeJson === 'string'
                ? JSON.parse(updatedResume.resumeJson)
                : updatedResume.resumeJson
        };

        res.json(parsedResume);

    } catch (error) {
        console.error('Restore Version Error:', error);
        res.status(500).json({ message: 'Failed to restore version' });
    }
};

// Delete a version
export const deleteVersion = async (req: Request, res: Response) => {
    try {
        const resumeId = req.params.resumeId as string;
        const versionId = req.params.versionId as string;
        const userId = (req as any).user?.userId as string;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Check ownership via resume
        const count = await prisma.resumeVersion.count({
            where: {
                id: versionId,
                resumeId: resumeId,
                resume: { userId: userId }
            }
        });

        if (count === 0) {
            return res.status(404).json({ message: 'Version not found' });
        }

        await prisma.resumeVersion.delete({
            where: { id: versionId }
        });

        res.status(204).send();

    } catch (error) {
        console.error('Delete Version Error:', error);
        res.status(500).json({ message: 'Failed to delete version' });
    }
};
