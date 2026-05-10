import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { activitiesApi } from '../../api/activities.api';
import { stopsApi } from '../../api/stops.api';
import { tripsApi } from '../../api/trips.api';
import ActivityCard from '../../components/itinerary/ActivityCard';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import useDebounce from '../../hooks/useDebounce';
import { ACTIVITY_CATEGORIES } from '../../utils/constants';
import { showApiError } from '../../utils/errorHandler';

export default function ActivitySearchPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: 'all', maxCost: 500, maxDuration: 12 });
  const [activities, setActivities] = useState([]);
  const [trips, setTrips] = useState([]);
  const [stops, setStops] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState('');
  const [selectedStop, setSelectedStop] = useState('');
  const debounced = useDebounce(search);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await activitiesApi.search({ search: debounced, category: filters.category, maxCost: filters.maxCost, maxDuration: filters.maxDuration });
        setActivities(response.data.data);
      } catch (err) {
        showApiError(err);
      }
    };
    load();
  }, [debounced, filters]);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const response = await tripsApi.list({ status: 'planning' });
        setTrips(response.data.data);
      } catch (err) {
        showApiError(err);
      }
    };
    loadTrips();
  }, []);

  const loadStops = async (tripId) => {
    setSelectedTrip(tripId);
    setSelectedStop('');
    try {
      const response = await stopsApi.list(tripId);
      setStops(response.data.data);
    } catch (err) {
      showApiError(err);
    }
  };

  const addToStop = async () => {
    try {
      await activitiesApi.addToStop(selectedStop, { city_activity_id: selectedActivity.id });
      toast.success('Activity added.');
      setSelectedActivity(null);
    } catch (err) {
      showApiError(err);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-950">Activity Search</h1>
        <p className="text-sm text-gray-600">Find seeded experiences and attach them to your stops.</p>
      </div>
      <Card>
        <div className="grid gap-3 lg:grid-cols-[1fr_160px_160px]">
          <Input placeholder="Search activities" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Input type="number" min="0" max="500" value={filters.maxCost} onChange={(event) => setFilters({ ...filters, maxCost: event.target.value })} />
          <Input type="number" min="0" max="12" value={filters.maxDuration} onChange={(event) => setFilters({ ...filters, maxDuration: event.target.value })} />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {['all', ...ACTIVITY_CATEGORIES].map((category) => (
            <button key={category} className={`rounded-full px-3 py-1.5 text-sm font-semibold capitalize ${filters.category === category ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setFilters({ ...filters, category })}>
              {category}
            </button>
          ))}
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {activities.map((activity) => (
          <Card key={activity.id}>
            <ActivityCard activity={{ CityActivity: activity }} />
            <p className="mt-2 text-sm text-gray-500">{activity.City?.name}, {activity.City?.country}</p>
            <Button className="mt-4 w-full" onClick={() => setSelectedActivity(activity)}>Add to Trip</Button>
          </Card>
        ))}
      </div>
      <Modal open={Boolean(selectedActivity)} title="Add activity to stop" onClose={() => setSelectedActivity(null)}>
        <div className="space-y-4">
          <select className="w-full rounded-lg border-gray-300" value={selectedTrip} onChange={(event) => loadStops(event.target.value)}>
            <option value="">Select trip</option>
            {trips.map((trip) => <option key={trip.id} value={trip.id}>{trip.title}</option>)}
          </select>
          <select className="w-full rounded-lg border-gray-300" value={selectedStop} onChange={(event) => setSelectedStop(event.target.value)}>
            <option value="">Select stop</option>
            {stops.map((stop) => <option key={stop.id} value={stop.id}>{stop.City?.name}</option>)}
          </select>
          <Button disabled={!selectedStop} onClick={addToStop}>Add Activity</Button>
        </div>
      </Modal>
    </div>
  );
}
