import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';
import EventImage from '../../components/EventImage';

const ManageEvents = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [tab, setTab] = useState('pending');

  useEffect(() => {
    Promise.all([
      api.get('/admin/events/pending'),
      api.get('/admin/events'),
    ]).then(([pendingRes, allRes]) => {
      setPendingEvents(pendingRes.data.events || []);
      setAllEvents(allRes.data.events || []);
    });
  }, []);

  const updateStatus = async (id, status, rejectionReason = '') => {
    try {
      await api.put(`/admin/events/${id}/status`, { status, rejectionReason });
      setPendingEvents(pendingEvents.filter((e) => e._id !== id));
      toast.success(`Event ${status}`);
    } catch {
      toast.error('Failed to update event');
    }
  };

  const events = tab === 'pending' ? pendingEvents : allEvents;

  return (
    <DashboardLayout type="admin">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">Manage Events</h1>

      <div className="flex gap-2 mb-6">
        {['pending', 'all'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}>
            {t} {t === 'pending' && `(${pendingEvents.length})`}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event._id} className="card">
            <div className="flex flex-col sm:flex-row gap-4">
              <EventImage src={event.images?.[0]} alt={event.title} className="w-full sm:w-24 h-20 rounded-lg object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.organizer?.organizationName} • {new Date(event.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{event.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                  event.status === 'approved' ? 'bg-green-100 text-green-700' :
                  event.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>{event.status}</span>
                {event.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(event._id, 'approved')} className="btn-primary !py-1.5 !px-3 text-xs">Approve</button>
                    <button onClick={() => updateStatus(event._id, 'rejected', 'Does not meet guidelines')} className="btn-outline !py-1.5 !px-3 text-xs text-red-600">Reject</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && <div className="card text-center py-12"><p className="text-gray-500">No events found</p></div>}
      </div>
    </DashboardLayout>
  );
};

export default ManageEvents;
