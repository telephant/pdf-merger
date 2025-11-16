'use client';

import { PDFFile } from '@/types/pdf';
import FileList from './FileList';
import PDFUploader from './PDFUploader';

interface RightSidebarProps {
  files: Map<string, PDFFile>;
  onRemoveFile: (fileId: string) => void;
  onFilesAdded: (files: PDFFile[]) => void;
  isProcessing: boolean;
  onMerge: () => void;
  onClear: () => void;
  hasPages: boolean;
}

export default function RightSidebar({
  files,
  onRemoveFile,
  onFilesAdded,
  isProcessing,
  onMerge,
  onClear,
  hasPages
}: RightSidebarProps) {
  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Add More Files */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Add More Files</h3>
        <PDFUploader onFilesAdded={onFilesAdded} compact />
      </div>
      
      {/* File List */}
      <FileList files={files} onRemoveFile={onRemoveFile} />
      
      {/* Action Buttons */}
      {hasPages && (
        <div className="space-y-2">
          <button
            onClick={onMerge}
            disabled={isProcessing}
            className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            {isProcessing ? 'Processing...' : 'Merge PDFs'}
          </button>
          
          <button
            onClick={onClear}
            className="w-full px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors border border-gray-300 font-medium text-sm"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}