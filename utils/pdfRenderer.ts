import { initializePdfJs } from './pdfThumbnails';

export async function generateHighQualityImage(
  file: File, 
  pageNumber: number,
  scale: number = 1.5
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
    console.error('Error generating high quality image:', error);
    return '';
  }
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