import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import StopCard from './StopCard';

export default function SortableStop({ stop, active, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: stop.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-stretch gap-2">
      <button className="rounded-lg border border-gray-200 bg-white px-2 text-gray-400" {...attributes} {...listeners} aria-label="Drag stop">
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1">
        <StopCard stop={stop} active={active} onClick={onClick} />
      </div>
    </div>
  );
}
