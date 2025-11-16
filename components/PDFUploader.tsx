'use client';

import { useCallback } from 'react';
import { PDFFile } from '@/types/pdf';

interface PDFUploaderProps {
  onFilesAdded: (files: PDFFile[]) => void;
  compact?: boolean;
}

export default function PDFUploader({ onFilesAdded, compact = false }: PDFUploaderProps) {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'application/pdf'
    );
    
    if (files.length > 0) {
      const pdfFiles: PDFFile[] = files.map(file => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        pages: [],
        thumbnails: []
      }));
      onFilesAdded(pdfFiles);
    }
  }, [onFilesAdded]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type === 'application/pdf'
    );
    
    if (files.length > 0) {
      const pdfFiles: PDFFile[] = files.map(file => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        pages: [],
        thumbnails: []
      }));
      onFilesAdded(pdfFiles);
    }
  }, [onFilesAdded]);

  if (compact) {
    return (
      <div 
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border border-dashed border-gray-300 rounded-md p-3 text-center hover:border-gray-400 transition-colors bg-white"
      >
        <svg 
          className="mx-auto h-6 w-6 text-gray-400 mb-2" 
          stroke="currentColor" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="1.5"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <input
          type="file"
          multiple
          accept="application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="pdf-upload-compact"
        />
        <label
          htmlFor="pdf-upload-compact"
          className="block w-full px-3 py-1.5 bg-gray-900 text-white rounded text-xs font-medium hover:bg-gray-800 cursor-pointer transition-colors"
        >
          Add PDFs
        </label>
      </div>
    );
  }

  return (
    <div 
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors bg-white"
    >
      <svg 
        className="mx-auto h-12 w-12 text-gray-400" 
        stroke="currentColor" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="1.5"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
        />
      </svg>
      <p className="mt-4 text-gray-600">
        Drop PDF files here or click to select
      </p>
      <input
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleFileSelect}
        className="hidden"
        id="pdf-upload"
      />
      <label
        htmlFor="pdf-upload"
        className="mt-4 inline-block px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 cursor-pointer transition-colors text-sm font-medium"
      >
        Select PDFs
      </label>
    </div>
  );
}