import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FileText, Shield } from 'lucide-react';

const PrivacyPolicy = () => {
    const sections = [
        {
            title: '1. Information We Collect',
            content: [
                {
                    subtitle: 'Account Information',
                    text: 'When you create an account, we collect your name, email address, and a hashed password. We do not store your password in plain text.'
                },
                {
                    subtitle: 'Resume Data',
                    text: 'All resume content you create (work experience, education, skills, etc.) is stored securely in our database and associated with your account. This data is used solely to provide the resume building service to you.'
                },
                {
                    subtitle: 'Usage Data',
                    text: 'We may collect non-personal information about how you interact with Rezumely, such as browser type, pages visited, and time spent, to improve our service.'
                }
            ]
        },
        {
            title: '2. How We Use Your Information',
            content: [
                {
                    subtitle: 'Service Provision',
                    text: 'Your information is primarily used to operate and improve the Rezumely service — including saving your resumes, generating PDF exports, and personalizing your experience.'
                },
                {
                    subtitle: 'Communications',
                    text: 'We may send you transactional emails (e.g., account verification) and, with your consent, product updates or career tips. You can unsubscribe from marketing emails at any time.'
                },
                {
                    subtitle: 'Analytics',
                    text: 'Aggregated, anonymized usage data may be used to understand how users interact with Rezumely so we can improve features and performance.'
                }
            ]
        },
        {
            title: '3. Data Sharing and Disclosure',
            content: [
                {
                    subtitle: 'We Do Not Sell Your Data',
                    text: 'We will never sell, rent, or trade your personal information to third parties for marketing purposes.'
                },
                {
                    subtitle: 'Service Providers',
                    text: 'We may share data with trusted service providers (e.g., cloud hosting, email delivery) who assist in operating our platform, under strict confidentiality agreements.'
                },
                {
                    subtitle: 'Legal Requirements',
                    text: 'We may disclose your information if required to do so by law or in response to a valid legal process (e.g., a court order or government request).'
                }
            ]
        },
        {
            title: '4. Data Security',
            content: [
                {
                    subtitle: 'Encryption',
                    text: 'All data transmitted between your browser and our servers is encrypted using industry-standard TLS (HTTPS). Passwords are hashed and salted using bcrypt.'
                },
                {
                    subtitle: 'Access Controls',
                    text: 'Access to user data is restricted to authorized personnel only and governed by strict internal policies.'
                }
            ]
        },
        {
            title: '5. Your Rights',
            content: [
                {
                    subtitle: 'Access & Portability',
                    text: 'You have the right to request a copy of all personal data we hold about you at any time.'
                },
                {
                    subtitle: 'Deletion',
                    text: 'You may request the deletion of your account and all associated data by contacting us at support@rezumely.com. We will process your request within 30 days.'
                },
                {
                    subtitle: 'Correction',
                    text: 'You can update or correct your personal information directly within your account settings at any time.'
                }
            ]
        },
        {
            title: '6. Cookies',
            content: [
                {
                    subtitle: 'Session Cookies',
                    text: 'We use essential session cookies to keep you logged in. These are deleted when you close your browser.'
                },
                {
                    subtitle: 'Analytics Cookies',
                    text: 'With your consent, we use analytics cookies to understand platform usage. You can disable these through your browser settings or our cookie preference center.'
                }
            ]
        },
        {
            title: '7. Changes to This Policy',
            content: [
                {
                    subtitle: 'Notification',
                    text: 'We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on our website. The "Last Updated" date at the bottom of this page reflects the most recent revision.'
                }
            ]
        },
        {
            title: '8. Contact Us',
            content: [
                {
                    subtitle: 'Get in Touch',
                    text: 'If you have any questions, concerns, or requests regarding this Privacy Policy, please contact our Data Privacy team at privacy@rezumely.com or through our Contact page.'
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen" style={{ background: 'hsl(210 25% 98%)' }}>
            <Helmet>
                <title>Privacy Policy | Rezumely - Resume Builder</title>
                <meta name="description" content="Learn how Rezumely collects, uses, and protects your personal information. Read our full Privacy Policy." />
                <link rel="canonical" href={`${window.location.origin}/privacy-policy`} />
            </Helmet>

            {/* ── Header ── */}
            <header className="sticky top-0 z-40 glass border-b shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 md:py-4 py-3 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo-dark.png" alt="Rezumely" className="h-8 sm:h-9 w-auto object-contain" />
                    </Link>
                    <Link to="/" className="flex items-center gap-1.5 text-sm transition-colors hover:text-slate-800"
                        style={{ color: 'hsl(215 16% 47%)' }}>
                        ← <span className="hidden sm:inline">Back to</span> Home
                    </Link>
                </div>
            </header>

            {/* ── Hero ── */}
            <div style={{ background: 'linear-gradient(135deg, hsl(222 47% 16%) 0%, hsl(217 91% 35%) 100%)' }}>
                <div className="container mx-auto px-4 sm:px-6 lg:py-16 py-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 mb-5 sm:mb-6">
                            <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 text-white">Privacy Policy</h1>
                        <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                            We're committed to protecting your privacy. Here's a clear, plain-English explanation of how we handle your data.
                        </p>
                        <p className="text-white/40 text-xs sm:text-sm mt-3 sm:mt-4">Last Updated: February 25, 2025</p>
                    </motion.div>
                </div>
            </div>

            {/* ── Content ── */}
            <main className="container mx-auto px-4 sm:px-6 lg:py-12 py-8">
                {/* Intro card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8"
                >
                    <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'hsl(215 16% 40%)' }}>
                        This Privacy Policy describes how <strong style={{ color: 'hsl(222 47% 11%)' }}>Rezumely</strong> ("we," "us," or "our") collects, uses, and shares information about you when you use our website and resume-building services. By using Rezumely, you agree to the practices described in this policy.
                    </p>
                </motion.div>

                {/* Sections */}
                <div className="space-y-4 sm:space-y-5">
                    {sections.map((section, i) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                        >
                            {/* Section header */}
                            <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 border-b border-slate-100"
                                style={{ background: 'hsl(217 91% 60% / 0.05)' }}>
                                <h2 className="text-sm sm:text-base md:text-lg font-bold"
                                    style={{ color: 'hsl(222 47% 11%)' }}>{section.title}</h2>
                            </div>
                            <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 space-y-4 sm:space-y-5">
                                {section.content.map((item) => (
                                    <div key={item.subtitle}>
                                        <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'hsl(222 47% 20%)' }}>
                                            {item.subtitle}
                                        </h3>
                                        <p className="text-sm leading-relaxed" style={{ color: 'hsl(215 16% 47%)' }}>
                                            {item.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 sm:mt-10 text-center"
                >
                    <p className="text-sm" style={{ color: 'hsl(215 16% 47%)' }}>
                        Have questions? See our{' '}
                        <Link to="/terms-of-service" className="font-medium hover:underline"
                            style={{ color: 'hsl(217 91% 45%)' }}>Terms of Service</Link>
                        {' '}or{' '}
                        <Link to="/#contact" className="font-medium hover:underline"
                            style={{ color: 'hsl(217 91% 45%)' }}>Contact Us</Link>.
                    </p>
                </motion.div>
            </main>

            {/* ── Footer ── */}
            <footer className="border-t border-slate-200 bg-white mt-6 sm:mt-8">
                <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
                    style={{ color: 'hsl(215 16% 55%)' }}>
                    <div className="flex items-center gap-2">
                        <img src="/logo-dark.png" alt="Rezumely" className="h-5 w-auto object-contain" />
                        © 2025 Rezumely
                    </div>
                    <div className="flex items-center gap-4 sm:gap-5">
                        <Link to="/blog" className="hover:text-slate-800 transition-colors">Blog</Link>
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

export default PrivacyPolicy;
