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
  { name: 'Inter', value: 'Inter, system-ui, sans-serif', sample: 'Modern & clean' },
  { name: 'Source Serif', value: '"Source Serif 4", Georgia, serif', sample: 'Elegant serif' },
  { name: 'Playfair', value: '"Playfair Display", Georgia, serif', sample: 'Classic display' },
  { name: 'JetBrains Mono', value: '"JetBrains Mono", "Courier New", monospace', sample: 'Technical mono' },
  { name: 'Arial', value: 'Arial, Helvetica, sans-serif', sample: 'Simple & familiar' },
  { name: 'Georgia', value: 'Georgia, "Times New Roman", serif', sample: 'Traditional serif' },
];

const fontSizeOptions = [
  { value: 'xs', label: 'Extra small', detail: 'Most compact' },
  { value: 'small', label: 'Small', detail: 'Compact' },
  { value: 'medium', label: 'Medium', detail: 'Recommended' },
  { value: 'large', label: 'Large', detail: 'Easy to read' },
  { value: 'xl', label: 'Extra large', detail: 'Maximum readability' },
] as const;

interface CustomizeStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export const CustomizeStep: React.FC<CustomizeStepProps> = ({ onNext, onPrev }) => {
  const { currentResume, setTemplate, updateResumeTemplateSettings } = useResumeStore();
  const { templateSettings: globalTemplateSettings, updateTemplateSettings: updateGlobalTemplateSettings } = useSettingsStore();
  const templateSettings = { ...globalTemplateSettings, ...currentResume.templateSettings };
  const updateTemplateSettings = (settings: Partial<typeof globalTemplateSettings>) => {
    updateGlobalTemplateSettings(settings);
    updateResumeTemplateSettings(settings);
  };

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
                    fontFamily: 'Inter, system-ui, sans-serif',
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
              <div className="grid sm:grid-cols-2 gap-3 mt-5 pt-5 border-t">
                <label className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2.5 cursor-pointer">
                  <input
                    aria-label="Custom primary color"
                    type="color"
                    value={templateSettings.primaryColor}
                    onChange={(event) => updateTemplateSettings({ primaryColor: event.target.value })}
                    className="h-9 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <span>
                    <span className="block text-sm font-medium">Primary color</span>
                    <span className="block text-xs text-muted-foreground">{templateSettings.primaryColor.toUpperCase()}</span>
                  </span>
                </label>
                <label className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2.5 cursor-pointer">
                  <input
                    aria-label="Custom accent color"
                    type="color"
                    value={templateSettings.accentColor}
                    onChange={(event) => updateTemplateSettings({ accentColor: event.target.value, secondaryColor: event.target.value })}
                    className="h-9 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <span>
                    <span className="block text-sm font-medium">Accent color</span>
                    <span className="block text-xs text-muted-foreground">{templateSettings.accentColor.toUpperCase()}</span>
                  </span>
                </label>
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
              <div className="grid sm:grid-cols-3 grid-cols-2 gap-3">
                {fontOptions.map((font) => {
                  const isSelected = templateSettings.fontFamily === font.value ||
                    (font.name === 'Inter' && templateSettings.fontFamily === 'Inter');
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
              <div className="grid sm:grid-cols-5 grid-cols-2 gap-3">
                {fontSizeOptions.map((size) => {
                  const isSelected = templateSettings.fontSize === size.value;
                  return (
                    <button
                      key={size.value}
                      onClick={() => updateTemplateSettings({ fontSize: size.value })}
                      className={`px-3 py-3 rounded-xl text-left border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-transparent bg-muted/50 hover:bg-muted'
                      }`}
                    >
                      <span className="block text-sm font-semibold">{size.label}</span>
                      <span className="block text-[11px] text-muted-foreground mt-0.5">{size.detail}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Medium is balanced for a one-page resume. Larger sizes can create additional pages when content is long.
              </p>
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
