import React from 'react';
import { motion } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { useSettingsStore } from '@/store/settingsStore';
import { templateInfo } from '@/data/templateData';
import { CustomButton } from '@/components/ui/custom-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Palette, Check, ArrowLeft, Download, Type, Rows3,
} from 'lucide-react';

const colorPresets = [
  { name: 'Navy', primary: '#1e3a5f', accent: '#3b82f6' },
  { name: 'Emerald', primary: '#064e3b', accent: '#10b981' },
  { name: 'Purple', primary: '#4c1d95', accent: '#8b5cf6' },
  { name: 'Rose', primary: '#9f1239', accent: '#f43f5e' },
  { name: 'Slate', primary: '#1e293b', accent: '#64748b' },
  { name: 'Teal', primary: '#134e4a', accent: '#14b8a6' },
  { name: 'Amber', primary: '#78350f', accent: '#f59e0b' },
  { name: 'Indigo', primary: '#312e81', accent: '#6366f1' },
];

const fontOptions = [
  { name: 'Inter', value: 'Inter', sample: 'Modern & clean' },
  { name: 'Source Serif', value: 'Source Serif 4', sample: 'Elegant serif' },
  { name: 'Playfair', value: 'Playfair Display', sample: 'Classic display' },
  { name: 'JetBrains Mono', value: 'JetBrains Mono', sample: 'Monospace' },
];

interface CustomizeStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export const CustomizeStep: React.FC<CustomizeStepProps> = ({ onNext, onPrev }) => {
  const { currentResume, setTemplate } = useResumeStore();
  const { templateSettings, updateTemplateSettings } = useSettingsStore();

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto lg:p-6 p-4 py-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-pink-500/20 to-orange-500/20">
              <Palette className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <h2 className="sm:text-2xl text-xl font-bold mb-2">Customize Your Resume</h2>
              <p className="text-sm text-muted-foreground">
                Choose a template and personalize the look
              </p>
            </div>
          </div>
        </motion.div>

        {/* ========== TEMPLATE PICKER ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rows3 className="h-5 w-5" />
                Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {templateInfo.map((tmpl) => {
                  const isSelected = currentResume.templateId === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      onClick={() => setTemplate(tmpl.id)}
                      className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        isSelected
                          ? 'border-primary shadow-lg ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50 hover:shadow-md'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="aspect-[1/1.4] bg-muted relative overflow-hidden">
                        <img
                          src={`/thumbnails/${tmpl.id}.png`}
                          alt={tmpl.name}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                            <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                              <Check className="h-5 w-5" />
                            </div>
                          </div>
                        )}
                        {/* Hover overlay */}
                        {!isSelected && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white text-xs font-medium px-3 py-1.5 bg-black/50 rounded-full backdrop-blur-sm">
                              Select
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Name & description */}
                      <div className="p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1.5 mb-0.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: tmpl.color }}
                          />
                          <span className="text-sm font-semibold truncate">{tmpl.name}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          {tmpl.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ========== COLOR THEME ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color Theme
                </CardTitle>
                <button
                  onClick={() => updateTemplateSettings({
                    primaryColor: '#1e3a5f',
                    accentColor: '#3b82f6',
                    secondaryColor: '#3b82f6',
                    fontFamily: 'Inter',
                    fontSize: 'medium',
                  })}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reset to default
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-4 grid-cols-3 gap-3">
                {colorPresets.map((preset) => {
                  const isSelected = templateSettings.primaryColor === preset.primary;
                  return (
                    <button
                      key={preset.name}
                      onClick={() => updateTemplateSettings({
                        primaryColor: preset.primary,
                        accentColor: preset.accent,
                      })}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-transparent hover:border-muted hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex gap-1.5">
                        <div
                          className="w-6 h-6 rounded-full shadow-inner"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="w-6 h-6 rounded-full shadow-inner"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      <span className="text-xs font-medium">{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ========== FONT FAMILY ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Font Family
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {fontOptions.map((font) => {
                  const isSelected = templateSettings.fontFamily === font.value;
                  return (
                    <button
                      key={font.name}
                      onClick={() => updateTemplateSettings({ fontFamily: font.value })}
                      className={`text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-transparent hover:border-muted hover:bg-muted/50'
                      }`}
                      style={{ fontFamily: font.value }}
                    >
                      <span className="text-sm font-semibold block">{font.name}</span>
                      <span className="text-xs text-muted-foreground">{font.sample}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ========== FONT SIZE ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Font Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {(['small', 'medium', 'large'] as const).map((size) => {
                  const isSelected = templateSettings.fontSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => updateTemplateSettings({ fontSize: size })}
                      className={`sm:px-4 sm:py-3 px-2 py-1.5 rounded-xl text-sm capitalize font-medium border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-transparent bg-muted/50 hover:bg-muted'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-between lg:pt-4 lg:pb-8 pb-12 gap-4">
          <CustomButton variant="outline" onClick={onPrev} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back: AI Tools
          </CustomButton>
          <CustomButton variant="primary" onClick={onNext} className="gap-2">
            Next: Finalize
            <Download className="h-4 w-4" />
          </CustomButton>
        </div>
      </div>
    </div>
  );
};
