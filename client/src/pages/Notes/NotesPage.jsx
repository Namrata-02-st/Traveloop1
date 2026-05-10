import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { notesApi } from '../../api/notes.api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { relativeTime } from '../../utils/formatDate';
import { showApiError } from '../../utils/errorHandler';

export default function NotesPage({ tripId, stops = [] }) {
  const params = useParams();
  const id = tripId || params.id;
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({ content: '', stop_id: '' });

  const loadNotes = async () => {
    try {
      const response = await notesApi.list(id);
      setNotes(response.data.data);
    } catch (err) {
      showApiError(err);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [id]);

  const openNew = () => {
    setEditing(null);
    setForm({ content: '', stop_id: '' });
    setModalOpen(true);
  };

  const openEdit = (note) => {
    setEditing(note);
    setForm({ content: note.content, stop_id: note.stop_id || '' });
    setModalOpen(true);
  };

  const saveNote = async (event) => {
    event.preventDefault();
    try {
      if (editing) await notesApi.update(id, editing.id, form);
      else await notesApi.create(id, form);
      toast.success(editing ? 'Note updated.' : 'Note added.');
      setModalOpen(false);
      loadNotes();
    } catch (err) {
      showApiError(err);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={openNew}>New Note</Button>
      </div>
      {notes.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {notes.map((note) => (
            <Card key={note.id}>
              <button className="block w-full text-left" onClick={() => openEdit(note)}>
                <div className="text-sm font-semibold text-gray-950">{note.Stop?.City?.name || 'General'}</div>
                <p className="mt-2 text-sm text-gray-700">{note.content.length > 100 ? `${note.content.slice(0, 100)}...` : note.content}</p>
                <p className="mt-3 text-xs text-gray-500">{relativeTime(note.updated_at || note.created_at)}</p>
              </button>
              <Button className="mt-3" size="sm" variant="ghost" onClick={() => setDeleting(note)}>Delete</Button>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No notes yet" description="Capture confirmations, ideas, reminders, and journal entries." actionLabel="New Note" onAction={openNew} />
      )}
      <Modal open={modalOpen} title={editing ? 'Edit note' : 'New note'} onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={saveNote}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Stop</span>
            <select className="w-full rounded-lg border-gray-300" value={form.stop_id} onChange={(event) => setForm({ ...form, stop_id: event.target.value })}>
              <option value="">General</option>
              {stops.map((stop) => <option key={stop.id} value={stop.id}>{stop.City?.name}</option>)}
            </select>
          </label>
          <textarea className="min-h-40 w-full rounded-lg border-gray-300" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} />
          <div className="flex justify-end"><Button type="submit">Save</Button></div>
        </form>
      </Modal>
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete note"
        description="Delete this note permanently?"
        confirmLabel="Delete"
        danger
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          try {
            await notesApi.remove(id, deleting.id);
            setDeleting(null);
            loadNotes();
          } catch (err) {
            showApiError(err);
          }
        }}
      />
    </div>
  );
}
