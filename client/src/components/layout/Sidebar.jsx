import { Home, LogOut, Map, Globe2, Star, User, Shield } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/trips', label: 'My Trips', icon: Map },
  { to: '/cities', label: 'Explore Cities', icon: Globe2 },
  { to: '/activities', label: 'Activities', icon: Star },
  { to: '/profile', label: 'Profile', icon: User }
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const items = user?.role === 'admin' ? [...navItems, { to: '/admin', label: 'Admin', icon: Shield }] : navItems;
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`;

  return (
    <>
      <aside className="no-print fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white p-4 lg:flex lg:flex-col">
        <div className="mb-8 px-2">
          <div className="text-xl font-extrabold text-primary-700">Traveloop</div>
          <div className="mt-1 text-xs text-gray-500">Local travel planning</div>
        </div>
        <nav className="space-y-1">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>
      <nav className="no-print fixed bottom-0 left-0 right-0 z-40 flex border-t border-gray-200 bg-white px-2 py-2 lg:hidden">
        {items.slice(0, 5).map((item) => (
          <NavLink key={item.to} to={item.to} className="flex flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1 text-[11px] font-medium text-gray-600">
            <item.icon className="h-5 w-5" />
            <span className="max-w-full truncate">{item.label.replace('Explore ', '')}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
