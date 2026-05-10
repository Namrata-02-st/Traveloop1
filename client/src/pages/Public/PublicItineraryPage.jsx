import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { shareApi } from '../../api/share.api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ItineraryViewPage from '../Itinerary/ItineraryViewPage';
import useAuthStore from '../../store/authStore';
import { SERVER_BASE_URL, gradientForName } from '../../utils/constants';
import { formatRange } from '../../utils/formatDate';
import { showApiError } from '../../utils/errorHandler';

export default function PublicItineraryPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [trip, setTrip] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await shareApi.get(token);
        setTrip(response.data.data);
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true);
        else showApiError(err);
      }
    };
    load();
  }, [token]);

  const copyTrip = async () => {
    if (!isAuthenticated) {
      toast.error('Log in to copy this trip.');
      navigate('/login');
      return;
    }
    try {
      const response = await shareApi.copy(token);
      navigate(`/trips/${response.data.data.tripId}`);
    } catch (err) {
      showApiError(err);
    }
  };

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-4">
        <Card className="max-w-md text-center">
          <h1 className="text-xl font-bold text-gray-950">This itinerary does not exist or is no longer public.</h1>
          <Link className="mt-4 inline-block font-semibold text-primary-700" to="/login">Go to Traveloop</Link>
        </Card>
      </div>
    );
  }

  if (!trip) return <div className="min-h-screen bg-surface p-8">Loading shared itinerary...</div>;

  const cover = trip.cover_url ? `${SERVER_BASE_URL}${trip.cover_url}` : null;

  return (
    <div className="min-h-screen bg-surface">
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className={`h-64 bg-gradient-to-br ${gradientForName(trip.title)}`} style={cover ? { backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined} />
          <div className="p-5">
            <h1 className="text-3xl font-bold text-gray-950">{trip.title}</h1>
            <p className="mt-1 text-gray-600">Planned by {trip.User?.name} · {formatRange(trip.start_date, trip.end_date)}</p>
            <p className="mt-2 text-sm text-gray-600">{(trip.Stops || []).map((stop) => stop.City?.name).join(' · ')}</p>
            <Button className="mt-4" onClick={copyTrip}>Copy This Trip</Button>
          </div>
        </section>
        <ItineraryViewPage readOnlyTrip={trip} />
      </main>
    </div>
  );
}
