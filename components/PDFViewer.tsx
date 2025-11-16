'use client';

import { useEffect, useRef, useState } from 'react';
import { SortablePageItem, PDFFile } from '@/types/pdf';
import { generateHighQualityImage } from '@/utils/pdfRenderer';

interface PDFViewerProps {
  pages: SortablePageItem[];
  files: Map<string, PDFFile>;
  onPageClick?: (pageId: string) => void;
  selectedPageId?: string;
}

export default function PDFViewer({ pages, files, onPageClick, selectedPageId }: PDFViewerProps) {
  const [loadedImages, setLoadedImages] = useState<Map<string, string>>(new Map());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageId = entry.target.getAttribute('data-page-id');
            if (pageId && !loadedImages.has(pageId) && !loadingImages.has(pageId)) {
              loadPageImage(pageId);
            }
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '200px'
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadedImages, loadingImages]);

  const loadPageImage = async (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;
    
    const file = files.get(page.fileId);
    if (!file) return;

    setLoadingImages(prev => new Set(prev).add(pageId));
    
    try {
      const highQualityImage = await generateHighQualityImage(file.file, page.pageNumber, 1.5);
      if (highQualityImage) {
        setLoadedImages(prev => new Map(prev).set(pageId, highQualityImage));
      }
    } catch (error) {
      console.error('Failed to load page image:', error);
    } finally {
      setLoadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(pageId);
        return newSet;
      });
    }
  };

  const handlePageRef = (element: HTMLDivElement | null, pageId: string) => {
    if (observerRef.current && element) {
      observerRef.current.observe(element);
    }
  };

  if (pages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-lg">No PDF pages to display</p>
          <p className="text-sm">Upload PDFs to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {pages.map((page, index) => (
          <div
            key={page.sortId}
            ref={(el) => handlePageRef(el, page.id)}
            data-page-id={page.id}
            className={`relative bg-white rounded-lg shadow-sm border transition-all duration-200 ${
              selectedPageId === page.id 
                ? 'border-blue-500 shadow-lg' 
                : 'border-gray-200 hover:shadow-md'
            } ${onPageClick ? 'cursor-pointer' : ''}`}
            onClick={() => onPageClick?.(page.id)}
          >
            {/* Page number indicator */}
            <div className="absolute top-4 left-4 bg-gray-900 text-white px-3 py-1 rounded-md text-sm font-medium z-10">
              Page {index + 1}
            </div>

            {/* Page content */}
            <div className="p-6">
              {loadedImages.has(page.id) ? (
                <img
                  src={loadedImages.get(page.id)}
                  alt={`Page ${index + 1}`}
                  className="w-full h-auto max-h-[800px] object-contain mx-auto"
                />
              ) : loadingImages.has(page.id) ? (
                <div className="w-full h-96 bg-gray-50 flex items-center justify-center rounded">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-gray-400">Loading page {index + 1}...</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-50 flex items-center justify-center rounded">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2 text-gray-400">Page {index + 1}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}