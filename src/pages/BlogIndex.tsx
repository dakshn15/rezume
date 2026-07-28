import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { blogPosts, blogCategories } from '@/data/blogPosts';
import { FileText, Clock, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

/* ─── Category colour mapping ─── */
const categoryColors: Record<string, string> = {
    'ATS Optimization': 'bg-blue-50 text-blue-700 border-blue-200',
    'Resume Tips': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Career Growth': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Interview Prep': 'bg-amber-50 text-amber-700 border-amber-200',
};
const getCategoryStyle = (cat: string) => categoryColors[cat] ?? 'bg-slate-50 text-slate-600 border-slate-200';

export const BlogIndex = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    const featuredPost = blogPosts.find(p => p.featured);
    const filtered =
        activeCategory === 'All'
            ? blogPosts.filter(p => !p.featured)
            : blogPosts.filter(p => p.category === activeCategory && !p.featured);

    return (
        <div className="min-h-screen" style={{ background: 'hsl(210 25% 98%)' }}>
            <Helmet>
                <title>Rezumely Career Blog — Resume Tips &amp; Interview Advice</title>
                <meta name="description" content="Expert career advice, resume writing tips, and interview strategies to help you land your dream job." />
                <meta name="keywords" content="career blog, resume tips, interview advice, resume builder, resume maker, free resume maker" />
                <meta property="og:title" content="Rezumely Career Blog" />
                <meta property="og:description" content="Expert career advice, resume writing tips, and interview strategies to help you land your dream job." />
                <meta property="og:type" content="website" />
            </Helmet>

            {/* ── Sticky Nav ── */}
            <header className="sticky top-0 z-40 glass border-b shadow-sm">
                <div className="container mx-auto md:py-4 py-3 flex items-center justify-between px-4 sm:px-6">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo-dark.png" alt="Rezumely" className="h-8 sm:h-9 w-auto object-contain" />
                    </Link>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link to="/"
                            className="hidden sm:inline-block text-sm font-medium transition-colors"
                            style={{ color: 'hsl(215 16% 47%)' }}
                        >
                            ← Home
                        </Link>
                        <Link to="/editor"
                            className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg, hsl(222 47% 20%) 0%, hsl(217 91% 45%) 100%)' }}
                        >
                            Build Resume Free
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── Hero ── */}
            <div className="border-b border-slate-200 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:py-14 py-10">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                    >
                        {/* Eyebrow badge */}
                        <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full border text-xs font-semibold"
                            style={{ borderColor: 'hsl(217 91% 60% / 0.3)', color: 'hsl(217 91% 45%)', background: 'hsl(217 91% 60% / 0.07)' }}>
                            <Sparkles className="h-3 w-3" />
                            Career Resources
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 justify-between">
                            <div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-3"
                                    style={{ color: 'hsl(222 47% 11%)' }}>
                                    Career{' '}
                                    <span style={{
                                        background: 'linear-gradient(135deg, hsl(222 47% 20%) 0%, hsl(217 91% 50%) 100%)',
                                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                                    }}>
                                        Blog
                                    </span>
                                </h1>
                                <p className="text-sm sm:text-base max-w-md leading-relaxed" style={{ color: 'hsl(215 16% 47%)' }}>
                                    Expert resume tips, job search strategies, and interview advice — straight from career professionals.
                                </p>
                            </div>

                            {/* Stats chips */}
                            <div className="flex items-center gap-5 text-center flex-shrink-0">
                                <div>
                                    <div className="text-2xl font-black" style={{ color: 'hsl(222 47% 20%)' }}>{blogPosts.length}</div>
                                    <div className="text-xs" style={{ color: 'hsl(215 16% 47%)' }}>Articles</div>
                                </div>
                                <div className="w-px h-8 bg-slate-200" />
                                <div>
                                    <div className="text-2xl font-black" style={{ color: 'hsl(222 47% 20%)' }}>{blogCategories.length - 1}</div>
                                    <div className="text-xs" style={{ color: 'hsl(215 16% 47%)' }}>Topics</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Main ── */}
            <main className="container mx-auto px-4 sm:px-6 lg:py-12 py-8">

                {/* ─ Featured Post ─ */}
                {featuredPost && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.05 }}
                        className="mb-10"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-px w-6 rounded-full" style={{ background: 'hsl(217 91% 60%)' }} />
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'hsl(217 91% 50%)' }}>
                                Featured Article
                            </span>
                        </div>

                        <Link to={`/blog/${featuredPost.slug}`} className="block group">
                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden
                              shadow-sm hover:shadow-md hover:-translate-y-0.5
                              transition-all duration-300 grid md:grid-cols-5">

                                {/* Left colour panel */}
                                <div className="md:col-span-2 p-6 sm:p-8 md:p-10 flex flex-col justify-between min-h-[180px] md:min-h-[220px]"
                                    style={{ background: 'linear-gradient(135deg, hsl(222 47% 16%) 0%, hsl(217 91% 35%) 100%)' }}>
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/15 flex items-center justify-center">
                                        <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                    <div>
                                        <span className="inline-block bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                                            {featuredPost.category}
                                        </span>
                                        <div className="flex items-center gap-3 text-white/60 text-xs">
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {featuredPost.readTime}</span>
                                            <span>·</span>
                                            <span>{featuredPost.date}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right content */}
                                <div className="md:col-span-3 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-lg sm:text-xl md:text-2xl font-black leading-snug mb-3 transition-colors duration-200"
                                            style={{ color: 'hsl(222 47% 11%)' }}>
                                            <span className="group-hover:text-[hsl(217,91%,45%)] transition-colors">{featuredPost.title}</span>
                                        </h2>
                                        <p className="text-sm leading-relaxed mb-4 sm:mb-6" style={{ color: 'hsl(215 16% 47%)' }}>
                                            {featuredPost.excerpt}
                                        </p>
                                    </div>

                                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                                style={{ background: 'linear-gradient(135deg, hsl(222 47% 20%) 0%, hsl(217 91% 45%) 100%)' }}>
                                                {featuredPost.author.charAt(0)}
                                            </div>
                                            <div className="text-xs">
                                                <div className="font-semibold" style={{ color: 'hsl(222 47% 11%)' }}>{featuredPost.author}</div>
                                                <div style={{ color: 'hsl(215 16% 55%)' }}>{featuredPost.authorRole}</div>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold
                                     group-hover:gap-2 transition-all duration-200"
                                            style={{ color: 'hsl(217 91% 50%)' }}>
                                            Read Article <ArrowRight className="h-3.5 w-3.5" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}

                {/* ─ Filter Tabs ─ */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center gap-2 flex-wrap mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-slate-200"
                >
                    {blogCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${activeCategory === cat
                                    ? 'text-white border-transparent shadow-sm'
                                    : `${getCategoryStyle(cat)} hover:shadow-sm`
                                }`}
                            style={activeCategory === cat
                                ? { background: 'linear-gradient(135deg, hsl(222 47% 20%) 0%, hsl(217 91% 45%) 100%)' }
                                : {}}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* ─ Articles Grid ─ */}
                {filtered.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {filtered.map((post, i) => (
                            <motion.article
                                key={post.slug}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: i * 0.06 }}
                                className="group"
                            >
                                <Link to={`/blog/${post.slug}`} className="flex flex-col h-full">
                                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden h-full flex flex-col
                                  shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-250">
                                        {/* Top accent strip */}
                                        <div className="h-0.5" style={{ background: 'linear-gradient(90deg, hsl(222 47% 20%) 0%, hsl(217 91% 50%) 100%)' }} />

                                        <div className="p-4 sm:p-5 flex flex-col flex-1">
                                            {/* Meta row */}
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getCategoryStyle(post.category)}`}>
                                                    {post.category}
                                                </span>
                                                <span className="text-xs flex items-center gap-1" style={{ color: 'hsl(215 16% 55%)' }}>
                                                    <Clock className="h-3 w-3" /> {post.readTime}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h2 className="text-[15px] font-bold leading-snug mb-2 flex-1"
                                                style={{ color: 'hsl(222 47% 11%)' }}>
                                                <span className="group-hover:text-[hsl(217,91%,45%)] transition-colors">
                                                    {post.title}
                                                </span>
                                            </h2>

                                            {/* Excerpt */}
                                            <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'hsl(215 16% 50%)' }}>
                                                {post.excerpt}
                                            </p>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                                                        style={{ background: 'linear-gradient(135deg, hsl(222 47% 20%) 0%, hsl(217 91% 45%) 100%)' }}>
                                                        {post.author.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-medium" style={{ color: 'hsl(222 47% 20%)' }}>{post.author}</div>
                                                        <div className="text-[10px]" style={{ color: 'hsl(215 16% 58%)' }}>{post.date}</div>
                                                    </div>
                                                </div>
                                                <ArrowRight
                                                    className="h-3.5 w-3.5 transition-all duration-200 group-hover:translate-x-0.5"
                                                    style={{ color: 'hsl(217 91% 55%)' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 sm:py-20">
                        <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-25" />
                        <p className="text-sm font-medium mb-2" style={{ color: 'hsl(215 16% 47%)' }}>No articles in this category yet.</p>
                        <button
                            onClick={() => setActiveCategory('All')}
                            className="text-xs font-semibold hover:underline"
                            style={{ color: 'hsl(217 91% 50%)' }}
                        >
                            View all articles →
                        </button>
                    </div>
                )}

                {/* ─ CTA Banner ─ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 sm:mt-16 rounded-2xl overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, hsl(222 47% 16%) 0%, hsl(217 91% 35%) 100%)' }}
                >
                    <div className="px-6 sm:px-8 md:px-12 py-8 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6">
                        <div>
                            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">Ready to apply these tips?</p>
                            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                                Build your ATS resume — free
                            </h3>
                            <p className="text-sm text-white/60 max-w-sm">
                                Land more interviews with a professionally designed, ATS-optimized resume in under 10 minutes.
                            </p>
                        </div>
                        <Link
                            to="/editor"
                            className="flex-shrink-0 inline-flex items-center gap-2 font-bold text-sm px-5 sm:px-6 py-3 rounded-xl
                         bg-white hover:bg-white/90 transition-opacity shadow-lg whitespace-nowrap"
                            style={{ color: 'hsl(222 47% 18%)' }}
                        >
                            Start Building Free <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </motion.div>
            </main>

            {/* ── Footer ── */}
            <footer className="border-t border-slate-200 bg-white mt-6 sm:mt-8">
                <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <img src="/logo-dark.png" alt="Rezumely" className="h-5 w-auto object-contain" />
                        <span className="text-xs" style={{ color: 'hsl(215 16% 55%)' }}>© 2025 Rezumely</span>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-5 text-xs" style={{ color: 'hsl(215 16% 55%)' }}>
                        <Link to="/privacy-policy" className="hover:text-slate-800 transition-colors">Privacy</Link>
                        <Link to="/terms-of-service" className="hover:text-slate-800 transition-colors">Terms</Link>
                        <Link to="/#contact" className="hover:text-slate-800 transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};
