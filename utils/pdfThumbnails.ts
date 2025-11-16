let pdfJsInitialized = false;

export async function initializePdfJs() {
  if (typeof window === 'undefined') return null;
  
  const pdfjs = await import('pdfjs-dist');
  
  if (!pdfJsInitialized) {
    // Use the CDN worker directly
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    pdfJsInitialized = true;
  }
  
  return pdfjs;
}

export async function generateThumbnail(
  file: File, 
  pageNumber: number,
  scale: number = 0.3
): Promise<string> {
  if (typeof window === 'undefined') {
    return '';
  }
  
  try {
    const pdfjs = await initializePdfJs();
    if (!pdfjs) return '';
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(pageNumber);
    
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas,
    };
    
    await page.render(renderContext).promise;
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return '';
  }
}

export async function generateAllThumbnails(
  file: File,
  pageCount: number
): Promise<string[]> {
  const thumbnails: string[] = [];
  
  for (let i = 1; i <= pageCount; i++) {
    const thumbnail = await generateThumbnail(file, i);
    thumbnails.push(thumbnail);
  }
  
  return thumbnails;
}