import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { templateInfo } from '@/components/templates/TemplateRenderer';
import { CustomButton } from '@/components/ui/custom-button';
import { FileText, CheckCircle2, ChevronRight, Menu, X, ArrowLeft } from 'lucide-react';

// Fallback images - placeholder for generated thumbnails
const getThumbnail = (id: string) => {
    return `/thumbnails/${id}.png`;
    // Note: we'll handle gracefully if these don't exist yet via the img onError handler
};

const CATEGORIES = ['All', 'Creative', 'Professional', 'Minimal', 'Specialized'];

const getCategory = (id: string) => {
    if (['creative'].includes(id)) return 'Creative';
    if (['professional', 'executive', 'classic'].includes(id)) return 'Professional';
    if (['minimal'].includes(id)) return 'Minimal';
    if (['developer', 'academic'].includes(id)) return 'Specialized';
    return 'Professional'; // default
};

export const TemplatesPage = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const filteredTemplates = activeCategory === 'All'
        ? templateInfo
        : templateInfo.filter(t => getCategory(t.id) === activeCategory);

    const handleUseTemplate = (templateId: string) => {
        // Navigate to editor with template selected in URL params
        // The Editor component will pick this up and apply it
        navigate(`/editor?template=${templateId}`);
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            <Helmet>
                <title>Resume Templates | Rezumely</title>
                <meta name="description" content="Browse our collection of professional, ATS-friendly resume templates. Perfect for any industry." />
            </Helmet>

            {/* Navigation - simplified version of Index.tsx nav */}
            <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-lg text-foreground">Rezumely</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <button onClick={() => navigate('/')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Home
                        </button>
                        <CustomButton variant="primary" onClick={() => navigate('/editor')}>
                            Build Resume
                        </CustomButton>
                    </div>

                    <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b shadow-lg p-4 flex flex-col gap-4">
                        <button onClick={() => navigate('/')} className="text-left py-2 font-medium">Home</button>
                        <CustomButton variant="primary" onClick={() => navigate('/editor')} className="w-full">
                            Build Resume
                        </CustomButton>
                    </div>
                )}
            </nav>

            <main className="container max-w-7xl mx-auto px-4 py-12 md:py-20">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            Choose your perfect resume <span className="text-primary">template</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Stand out from the crowd with our professionally designed, ATS-friendly templates.
                            Find the perfect match for your industry and style.
                        </p>
                    </motion.div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                                ? 'bg-primary text-primary-foreground shadow-md scale-105'
                                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredTemplates.map((template, index) => (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="group relative flex flex-col h-full bg-card rounded-xl border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Image Container */}
                            <div
                                className="aspect-[1/1.4] overflow-hidden bg-muted relative border-b"
                            >
                                {/* Fallback pattern while waiting for real image */}
                                <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />

                                <img
                                    src={getThumbnail(template.id)}
                                    alt={`${template.name} template preview`}
                                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    onError={(e) => {
                                        // Fallback if image not generated yet
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=560&fit=crop&q=80';
                                    }}
                                />

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                    <CustomButton
                                        variant="primary"
                                        onClick={() => handleUseTemplate(template.id)}
                                        className="shadow-lg transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                    >
                                        Use Template
                                    </CustomButton>
                                </div>
                            </div>

                            {/* Template Info */}
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div
                                        className="w-4 h-4 rounded-full shadow-inner"
                                        style={{ backgroundColor: template.color }}
                                    />
                                    <h3 className="font-bold text-lg">{template.name}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4 flex-1">
                                    {template.description}
                                </p>
                                <div className="border-t pt-4 mt-auto">
                                    <ul className="space-y-2 mb-4">
                                        <li className="flex items-center text-xs text-muted-foreground gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <span>ATS-friendly design</span>
                                        </li>
                                        <li className="flex items-center text-xs text-muted-foreground gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <span>Fully customizable</span>
                                        </li>
                                    </ul>
                                    <CustomButton
                                        variant="outline"
                                        className="w-full group/btn"
                                        onClick={() => handleUseTemplate(template.id)}
                                    >
                                        Select this template
                                        <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                    </CustomButton>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default TemplatesPage;
