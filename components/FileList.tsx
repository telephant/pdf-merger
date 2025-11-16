'use client';

import { PDFFile } from '@/types/pdf';

interface FileListProps {
  files: Map<string, PDFFile>;
  onRemoveFile: (fileId: string) => void;
}

export default function FileList({ files, onRemoveFile }: FileListProps) {
  if (files.size === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Uploaded Files</h3>
      <div className="space-y-2">
        {Array.from(files.values()).map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md"
          >
            <div className="flex items-center space-x-3">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">{file.pages.length} pages</p>
              </div>
            </div>
            <button
              onClick={() => onRemoveFile(file.id)}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Remove file"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}