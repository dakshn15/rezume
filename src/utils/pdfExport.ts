import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ExportSettings } from '@/store/settingsStore';

export interface ExportProgress {
  status: 'preparing' | 'rendering' | 'generating' | 'complete' | 'error';
  progress: number;
  message: string;
}

export const exportToPDF = async (
  element: HTMLElement,
  filename: string,
  settings: ExportSettings,
  onProgress?: (progress: ExportProgress) => void
): Promise<void> => {
  let originalTransform = '';
  let originalBoxShadow = '';
  let originalBorderRadius = '';
  let originalMinHeight = '';

  try {
    onProgress?.({ status: 'preparing', progress: 10, message: 'Preparing document...' });

    // Store original styles to restore them later
    originalTransform = element.style.transform;
    originalBoxShadow = element.style.boxShadow;
    originalBorderRadius = element.style.borderRadius;

    // Remove zoom transform, shadows, and rounded corners for a clean capture at 100% scale
    element.style.transform = 'none';
    element.style.boxShadow = 'none';
    element.style.borderRadius = '0';

    // Force the element to at least A4 height (297mm) before capture so short resumes don't look cut off
    originalMinHeight = element.style.minHeight;
    element.style.minHeight = '297mm';

    // Await all webfonts (like Inter) to fully load so html2canvas doesn't miscalculate fallback font baselines
    await document.fonts.ready;

    // Wait a brief moment for the browser to apply the style changes and any fonts to settle
    await new Promise(resolve => setTimeout(resolve, 300));

    onProgress?.({ status: 'rendering', progress: 40, message: 'Capturing high-quality image...' });

    const rect = element.getBoundingClientRect();

    // Capture the element using html2canvas
    const canvas = await html2canvas(element, {
      scale: 3, // Very high scale for crisp vector-like text
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (documentClone) => {
        const style = documentClone.createElement('style');
        style.innerHTML = `
          .resume-paper {
            border-radius: 0 !important;
            box-shadow: none !important;
            margin: 0 !important;
            transform: none !important;
          }
          * {
            text-rendering: geometricPrecision !important;
            -webkit-font-smoothing: antialiased !important;
          }
        `;
        documentClone.head.appendChild(style);
      }
    });

    onProgress?.({ status: 'generating', progress: 75, message: 'Generating PDF...' });

    const imgData = canvas.toDataURL('image/jpeg', 1.0); // Use JPEG with highest quality
    const pdfWidth = settings.paperSize === 'letter' ? 215.9 : 210;
    const minPdfHeight = settings.paperSize === 'letter' ? 279.4 : 297;

    const canvasRatio = canvas.width / canvas.height;
    const exactHeight = pdfWidth / canvasRatio;

    // By dynamically defining the exact PDF page size matching the canvas constraint,
    // we eliminate all white side-borders and guarantee a perfect 1:1 single-page fit.
    const finalHeight = Math.max(minPdfHeight, exactHeight);

    // Initialize jsPDF with custom dynamic single-page height
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pdfWidth, finalHeight]
    });

    // Fill the exact width, and allow height to naturally scale up to `exactHeight`.
    // The canvas is cleanly painted to the PDF with zero margins!
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, exactHeight);

    pdf.save(filename);

    // Restore original styles
    element.style.transform = originalTransform;
    element.style.boxShadow = originalBoxShadow;
    element.style.borderRadius = originalBorderRadius;
    element.style.minHeight = originalMinHeight;

    onProgress?.({ status: 'complete', progress: 100, message: 'PDF generated successfully!' });

  } catch (error) {
    console.error('PDF Export Error:', error);
    onProgress?.({ status: 'error', progress: 0, message: 'Export failed' });

    // Attempt rapid style restoration on crash
    try {
      element.style.transform = originalTransform;
      element.style.boxShadow = originalBoxShadow;
      element.style.borderRadius = originalBorderRadius;
      if (originalMinHeight) {
        element.style.minHeight = originalMinHeight;
      }
    } catch { }

    throw error;
  }
};
