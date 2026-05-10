import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Heart, Star } from 'lucide-react';
import { citiesApi } from '../../api/cities.api';
import { tripsApi } from '../../api/trips.api';
import { stopsApi } from '../../api/stops.api';
import api from '../../api/axiosInstance';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ImageTile from '../../components/common/ImageTile';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import useDebounce from '../../hooks/useDebounce';
import useAuthStore from '../../store/authStore';
import { REGIONS, gradientForName } from '../../utils/constants';
import { resolveImageUrl } from '../../utils/image';
import { showApiError } from '../../utils/errorHandler';

export default function CitySearchPage() {
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ region: '', country: '', minCost: 0, maxCost: 500 });
  const [cities, setCities] = useState([]);
  const [trips, setTrips] = useState([]);
  const [detail, setDetail] = useState(null);
  const [activities, setActivities] = useState([]);
  const [addForm, setAddForm] = useState({ tripId: '', arrive_date: '', depart_date: '' });
  const debounced = useDebounce(search);

  const loadCities = async () => {
    try {
      const response = await citiesApi.list({ search: debounced, ...filters });
      setCities(response.data.data);
    } catch (err) {
      showApiError(err);
    }
  };

  useEffect(() => {
    loadCities();
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

  const countries = useMemo(() => Array.from(new Set(cities.map((city) => city.country))).sort(), [cities]);

  const openDetail = async (city) => {
    setDetail(city);
    try {
      const response = await citiesApi.activities(city.id);
      setActivities(response.data.data);
    } catch (err) {
      showApiError(err);
    }
  };

  const saveCity = async (city) => {
    try {
      await api.post(`/users/${user.id}/saved-destinations`, { city_id: city.id });
      toast.success('Destination saved.');
    } catch (err) {
      showApiError(err);
    }
  };

  const addToTrip = async (event) => {
    event.preventDefault();
    try {
      await stopsApi.create(addForm.tripId, { city_id: detail.id, arrive_date: addForm.arrive_date, depart_date: addForm.depart_date });
      toast.success('City added to trip.');
      setDetail(null);
    } catch (err) {
      showApiError(err);
    }
  };

  const detailImage = detail ? resolveImageUrl(detail.image_url) : null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-950">Explore Cities</h1>
        <p className="text-sm text-gray-600">Search seeded local destinations and save ideas to your wishlist.</p>
      </div>
      <Card>
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_1fr_160px]">
          <Input placeholder="Search city or country" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select className="rounded-lg border-gray-300" value={filters.country} onChange={(event) => setFilters({ ...filters, country: event.target.value })}>
            <option value="">All countries</option>
            {countries.map((country) => <option key={country} value={country}>{country}</option>)}
          </select>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((region) => (
              <button key={region} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${filters.region === region ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setFilters({ ...filters, region: filters.region === region ? '' : region })}>
                {region}
              </button>
            ))}
          </div>
          <Input type="number" min="0" max="500" value={filters.maxCost} onChange={(event) => setFilters({ ...filters, maxCost: event.target.value })} />
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cities.map((city) => (
          <Card key={city.id} className="overflow-hidden p-0">
            <ImageTile
              src={resolveImageUrl(city.image_url)}
              alt={city.name}
              className="h-28"
              fallbackClass={`bg-gradient-to-br ${gradientForName(city.name)}`}
              fallbackText={city.name?.charAt(0)}
            />
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-950">{city.name}</h3>
                  <p className="text-sm text-gray-500">{city.country}</p>
                </div>
                <button onClick={() => saveCity(city)} aria-label="Save destination"><Heart className="h-5 w-5 text-danger" /></button>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">~${city.cost_index}/day</span>
                <span className="inline-flex items-center gap-1 text-amber-600"><Star className="h-4 w-4 fill-current" />{city.popularity}</span>
              </div>
              <Button className="mt-4 w-full" variant="secondary" onClick={() => openDetail(city)}>View Details</Button>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={Boolean(detail)} title={detail?.name} onClose={() => setDetail(null)} maxWidth="max-w-2xl">
        {detail && (
          <div className="space-y-5">
            <ImageTile
              src={detailImage}
              alt={detail.name}
              className="h-40 rounded-xl"
              fallbackClass={`bg-gradient-to-br ${gradientForName(detail.name)}`}
              fallbackText={detail.name?.charAt(0)}
            />
            <p className="text-sm text-gray-700">{detail.description}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Card><p className="text-sm text-gray-500">Cost index</p><strong>${detail.cost_index}/day</strong></Card>
              <Card><p className="text-sm text-gray-500">Popularity</p><strong>{detail.popularity}/100</strong></Card>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-950">Activities Preview</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {activities.slice(0, 6).map((activity) => <div key={activity.id} className="rounded-lg bg-gray-50 p-3 text-sm">{activity.name}</div>)}
              </div>
            </div>
            <form className="grid gap-3 sm:grid-cols-[1fr_150px_150px_auto]" onSubmit={addToTrip}>
              <select className="rounded-lg border-gray-300" value={addForm.tripId} onChange={(event) => setAddForm({ ...addForm, tripId: event.target.value })}>
                <option value="">Add to trip</option>
                {trips.map((trip) => <option key={trip.id} value={trip.id}>{trip.title}</option>)}
              </select>
              <Input type="date" value={addForm.arrive_date} onChange={(event) => setAddForm({ ...addForm, arrive_date: event.target.value })} />
              <Input type="date" value={addForm.depart_date} onChange={(event) => setAddForm({ ...addForm, depart_date: event.target.value })} />
              <Button type="submit">Add</Button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
