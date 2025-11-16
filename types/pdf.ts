export interface PDFFile {
  id: string;
  file: File;
  name: string;
  pages: PDFPage[];
  thumbnails: string[];
}

export interface PDFPage {
  id: string;
  fileId: string;
  pageNumber: number;
  thumbnail: string;
}

export interface SortablePageItem extends PDFPage {
  sortId: string;
}
