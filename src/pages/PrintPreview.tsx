import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { Loader2 } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { Resume } from '@/data/resumeModel';
import api from '@/services/api';

const PrintPreview = () => {
    const { id } = useParams<{ id: string }>();
    const [resume, setResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);
    const { templateSettings } = useSettingsStore();
    // In a real app, we might fetch settings specific to the resume if saved

    useEffect(() => {
        const fetchResume = async () => {
            if (!id) return;
            try {
                const response = await api.get(`/resumes/${id}`);
                setResume(response.data);
            } catch (error) {
                console.error("Failed to fetch resume for print", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResume();
    }, [id]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!resume) {
        return <div>Resume not found</div>;
    }

    // Determine template from URL query or resume metadata logic (simplification: default or from store if matching)
    // For this implementation, we'll assume the currently selected template in layout, 
    // but ideally the resume object stores its preferred template.
    // We'll fallback to 'modern' if not specified.
    const urlParams = new URLSearchParams(window.location.search);
    const template = urlParams.get('template') || 'modern';

    return (
        <div className="min-h-screen bg-white">
            {/* 
                We render slightly differently for the printer. 
                The margin/padding is handled by the template or @page CSS.
             */}
            <div className="mx-auto print:w-full print:mx-0 print:p-0" style={{ width: '210mm' }}>
                <TemplateRenderer
                    resume={resume}
                    templateId={template}
                    settings={templateSettings}
                />
            </div>
        </div>
    );
};

export default PrintPreview;
