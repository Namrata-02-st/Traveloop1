import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe2, Map, Plus, Wallet } from 'lucide-react';
import { citiesApi } from '../../api/cities.api';
import { tripsApi } from '../../api/trips.api';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import ImageTile from '../../components/common/ImageTile';
import TripCard from '../../components/trips/TripCard';
import useAuthStore from '../../store/authStore';
import { formatCurrency } from '../../utils/formatCurrency';
import { gradientForName } from '../../utils/constants';
import { resolveImageUrl } from '../../utils/image';
import { showApiError } from '../../utils/errorHandler';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [tripResponse, cityResponse] = await Promise.all([
          tripsApi.list({ limit: 3, sort: 'recent' }),
          citiesApi.list({ sort: 'popular', limit: 6 })
        ]);
        setTrips(tripResponse.data.data);
        setCities(cityResponse.data.data);
      } catch (err) {
        showApiError(err);
      }
    };
    load();
  }, []);

  const totalEstimated = trips.reduce((sum, trip) => sum + Number(trip.estimatedCost || 0), 0);
  const actions = [
    { label: 'Plan New Trip', icon: Plus, to: '/trips/new' },
    { label: 'My Trips', icon: Map, to: '/trips' },
    { label: 'Explore Cities', icon: Globe2, to: '/cities' }
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-primary-700 p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}! Ready to plan your next adventure?</h1>
        <p className="mt-2 text-primary-50">Build trips, organize stops, track budget, and share itinerary links.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <button key={action.label} onClick={() => navigate(action.to)} className="rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <action.icon className="h-6 w-6 text-primary-600" />
            <div className="mt-3 font-semibold text-gray-950">{action.label}</div>
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-950">Recent Trips</h2>
          {trips.length ? (
            <div className="grid gap-4 md:grid-cols-3">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onView={() => navigate(`/trips/${trip.id}`)} />
              ))}
            </div>
          ) : (
            <EmptyState title="No trips yet. Start planning!" description="Create your first itinerary and keep every stop, note, and cost in one place." actionLabel="Plan New Trip" onAction={() => navigate('/trips/new')} />
          )}
        </section>
        <Card>
          <div className="flex items-center gap-3">
            <Wallet className="h-6 w-6 text-accent-500" />
            <div>
              <p className="text-sm text-gray-500">Budget Overview</p>
              <p className="text-2xl font-bold text-gray-950">{formatCurrency(totalEstimated)}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">Estimated cost across your recent trips.</p>
        </Card>
      </div>
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-950">Popular Destinations</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {cities.map((city) => (
            <button key={city.id} className="min-w-52 rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm" onClick={() => navigate('/cities')}>
              <ImageTile
                src={resolveImageUrl(city.image_url)}
                alt={city.name}
                className="mb-3 h-24 w-full rounded-lg"
                fallbackClass={`bg-gradient-to-br ${gradientForName(city.name)}`}
                fallbackText={city.name?.charAt(0)}
              />
              <div className="font-semibold text-gray-950">{city.name}</div>
              <div className="text-sm text-gray-500">{city.country}</div>
              <div className="mt-3 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">~${city.cost_index}/day</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
