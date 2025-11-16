export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">About PDFMerge</h3>
            <p className="text-sm text-gray-600">
              A simple, secure tool to merge multiple PDF files into one. 
              All processing happens in your browser - your files never leave your device.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Drag and drop PDF files</li>
              <li>• Reorder pages visually</li>
              <li>• Client-side processing</li>
              <li>• No file size limits</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Privacy First</h3>
            <p className="text-sm text-gray-600">
              Your files are processed entirely in your browser. 
              We don't store, upload, or have access to any of your documents.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} PDFMerge. Built with privacy in mind.
          </p>
        </div>
      </div>
    </footer>
  );
}