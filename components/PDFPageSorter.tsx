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
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortablePageItem } from '@/types/pdf';

interface SortableItemProps {
  page: SortablePageItem;
  onRemove: (id: string) => void;
  displayNumber: number;
  compact?: boolean;
}

function SortableItem({ page, onRemove, displayNumber, compact = false }: SortableItemProps) {
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
      className="relative group flex flex-col items-center justify-center"
    >
      <div 
        {...attributes} 
        {...listeners}
        className={`flex flex-col items-center justify-center w-fit bg-white border border-gray-200 rounded-md cursor-move hover:shadow-lg transition-all ${
          compact ? 'p-1' : 'p-2'
        }`}
      >
        {page.thumbnail ? (
          <img 
            src={page.thumbnail} 
            alt={`Page ${page.pageNumber}`}
            className={`w-full object-contain ${compact ? 'h-40' : 'h-64'}`}
          />
        ) : (
          <div className={`w-full bg-gray-50 flex items-center justify-center rounded ${
            compact ? 'h-40' : 'h-64'
          }`}>
            <span className="text-gray-400 text-xs">Page {displayNumber}</span>
          </div>
        )}
        <p className={`text-xs text-gray-600 text-center font-medium ${
          compact ? 'mt-0.5' : 'mt-1'
        }`}>
          Page {displayNumber}
        </p>
      </div>
      <button
        onClick={() => onRemove(page.sortId)}
        className={`absolute bg-white border border-gray-200 text-gray-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-sm leading-none ${
          compact ? 'top-1 right-1 w-5 h-5' : 'top-2 right-2 w-6 h-6'
        }`}
      >
        ×
      </button>
    </div>
  );
}

interface PDFPageSorterProps {
  pages: SortablePageItem[];
  onPagesReorder: (pages: SortablePageItem[]) => void;
  onPageRemove: (id: string) => void;
  compact?: boolean;
}

export default function PDFPageSorter({ 
  pages, 
  onPagesReorder,
  onPageRemove,
  compact = false
}: PDFPageSorterProps) {
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

  const containerClass = compact 
    ? "bg-white rounded-lg p-3 w-full border border-gray-200 overflow-hidden flex flex-col"
    : "bg-white rounded-lg p-6 min-h-[300px] shadow-sm border border-gray-100";
    
  const gridClass = compact
    ? "grid grid-cols-1 gap-2"
    : "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4";

  return (
    <div className={containerClass}>
      {pages.length === 0 ? (
        <div className={`text-center text-gray-400 ${compact ? 'py-8' : 'py-16'}`}>
          {compact ? 'No pages' : 'Upload PDFs to see pages here'}
        </div>
      ) : (
        <div className={compact ? "flex-1 overflow-y-auto" : ""}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={pages.map(p => p.sortId)}
              strategy={rectSortingStrategy}
            >
              <div className={gridClass}>
                {pages.map((page, index) => (
                  <SortableItem 
                    key={page.sortId} 
                    page={page} 
                    onRemove={onPageRemove}
                    displayNumber={index + 1}
                    compact={compact}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}