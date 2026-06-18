import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

const AttendeesPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    api.get('/organizer/events').then(({ data }) => {
      setEvents(data.events || []);
      if (data.events?.length) setSelectedEvent(data.events[0]._id);
    });
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      api.get(`/organizer/events/${selectedEvent}/attendees`).then(({ data }) => setAttendees(data.attendees || []));
    }
  }, [selectedEvent]);

  return (
    <DashboardLayout type="organizer">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">Attendee Management</h1>
      <select className="input-field max-w-xs mb-6" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
        {events.map((e) => <option key={e._id} value={e._id}>{e.title}</option>)}
      </select>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left py-3 font-medium text-gray-500">Name</th>
              <th className="text-left py-3 font-medium text-gray-500">Email</th>
              <th className="text-left py-3 font-medium text-gray-500">Tickets</th>
              <th className="text-left py-3 font-medium text-gray-500">Status</th>
              <th className="text-left py-3 font-medium text-gray-500">Checked In</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((booking) => (
              <tr key={booking._id} className="border-b border-gray-50 dark:border-gray-800">
                <td className="py-3 font-medium text-gray-900 dark:text-white">{booking.user?.name}</td>
                <td className="py-3 text-gray-500">{booking.user?.email}</td>
                <td className="py-3 text-gray-500">{booking.ticketCount}</td>
                <td className="py-3"><span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 capitalize">{booking.status}</span></td>
                <td className="py-3">{booking.checkedIn ? '✅ Yes' : '❌ No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {attendees.length === 0 && <p className="text-center text-gray-500 py-8">No attendees yet</p>}
      </div>
    </DashboardLayout>
  );
};

export default AttendeesPage;
