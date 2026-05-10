import Navbar from './Navbar';
import Sidebar from './Sidebar';
import OfflineBanner from '../common/OfflineBanner';

export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-surface">
      <OfflineBanner />
      <Sidebar />
      <Navbar />
      <main className="pb-24 lg:ml-64 lg:pb-8">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
