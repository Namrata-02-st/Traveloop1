import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import PageWrapper from '../components/layout/PageWrapper';
import LoginPage from '../pages/Auth/LoginPage';
import SignupPage from '../pages/Auth/SignupPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import MyTripsPage from '../pages/Trips/MyTripsPage';
import CreateTripPage from '../pages/Trips/CreateTripPage';
import TripDetailPage from '../pages/Trips/TripDetailPage';
import ItineraryBuilderPage from '../pages/Itinerary/ItineraryBuilderPage';
import ItineraryViewPage from '../pages/Itinerary/ItineraryViewPage';
import CitySearchPage from '../pages/Search/CitySearchPage';
import ActivitySearchPage from '../pages/Search/ActivitySearchPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import PublicItineraryPage from '../pages/Public/PublicItineraryPage';
import AdminDashboard from '../pages/Admin/AdminDashboard';

function RootRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    toast.error('Please log in to continue.');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return (
    <PageWrapper>
      <Outlet />
    </PageWrapper>
  );
}

function AdminRoute() {
  const user = useAuthStore((state) => state.user);
  if (user?.role !== 'admin') {
    toast.error('Access denied.');
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/share/:token" element={<PublicItineraryPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/trips" element={<MyTripsPage />} />
          <Route path="/trips/new" element={<CreateTripPage />} />
          <Route path="/trips/:id" element={<TripDetailPage />} />
          <Route path="/trips/:id/build" element={<ItineraryBuilderPage />} />
          <Route path="/trips/:id/view" element={<ItineraryViewPage />} />
          <Route path="/cities" element={<CitySearchPage />} />
          <Route path="/activities" element={<ActivitySearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
