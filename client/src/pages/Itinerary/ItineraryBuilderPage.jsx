import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { activitiesApi } from '../../api/activities.api';
import { citiesApi } from '../../api/cities.api';
import { stopsApi } from '../../api/stops.api';
import { tripsApi } from '../../api/trips.api';
import ActivityCard from '../../components/itinerary/ActivityCard';
import SortableStop from '../../components/itinerary/SortableStop';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import ImageTile from '../../components/common/ImageTile';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import useDebounce from '../../hooks/useDebounce';
import useTripStore from '../../store/tripStore';
import { ACTIVITY_CATEGORIES, gradientForName } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatRange } from '../../utils/formatDate';
import { resolveImageUrl } from '../../utils/image';
import { showApiError } from '../../utils/errorHandler';

function AddStopModal({ open, trip, onClose, onAdded }) {
  const [search, setSearch] = useState('');
  const [cities, setCities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dates, setDates] = useState({ arrive_date: '', depart_date: '', est_stay_cost: 0 });
  const debounced = useDebounce(search);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        const response = await citiesApi.list({ search: debounced, limit: 8 });
        setCities(response.data.data);
      } catch (err) {
        showApiError(err);
      }
    };
    load();
  }, [debounced, open]);

  const submit = async (event) => {
    event.preventDefault();
    if (!selected) return toast.error('Select a city.');
    if (new Date(dates.arrive_date) < new Date(trip.start_date) || new Date(dates.depart_date) > new Date(trip.end_date)) {
      return toast.error('Stop dates must be within trip dates.');
    }
    try {
      const response = await stopsApi.create(trip.id, { city_id: selected.id, ...dates });
      onAdded(response.data.data);
      onClose();
    } catch (err) {
      showApiError(err);
    }
  };

  return (
    <Modal open={open} title="Add Stop" onClose={onClose}>
      <form className="space-y-4" onSubmit={submit}>
        <Input label="Search city" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tokyo, Paris, Mumbai..." />
        <div className="max-h-48 space-y-2 overflow-y-auto">
          {cities.map((city) => (
            <button key={city.id} type="button" onClick={() => setSelected(city)} className={`w-full rounded-lg border p-3 text-left text-sm ${selected?.id === city.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <ImageTile
                  src={resolveImageUrl(city.image_url)}
                  alt={city.name}
                  className="h-10 w-10 rounded-lg"
                  fallbackClass={`bg-gradient-to-br ${gradientForName(city.name)}`}
                  fallbackText={city.name?.charAt(0)}
                />
                <div>
                  <strong>{city.name}</strong>, {city.country}
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Arrive" type="date" min={trip.start_date} max={trip.end_date} value={dates.arrive_date} onChange={(event) => setDates({ ...dates, arrive_date: event.target.value })} />
          <Input label="Depart" type="date" min={trip.start_date} max={trip.end_date} value={dates.depart_date} onChange={(event) => setDates({ ...dates, depart_date: event.target.value })} />
        </div>
        <Input label="Estimated stay cost" type="number" min="0" value={dates.est_stay_cost} onChange={(event) => setDates({ ...dates, est_stay_cost: event.target.value })} />
        <div className="flex justify-end"><Button type="submit">Add Stop</Button></div>
      </form>
    </Modal>
  );
}

function ActivitySearchModal({ open, stop, onClose, onAdded }) {
  const [category, setCategory] = useState('all');
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!open || !stop) return;
    const load = async () => {
      try {
        const response = await citiesApi.activities(stop.city_id, { category });
        setActivities(response.data.data);
      } catch (err) {
        showApiError(err);
      }
    };
    load();
  }, [open, stop, category]);

  const add = async (activity) => {
    try {
      const response = await activitiesApi.addToStop(stop.id, { city_activity_id: activity.id });
      onAdded(response.data.data);
      toast.success('Activity added.');
    } catch (err) {
      showApiError(err);
    }
  };

  return (
    <Modal open={open} title="Add Activity" onClose={onClose} maxWidth="max-w-2xl">
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {['all', ...ACTIVITY_CATEGORIES].map((item) => (
          <button key={item} className={`rounded-full px-3 py-1.5 text-sm font-semibold capitalize ${category === item ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {activities.map((activity) => (
          <Card key={activity.id}>
            <ActivityCard activity={{ CityActivity: activity }} />
            <Button className="mt-3" size="sm" onClick={() => add(activity)}>Add</Button>
          </Card>
        ))}
      </div>
    </Modal>
  );
}

function CustomActivityModal({ open, stop, onClose, onAdded }) {
  const [form, setForm] = useState({ custom_name: '', custom_cost: 0, custom_duration: 1, scheduled_date: '', scheduled_time: '', notes: '' });

  const submit = async (event) => {
    event.preventDefault();
    try {
      const response = await activitiesApi.addToStop(stop.id, form);
      onAdded(response.data.data);
      setForm({ custom_name: '', custom_cost: 0, custom_duration: 1, scheduled_date: '', scheduled_time: '', notes: '' });
      onClose();
    } catch (err) {
      showApiError(err);
    }
  };

  return (
    <Modal open={open} title="Custom Activity" onClose={onClose}>
      <form className="space-y-4" onSubmit={submit}>
        <Input label="Activity Name" value={form.custom_name} onChange={(event) => setForm({ ...form, custom_name: event.target.value })} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Cost" type="number" min="0" value={form.custom_cost} onChange={(event) => setForm({ ...form, custom_cost: event.target.value })} />
          <Input label="Duration (hours)" type="number" min="0" step="0.5" value={form.custom_duration} onChange={(event) => setForm({ ...form, custom_duration: event.target.value })} />
          <Input label="Scheduled Date" type="date" min={stop?.arrive_date} max={stop?.depart_date} value={form.scheduled_date} onChange={(event) => setForm({ ...form, scheduled_date: event.target.value })} />
          <Input label="Scheduled Time" type="time" value={form.scheduled_time} onChange={(event) => setForm({ ...form, scheduled_time: event.target.value })} />
        </div>
        <textarea className="w-full rounded-lg border-gray-300" rows="3" placeholder="Notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
        <div className="flex justify-end"><Button type="submit">Add Custom Activity</Button></div>
      </form>
    </Modal>
  );
}

export default function ItineraryBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const touchBudget = useTripStore((state) => state.touchBudget);
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [addStopOpen, setAddStopOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  const selectedStop = useMemo(() => stops.find((stop) => stop.id === selectedId) || stops[0], [stops, selectedId]);

  const load = async () => {
    try {
      const [tripResponse, stopsResponse] = await Promise.all([tripsApi.get(id), stopsApi.list(id)]);
      setTrip(tripResponse.data.data);
      setStops(stopsResponse.data.data);
      setSelectedId((current) => current || stopsResponse.data.data[0]?.id || null);
    } catch (err) {
      showApiError(err);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const refreshStopActivities = async () => {
    const response = await stopsApi.list(id);
    setStops(response.data.data);
    touchBudget();
  };

  const dragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = stops.findIndex((stop) => stop.id === active.id);
    const newIndex = stops.findIndex((stop) => stop.id === over.id);
    const reordered = arrayMove(stops, oldIndex, newIndex);
    setStops(reordered);
    try {
      await stopsApi.reorder(id, reordered.map((stop) => stop.id));
    } catch (err) {
      showApiError(err);
      load();
    }
  };

  if (!trip) return <Card>Loading itinerary builder...</Card>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-950">Itinerary Builder</h1>
          <p className="text-sm text-gray-600">{trip.title} · {formatRange(trip.start_date, trip.end_date)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate(`/trips/${id}`)}>Trip Detail</Button>
          <Button onClick={() => navigate(`/trips/${id}/view`)}>View Itinerary</Button>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-950">Stops</h2>
            <Button size="sm" onClick={() => setAddStopOpen(true)}><Plus className="h-4 w-4" />Add Stop</Button>
          </div>
          {stops.length ? (
            <DndContext sensors={sensors} onDragEnd={dragEnd}>
              <SortableContext items={stops.map((stop) => stop.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {stops.map((stop) => (
                    <SortableStop key={stop.id} stop={stop} active={selectedStop?.id === stop.id} onClick={() => setSelectedId(stop.id)} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <EmptyState title="No stops yet" description="Add the first city to start building your itinerary." actionLabel="Add Stop" onAction={() => setAddStopOpen(true)} />
          )}
        </Card>
        <Card>
          {selectedStop ? (
            <div>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-950">{selectedStop.City?.name}</h2>
                  <p className="text-sm text-gray-600">{formatRange(selectedStop.arrive_date, selectedStop.depart_date)} · stay {formatCurrency(selectedStop.est_stay_cost, trip.currency)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setCustomOpen(true)}>Custom Activity</Button>
                  <Button onClick={() => setActivityOpen(true)}>Add Activity</Button>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {(selectedStop.StopActivities || []).map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    currency={trip.currency}
                    editable
                    onDelete={async () => {
                      try {
                        await activitiesApi.removeFromStop(selectedStop.id, activity.id);
                        await refreshStopActivities();
                      } catch (err) {
                        showApiError(err);
                      }
                    }}
                    onUpdate={async (payload) => {
                      try {
                        await activitiesApi.updateForStop(selectedStop.id, activity.id, payload);
                        await refreshStopActivities();
                      } catch (err) {
                        showApiError(err);
                      }
                    }}
                  />
                ))}
                {!selectedStop.StopActivities?.length && <EmptyState title="No activities for this stop" description="Add seeded recommendations or create your own custom plan." />}
              </div>
            </div>
          ) : (
            <EmptyState title="Select a stop" description="Choose or add a city to manage its activities." />
          )}
        </Card>
      </div>
      <AddStopModal open={addStopOpen} trip={trip} onClose={() => setAddStopOpen(false)} onAdded={(stop) => { setStops((items) => [...items, stop]); setSelectedId(stop.id); }} />
      <ActivitySearchModal open={activityOpen} stop={selectedStop} onClose={() => setActivityOpen(false)} onAdded={refreshStopActivities} />
      {selectedStop && <CustomActivityModal open={customOpen} stop={selectedStop} onClose={() => setCustomOpen(false)} onAdded={refreshStopActivities} />}
    </div>
  );
}
