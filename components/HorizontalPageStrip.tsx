'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortablePageItem, PDFFile } from '@/types/pdf';
import { generateThumbnail } from '@/utils/pdfRenderer';
import { useEffect, useState } from 'react';

interface SortableItemProps {
  page: SortablePageItem;
  onRemove: (id: string) => void;
  displayNumber: number;
  file: PDFFile;
}

function SortableItem({ page, onRemove, displayNumber, file }: SortableItemProps) {
  const [thumbnail, setThumbnail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!thumbnail && !loading) {
      setLoading(true);
      generateThumbnail(file.file, page.pageNumber, 0.3)
        .then((thumb) => {
          if (thumb) {
            setThumbnail(thumb);
          }
        })
        .catch((error) => {
          console.error('Failed to generate thumbnail:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [file.file, page.pageNumber, thumbnail, loading]);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.sortId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group flex-shrink-0"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="bg-white border border-gray-200 rounded-md p-2 cursor-move hover:shadow-lg transition-all w-20 h-28"
      >
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={`Page ${page.pageNumber}`}
            className="w-full h-16 object-contain"
          />
        ) : loading ? (
          <div className="w-full h-16 bg-gray-50 flex items-center justify-center rounded">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
          </div>
        ) : (
          <div className="w-full h-16 bg-gray-50 flex items-center justify-center rounded">
            <span className="text-gray-400 text-xs">{displayNumber}</span>
          </div>
        )}
        <p className="text-xs text-gray-600 text-center font-medium mt-1">
          {displayNumber}
        </p>
      </div>
      <button
        onClick={() => onRemove(page.sortId)}
        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 text-xs leading-none flex items-center justify-center"
      >
        ×
      </button>
    </div>
  );
}

interface HorizontalPageStripProps {
  pages: SortablePageItem[];
  files: Map<string, PDFFile>;
  onPagesReorder: (pages: SortablePageItem[]) => void;
  onPageRemove: (id: string) => void;
}

export default function HorizontalPageStrip({ 
  pages, 
  files,
  onPagesReorder,
  onPageRemove 
}: HorizontalPageStripProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = pages.findIndex((p) => p.sortId === active.id);
      const newIndex = pages.findIndex((p) => p.sortId === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newPages = arrayMove(pages, oldIndex, newIndex);
        onPagesReorder(newPages);
      }
    }
  };

  if (pages.length === 0) return null;

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">
          Page Order ({pages.length} pages)
        </h3>
        <p className="text-xs text-gray-500">
          Drag to reorder
        </p>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={pages.map(p => p.sortId)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-3 overflow-x-auto pb-2">
            {pages.map((page, index) => {
              const file = files.get(page.fileId);
              if (!file) return null;
              
              return (
                <SortableItem 
                  key={page.sortId} 
                  page={page} 
                  file={file}
                  onRemove={onPageRemove}
                  displayNumber={index + 1}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}