'use client';
import { PDFDocument } from 'pdf-lib';
import { PDFFile, PDFPage, SortablePageItem } from '@/types/pdf';


export const getPDFJS = async () => {
   const pdfjs = await import("pdfjs-dist/webpack.mjs");

   return pdfjs
};

export async function extractPagesFromPDF(pdfFile: PDFFile): Promise<PDFPage[]> {
  const pdfjs = await getPDFJS();
  const url = URL.createObjectURL(pdfFile.file);
  const loadingTask = pdfjs.getDocument(url);

  try {
    const pdf = await loadingTask.promise;

    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      console.log('📄 Loaded page:', i, page);
      pages.push({
        id: `${pdfFile.id}-page-${i}`,
        fileId: pdfFile.id,
        pageNumber: i,
        thumbnail: ''
      });
    }

    return pages;
  } catch (error) {
    console.error('❌ Failed to extract PDF pages:', error);
    return [];
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function mergePDFs(
  originalFiles: Map<string, PDFFile>,
  sortedPages: SortablePageItem[]
): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();

  for (const item of sortedPages) {
    const pdfFile = originalFiles.get(item.fileId);
    if (!pdfFile) continue;

    const arrayBuffer = await pdfFile.file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    
    const copiedPages = await mergedPdf.copyPages(pdf, [item.pageNumber - 1]);
    mergedPdf.addPage(copiedPages[0]);
  }

  const mergedBytes = await mergedPdf.save();
  return new Blob([new Uint8Array(mergedBytes)], { type: 'application/pdf' });
}