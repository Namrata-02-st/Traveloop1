import { Clock, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import ImageTile from '../common/ImageTile';
import { categoryClasses, gradientForName } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatCurrency';
import { resolveImageUrl } from '../../utils/image';

export default function ActivityCard({ activity, currency = 'USD', editable, onDelete, onUpdate }) {
  const base = activity.CityActivity || {};
  const name = base.name || activity.custom_name || 'Custom activity';
  const category = base.category || 'culture';
  const cost = base.est_cost ?? activity.custom_cost ?? 0;
  const duration = base.est_duration ?? activity.custom_duration;
  const imageUrl = resolveImageUrl(base.image_url || activity.image_url);

  return (
    <div className={`rounded-lg border-l-4 bg-white p-3 shadow-sm ${categoryClasses[category] || categoryClasses.culture}`}>
      <div className="flex items-start gap-3">
        <ImageTile
          src={imageUrl}
          alt={name}
          className="h-14 w-14 rounded-lg"
          fallbackClass={`bg-gradient-to-br ${gradientForName(name)}`}
          fallbackText={name?.charAt(0)}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-semibold text-gray-950">{name}</h4>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <Badge>{category}</Badge>
                {duration && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {duration}h
                  </span>
                )}
                <span>{formatCurrency(cost, currency)}</span>
              </div>
            </div>
            {editable && (
              <Button variant="ghost" size="sm" onClick={onDelete} aria-label="Remove activity">
                <Trash2 className="h-4 w-4 text-danger" />
              </Button>
            )}
          </div>
        </div>
      </div>
      {editable && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <input
            type="date"
            value={activity.scheduled_date || ''}
            className="rounded-lg border-gray-300 text-sm"
            onChange={(event) => onUpdate?.({ scheduled_date: event.target.value })}
          />
          <input
            type="time"
            value={activity.scheduled_time?.slice(0, 5) || ''}
            className="rounded-lg border-gray-300 text-sm"
            onChange={(event) => onUpdate?.({ scheduled_time: event.target.value })}
          />
        </div>
      )}
      {activity.notes && <p className="mt-2 text-sm text-gray-600">{activity.notes}</p>}
    </div>
  );
}
