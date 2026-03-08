import React, { useEffect, useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { format } from 'date-fns';
import { Clock, RotateCcw, Trash2, X } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import api from '@/services/api';
import { toast } from 'sonner';
import { defaultResume } from '@/data/resumeModel';

interface Version {
    id: string;
    label: string;
    createdAt: string;
}

export const VersionHistory = ({ onClose }: { onClose: () => void }) => {
    const { currentResume, saveResume, setCurrentResume } = useResumeStore();
    const [versions, setVersions] = useState<Version[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVersions();
    }, [currentResume.id]);

    const fetchVersions = async (id?: string) => {
        try {
            const resumeId = id || currentResume.id;
            const response = await api.get(`/versions/${resumeId}`);
            setVersions(response.data);
        } catch (error) {
            console.error("Failed to fetch versions", error);
        } finally {
            setLoading(false);
        }
    };

    const createVersion = async () => {
        try {
            // Ensure current state is saved first
            await saveResume(currentResume);

            // Fetch the updated ID from store in case it was just created (nanoid -> UUID)
            const latestResumeId = useResumeStore.getState().currentResume.id;

            const label = `Version ${versions.length + 1} - ${format(new Date(), 'MMM d, h:mm a')}`;
            await api.post(`/versions/${latestResumeId}`, { label });
            toast.success("Version created successfully");
            fetchVersions(latestResumeId);
        } catch (error) {
            toast.error("Failed to create version");
        }
    };

    const restoreVersion = async (versionId: string) => {
        if (!confirm("Are you sure? This will overwrite your current resume.")) return;
        try {
            const response = await api.post(`/versions/${currentResume.id}/restore/${versionId}`);

            // Merge with defaultResume to ensure nested objects like personalInfo exist
            // This prevents "Cannot read properties of undefined (reading 'name')" crash
            const restoredData = response.data.resumeJson || response.data;
            const safeResume = {
                ...defaultResume,
                ...restoredData,
                id: currentResume.id, // Preserve current ID so we don't accidentally rename the document internally
                personalInfo: {
                    ...defaultResume.personalInfo,
                    ...(restoredData.personalInfo || {})
                },
                skills: {
                    ...defaultResume.skills,
                    ...(restoredData.skills || {})
                },
                additional: {
                    ...defaultResume.additional,
                    ...(restoredData.additional || {})
                }
            };

            setCurrentResume(safeResume);
            toast.success("Resume restored to version");
            onClose(); // Close panel after restore to see changes
        } catch (error) {
            toast.error("Failed to restore version");
        }
    };

    const deleteVersion = async (versionId: string) => {
        if (!confirm("Delete this version permanently?")) return;
        try {
            await api.delete(`/versions/${currentResume.id}/${versionId}`);
            toast.success("Version deleted");
            setVersions(versions.filter(v => v.id !== versionId));
        } catch (error) {
            toast.error("Failed to delete version");
        }
    };

    return (
        <div className="h-full flex flex-col bg-card border-l w-80 shadow-xl fixed right-0 top-0 z-50 animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Version History
                </h2>
                <button onClick={onClose}>
                    <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </button>
            </div>

            <div className="p-4 border-b bg-muted/30">
                <CustomButton onClick={createVersion} className="w-full" size="sm">
                    Save New Version
                </CustomButton>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                    Create a snapshot of your current resume to save your progress.
                </p>
            </div>

            <ScrollArea className="flex-1 p-4">
                {loading ? (
                    <div className="text-center text-sm text-muted-foreground py-8">Loading...</div>
                ) : versions.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-8">No versions saved yet.</div>
                ) : (
                    <div className="space-y-3">
                        {versions.map((version) => (
                            <div key={version.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm truncate pr-2" title={version.label}>
                                        {version.label || 'Untitled Version'}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                                        {format(new Date(version.createdAt), 'MMM d')}
                                    </span>
                                </div>
                                <div className="text-[10px] text-muted-foreground mb-3">
                                    {format(new Date(version.createdAt), 'h:mm a')}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CustomButton
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs flex-1 gap-1"
                                        onClick={() => restoreVersion(version.id)}
                                    >
                                        <RotateCcw className="h-3 w-3" /> Restore
                                    </CustomButton>
                                    <button
                                        className="h-7 w-7 flex items-center justify-center text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                        onClick={() => deleteVersion(version.id)}
                                        title="Delete Version"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};
