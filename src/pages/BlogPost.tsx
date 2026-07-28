import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { blogPosts } from '@/data/blogPosts';
import {
    FileText, ArrowLeft, Clock, Calendar, Share2,
    ArrowRight, BookOpen, ChevronUp, Tag
} from 'lucide-react';
import { toast } from 'sonner';

/* ─── Reading progress ─── */
function ReadingProgress() {
    const [pct, setPct] = useState(0);
    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            setPct(el.scrollHeight - el.clientHeight > 0
                ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
                : 0);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent pointer-events-none">
            <div className="h-full transition-[width] duration-75"
                style={{ width: `${pct}%`, background: 'linear-gradient(90deg, hsl(222 47% 20%) 0%, hsl(217 91% 50%) 100%)' }} />
        </div>
    );
}

/* ─── Back to top ─── */
function BackToTop() {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const fn = () => setShow(window.scrollY > 400);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);
    if (!show) return null;
    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 w-9 h-9 rounded-full text-white shadow-lg
                 flex items-center justify-center transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, hsl(222 47% 20%) 0%, hsl(217 91% 45%) 100%)' }}
        >
            <ChevronUp className="h-4 w-4" />
        </motion.button>
    );
}

/* ─── Markdown overrides ─── */
const md: Record<string, React.FC<any>> = {
    h1: ({ children }) => (
        <h1 className="text-2xl sm:text-3xl font-black mt-0 mb-5 leading-tight" style={{ color: 'hsl(222 47% 11%)' }}>
            {children}
        </h1>
    ),
    h2: ({ children }) => (
        <h2 className="text-lg sm:text-xl font-black mt-8 sm:mt-10 mb-4 flex items-center gap-2.5" style={{ color: 'hsl(222 47% 11%)' }}>
            <span className="inline-block w-1 h-5 rounded-full flex-shrink-0"
                style={{ background: 'linear-gradient(180deg, hsl(222 47% 20%) 0%, hsl(217 91% 50%) 100%)' }} />
            {children}
        </h2>
    ),
    h3: ({ children }) => (
        <h3 className="text-base sm:text-[17px] font-bold mt-6 mb-2" style={{ color: 'hsl(222 47% 15%)' }}>
            {children}
        </h3>
    ),
    p: ({ children }) => (
        <p className="text-[14px] sm:text-[15px] leading-7 sm:leading-8 mb-5" style={{ color: 'hsl(215 16% 40%)' }}>
            {children}
        </p>
    ),
    ul: ({ children }) => <ul className="space-y-2 mb-5 pl-0">{children}</ul>,
    ol: ({ children }) => <ol className="space-y-2 mb-5 pl-5 list-decimal" style={{ color: 'hsl(215 16% 40%)' }}>{children}</ol>,
    li: ({ children }) => (
        <li className="flex items-start gap-3 text-[14px] sm:text-[15px] leading-7" style={{ color: 'hsl(215 16% 40%)' }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[10px] sm:mt-[11px]"
                style={{ background: 'hsl(217 91% 55%)' }} />
            <span>{children}</span>
        </li>
    ),
    strong: ({ children }) => (
        <strong className="font-bold" style={{ color: 'hsl(222 47% 15%)' }}>{children}</strong>
    ),
    em: ({ children }) => (
        <em className="italic" style={{ color: 'hsl(215 16% 50%)' }}>{children}</em>
    ),
    code: ({ inline, children }: any) =>
        inline ? (
            <code className="text-[12px] sm:text-[13px] px-1.5 py-0.5 rounded font-mono border"
                style={{ background: 'hsl(217 91% 60% / 0.08)', color: 'hsl(217 91% 40%)', borderColor: 'hsl(217 91% 60% / 0.2)' }}>
                {children}
            </code>
        ) : (
            <pre className="rounded-xl p-3 sm:p-4 overflow-x-auto text-xs sm:text-sm font-mono my-5 sm:my-6"
                style={{ background: 'hsl(222 47% 9%)', color: 'hsl(210 40% 88%)' }}>
                <code>{children}</code>
            </pre>
        ),
    blockquote: ({ children }) => (
        <blockquote className="border-l-[3px] px-4 sm:px-5 py-3 my-5 rounded-r-xl text-sm sm:text-[15px] italic"
            style={{ borderColor: 'hsl(217 91% 55%)', background: 'hsl(217 91% 60% / 0.06)', color: 'hsl(215 16% 45%)' }}>
            {children}
        </blockquote>
    ),
    a: ({ href, children }: any) => (
        <a href={href} className="font-medium underline underline-offset-2 hover:no-underline"
            style={{ color: 'hsl(217 91% 50%)' }} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    ),
};

/* ─── Category colour ─── */
const categoryColors: Record<string, { bg: string; color: string }> = {
    'ATS Optimization': { bg: 'hsl(217 91% 60% / 0.1)', color: 'hsl(217 91% 45%)' },
    'Resume Tips': { bg: 'hsl(222 47% 20% / 0.08)', color: 'hsl(222 47% 30%)' },
    'Career Growth': { bg: 'hsl(142 71% 45% / 0.1)', color: 'hsl(142 71% 35%)' },
    'Interview Prep': { bg: 'hsl(38 92% 50% / 0.1)', color: 'hsl(38 92% 40%)' },
};
const getCat = (c: string) => categoryColors[c] ?? { bg: 'hsl(215 16% 47% / 0.1)', color: 'hsl(215 16% 40%)' };

/* ─── Main ─── */
export const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const post = blogPosts.find(p => p.slug === slug);
    const morePosts = blogPosts.filter(p => p.slug !== slug).slice(0, 3);

    const share = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied!');
    };

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6"
                style={{ background: 'hsl(210 25% 98%)' }}>
                <Helmet>
                    <title>Article Not Found | Rezumely Blog</title>
                    <meta name="robots" content="noindex" />
                </Helmet>
                <BookOpen className="h-12 w-12 mb-4 opacity-20" />
                <h1 className="text-xl font-bold mb-2" style={{ color: 'hsl(222 47% 11%)' }}>Article Not Found</h1>
                <p className="text-sm mb-6" style={{ color: 'hsl(215 16% 47%)' }}>This article doesn't exist or may have moved.</p>
                <button onClick={() => navigate('/blog')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, hsl(222 47% 20%) 0%, hsl(217 91% 45%) 100%)' }}>
                    <ArrowLeft className="h-4 w-4" /> Back to Blog
                </button>
            </div>
        );
    }

    const catStyle = getCat(post.category);

    return (
        <div className="min-h-screen bg-white">
            <Helmet>
                <title>{post.metaTitle}</title>
                <meta name="description" content={post.metaDescription} />
                <meta name="keywords" content={`${post.tags.join(', ')}, resume advice, resume maker, resume builder`} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:type" content="article" />
                <link rel="canonical" href={`${window.location.origin}/blog/${post.slug}`} />
            </Helmet>

            <ReadingProgress />
            <BackToTop />

            {/* ── Sticky Nav ── */}
            <header className="sticky top-0 z-40 glass border-b shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 md:py-4 py-3 flex items-center justify-between gap-2">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <img src="/logo-dark.png" alt="Rezumely" className="h-7 sm:h-8 w-auto object-contain" />
                    </Link>

                    {/* Breadcrumb — visible on md+ */}
                    <div className="hidden md:flex flex-1 items-center gap-1 px-4 text-xs min-w-0"
                        style={{ color: 'hsl(215 16% 55%)' }}>
                        <Link to="/blog" className="hover:text-slate-800 transition-colors whitespace-nowrap">Blog</Link>
                        <span className="mx-1">/</span>
                        <span className="truncate" style={{ color: 'hsl(222 47% 18%)' }}>{post.title}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Link to="/blog"
                            className="hidden sm:inline-flex items-center gap-1 text-xs transition-colors hover:text-slate-800"
                            style={{ color: 'hsl(215 16% 55%)' }}>
                            <ArrowLeft className="h-3.5 w-3.5" /> Blog
                        </Link>
                        <button onClick={share}
                            className="hidden sm:inline-flex items-center gap-1.5 text-xs border border-slate-200 bg-slate-50
                         hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
                            style={{ color: 'hsl(215 16% 40%)' }}>
                            <Share2 className="h-3 w-3" /> Share
                        </button>
                        <Link to="/editor"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-white"
                            style={{ background: 'linear-gradient(135deg, hsl(222 47% 20%) 0%, hsl(217 91% 45%) 100%)' }}>
                            <FileText className="h-3 w-3" />
                            <span className="hidden sm:inline">Build Resume</span>
                            <span className="sm:hidden">Build</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── Article Hero ── */}
            <div className="border-b border-slate-100" style={{ background: 'hsl(210 25% 98%)' }}>
                <div className="container mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-6 sm:pb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Top meta */}
                        <div className="flex items-center gap-2 mb-4 sm:mb-5 text-xs flex-wrap">
                            <Link to="/blog" className="flex items-center gap-1 transition-colors hover:text-slate-800"
                                style={{ color: 'hsl(215 16% 55%)' }}>
                                <ArrowLeft className="h-3 w-3" /> Blog
                            </Link>
                            <span style={{ color: 'hsl(215 16% 70%)' }}>·</span>
                            <span className="font-semibold px-2 py-0.5 rounded-md"
                                style={{ background: catStyle.bg, color: catStyle.color }}>
                                {post.category}
                            </span>
                            <span style={{ color: 'hsl(215 16% 70%)' }}>·</span>
                            <span className="flex items-center gap-1" style={{ color: 'hsl(215 16% 55%)' }}>
                                <Clock className="h-3 w-3" /> {post.readTime}
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight mb-4"
                            style={{ color: 'hsl(222 47% 11%)' }}>
                            {post.title}
                        </h1>

                        {/* Excerpt */}
                        <p className="text-sm sm:text-base leading-relaxed mb-5 sm:mb-6 max-w-2xl"
                            style={{ color: 'hsl(215 16% 45%)' }}>
                            {post.excerpt}
                        </p>

                        {/* Author bar */}
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 py-3 sm:py-4 border-t border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                    style={{ background: 'linear-gradient(135deg, hsl(222 47% 20%) 0%, hsl(217 91% 45%) 100%)' }}>
                                    {post.author.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold" style={{ color: 'hsl(222 47% 11%)' }}>{post.author}</div>
                                    <div className="text-xs" style={{ color: 'hsl(215 16% 55%)' }}>{post.authorRole}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs" style={{ color: 'hsl(215 16% 55%)' }}>
                                <Calendar className="h-3 w-3" /> {post.date}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Article Body ── */}
            <div className="container mx-auto px-4 sm:px-6 lg:py-10 py-8">
                {/* Constrain prose to readable width */}
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        {/* Prose */}
                        <ReactMarkdown components={md}>{post.content}</ReactMarkdown>

                        {/* Tags */}
                        <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                            <Tag className="h-3.5 w-3.5" style={{ color: 'hsl(215 16% 60%)' }} />
                            {post.tags.map(tag => (
                                <span key={tag}
                                    className="text-[11px] font-medium px-2.5 py-1 rounded-full border"
                                    style={{ background: 'hsl(210 25% 96%)', color: 'hsl(215 16% 45%)', borderColor: 'hsl(214 32% 91%)' }}>
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Author bio */}
                        <div className="mt-6 sm:mt-8 rounded-xl border border-slate-200 p-4 sm:p-5 flex gap-3 sm:gap-4"
                            style={{ background: 'hsl(210 25% 98%)' }}>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                                style={{ background: 'linear-gradient(135deg, hsl(222 47% 20%) 0%, hsl(217 91% 45%) 100%)' }}>
                                {post.author.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-sm mb-0.5" style={{ color: 'hsl(222 47% 11%)' }}>{post.author}</div>
                                <div className="text-xs font-semibold mb-2" style={{ color: 'hsl(217 91% 45%)' }}>{post.authorRole}</div>
                                <p className="text-xs leading-relaxed" style={{ color: 'hsl(215 16% 50%)' }}>
                                    Career expert helping professionals land their dream jobs with data-driven resume advice and practical job search strategies.
                                </p>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-6 sm:mt-8 rounded-xl overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, hsl(222 47% 16%) 0%, hsl(217 91% 35%) 100%)' }}>
                            <div className="px-5 sm:px-7 py-6 sm:py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-white/50 mb-1">
                                        Ready to apply these tips?
                                    </div>
                                    <h3 className="text-base sm:text-lg font-black text-white mb-1">Build your free resume now</h3>
                                    <p className="text-xs text-white/60">ATS-optimized, beautifully designed — in under 10 minutes.</p>
                                </div>
                                <Link to="/editor"
                                    className="flex-shrink-0 inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl
                             bg-white hover:bg-white/90 transition-opacity shadow-md whitespace-nowrap"
                                    style={{ color: 'hsl(222 47% 18%)' }}>
                                    Start Building <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* More Articles */}
                        {morePosts.length > 0 && (
                            <div className="mt-10 sm:mt-12">
                                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                                    <div className="h-px flex-1 bg-slate-200" />
                                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'hsl(215 16% 60%)' }}>
                                        More Articles
                                    </span>
                                    <div className="h-px flex-1 bg-slate-200" />
                                </div>
                                <div className="space-y-2.5">
                                    {morePosts.map(other => {
                                        const oc = getCat(other.category);
                                        return (
                                            <Link key={other.slug} to={`/blog/${other.slug}`}
                                                className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-slate-100
                                   hover:border-slate-200 hover:bg-slate-50/70 transition-all duration-200">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                    style={{ background: oc.bg }}>
                                                    <BookOpen className="h-3.5 w-3.5" style={{ color: oc.color }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[10px] font-semibold mb-0.5" style={{ color: oc.color }}>{other.category}</div>
                                                    <div className="text-sm font-semibold leading-snug truncate group-hover:text-[hsl(217,91%,45%)] transition-colors"
                                                        style={{ color: 'hsl(222 47% 11%)' }}>
                                                        {other.title}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-[11px] flex-shrink-0"
                                                    style={{ color: 'hsl(215 16% 58%)' }}>
                                                    <Clock className="h-3 w-3" /> {other.readTime}
                                                    <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition-transform"
                                                        style={{ color: 'hsl(217 91% 55%)' }} />
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Bottom nav */}
                        <div className="mt-8 sm:mt-10 flex items-center justify-between pt-5 border-t border-slate-100">
                            <Link to="/blog" className="flex items-center gap-1.5 text-sm transition-colors hover:text-slate-800"
                                style={{ color: 'hsl(215 16% 55%)' }}>
                                <ArrowLeft className="h-3.5 w-3.5" /> All Articles
                            </Link>
                            <button onClick={share} className="flex items-center gap-1.5 text-sm transition-colors hover:text-slate-800"
                                style={{ color: 'hsl(215 16% 55%)' }}>
                                <Share2 className="h-3.5 w-3.5" /> Share
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Footer ── */}
            <footer className="border-t border-slate-200" style={{ background: 'hsl(210 25% 98%)' }}>
                <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
                    style={{ color: 'hsl(215 16% 55%)' }}>
                    <div className="flex items-center gap-2">
                        <img src="/logo-dark.png" alt="Rezumely" className="h-5 w-auto object-contain" />
                        © 2025 Rezumely
                    </div>
                    <div className="flex items-center gap-4 sm:gap-5">
                        <Link to="/blog" className="hover:text-slate-800 transition-colors">Blog</Link>
                        <Link to="/privacy-policy" className="hover:text-slate-800 transition-colors">Privacy</Link>
                        <Link to="/terms-of-service" className="hover:text-slate-800 transition-colors">Terms</Link>
                        <Link to="/editor" className="font-semibold hover:opacity-80 transition-opacity"
                            style={{ color: 'hsl(217 91% 45%)' }}>
                            Build Resume →
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};
