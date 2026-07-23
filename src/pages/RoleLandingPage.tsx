import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { roleTemplates } from '@/data/roleTemplates';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { Button } from '@/components/ui/button';
import { useResumeStore } from '@/store/resumeStore';
import { ArrowLeft, Edit } from 'lucide-react';

export const RoleLandingPage = () => {
    const { role } = useParams();
    const navigate = useNavigate();
    const { setCurrentResume, saveResume } = useResumeStore();

    const template = roleTemplates.find(t => t.slug === role);

    if (!template) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Helmet>
                    <title>Resume Template Not Found | Rezumely</title>
                    <meta name="robots" content="noindex" />
                </Helmet>
                <h1 className="sm:text-2xl text-xl font-bold mb-4">Template Not Found</h1>
                <Button onClick={() => navigate('/')}>Go Home</Button>
            </div>
        );
    }

    const handleUseTemplate = async () => {
        // Clone the template resume and set as current
        const newResume = {
            ...template.resume,
            id: crypto.randomUUID(), // Ensure new ID
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            title: `My ${template.title}`,
        };

        setCurrentResume(newResume);
        // Optional: Save immediately or let user save
        // await saveResume(newResume); 
        navigate('/editor');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Helmet>
                <title>{template.metaTitle}</title>
                <meta name="description" content={template.metaDescription} />
                <meta name="keywords" content={`resume maker, resume builder, free resume maker, ${template.title} resume template, ATS resume builder`} />
                <meta property="og:title" content={`${template.metaTitle} | Rezumely`} />
                <meta property="og:description" content={template.metaDescription} />
                <meta property="og:type" content="article" />
                <link rel="canonical" href={`${window.location.origin}/resume-templates/${template.slug}`} />
            </Helmet>

            {/* Header / CTA Section */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-xl font-semibold hidden md:block">{template.title}</h1>
                    </div>
                    <Button onClick={handleUseTemplate} size="lg" className="shadow-md">
                        <Edit className="h-4 w-4 mr-2" />
                        Use This Template
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8">

                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-lg font-bold mb-2">About this Template</h2>
                        <p className="text-muted-foreground mb-4">{template.description}</p>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm">Best for:</h3>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                                <li>{template.title} roles</li>
                                <li>ATS Compatibility</li>
                                <li>Modern Clean Layout</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                        <h3 className="font-semibold text-blue-900 mb-2">Pro Tip</h3>
                        <p className="text-sm text-blue-800">
                            Recruiters spend an average of 7 seconds scanning a resume. This template is designed to highlight your key skills and achievements instantly.
                        </p>
                    </div>
                </div>

                {/* Preview */}
                <div className="lg:col-span-8">
                    <div className="bg-white shadow-xl rounded-sm overflow-hidden border">
                        <TemplateRenderer
                            resume={template.resume}
                            templateId="modern" // Default or make dynamic if needed
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};
