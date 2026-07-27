import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Resume } from '@/data/resumeModel';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PublicResume = () => {
    const { idOrSlug } = useParams();
    const [resume, setResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResume = async () => {
            try {
                // We use a specific public endpoint that doesn't require auth
                // The base URL for axios might include /api
                // We need to bypass the interceptor or just use a raw fetch/axios instance if the main one adds headers.
                // Assuming standard api instance handles 401 gracefully or we just try.
                // Ideally, we have a public instance. For now, use existing but handle error.
                // Or better, use fetch directly to avoid auth headers being an issue if they are invalid.

                // Construct URL. If using vite proxy, /api/public/...
                const response = await fetch(`${import.meta.env.VITE_API_URL}/public/${idOrSlug}`);

                if (!response.ok) {
                    throw new Error('Resume not found or private');
                }

                const data = await response.json();
                setResume(data);
            } catch (err) {
                console.error(err);
                setError('Resume not found or is private.');
            } finally {
                setLoading(false);
            }
        };

        if (idOrSlug) {
            fetchResume();
        }
    }, [idOrSlug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !resume) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
                <h1 className="sm:text-2xl text-xl font-bold mb-2">Oops!</h1>
                <p className="text-muted-foreground mb-4">{error || 'Something went wrong.'}</p>
                <Button onClick={() => window.location.href = '/'}>Go Home</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex justify-center">
            <div className="max-w-[210mm] w-full bg-white shadow-xl rounded-sm overflow-hidden print:shadow-none print:m-0">
                {/* We might need to ensure TemplateRenderer is read-only implicitly or explicitly */}
                {/* TemplateRenderer typically takes 'data' property matching Resume structure */}
                <TemplateRenderer
                    resume={resume}
                    templateId={resume.templateId || 'modern'}
                    settings={resume.templateSettings}
                />
            </div>
            {/* simple footer or branding */}
            <div className="fixed bottom-4 right-4 print:hidden">
                <a href="/" className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-gray-900 transition-colors">
                    Made with Rezumely
                </a>
            </div>
        </div>
    );
};
