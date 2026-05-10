import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ImageTile from '../../components/common/ImageTile';
import Input from '../../components/common/Input';
import useAuthStore from '../../store/authStore';
import { SERVER_BASE_URL, gradientForName } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';
import { resolveImageUrl } from '../../utils/image';
import { showApiError } from '../../utils/errorHandler';

const languages = [
  ['en', 'English'],
  ['hi', 'Hindi'],
  ['fr', 'French'],
  ['es', 'Spanish'],
  ['ar', 'Arabic'],
  ['ja', 'Japanese']
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuthStore();
  const [profile, setProfile] = useState(user);
  const [saved, setSaved] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');

  const load = async () => {
    try {
      const [profileResponse, savedResponse] = await Promise.all([
        api.get(`/users/${user.id}`),
        api.get(`/users/${user.id}/saved-destinations`)
      ]);
      setProfile(profileResponse.data.data);
      setSaved(savedResponse.data.data);
    } catch (err) {
      showApiError(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (event) => {
    event.preventDefault();
    try {
      const response = await api.put(`/users/${user.id}`, { name: profile.name, language: profile.language });
      updateUser(response.data.data);
      if (avatar) {
        const formData = new FormData();
        formData.append('avatar', avatar);
        const avatarResponse = await api.put(`/users/${user.id}/avatar`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        updateUser({ avatar_url: avatarResponse.data.data.avatar_url });
      }
      toast.success('Profile saved.');
      load();
    } catch (err) {
      showApiError(err);
    }
  };

  const deleteAccount = async () => {
    try {
      await api.delete(`/users/${user.id}`, { data: { confirmEmail } });
      logout();
      navigate('/login');
    } catch (err) {
      showApiError(err);
    }
  };

  const avatarUrl = profile?.avatar_url ? `${SERVER_BASE_URL}${profile.avatar_url}` : null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-950">Profile Settings</h1>
        <p className="text-sm text-gray-600">Manage account details and saved destinations.</p>
      </div>
      <Card>
        <form className="grid gap-6 lg:grid-cols-[180px_1fr]" onSubmit={save}>
          <div>
            <label className="block cursor-pointer">
              <div className="h-32 w-32 overflow-hidden rounded-full bg-primary-50">
                {avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-primary-700">{profile?.name?.charAt(0)}</div>}
              </div>
              <input type="file" accept="image/png,image/jpeg" className="mt-3 text-sm" onChange={(event) => setAvatar(event.target.files?.[0] || null)} />
            </label>
          </div>
          <div className="space-y-4">
            <Input label="Full Name" value={profile?.name || ''} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Language</span>
              <select className="w-full rounded-lg border-gray-300" value={profile?.language || 'en'} onChange={(event) => setProfile({ ...profile, language: event.target.value })}>
                {languages.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <Card><p className="text-sm text-gray-500">Member since</p><strong>{formatDate(profile?.created_at)}</strong></Card>
              <Card><p className="text-sm text-gray-500">Total trips</p><strong>{profile?.totalTrips || 0}</strong></Card>
            </div>
            <Button type="submit">Save Profile</Button>
          </div>
        </form>
      </Card>
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-950">Saved Destinations</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((city) => (
            <Card key={city.id}>
              <ImageTile
                src={resolveImageUrl(city.image_url)}
                alt={city.name}
                className="mb-3 h-20 rounded-lg"
                fallbackClass={`bg-gradient-to-br ${gradientForName(city.name)}`}
                fallbackText={city.name?.charAt(0)}
              />
              <h3 className="font-semibold text-gray-950">{city.name}</h3>
              <p className="text-sm text-gray-500">{city.country}</p>
              <Button
                className="mt-3"
                variant="secondary"
                size="sm"
                onClick={async () => {
                  try {
                    await api.delete(`/users/${user.id}/saved-destinations/${city.id}`);
                    setSaved((items) => items.filter((item) => item.id !== city.id));
                  } catch (err) {
                    showApiError(err);
                  }
                }}
              >
                Remove
              </Button>
            </Card>
          ))}
        </div>
      </section>
      <Card className="border-red-100 bg-red-50">
        <h2 className="font-semibold text-red-900">Delete Account</h2>
        <p className="mt-1 text-sm text-red-700">Deactivate your account and prevent future logins.</p>
        <Button className="mt-4" variant="danger" onClick={() => setDeleteOpen(true)}>Delete My Account</Button>
      </Card>
      <ConfirmDialog
        open={deleteOpen}
        title="Delete account"
        description="Type your email in the next field before confirming account deletion."
        confirmLabel="Delete Account"
        danger
        onClose={() => setDeleteOpen(false)}
        onConfirm={deleteAccount}
      />
      {deleteOpen && (
        <div className="fixed bottom-6 left-1/2 z-[60] w-80 -translate-x-1/2 rounded-xl bg-white p-3 shadow-lg">
          <Input placeholder={user.email} value={confirmEmail} onChange={(event) => setConfirmEmail(event.target.value)} />
        </div>
      )}
    </div>
  );
}
