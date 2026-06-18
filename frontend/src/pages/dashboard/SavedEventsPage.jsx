import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import EventCard from '../../components/EventCard';
import api from '../../services/api';

const SavedEventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/users/profile').then(({ data }) => setEvents(data.user?.savedEvents || []));
  }, []);

  return (
    <DashboardLayout type="user">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">Saved Events</h1>
      {events.length === 0 ? (
        <div className="card text-center py-12"><p className="text-gray-500">No saved events yet</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => <EventCard key={event._id} event={event} index={i} />)}
        </div>
      )}
    </DashboardLayout>
  );
};

export default SavedEventsPage;
