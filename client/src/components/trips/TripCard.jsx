import { CalendarDays, Edit3, Eye, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatRange } from '../../utils/formatDate';
import { SERVER_BASE_URL, gradientForName } from '../../utils/constants';

export default function TripCard({ trip, onView, onEdit, onDelete }) {
  const budget = Number(trip.total_budget || 0);
  const estimated = Number(trip.estimatedCost || 0);
  const progress = budget > 0 ? Math.min(100, Math.round((estimated / budget) * 100)) : 0;
  const cover = trip.cover_url ? `${SERVER_BASE_URL}${trip.cover_url}` : null;

  return (
    <Card className="overflow-hidden p-0">
      <div className={`h-36 bg-gradient-to-br ${gradientForName(trip.title)}`} style={cover ? { backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-1 text-base font-semibold text-gray-950">{trip.title}</h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <CalendarDays className="h-4 w-4" />
              {formatRange(trip.start_date, trip.end_date)}
            </div>
          </div>
          <Badge variant={trip.status}>{trip.status}</Badge>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>{trip.stopCount || trip.Stops?.length || 0} stops</span>
          <span>{formatCurrency(estimated, trip.currency)} est.</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-gray-100">
          <div className={`h-2 rounded-full ${estimated > budget && budget > 0 ? 'bg-danger' : 'bg-accent-500'}`} style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button size="sm" variant="secondary" onClick={onView}>
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button size="sm" variant="ghost" onClick={onEdit} aria-label="Edit trip">
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete} aria-label="Delete trip">
            <Trash2 className="h-4 w-4 text-danger" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
