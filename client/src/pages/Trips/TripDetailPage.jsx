import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Edit3, Share2 } from 'lucide-react';
import { tripsApi } from '../../api/trips.api';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import TripForm from '../../components/trips/TripForm';
import BudgetPage from '../Budget/BudgetPage';
import PackingPage from '../Packing/PackingPage';
import NotesPage from '../Notes/NotesPage';
import ItineraryViewPage from '../Itinerary/ItineraryViewPage';
import { SERVER_BASE_URL, gradientForName } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatRange } from '../../utils/formatDate';
import { showApiError } from '../../utils/errorHandler';

const tabs = ['itinerary', 'budget', 'packing', 'notes'];

export default function TripDetailPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [tab, setTab] = useState('itinerary');
  const [editing, setEditing] = useState(false);

  const loadTrip = async () => {
    try {
      const response = await tripsApi.get(id);
      setTrip(response.data.data);
    } catch (err) {
      showApiError(err);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [id]);

  const days = useMemo(() => {
    if (!trip) return 0;
    return Math.max(1, Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000) + 1);
  }, [trip]);

  const toggleShare = async () => {
    try {
      const response = await tripsApi.share(id);
      await loadTrip();
      if (response.data.data.is_public) {
        const url = `${window.location.origin}/share/${response.data.data.share_token}`;
        await navigator.clipboard.writeText(url);
        toast.success('Trip is now public. Link copied.');
      } else {
        toast.success('Trip is private.');
      }
    } catch (err) {
      showApiError(err);
    }
  };

  const updateTrip = async (payload) => {
    try {
      await tripsApi.update(id, payload);
      setEditing(false);
      toast.success('Trip updated.');
      loadTrip();
    } catch (err) {
      showApiError(err);
    }
  };

  if (!trip) return <Card>Loading trip...</Card>;

  const cover = trip.cover_url ? `${SERVER_BASE_URL}${trip.cover_url}` : null;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className={`h-56 bg-gradient-to-br ${gradientForName(trip.title)}`} style={cover ? { backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined} />
        <div className="p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant={trip.status}>{trip.status}</Badge>
                <Badge>{trip.stopCount} cities</Badge>
                <Badge>{days} days</Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-950">{trip.title}</h1>
              <p className="mt-1 text-gray-600">{formatRange(trip.start_date, trip.end_date)}</p>
              {trip.description && <p className="mt-3 max-w-3xl text-sm text-gray-700">{trip.description}</p>}
              <p className="mt-3 text-sm font-semibold text-gray-950">{formatCurrency(trip.estimatedCost, trip.currency)} estimated of {formatCurrency(trip.total_budget, trip.currency)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={`/trips/${id}/build`}>
                <Button>Build Itinerary</Button>
              </Link>
              <Button variant="secondary" onClick={() => setEditing(true)}>
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
              <Button variant={trip.is_public ? 'success' : 'secondary'} onClick={toggleShare}>
                <Share2 className="h-4 w-4" />
                {trip.is_public ? 'Public' : 'Make Public'}
              </Button>
            </div>
          </div>
          {trip.is_public && (
            <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
              Share URL: {window.location.origin}/share/{trip.share_token}
            </div>
          )}
        </div>
      </section>
      <div className="no-print flex gap-2 overflow-x-auto border-b border-gray-200">
        {tabs.map((item) => (
          <button key={item} onClick={() => setTab(item)} className={`border-b-2 px-4 py-3 text-sm font-semibold capitalize ${tab === item ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500'}`}>
            {item}
          </button>
        ))}
      </div>
      {tab === 'itinerary' && <ItineraryViewPage embeddedTrip={trip} />}
      {tab === 'budget' && <BudgetPage tripId={id} currency={trip.currency} />}
      {tab === 'packing' && <PackingPage tripId={id} />}
      {tab === 'notes' && <NotesPage tripId={id} stops={trip.Stops || []} />}
      <Modal open={editing} title="Edit trip" onClose={() => setEditing(false)}>
        <TripForm initialValues={trip} submitLabel="Update Trip" onSubmit={updateTrip} />
      </Modal>
    </div>
  );
}
