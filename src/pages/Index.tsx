import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, Palette, Download, Sparkles, ArrowRight, CheckCircle, 
  Mail, Phone, MapPin, Send, Star, Zap, Shield, Clock,
  Linkedin, Twitter, Github, Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { CustomInput } from '@/components/ui/custom-input';
import { CustomTextarea } from '@/components/ui/custom-textarea';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination } from 'swiper/modules';

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      image: '/templates/modern-template.svg'
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional single-column',
      color: '#1f2937',
      image: '/templates/classic-template.svg'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean & ATS-friendly',
      color: '#6b7280',
      image: '/templates/minimal-template.svg'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Bold & vibrant design',
      color: '#7c3aed',
      image: '/templates/creative-template.svg'
    },
  ];

  const stats = [
    { value: '50K+', label: 'Resumes Created' },
    { value: '95%', label: 'ATS Pass Rate' },
    { value: '4.9/5', label: 'User Rating' },
    { value: '10min', label: 'Average Build Time' },
  ];

  const testimonials = [
    { 
      name: 'Sarah Johnson', 
      role: 'Software Engineer at Google', 
      text: 'Got 3 interview calls within a week of using my new resume! The ATS optimization really works.',
      avatar: 'SJ',
      rating: 5
    },
    { 
      name: 'Michael Chen', 
      role: 'Product Manager at Microsoft', 
      text: 'The templates are incredibly professional and the editor is so intuitive. Landed my dream job!',
      avatar: 'MC',
      rating: 5
    },
    { 
      name: 'Emily Davis', 
      role: 'Marketing Director at Spotify', 
      text: 'Beautiful templates that actually get results. The real-time preview saved me hours of formatting.',
      avatar: 'ED',
      rating: 5
    },
    { 
      name: 'David Rodriguez', 
      role: 'UX Designer at Adobe', 
      text: 'Finally, a resume builder that understands design. The creative template helped me stand out.',
      avatar: 'DR',
      rating: 5
    },
    { 
      name: 'Lisa Wang', 
      role: 'Data Scientist at Netflix', 
      text: 'Clean, professional, and ATS-friendly. Got past the initial screening at 5 different companies.',
      avatar: 'LW',
      rating: 5
    },
    { 
      name: 'James Thompson', 
      role: 'Marketing Manager at Tesla', 
      text: 'The auto-save feature is a lifesaver. Built my entire resume during my lunch breaks.',
      avatar: 'JT',
      rating: 5
    },
  ];

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-50 glass border-b shadow-md">
        <div className="container mx-auto md:py-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">Rezumely</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#templates" className="text-muted-foreground hover:text-foreground transition-colors">Templates</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/editor" className="hidden sm:block">
              <CustomButton variant="primary" size="sm">
                Get Started <ArrowRight />
              </CustomButton>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-foreground hover:text-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass border-t"
          >
            <nav className="container mx-auto px-6 py-4 space-y-4">
              <a
                href="#features"
                className="block text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#templates"
                className="block text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Templates
              </a>
              <a
                href="#testimonials"
                className="block text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className="block text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
              <Link
                to="/editor"
                className="block sm:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <CustomButton variant="primary" size="sm" className="w-full">
                  Get Started <ArrowRight />
                </CustomButton>
              </Link>
            </nav>
          </motion.div>
        )}
      </header>

      {/* Hero */}
      <section className="relative flex items-center justify-center overflow-hidden lg:py-16 py-10">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-secondary/50 dark:from-foreground/5 dark:via-primary/15 dark:to-accent/15" />

          {/* Animated gradient orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 -left-40 w-96 h-96 bg-gradient-to-r from-primary/25 to-accent/35 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.25, 0.35, 0.25],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-gradient-to-r from-accent/25 to-primary/25 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-2xl"
          />
        </div>

        {/* Enhanced Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center lg:mb-12 mb-6"
            >
              {/* Enhanced Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass border border-primary/20 dark:border-accent/30 lg:mb-8 mb-5 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ✨ Effortless Resume Builder
                </span>
              </motion.div>

              {/* Enhanced Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                className="text-4xl sm:text-5xl  md:text-7xl xl:text-8xl font-black mb-6 leading-[1.1] tracking-tight"
              >
                <motion.span
                  className="block text-foreground md:mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Create Your
                </motion.span>
                <motion.span
                  className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  Dream Resume
                </motion.span>
              </motion.h1>

              {/* Enhanced Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="md:text-lg lg:text-xl xl:text-2xl text-muted-foreground mb-5 lg:mb-8 max-w-2xl mx-auto md:leading-relaxed px-4"
              >
                Build professional, ATS-optimized resumes in minutes with our intelligent editor.
                <br className="hidden md:block" />
                <span className="text-accent font-semibold md:mt-2"> Land your dream job faster.</span>
              </motion.p>

              {/* Enhanced CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link to="/editor" className="group">
                  <CustomButton variant="primary" size="lg">
                    Start Building Free
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </CustomButton>
                </Link>
                <a href="#templates" className="group w-full sm:w-auto">
                  <CustomButton
                    variant="outline" size="lg">
                    <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    View Templates
                  </CustomButton>
                </a>
              </motion.div>
            </motion.div>

            {/* Enhanced Interactive Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, i) => (
                <div className="group relative cursor-pointer">
                  {/* Glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />

                  {/* Card */}
                  <div className="relative text-center h-full glass rounded-2xl p-4 lg:p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">

                    <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Enhanced Floating Elements */}
            <div className="absolute top-1/4 left-4 sm:left-8 hidden lg:block pointer-events-none">
              <motion.div
                animate={{
                  y: [-15, 15, -15],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 bg-gradient-to-br from-primary/25 to-accent/25 rounded-2xl rotate-12 backdrop-blur-sm border border-primary/10"
              />
            </div>
            <div className="absolute top-1/3 right-4 sm:right-12 hidden lg:block pointer-events-none">
              <motion.div
                animate={{
                  y: [15, -15, 15],
                  rotate: [0, 180, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full backdrop-blur-sm border border-accent/10"
              />
            </div>
            <div className="absolute bottom-1/3 left-1/4 hidden xl:block pointer-events-none">
              <motion.div
                animate={{
                  y: [-10, 10, -10],
                  rotate: [-5, 5, -5],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg rotate-45 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative lg:py-16 py-10 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto relative z-[1]">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center lg:mb-8 mb-5"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex leading-none items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 md:mb-5 mb-4"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powerful Features</span>
            </motion.div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Professional tools and intelligent features designed to help you create the perfect resume that gets results
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 sm:gap-5 gap-4">
            {features.map((feature, i) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative"
                >
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  {/* Card */}
                  <div className="relative h-full glass rounded-2xl shadow-sm xl:p-8 lg:p-6 p-4 border-border hover:border-primary/30 transition-all duration-300 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl" />

                    {/* Icon Container */}
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative lg:w-16 lg:h-16 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center md:mb-5 mb-4 group-hover:shadow-md transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-xl" />
                      <IconComponent className="lg:h-8 lg:w-8 w-5 h-5 text-primary" />
                    </motion.div>

                    {/* Content */}
                    <div className="relative">
                      <h3 className="text-xl font-semibold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground group-hover:text-black transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center lg:mt-8 mt-6"
          >
            <Link to="/editor" className="group">
              <CustomButton variant="primary">
                Try All Features Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </CustomButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Templates Preview */}
      <section id="templates" className="lg:py-16 py-10 bg-gray-100">
        <div className="container mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center lg:mb-8 mb-5"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex leading-none items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 md:mb-5 mb-4"
            >
              <Palette className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Professional Templates</span>
            </motion.div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 max-w-xl mx-auto">
              Choose Your Perfect Resume Style
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              4 professionally designed, ATS-optimized templates crafted for different industries and career levels.
              Each template is fully customizable and ready to impress.
            </p>
          </motion.div>

          {/* Templates Swiper Slider */}
          <div className="relative">
            <Swiper
              modules={[Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              className="p-4 -m-4"
            >
              {templates.map((template, i) => (
                <SwiperSlide key={template.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="group relative h-full"
                  >

                    <Link to={`/editor?template=${template.id}`} className="block relative h-full">
                      <div className="glass shadow-md rounded-2xl overflow-hidden border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                        {/* Template Preview */}
                        <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-muted/20 to-muted/40">
                          <motion.img
                            src={template.image}
                            alt={`${template.name} template preview`}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="w-full h-full object-cover object-top"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Enhanced Template Info */}
                        <div className="lg:p-5 p-4 bg-card backdrop-blur-sm flex-1 flex flex-col">
                          <div className="flex-1">
                            <h3 className="font-bold text-foreground text-xl mb-1">{template.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                          </div>

                          {/* Features */}
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <CheckCircle className="h-3 w-3 text-success" />
                            <span className="text-xs text-muted-foreground">ATS-Optimized</span>
                            <CheckCircle className="h-3 w-3 text-success" />
                            <span className="text-xs text-muted-foreground">Customizable</span>
                          </div>

                          {/* CTA */}
                          <motion.div
                            whileHover={{ x: 4 }}
                            className="flex items-center text-accent text-sm font-semibold group-hover:text-primary transition-colors duration-300"
                          >
                            Use This Template
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </motion.div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="text-center mt-5"
          >
            <p className="text-muted-foreground mb-4">
              Can't decide? Start with any template and switch anytime during editing.
            </p>
            <Link to="/editor" className="group">
              <CustomButton variant="primary">
                Start Creating Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </CustomButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="lg:py-16 py-10">
        <div className="container mx-auto relative z-[1]">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center lg:mb-8 mb-5"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex leading-none items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 md:mb-5 mb-4"
            >
              <Star className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Success Stories</span>
            </motion.div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Join thousands of professionals who've landed their dream jobs using our resume builder
            </p>
          </motion.div>
          {/* Testimonials Swiper */}
          <div className="relative">
            <Swiper
              modules={[Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              className="p-4 -m-4"
            >
              {testimonials.map((testimonial, i) => (
                <SwiperSlide key={testimonial.name}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group relative h-full"
                  >
                    {/* Card */}
                    <div className="relative h-full glass rounded-2xl shadow-md hover:shadow-lg xl:p-8 lg:p-6 p-4 border-border hover:border-primary/30 transition-all duration-300 overflow-hidden">
                      {/* Background Pattern */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl" />
                      {/* Rating Stars */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex gap-1 md:mb-5 mb-4 relative"
                      >
                        {[...Array(testimonial.rating)].map((_, j) => (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, rotate: -180 }}
                            whileInView={{ opacity: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + j * 0.1, type: "spring" }}
                          >
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          </motion.div>
                        ))}
                      </motion.div>
                      {/* Quote */}
                      <div className="relative md:mb-6 mb-4">
                        <p className="text-foreground leading-relaxed relative z-10 group-hover:text-black transition-colors duration-300">
                          {testimonial.text}
                        </p>
                      </div>
                      {/* User Info */}
                      <div className="flex items-center gap-4 relative">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold text-lg border-2 border-primary/10 group-hover:border-primary/30 transition-all duration-300"
                        >
                          {testimonial.avatar}
                        </motion.div>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center lg:mt-8 mt-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 gap-y-2 sm:gap-8 mb-6">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium text-muted-foreground">4.9/5 from 10,000+ reviews</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">95%</span> of users get interviews within 2 weeks
              </div>
            </div>
            <Link to="/editor" className="group">
              <CustomButton variant="primary">
                Join Success Stories
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </CustomButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative lg:py-16 py-10 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/40 to-accent/40 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-accent/40 to-primary/40 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto text-center relative z-[1]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex leading-none items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 md:mb-5 mb-4"
            >
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Transform Your Career Today</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-white"
            >
              Ready to Land Your
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Dream Job?
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="lg:text-xl text-white/90 lg:mb-10 md:mb-6 mb-5 max-w-[600px] mx-auto leading-relaxed"
            >
              Join <span className="font-bold text-white">50,000+</span> professionals who've built winning resumes.
              Your success story starts in just 10 minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4 justify-center items-center"
            >
              <Link to="/editor" className="group">
                <CustomButton variant="secondary" size="lg">
                  <FileText className="h-5 w-5" />
                  Start Building Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </CustomButton>
              </Link>
              <a href="#templates" className="group">
                <CustomButton variant="outline" size="lg" className='border-white text-white'>
                  <Palette className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  View Templates
                </CustomButton>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="lg:py-16 py-10">

        <div className="container mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center lg:mb-8 mb-5"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex leading-none items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 md:mb-5 mb-4"
            >
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Get in Touch</span>
            </motion.div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
              Have Questions?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're here to help you create the perfect resume. Reach out to our team for support, feedback, or just to say hello.
            </p>
          </motion.div>

          <div className="flex md:flex-row flex-col lg:gap-12 gap-6">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='md:max-w-[40%] w-full'
            >
              <div className="md:space-y-6 space-y-4">
                <div
                  className="flex items-center gap-4 p-4 rounded-2xl glass border-border hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="md:w-14 w-10 md:h-14 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="md:h-6 md:w-6 h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-foreground mb-1">Email Us</div>
                    <div className="text-muted-foreground mb-1">support@rezumely.com</div>
                    <div className="text-xs text-muted-foreground">We reply within 24 hours</div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-4 p-4 rounded-2xl glass border-border hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="md:w-14 w-10 md:h-14 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="md:h-6 md:w-6 h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-foreground mb-1">Call Us</div>
                    <div className="text-muted-foreground mb-1">+1 (555) 123-4567</div>
                    <div className="text-xs text-muted-foreground">Mon-Fri, 9AM-6PM PST</div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-4 p-4 rounded-2xl glass border-border hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="md:w-14 w-10 md:h-14 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="md:h-6 md:w-6 h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-foreground mb-1">Visit Us</div>
                    <div className="text-muted-foreground mb-1">San Francisco, CA</div>
                    <div className="text-xs text-muted-foreground">By appointment only</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass flex-1 rounded-2xl xl:p-8 lg:p-6 p-4 border-border"
            >
              <h3 className="text-xl font-semibold lg:mb-4 mb-3">Send us a Message</h3>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <CustomInput label="Name" placeholder="Your name" />
                  <CustomInput label="Email" type="email" placeholder="your@email.com" />
                </div>
                <CustomInput label="Subject" placeholder="How can we help?" />
                <CustomTextarea label="Message" placeholder="Tell us about your question or feedback..." className="min-h-[120px] resize-none" />
                <CustomButton variant="primary" className="w-full group">
                  <Send className="h-4 w-4" />
                  Send Message
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </CustomButton>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden lg:pt-16 pt-10 pb-5">
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-accent/15 to-primary/15 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto relative z-[1]">
          {/* Main Footer Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-4 sm:grid-cols-2 gap-8 lg:mb-12 sm:mb-6 mb-5"
          >
            {/* Enhanced Brand Section */}
            <div className="sm:col-span-2 md:text-start text-center">
              <div
                className="flex items-center md:justify-start justify-center gap-3 lg:mb-6 mb-5"
              >
                <div className="lg:w-14 w-12 lg:h-14 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <FileText className="lg:h-7 lg:w-7 w-6 h-6 text-white" />
                </div>
                <span className="font-black lg:text-3xl text-2xl text-white">Rezumely</span>
              </div>
              <p className="text-white/80 max-w-md md:mx-0 mx-auto lg:mb-8 mb-5 lg:text-lg">
                Transform your career with professional, ATS-optimized resumes. Join <span className="font-semibold text-white">50,000+</span> professionals who've landed their dream jobs.
              </p>
              <div className="flex md:justify-start justify-center gap-3">
                {[
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Github, href: "#", label: "GitHub" }
                ].map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    className="lg:w-12 w-10 lg:h-12 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all duration-300 group border border-white/10"
                  >
                    <Icon className="lg:h-5 lg:w-5 h-4 w-4 text-white" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h4 className="font-bold text-white mb-6 text-lg">Quick Links</h4>
              <div className="space-y-4">
                {[
                  { to: "/editor", label: "Resume Editor" },
                  { href: "#templates", label: "Templates" },
                  { href: "#features", label: "Features" },
                  { href: "#testimonials", label: "Success Stories" }
                ].map(({ to, href, label }) => (
                  <motion.div key={label}>
                    {to ? (
                      <Link to={to} className="inline-block w-fit text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300">
                        {label}
                      </Link>
                    ) : (
                      <a href={href} className="inline-block w-fit text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300">
                        {label}
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h4 className="font-bold text-white mb-6 text-lg">Support</h4>
              <div className="space-y-4">
                {[
                  { href: "#contact", label: "Contact Us" },
                  { href: "#", label: "Help Center" },
                  { href: "#", label: "Privacy Policy" },
                  { href: "#", label: "Terms of Service" }
                ].map(({ href, label }) => (
                  <motion.div key={label}>
                    <a href={href} className="inline-block w-fit text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300">
                      {label}
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="border-t border-white/10 pt-5 flex flex-col lg:flex-row lg:text-start text-center justify-between items-center gap-2"
          >
            <p className="text-white/60 text-sm">
              © 2025 Rezumely. All rights reserved. Made with ❤️ for job seekers worldwide.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:gap-6 gap-y-2 gap-3 text-sm">
              <span className="flex items-center gap-2 text-white/70">
                <CheckCircle className="h-4 w-4 text-green-400" />
                100% Free to Start
              </span>
              <span className="flex items-center gap-2 text-white/70">
                <Shield className="h-4 w-4 text-blue-400" />
                Secure & Private
              </span>
              <span className="flex items-center gap-2 text-white/70">
                <Clock className="h-4 w-4 text-purple-400" />
                Ready in 10min
              </span>
            </div>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Index;

