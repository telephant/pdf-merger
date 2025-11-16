'use client';

import { useState, useCallback } from 'react';
import PDFUploader from '@/components/PDFUploader';
import PDFViewer from '@/components/PDFViewer';
import RightSidebar from '@/components/RightSidebar';
import HorizontalPageStrip from '@/components/HorizontalPageStrip';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import { PDFFile, SortablePageItem } from '@/types/pdf';
import { extractPagesFromPDF, mergePDFs } from '@/utils/pdfProcessor';

export default function Home() {
  const [pdfFiles, setPdfFiles] = useState<Map<string, PDFFile>>(new Map());
  const [sortablePages, setSortablePages] = useState<SortablePageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesAdded = useCallback(async (newFiles: PDFFile[]) => {
    setIsProcessing(true);
    
    const updatedFiles = new Map(pdfFiles);
    const newPages: SortablePageItem[] = [];
    
    for (const file of newFiles) {
      try {
        const pages = await extractPagesFromPDF(file);
        file.pages = pages;
        updatedFiles.set(file.id, file);
        
        pages.forEach(page => {
          newPages.push({
            ...page,
            sortId: `${Date.now()}-${Math.random()}`
          });
        });
      } catch (error) {
        console.error('Error processing PDF:', error);
      }
    }
    
    setPdfFiles(updatedFiles);
    setSortablePages([...sortablePages, ...newPages]);
    setIsProcessing(false);
  }, [pdfFiles, sortablePages]);

  const handlePagesReorder = useCallback((pages: SortablePageItem[]) => {
    setSortablePages(pages);
  }, []);

  const handlePageRemove = useCallback((sortId: string) => {
    setSortablePages(sortablePages.filter(page => page.sortId !== sortId));
  }, [sortablePages]);

  const handleFileRemove = useCallback((fileId: string) => {
    const newFiles = new Map(pdfFiles);
    newFiles.delete(fileId);
    setPdfFiles(newFiles);
    setSortablePages(sortablePages.filter(page => page.fileId !== fileId));
  }, [pdfFiles, sortablePages]);

  const handleMerge = useCallback(async () => {
    if (sortablePages.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const mergedPdfBlob = await mergePDFs(pdfFiles, sortablePages);
      const url = URL.createObjectURL(mergedPdfBlob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error merging PDFs:', error);
    }
    
    setIsProcessing(false);
  }, [pdfFiles, sortablePages]);

  const handleClear = useCallback(() => {
    setPdfFiles(new Map());
    setSortablePages([]);
  }, []); // 


  return (
    <>
      {pdfFiles.size === 0 ? (
        <section className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">Merge PDF Files Online</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Combine multiple PDF files easily with our free online PDF merger. No signup, no watermark, just drag and drop your files.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <PDFUploader onFilesAdded={handleFilesAdded} />
            </div>
          </div>
        </section>
      ) : (
        <div className="h-screen flex flex-col">
          {/* Main content area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Horizontal page strip at bottom */}
            <HorizontalPageStrip
              pages={sortablePages}
              files={pdfFiles}
              onPagesReorder={handlePagesReorder}
              onPageRemove={handlePageRemove}
            />
            {/* Main PDF viewer and sidebar */}
            <div className="flex-1 flex min-h-0">
              {/* Main PDF viewer */}
              <div className="flex-1 min-w-0">
                <PDFViewer pages={sortablePages} files={pdfFiles} />
              </div>
              
              {/* Right sidebar */}
              <div className="w-80 border-l border-gray-200 bg-gray-50 p-4">
                <RightSidebar
                  files={pdfFiles}
                  onRemoveFile={handleFileRemove}
                  onFilesAdded={handleFilesAdded}
                  isProcessing={isProcessing}
                  onMerge={handleMerge}
                  onClear={handleClear}
                  hasPages={sortablePages.length > 0}
                />
              </div>
            </div>
            
          </div>
        </div>
      )}
      
      {pdfFiles.size === 0 && (
        <>
          <HowItWorks />
          <Features />
        </>
      )}
    </>
  );
}
