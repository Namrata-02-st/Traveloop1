import { eachDayOfInterval, parseISO } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { tripsApi } from '../../api/trips.api';
import Card from '../../components/common/Card';
import ImageTile from '../../components/common/ImageTile';
import DayBlock from '../../components/itinerary/DayBlock';
import ActivityCard from '../../components/itinerary/ActivityCard';
import { gradientForName } from '../../utils/constants';
import { formatRange } from '../../utils/formatDate';
import { resolveImageUrl } from '../../utils/image';
import { showApiError } from '../../utils/errorHandler';

export default function ItineraryViewPage({ embeddedTrip, readOnlyTrip }) {
  const { id } = useParams();
  const [trip, setTrip] = useState(embeddedTrip || readOnlyTrip || null);
  const [mode, setMode] = useState('timeline');

  useEffect(() => {
    if (embeddedTrip || readOnlyTrip || !id) return;
    const load = async () => {
      try {
        const response = await tripsApi.get(id);
        setTrip(response.data.data);
      } catch (err) {
        showApiError(err);
      }
    };
    load();
  }, [id, embeddedTrip, readOnlyTrip]);

  useEffect(() => {
    if (embeddedTrip || readOnlyTrip) setTrip(embeddedTrip || readOnlyTrip);
  }, [embeddedTrip, readOnlyTrip]);

  const dayBlocks = useMemo(() => {
    if (!trip?.start_date || !trip?.end_date) return [];
    const days = eachDayOfInterval({ start: parseISO(trip.start_date), end: parseISO(trip.end_date) });
    return days.map((day) => {
      const iso = day.toISOString().slice(0, 10);
      const stop = (trip.Stops || []).find((item) => item.arrive_date <= iso && item.depart_date >= iso);
      const activities = (stop?.StopActivities || []).filter((activity) => !activity.scheduled_date || activity.scheduled_date === iso);
      return { date: day, city: stop?.City?.name || 'Travel day', activities };
    });
  }, [trip]);

  if (!trip) return <Card>Loading itinerary...</Card>;

  return (
    <div className="space-y-5">
      {!embeddedTrip && !readOnlyTrip && (
        <div>
          <h1 className="text-2xl font-bold text-gray-950">{trip.title}</h1>
          <p className="text-sm text-gray-600">{formatRange(trip.start_date, trip.end_date)}</p>
        </div>
      )}
      <div className="no-print flex w-fit rounded-lg bg-white p-1 shadow-sm">
        {['timeline', 'city'].map((item) => (
          <button key={item} onClick={() => setMode(item)} className={`rounded-md px-4 py-2 text-sm font-semibold ${mode === item ? 'bg-primary-600 text-white' : 'text-gray-600'}`}>
            {item === 'timeline' ? 'Timeline' : 'By City'}
          </button>
        ))}
      </div>
      {mode === 'timeline' ? (
        <div className="space-y-4">
          {dayBlocks.map((block) => (
            <DayBlock key={block.date.toISOString()} {...block} currency={trip.currency} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {(trip.Stops || []).map((stop) => (
            <Card key={stop.id}>
              <ImageTile
                src={resolveImageUrl(stop.City?.image_url)}
                alt={stop.City?.name || 'City'}
                className="mb-4 h-28 rounded-xl"
                fallbackClass={`bg-gradient-to-br ${gradientForName(stop.City?.name || 'City')}`}
                fallbackText={stop.City?.name?.charAt(0)}
              />
              <h2 className="text-xl font-bold text-gray-950">{stop.City?.name}</h2>
              <p className="mb-4 text-sm text-gray-600">{formatRange(stop.arrive_date, stop.depart_date)}</p>
              <div className="space-y-3">
                {(stop.StopActivities || []).map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} currency={trip.currency} />
                ))}
                {!stop.StopActivities?.length && <p className="text-sm text-gray-500">No activities added.</p>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
