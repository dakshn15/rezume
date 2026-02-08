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
    onProgress?.({ status: 'preparing', progress: 5, message: 'Preparing document...' });

    const paperSizes: Record<string, { width: number; height: number }> = {
      a4: { width: 210, height: 297 },
      letter: { width: 215.9, height: 279.4 },
    };

    const size = paperSizes[settings.paperSize] || paperSizes.a4;
    const mmToPx = 96 / 25.4;

    // scale for html2canvas rendering
    const scale = settings.quality === 'high' ? 2.5 : 1.5;

    onProgress?.({ status: 'rendering', progress: 20, message: 'Cloning content and preparing print frame...' });

    // Clone element and prepare off-screen iframe so styles are preserved
    // Prefer to clone the actual template content (first child) to avoid wrapper styles
    const sourceElement = (element.firstElementChild as HTMLElement) || element;
    const clonedElement = sourceElement.cloneNode(true) as HTMLElement;
    // Reset layout-affecting inline styles
    clonedElement.style.transform = 'none';
    clonedElement.style.margin = '0';
    clonedElement.style.padding = '0';
    clonedElement.style.background = '#ffffff';
    clonedElement.style.width = `${Math.round(size.width * mmToPx)}px`;
    // Force minimum page height so content starts at top and fits to A4/Letter
    clonedElement.style.minHeight = `${Math.round(size.height * mmToPx)}px`;
    clonedElement.style.boxSizing = 'border-box';
    clonedElement.style.position = 'relative';
    clonedElement.style.top = '0';
    // Remove rounded corners / shadows that may come from preview wrapper
    clonedElement.style.borderRadius = '0';
    clonedElement.style.boxShadow = 'none';

    if (settings.colorMode === 'bw') {
      clonedElement.style.filter = 'grayscale(100%)';
    }

    if (!settings.includePhoto) {
      clonedElement.querySelectorAll('[data-photo]').forEach((p) => p.remove());
    }

    // Remove link styles on anchors
    clonedElement.querySelectorAll('a').forEach((l) => {
      (l as HTMLElement).style.textDecoration = 'none';
      (l as HTMLElement).style.color = 'inherit';
    });

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = `${Math.round(size.width * mmToPx)}px`;
    iframe.style.height = 'auto';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const idoc = iframe.contentDocument as Document;
    const iwin = iframe.contentWindow as Window;

    // Copy styles and links into iframe head
    Array.from(document.head.childNodes).forEach((node) => {
      if (
        node.nodeName === 'STYLE' ||
        (node.nodeName === 'LINK' && (node as HTMLLinkElement).rel === 'stylesheet')
      ) {
        idoc.head.appendChild(node.cloneNode(true));
      }
    });

    const style = idoc.createElement('style');
    style.textContent = `
      html, body { margin: 0; padding: 0; background: #fff; height: auto; }
      * { box-sizing: border-box; }
      img { max-width: 100%; height: auto; }
      @page { margin: 0; size: ${size.width}mm ${size.height}mm; }
      * { -webkit-print-color-adjust: exact; color-adjust: exact; }
      /* Remove rounded corners and shadows inside PDF output */
      #pdf-root, #pdf-root * { border-radius: 0 !important; -webkit-border-radius: 0 !important; box-shadow: none !important; }
      body { -webkit-print-color-adjust: exact; }
    `;
    idoc.head.appendChild(style);

    // Wrap cloned content in a root container so we can scope PDF-only styles
    const wrapper = idoc.createElement('div');
    wrapper.id = 'pdf-root';
    wrapper.style.margin = '0';
    wrapper.style.padding = '0';
    wrapper.style.width = `${Math.round(size.width * mmToPx)}px`;
    wrapper.appendChild(clonedElement);
    idoc.body.appendChild(wrapper);

    // Give fonts and resources some time to load
    try {
      await (iwin as any).document.fonts.ready;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));

    onProgress?.({ status: 'rendering', progress: 45, message: 'Rendering content...' });

    const renderTarget = idoc.getElementById('pdf-root') as HTMLElement || idoc.body.firstElementChild as HTMLElement;

    // Dynamic import to avoid type/build issues if the package isn't installed
    const html2pdfModule = await import('html2pdf.js').catch((e) => null) as any;
    const html2pdf = html2pdfModule?.default || html2pdfModule;
    if (!html2pdf) {
      throw new Error('html2pdf.js is not installed. Please install html2pdf.js to enable PDF export.');
    }

    onProgress?.({ status: 'generating', progress: 60, message: 'Generating PDF (html2pdf)...' });

    const opt = {
      margin: 0,
      filename,
      image: { type: 'png', quality: 1 },
      html2canvas: {
        scale,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: Math.round(size.width * mmToPx),
        // prefer scrollHeight to capture full content and ensure canvas aligns to top
        windowHeight: Math.max(renderTarget.scrollHeight || 0, renderTarget.getBoundingClientRect().height || 0, 800),
        scrollX: 0,
        scrollY: 0,
        logging: false,
      },
      jsPDF: { unit: 'mm', format: settings.paperSize, orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
      enableLinks: true,
    };

    // html2pdf does not provide fine-grained progress, so we provide coarse updates
    await new Promise<void>((resolve, reject) => {
      try {
        const worker = html2pdf().from(renderTarget).set(opt);

        // Try to hook internal events if available for slight progress updates
        try {
          const internal = (worker as any).get || (worker as any).outputPdf;
          // no-op; keep for compatibility
        } catch {}

        worker.save().then(() => {
          onProgress?.({ status: 'complete', progress: 100, message: 'PDF ready!' });
          resolve();
        }).catch((err: any) => {
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });

    // cleanup
    try {
      document.body.removeChild(iframe);
    } catch {}

  } catch (error) {
    onProgress?.({ status: 'error', progress: 0, message: 'Export failed' });
    throw error;
  }
};
