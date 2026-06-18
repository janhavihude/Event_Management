import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import EventImage from '../../components/EventImage';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get('/users/history').then(({ data }) => setHistory(data.history || []));
  }, []);

  return (
    <DashboardLayout type="user">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">Event History</h1>
      {history.length === 0 ? (
        <div className="card text-center py-12"><p className="text-gray-500">No past events</p></div>
      ) : (
        <div className="space-y-4">
          {history.map((booking) => (
            <div key={booking._id} className="card flex items-center gap-4 !py-4">
              <EventImage src={booking.event?.images?.[0]} alt={booking.event?.title || 'Event'} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{booking.event?.title}</p>
                <p className="text-sm text-gray-500">{format(new Date(booking.event?.date), 'MMM dd, yyyy')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default HistoryPage;
