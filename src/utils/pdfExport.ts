import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
  try {
    onProgress?.({ status: 'preparing', progress: 10, message: 'Preparing document...' });

    const paperSizes = {
      a4: { width: 210, height: 297 },
      letter: { width: 215.9, height: 279.4 },
    };

    const size = paperSizes[settings.paperSize];
    const scale = settings.quality === 'high' ? 3 : 2;
    const mmToPx = 3.7795275591; // 1mm = 3.78px at 96 DPI

    onProgress?.({ status: 'rendering', progress: 30, message: 'Rendering content...' });

    // Clone element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Reset any transform scale on the cloned element
    clonedElement.style.transform = 'none';
    clonedElement.style.width = `${size.width}mm`;
    clonedElement.style.minHeight = `${size.height}mm`;
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = '-9999px';
    clonedElement.style.top = '0';
    clonedElement.style.background = 'white';
    clonedElement.style.margin = '0';
    clonedElement.style.padding = '0';
    
    // Apply grayscale if black and white mode
    if (settings.colorMode === 'bw') {
      clonedElement.style.filter = 'grayscale(100%)';
    }

    // Remove photo if setting is disabled
    if (!settings.includePhoto) {
      const photos = clonedElement.querySelectorAll('[data-photo]');
      photos.forEach((photo) => photo.remove());
    }

    // Fix any links to be visible
    const links = clonedElement.querySelectorAll('a');
    links.forEach((link) => {
      link.style.textDecoration = 'none';
    });

    document.body.appendChild(clonedElement);

    // Wait for fonts to load
    await document.fonts.ready;
    
    // Small delay to ensure rendering is complete
    await new Promise(resolve => setTimeout(resolve, 100));

    onProgress?.({ status: 'rendering', progress: 50, message: 'Capturing pages...' });

    const canvas = await html2canvas(clonedElement, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: size.width * mmToPx,
      height: clonedElement.scrollHeight,
      windowWidth: size.width * mmToPx,
      windowHeight: size.height * mmToPx,
      onclone: (clonedDoc) => {
        // Ensure all styles are properly applied in the cloned document
        const style = clonedDoc.createElement('style');
        style.textContent = `
          * { box-sizing: border-box; }
          @page { margin: 0; size: ${size.width}mm ${size.height}mm; }
        `;
        clonedDoc.head.appendChild(style);
      }
    });

    document.body.removeChild(clonedElement);

    onProgress?.({ status: 'generating', progress: 70, message: 'Generating PDF...' });

    const imgWidth = size.width;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageHeight = size.height;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: settings.paperSize,
      compress: true,
    });

    // Add metadata
    pdf.setProperties({
      title: filename.replace('.pdf', ''),
      creator: 'Resume Builder Pro',
      subject: 'Professional Resume',
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    
    let heightLeft = imgHeight;
    let position = 0;
    let pageNum = 0;

    // Add pages
    while (heightLeft > 0) {
      if (pageNum > 0) {
        pdf.addPage();
      }
      
      // Calculate the portion of the image to show on this page
      const sourceY = pageNum * (pageHeight / imgHeight) * canvas.height;
      const sourceHeight = Math.min(
        (pageHeight / imgHeight) * canvas.height,
        canvas.height - sourceY
      );
      
      // Create a temporary canvas for this page
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sourceHeight;
      const ctx = pageCanvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight,
          0, 0, pageCanvas.width, sourceHeight
        );
        
        const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
        const pageImgHeight = (sourceHeight / canvas.width) * imgWidth;
        
        pdf.addImage(
          pageImgData,
          'PNG',
          0,
          0,
          imgWidth,
          pageImgHeight,
          undefined,
          'FAST'
        );
      }
      
      heightLeft -= pageHeight;
      pageNum++;
    }

    onProgress?.({ status: 'complete', progress: 100, message: 'Download ready!' });

    pdf.save(filename);
  } catch (error) {
    onProgress?.({ status: 'error', progress: 0, message: 'Export failed. Please try again.' });
    throw error;
  }
};
