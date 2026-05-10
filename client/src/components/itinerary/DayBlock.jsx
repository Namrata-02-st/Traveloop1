import { formatDate } from '../../utils/formatDate';
import ActivityCard from './ActivityCard';

export default function DayBlock({ date, city, activities, currency }) {
  const scheduled = activities.filter((item) => item.scheduled_time).sort((a, b) => a.scheduled_time.localeCompare(b.scheduled_time));
  const unscheduled = activities.filter((item) => !item.scheduled_time);

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-950">{formatDate(date, 'EEEE, MMM d')}</h3>
        <p className="text-sm text-gray-500">{city}</p>
      </div>
      <div className="space-y-3">
        {[...scheduled, ...unscheduled].map((activity) => (
          <ActivityCard key={activity.id} activity={activity} currency={currency} />
        ))}
        {!activities.length && <p className="text-sm text-gray-500">No activities scheduled.</p>}
      </div>
    </section>
  );
}
