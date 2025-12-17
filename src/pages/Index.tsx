import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, Palette, Download, Sparkles, ArrowRight, CheckCircle, 
  Mail, Phone, MapPin, Send, Star, Zap, Shield, Clock,
  Linkedin, Twitter, Github
} from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { CustomInput } from '@/components/ui/custom-input';
import { CustomTextarea } from '@/components/ui/custom-textarea';

const Index = () => {
  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Build your resume in minutes with our intuitive editor' },
    { icon: Shield, title: 'ATS-Optimized', description: 'Templates designed to pass applicant tracking systems' },
    { icon: Palette, title: '4 Pro Templates', description: 'Modern, Classic, Minimal, and Creative designs' },
    { icon: Download, title: 'PDF Export', description: 'High-quality PDF downloads ready for applications' },
    { icon: Sparkles, title: 'Real-time Preview', description: 'See changes instantly as you type' },
    { icon: Clock, title: 'Auto-Save', description: 'Never lose your work with automatic saving' },
  ];

  const templates = [
    { 
      id: 'modern', 
      name: 'Modern', 
      description: 'Two-column with sidebar',
      color: '#1e3a5f',
      style: 'bg-gradient-to-br from-[#1e3a5f] to-[#3b82f6]'
    },
    { 
      id: 'classic', 
      name: 'Classic', 
      description: 'Traditional single-column',
      color: '#1f2937',
      style: 'bg-gradient-to-br from-[#1f2937] to-[#4b5563]'
    },
    { 
      id: 'minimal', 
      name: 'Minimal', 
      description: 'Clean & ATS-friendly',
      color: '#6b7280',
      style: 'bg-gradient-to-br from-[#6b7280] to-[#9ca3af]'
    },
    { 
      id: 'creative', 
      name: 'Creative', 
      description: 'Bold & vibrant design',
      color: '#7c3aed',
      style: 'bg-gradient-to-br from-[#7c3aed] to-[#a855f7]'
    },
  ];

  const stats = [
    { value: '50K+', label: 'Resumes Created' },
    { value: '95%', label: 'ATS Pass Rate' },
    { value: '4.9/5', label: 'User Rating' },
    { value: '10min', label: 'Average Build Time' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Software Engineer', text: 'Got 3 interview calls within a week of using my new resume!' },
    { name: 'Michael Chen', role: 'Product Manager', text: 'The ATS optimization feature is a game-changer.' },
    { name: 'Emily Davis', role: 'Marketing Director', text: 'Beautiful templates that actually get results.' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">ResumeBuilder Pro</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Templates</a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </nav>
          <Link to="/editor">
            <CustomButton variant="hero" size="sm">
              Get Started <ArrowRight className="h-4 w-4" />
            </CustomButton>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto text-center max-w-5xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8">
              <Star className="h-4 w-4 fill-current" />
              Free Professional Resume Builder
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight leading-tight">
              Build Your Perfect Resume
              <br />
              <span className="gradient-text">in Minutes</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Create ATS-friendly resumes with our professional templates. Real-time preview, 
              smart suggestions, and instant PDF export.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Link to="/editor">
                <CustomButton variant="hero" size="xl" className="text-lg px-8 py-6">
                  Start Building Free <ArrowRight className="h-5 w-5" />
                </CustomButton>
              </Link>
              <a href="#templates">
                <CustomButton variant="outline" size="xl" className="text-lg px-8 py-6">
                  View Templates
                </CustomButton>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you create the perfect resume
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="section-container card-hover group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section id="templates" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Professional Templates</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Choose from 4 ATS-optimized templates designed for different industries
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {templates.map((template, i) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to="/editor" className="block group">
                  <div className="template-card bg-card overflow-hidden">
                    {/* Template Preview */}
                    <div className={`aspect-[3/4] ${template.style} p-4 relative`}>
                      <div className="absolute inset-0 bg-white/5" />
                      {/* Mini Resume Preview */}
                      <div className="bg-white rounded-lg h-full p-3 shadow-2xl transform group-hover:scale-[1.02] transition-transform">
                        <div className="flex gap-2 h-full">
                          {template.id === 'modern' && (
                            <>
                              <div className="w-1/3 bg-[#1e3a5f] rounded p-2">
                                <div className="w-8 h-8 bg-white/20 rounded-full mb-2 mx-auto" />
                                <div className="space-y-1">
                                  <div className="h-1 bg-white/30 rounded w-full" />
                                  <div className="h-1 bg-white/20 rounded w-3/4" />
                                </div>
                              </div>
                              <div className="flex-1 space-y-2 py-1">
                                <div className="h-2 bg-[#1e3a5f] rounded w-3/4" />
                                <div className="h-1 bg-gray-200 rounded w-1/2" />
                                <div className="mt-3 space-y-1">
                                  <div className="h-1 bg-gray-300 rounded" />
                                  <div className="h-1 bg-gray-200 rounded w-5/6" />
                                  <div className="h-1 bg-gray-200 rounded w-4/6" />
                                </div>
                              </div>
                            </>
                          )}
                          {template.id === 'classic' && (
                            <div className="w-full space-y-2 py-1">
                              <div className="text-center border-b border-gray-200 pb-2">
                                <div className="h-2 bg-gray-800 rounded w-1/2 mx-auto mb-1" />
                                <div className="h-1 bg-gray-400 rounded w-1/3 mx-auto" />
                              </div>
                              <div className="space-y-1">
                                <div className="h-1.5 bg-gray-700 rounded w-1/4" />
                                <div className="h-1 bg-gray-300 rounded" />
                                <div className="h-1 bg-gray-200 rounded w-5/6" />
                              </div>
                            </div>
                          )}
                          {template.id === 'minimal' && (
                            <div className="w-full space-y-3 py-2">
                              <div className="h-2.5 bg-gray-800 rounded w-2/3" />
                              <div className="h-1 bg-gray-300 rounded w-1/2" />
                              <div className="h-px bg-gray-200 my-2" />
                              <div className="space-y-1">
                                <div className="h-1 bg-gray-300 rounded" />
                                <div className="h-1 bg-gray-200 rounded w-5/6" />
                              </div>
                            </div>
                          )}
                          {template.id === 'creative' && (
                            <div className="w-full">
                              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded p-2 mb-2">
                                <div className="h-2 bg-white rounded w-2/3 mb-1" />
                                <div className="h-1 bg-white/60 rounded w-1/2" />
                              </div>
                              <div className="space-y-2 px-1">
                                <div className="flex gap-2">
                                  <div className="w-1 bg-purple-500 rounded" />
                                  <div className="flex-1 space-y-1">
                                    <div className="h-1 bg-gray-300 rounded" />
                                    <div className="h-1 bg-gray-200 rounded w-3/4" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Template Info */}
                    <div className="p-4 bg-card">
                      <h3 className="font-semibold text-foreground text-lg">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <div className="mt-3 flex items-center text-accent text-sm font-medium group-hover:gap-2 transition-all">
                        Use Template <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground">Join thousands who landed their dream jobs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="section-container"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="container mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Land Your Dream Job?</h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-xl mx-auto">
            Join thousands of professionals who've built winning resumes with our builder.
          </p>
          <Link to="/editor">
            <CustomButton variant="secondary" size="xl" className="text-lg px-8 py-6">
              Create Your Resume Now <ArrowRight className="h-5 w-5" />
            </CustomButton>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Have questions or feedback? We'd love to hear from you. 
                Our team is here to help you create the perfect resume.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Email Us</div>
                    <div className="text-muted-foreground">support@resumebuilder.pro</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Call Us</div>
                    <div className="text-muted-foreground">+1 (555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Location</div>
                    <div className="text-muted-foreground">San Francisco, CA</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section-container">
              <h3 className="text-xl font-semibold mb-6">Send us a Message</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <CustomInput label="Name" placeholder="Your name" />
                  <CustomInput label="Email" type="email" placeholder="your@email.com" />
                </div>
                <CustomInput label="Subject" placeholder="How can we help?" />
                <CustomTextarea label="Message" placeholder="Your message..." className="min-h-[120px]" />
                <CustomButton variant="hero" className="w-full">
                  <Send className="h-4 w-4" /> Send Message
                </CustomButton>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg text-foreground">ResumeBuilder Pro</span>
              </Link>
              <p className="text-muted-foreground max-w-md">
                Create professional, ATS-friendly resumes in minutes. Land your dream job with our powerful resume builder.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/editor" className="block text-muted-foreground hover:text-foreground transition-colors">Resume Editor</Link>
                <a href="#templates" className="block text-muted-foreground hover:text-foreground transition-colors">Templates</a>
                <a href="#features" className="block text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#contact" className="block text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 ResumeBuilder Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
