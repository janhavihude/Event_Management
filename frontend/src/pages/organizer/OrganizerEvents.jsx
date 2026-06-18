import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, BarChart3 } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';
import EventImage from '../../components/EventImage';

const OrganizerEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/organizer/events').then(({ data }) => setEvents(data.events || []));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/organizer/events/${id}`);
      setEvents(events.filter((e) => e._id !== id));
      toast.success('Event deleted');
    } catch {
      toast.error('Failed to delete event');
    }
  };

  return (
    <DashboardLayout type="organizer">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">My Events</h1>
        <Link to="/organizer/create" className="btn-primary text-sm">+ Create Event</Link>
      </div>

      {events.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No events created yet</p>
          <Link to="/organizer/create" className="btn-primary text-sm">Create Your First Event</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event._id} className="card flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <EventImage src={event.images?.[0]} alt={event.title} className="w-20 h-20 rounded-lg object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()} • {event.availableSeats}/{event.totalSeats} seats</p>
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 capitalize ${
                  event.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>{event.status}</span>
              </div>
              <div className="flex gap-2">
                <Link to={`/organizer/analytics?event=${event._id}`} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="Analytics">
                  <BarChart3 className="w-4 h-4 text-gray-500" />
                </Link>
                <button onClick={() => handleDelete(event._id)} className="p-2 hover:bg-red-50 rounded-lg" title="Delete">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default OrganizerEvents;
