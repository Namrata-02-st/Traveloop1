import { Trash2 } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function PackingItem({ item, onToggle, onDelete }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
      <input type="checkbox" checked={item.is_packed} onChange={onToggle} className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
      <span className={`flex-1 text-sm font-medium ${item.is_packed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{item.name}</span>
      <Badge>{item.category}</Badge>
      <Button variant="ghost" size="sm" onClick={onDelete} aria-label="Delete item">
        <Trash2 className="h-4 w-4 text-danger" />
      </Button>
    </div>
  );
}
