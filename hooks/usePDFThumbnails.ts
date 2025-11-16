import { useEffect } from 'react';
import { PDFFile, SortablePageItem } from '@/types/pdf';
import { generateThumbnail } from '@/utils/pdfThumbnails';

export function usePDFThumbnails(
  pdfFiles: Map<string, PDFFile>,
  pages: SortablePageItem[],
  onThumbnailGenerated: (pageId: string, thumbnail: string) => void
) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const generateThumbnails = async () => {
      for (const page of pages) {
        if (!page.thumbnail) {
          const file = pdfFiles.get(page.fileId);
          if (file) {
            const thumbnail = await generateThumbnail(file.file, page.pageNumber);
            if (thumbnail) {
              onThumbnailGenerated(page.id, thumbnail);
            }
          }
        }
      }
    };

    generateThumbnails();
  }, [pages, pdfFiles, onThumbnailGenerated]);
}