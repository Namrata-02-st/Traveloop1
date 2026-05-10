import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { tripsApi } from '../../api/trips.api';
import Card from '../../components/common/Card';
import TripForm from '../../components/trips/TripForm';
import { showApiError } from '../../utils/errorHandler';

export default function CreateTripPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const createTrip = async (payload) => {
    setLoading(true);
    try {
      const response = await tripsApi.create(payload);
      toast.success('Trip created.');
      navigate(`/trips/${response.data.data.id}/build`);
    } catch (err) {
      showApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-950">Plan New Trip</h1>
        <p className="text-sm text-gray-600">Create the shell of your trip, then add cities and activities.</p>
      </div>
      <Card>
        <TripForm submitLabel="Create Trip" onSubmit={createTrip} loading={loading} />
      </Card>
    </div>
  );
}
