import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { adminApi } from '../../api/admin.api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { formatDate } from '../../utils/formatDate';
import { showApiError } from '../../utils/errorHandler';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [popularCities, setPopularCities] = useState([]);

  const load = async () => {
    try {
      const [statsResponse, usersResponse, tripsResponse, citiesResponse] = await Promise.all([
        adminApi.stats(),
        adminApi.users({ page: 1, limit: 20 }),
        adminApi.trips(),
        adminApi.popularCities()
      ]);
      setStats(statsResponse.data.data);
      setUsers(usersResponse.data.data.users);
      setTrips(tripsResponse.data.data);
      setPopularCities(citiesResponse.data.data.map((row) => ({ name: row.City?.name, count: Number(row.count) })));
    } catch (err) {
      showApiError(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!stats) return <Card>Loading admin dashboard...</Card>;

  const statCards = [
    ['Total Users', stats.totalUsers],
    ['Total Trips', stats.totalTrips],
    ['Public Trips', stats.publicTrips],
    ['Trips This Week', stats.tripsThisWeek]
  ];
  const activityData = (stats.activity || []).map((row) => ({ day: row.day || row.dataValues?.day, count: Number(row.count || row.dataValues?.count) }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-950">Admin Dashboard</h1>
        <p className="text-sm text-gray-600">Platform usage, users, trips, and popular destinations.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(([label, value]) => (
          <Card key={label}><p className="text-sm text-gray-500">{label}</p><strong className="mt-2 block text-2xl text-gray-950">{value}</strong></Card>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="h-80">
          <h2 className="mb-4 font-semibold text-gray-950">Trips Created</h2>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" fill="#3b82f6" stroke="#2563eb" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="h-80">
          <h2 className="mb-4 font-semibold text-gray-950">Top Cities</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={popularCities}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <h2 className="mb-4 font-semibold text-gray-950">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500"><tr><th className="py-2">Name</th><th>Email</th><th>Role</th><th>Trips</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-100">
                  <td className="py-3 font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.tripCount}</td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>{user.is_active ? 'Active' : 'Inactive'}</td>
                  <td><Button size="sm" variant="secondary" onClick={async () => { await adminApi.setUserStatus(user.id, !user.is_active); load(); }}>{user.is_active ? 'Deactivate' : 'Activate'}</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <h2 className="mb-4 font-semibold text-gray-950">All Trips</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500"><tr><th className="py-2">Title</th><th>Owner</th><th>Destinations</th><th>Status</th><th>Created</th></tr></thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="border-t border-gray-100">
                  <td className="py-3 font-medium">{trip.title}</td>
                  <td>{trip.User?.name}</td>
                  <td>{(trip.Stops || []).map((stop) => stop.City?.name).join(', ')}</td>
                  <td>{trip.status}</td>
                  <td>{formatDate(trip.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
