import { Menu } from 'lucide-react';
import Button from '../common/Button';
import useAuthStore from '../../store/authStore';

export default function Navbar() {
  const { user } = useAuthStore();

  return (
    <header className="no-print sticky top-0 z-30 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:ml-64">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="lg:hidden" aria-label="Open navigation">
            <Menu className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-gray-950">Traveloop</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="hidden sm:inline">{user?.name}</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 font-semibold text-primary-700">
            {user?.name?.charAt(0)?.toUpperCase() || 'T'}
          </div>
        </div>
      </div>
    </header>
  );
}
