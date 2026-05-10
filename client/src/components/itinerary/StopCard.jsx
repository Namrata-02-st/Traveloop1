import { MapPin } from 'lucide-react';
import Badge from '../common/Badge';
import ImageTile from '../common/ImageTile';
import { gradientForName } from '../../utils/constants';
import { formatRange } from '../../utils/formatDate';
import { resolveImageUrl } from '../../utils/image';

export default function StopCard({ stop, active, onClick }) {
  const imageUrl = resolveImageUrl(stop.City?.image_url);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg border p-3 text-left transition ${active ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white hover:border-primary-200'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <ImageTile
            src={imageUrl}
            alt={stop.City?.name || 'City'}
            className="h-12 w-12 rounded-lg"
            fallbackClass={`bg-gradient-to-br ${gradientForName(stop.City?.name || 'City')}`}
            fallbackText={stop.City?.name?.charAt(0)}
          />
          <div>
            <div className="flex items-center gap-2 font-semibold text-gray-950">
              <MapPin className="h-4 w-4 text-primary-600" />
              {stop.City?.name}
            </div>
            <p className="mt-1 text-sm text-gray-500">{stop.City?.country}</p>
            <p className="mt-1 text-sm text-gray-600">{formatRange(stop.arrive_date, stop.depart_date)}</p>
          </div>
        </div>
        <Badge>{stop.StopActivities?.length || 0} acts</Badge>
      </div>
    </button>
  );
}
