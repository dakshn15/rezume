import { ExportSettings } from '@/store/settingsStore';

export interface ExportProgress {
  status: 'preparing' | 'rendering' | 'generating' | 'complete' | 'error';
  progress: number;
  message: string;
}

const linkifyPlainText = (root: HTMLElement, documentClone: Document) => {
  const urlPattern = /((?:https?:\/\/|www\.)[^\s<>]+|(?:[\w-]+\.)+(?:com|dev|io|org|net|co|ai|in)(?:\/[^\s<>]*)?|[\w.+-]+@[\w-]+\.[\w.-]+)/gi;
  const walker = documentClone.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.parentElement?.closest('a') || !urlPattern.test(node.data)) continue;
    urlPattern.lastIndex = 0;
    textNodes.push(node);
  }

  textNodes.forEach((node) => {
    const fragment = documentClone.createDocumentFragment();
    let previousIndex = 0;
    node.data.replace(urlPattern, (match: string, _capture: string, offset: number) => {
      fragment.append(node.data.slice(previousIndex, offset));
      const link = documentClone.createElement('a');
      link.href = match.includes('@') ? `mailto:${match}` : (match.startsWith('http') ? match : `https://${match}`);
      link.textContent = match;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.color = 'inherit';
      link.style.textDecoration = 'inherit';
      fragment.append(link);
      previousIndex = offset + match.length;
      return match;
    });
    fragment.append(node.data.slice(previousIndex));
    node.replaceWith(fragment);
  });
};

/**
 * Opens the browser's native PDF print flow for an unscaled copy of the resume.
 *
 * The editor preview is deliberately scaled with CSS transforms. Capturing that
 * node with html2canvas made the exported layout depend on the current viewport
 * and converted all content into one oversized image. Printing an isolated,
 * paper-sized document uses the browser's layout engine instead, which preserves
 * the same flex/grid structure, SVG icons, backgrounds and page-break rules.
 */
export const exportToPDF = async (
  element: HTMLElement,
  filename: string,
  settings: ExportSettings,
  onProgress?: (progress: ExportProgress) => void
): Promise<void> => {
  let frame: HTMLIFrameElement | undefined;
  const originalDocumentTitle = document.title;

  try {
    onProgress?.({ status: 'preparing', progress: 15, message: 'Preparing print-quality resume...' });

    frame = document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true');
    frame.style.cssText = [
      'position: fixed',
      'width: 210mm',
      'height: 297mm',
      'left: -10000px',
      'top: 0',
      'border: 0',
      'pointer-events: none',
    ].join(';');
    document.body.appendChild(frame);

    const printDocument = frame.contentDocument;
    const printWindow = frame.contentWindow;
    if (!printDocument || !printWindow) throw new Error('Could not create the print document');

    // Vite puts application CSS in style tags in development and stylesheet links
    // in production. Copy both so the export always receives the exact template CSS.
    const applicationStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((node) => node.outerHTML)
      .join('\n');
    const paperSize = settings.paperSize === 'letter' ? 'letter' : 'A4';
    const documentTitle = filename.replace(/\.pdf$/i, '');

    // Chromium uses the top-level page title for its default Save as PDF name,
    // even when print() is called from an iframe. Temporarily set it to the
    // resume filename so users do not receive "… — Editor | Rezumely.pdf".
    document.title = documentTitle;

    printDocument.open();
    printDocument.write(`<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${documentTitle}</title>
          ${applicationStyles}
          <style>
            @page { size: ${paperSize}; margin: 0; }
            html, body {
              width: ${settings.paperSize === 'letter' ? '215.9mm' : '210mm'};
              margin: 0 !important;
              padding: 0 !important;
              background: #fff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            #resume-print-root {
              width: ${settings.paperSize === 'letter' ? '215.9mm' : '210mm'};
              margin: 0 !important;
              padding: 0 !important;
              overflow: visible !important;
              transform: none !important;
              box-shadow: none !important;
            }
            #resume-print-root .resume-paper,
            #resume-print-root .resume-template {
              margin: 0 !important;
              /* A screen-only A4 min-height can spill by a few pixels into a
                 completely blank second printed page. Let print pagination
                 use the real content height instead. */
              min-height: 0 !important;
              transform: none !important;
              box-shadow: none !important;
              border-radius: 0 !important;
            }
          </style>
        </head>
        <body><main id="resume-print-root"></main></body>
      </html>`);
    printDocument.close();

    const clonedResume = element.cloneNode(true) as HTMLElement;
    // Remove editor-only sizing and zoom from the cloned wrapper. The template
    // itself owns its print dimensions, exactly as it does in the live preview.
    clonedResume.style.transform = 'none';
    clonedResume.style.transformOrigin = 'initial';
    clonedResume.style.width = '100%';
    clonedResume.style.minWidth = '0';
    clonedResume.style.maxWidth = 'none';
    clonedResume.style.minHeight = '0';
    const printRoot = printDocument.getElementById('resume-print-root');
    printRoot?.appendChild(clonedResume);
    if (printRoot) linkifyPlainText(printRoot, printDocument);

    await printDocument.fonts.ready;
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    onProgress?.({ status: 'generating', progress: 75, message: 'Opening Save as PDF…' });

    await new Promise<void>((resolve) => {
      const finish = () => {
        printWindow.removeEventListener('afterprint', finish);
        resolve();
      };
      printWindow.addEventListener('afterprint', finish, { once: true });
      printWindow.focus();
      printWindow.print();
      // Some browsers do not emit afterprint from an iframe. Do not leave the
      // editor stuck if that happens after the user closes its print dialog.
      window.setTimeout(finish, 1500);
    });

    onProgress?.({ status: 'complete', progress: 100, message: 'PDF print dialog opened.' });
  } catch (error) {
    console.error('PDF Export Error:', error);
    onProgress?.({ status: 'error', progress: 0, message: 'Export failed' });
    throw error;
  } finally {
    document.title = originalDocumentTitle;
    // Keep the frame alive just long enough for Chromium to snapshot its contents.
    window.setTimeout(() => frame?.remove(), 2000);
  }
};
