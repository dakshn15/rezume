import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FileText, Scale } from 'lucide-react';

const TermsOfService = () => {
    const sections = [
        {
            title: '1. Acceptance of Terms',
            content: [
                {
                    subtitle: 'Agreement',
                    text: 'By accessing or using Rezumely ("the Service"), you confirm that you are at least 16 years old, have read and understood these Terms of Service, and agree to be bound by them. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these terms.'
                }
            ]
        },
        {
            title: '2. Description of Service',
            content: [
                {
                    subtitle: 'What We Provide',
                    text: 'Rezumely is an online resume building platform that allows users to create, edit, and export professional resumes using our provided templates, editors, and AI-assisted tools.'
                },
                {
                    subtitle: 'Service Changes',
                    text: 'We reserve the right to modify, suspend, or discontinue any part of the Service at any time. We will make reasonable efforts to notify you of major changes in advance.'
                }
            ]
        },
        {
            title: '3. User Accounts',
            content: [
                {
                    subtitle: 'Account Responsibility',
                    text: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.'
                },
                {
                    subtitle: 'Accurate Information',
                    text: 'You agree to provide accurate, current, and complete information during registration and to keep your profile information up to date.'
                },
                {
                    subtitle: 'Account Termination',
                    text: 'We reserve the right to suspend or terminate your account if you violate these terms, engage in fraudulent activity, or use the Service in a way that disrupts other users.'
                }
            ]
        },
        {
            title: '4. Acceptable Use',
            content: [
                {
                    subtitle: 'Permitted Use',
                    text: 'You may use Rezumely only for lawful purposes and in accordance with these Terms. The Service is intended for personal, non-commercial use in creating professional resumes.'
                },
                {
                    subtitle: 'Prohibited Activities',
                    text: 'You agree not to: (a) use the Service to transmit unlawful, harmful, or abusive content; (b) attempt to gain unauthorized access to the Service or its systems; (c) use automated tools to scrape or extract data; (d) resell or redistribute the Service without prior written consent; or (e) impersonate any person or entity.'
                }
            ]
        },
        {
            title: '5. Intellectual Property',
            content: [
                {
                    subtitle: 'Our Content',
                    text: 'The Rezumely platform, including its design, templates, code, and trademarks, is owned by Rezumely and is protected by applicable intellectual property laws. You may not copy, modify, or distribute our proprietary content without explicit written permission.'
                },
                {
                    subtitle: 'Your Content',
                    text: 'You retain full ownership of all resume content you create on Rezumely. By using our Service, you grant us a limited, non-exclusive license to store, process, and display your content solely for the purpose of providing the Service to you.'
                }
            ]
        },
        {
            title: '6. Data and Privacy',
            content: [
                {
                    subtitle: 'Privacy Policy',
                    text: 'Your use of Rezumely is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our data practices.'
                }
            ]
        },
        {
            title: '7. Disclaimers and Limitation of Liability',
            content: [
                {
                    subtitle: 'No Guarantees',
                    text: 'Rezumely is provided on an "as is" and "as available" basis. We do not guarantee that using Rezumely will result in job interviews, employment, or any specific career outcome.'
                },
                {
                    subtitle: 'Limitation of Liability',
                    text: 'To the fullest extent permitted by law, Rezumely shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Service.'
                }
            ]
        },
        {
            title: '8. Indemnification',
            content: [
                {
                    subtitle: 'Your Responsibility',
                    text: "You agree to indemnify and hold harmless Rezumely, its officers, directors, employees, and agents from any claims, damages, or expenses (including reasonable attorneys' fees) arising from your violation of these Terms or your use of the Service."
                }
            ]
        },
        {
            title: '9. Governing Law',
            content: [
                {
                    subtitle: 'Jurisdiction',
                    text: 'These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in San Francisco County, California.'
                }
            ]
        },
        {
            title: '10. Changes to Terms',
            content: [
                {
                    subtitle: 'Updates',
                    text: "We may revise these Terms of Service at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms."
                }
            ]
        },
        {
            title: '11. Contact',
            content: [
                {
                    subtitle: 'Questions',
                    text: 'If you have any questions about these Terms of Service, please contact us at legal@rezumely.com or through our Contact page. We are happy to clarify any concerns you may have.'
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen" style={{ background: 'hsl(210 25% 98%)' }}>
            <Helmet>
                <title>Terms of Service | Rezumely - Resume Builder</title>
                <meta name="description" content="Read the Rezumely Terms of Service. Learn the rules and guidelines for using our free resume builder platform." />
                <link rel="canonical" href={`${window.location.origin}/terms-of-service`} />
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
                            <Scale className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 text-white">Terms of Service</h1>
                        <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                            Please read these terms carefully before using Rezumely. By using our service, you agree to these terms.
                        </p>
                        <p className="text-white/40 text-xs sm:text-sm mt-3 sm:mt-4">Last Updated: February 25, 2025</p>
                    </motion.div>
                </div>
            </div>

            {/* ── Summary Box ── */}
            <div className="container mx-auto px-4 sm:px-6 -mt-5 sm:-mt-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 sm:p-5 md:p-6
                               flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center"
                >
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                        style={{ background: 'hsl(217 91% 60% / 0.1)' }}>
                        <Scale className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: 'hsl(217 91% 45%)' }} />
                    </div>
                    <div>
                        <h2 className="font-bold text-sm sm:text-base mb-1" style={{ color: 'hsl(222 47% 11%)' }}>
                            The Short Version
                        </h2>
                        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'hsl(215 16% 47%)' }}>
                            Use Rezumely for building your resume. Don't misuse the platform or violate others' rights. You own your content; we need a limited license to show it to you. We're not liable for employment outcomes.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* ── Content ── */}
            <main className="container mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-8 sm:pb-12">
                <div className="space-y-4 sm:space-y-5">
                    {sections.map((section, i) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.15 + i * 0.04 }}
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
                        Also see our{' '}
                        <Link to="/privacy-policy" className="font-medium hover:underline"
                            style={{ color: 'hsl(217 91% 45%)' }}>Privacy Policy</Link>
                        {' '}or{' '}
                        <Link to="/#contact" className="font-medium hover:underline"
                            style={{ color: 'hsl(217 91% 45%)' }}>Contact Us</Link>.
                    </p>
                </motion.div>
            </main>

            {/* ── Footer ── */}
            <footer className="border-t border-slate-200 bg-white">
                <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
                    style={{ color: 'hsl(215 16% 55%)' }}>
                    <div className="flex items-center gap-2">
                        <img src="/logo-dark.png" alt="Rezumely" className="h-5 w-auto object-contain" />
                        © 2025 Rezumely
                    </div>
                    <div className="flex items-center gap-4 sm:gap-5">
                        <Link to="/blog" className="hover:text-slate-800 transition-colors">Blog</Link>
                        <Link to="/privacy-policy" className="hover:text-slate-800 transition-colors">Privacy</Link>
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

export default TermsOfService;
