import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { packingApi } from '../../api/packing.api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import PackingItem from '../../components/packing/PackingItem';
import { PACKING_CATEGORIES } from '../../utils/constants';
import { showApiError } from '../../utils/errorHandler';

export default function PackingPage({ tripId }) {
  const params = useParams();
  const id = tripId || params.id;
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('all');
  const [form, setForm] = useState({ name: '', category: 'other' });
  const [confirmReset, setConfirmReset] = useState(false);

  const loadItems = async () => {
    try {
      const response = await packingApi.list(id);
      setItems(response.data.data);
    } catch (err) {
      showApiError(err);
    }
  };

  useEffect(() => {
    loadItems();
  }, [id]);

  const filtered = category === 'all' ? items : items.filter((item) => item.category === category);
  const packed = items.filter((item) => item.is_packed).length;
  const progress = items.length ? Math.round((packed / items.length) * 100) : 0;

  const addItem = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    try {
      const response = await packingApi.create(id, form);
      setItems((current) => [response.data.data, ...current]);
      setForm({ name: '', category: 'other' });
    } catch (err) {
      showApiError(err);
    }
  };

  const tabs = useMemo(() => ['all', ...PACKING_CATEGORIES], []);

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-gray-950">{packed} of {items.length} items packed</h2>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-100 sm:w-80">
              <div className="h-2 rounded-full bg-accent-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <Button variant="secondary" onClick={() => setConfirmReset(true)} disabled={!items.length}>Reset All</Button>
        </div>
      </Card>
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((item) => (
          <button key={item} className={`rounded-full px-3 py-1.5 text-sm font-semibold capitalize ${category === item ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </div>
      <form className="grid gap-3 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_180px_auto]" onSubmit={addItem}>
        <input className="rounded-lg border-gray-300" placeholder="Add item" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <select className="rounded-lg border-gray-300" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
          {PACKING_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <Button type="submit">Add</Button>
      </form>
      {filtered.length ? (
        <div className="space-y-2">
          {filtered.map((item) => (
            <PackingItem
              key={item.id}
              item={item}
              onToggle={async () => {
                try {
                  const response = await packingApi.update(id, item.id, { is_packed: !item.is_packed });
                  setItems((current) => current.map((entry) => (entry.id === item.id ? response.data.data : entry)));
                } catch (err) {
                  showApiError(err);
                }
              }}
              onDelete={async () => {
                try {
                  await packingApi.remove(id, item.id);
                  setItems((current) => current.filter((entry) => entry.id !== item.id));
                } catch (err) {
                  showApiError(err);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No packing items" description="Add documents, clothing, electronics, and essentials for this trip." />
      )}
      <ConfirmDialog
        open={confirmReset}
        title="Reset packing list"
        description="Uncheck every item without deleting the list."
        confirmLabel="Reset"
        onClose={() => setConfirmReset(false)}
        onConfirm={async () => {
          try {
            const response = await packingApi.reset(id);
            setItems(response.data.data);
            setConfirmReset(false);
            toast.success('Packing list reset.');
          } catch (err) {
            showApiError(err);
          }
        }}
      />
    </div>
  );
}
