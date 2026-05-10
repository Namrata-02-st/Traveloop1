import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { tripsApi } from '../../api/trips.api';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import TripCard from '../../components/trips/TripCard';
import TripForm from '../../components/trips/TripForm';
import { showApiError } from '../../utils/errorHandler';

export default function MyTripsPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [sort, setSort] = useState('recent');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const loadTrips = async () => {
    try {
      const response = await tripsApi.list({ sort });
      setTrips(response.data.data);
    } catch (err) {
      showApiError(err);
    }
  };

  useEffect(() => {
    loadTrips();
  }, [sort]);

  const deleteTrip = async () => {
    const previous = trips;
    setTrips((items) => items.filter((trip) => trip.id !== deleting.id));
    setDeleting(null);
    try {
      await tripsApi.remove(deleting.id);
      toast.success('Trip deleted.');
    } catch (err) {
      setTrips(previous);
      showApiError(err);
    }
  };

  const updateTrip = async (payload) => {
    try {
      await tripsApi.update(editing.id, payload);
      toast.success('Trip updated.');
      setEditing(null);
      loadTrips();
    } catch (err) {
      showApiError(err);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-950">My Trips</h1>
          <p className="text-sm text-gray-600">Manage every itinerary you are planning.</p>
        </div>
        <div className="flex gap-2">
          <select className="rounded-lg border-gray-300 text-sm" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="recent">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
          <Button onClick={() => navigate('/trips/new')}>Plan Your First Trip</Button>
        </div>
      </div>
      {trips.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onView={() => navigate(`/trips/${trip.id}`)} onEdit={() => setEditing(trip)} onDelete={() => setDeleting(trip)} />
          ))}
        </div>
      ) : (
        <EmptyState title="You haven't planned any trips yet" description="Start with a destination, dates, and a budget. You can add stops and activities next." actionLabel="Plan Your First Trip" onAction={() => navigate('/trips/new')} />
      )}
      <Modal open={Boolean(editing)} title="Edit trip" onClose={() => setEditing(null)}>
        <TripForm initialValues={editing} submitLabel="Update Trip" onSubmit={updateTrip} />
      </Modal>
      <ConfirmDialog open={Boolean(deleting)} title="Delete trip" description={`Delete ${deleting?.title}? This removes stops, notes, budget details, and packing items.`} confirmLabel="Delete" danger onClose={() => setDeleting(null)} onConfirm={deleteTrip} />
    </div>
  );
}
