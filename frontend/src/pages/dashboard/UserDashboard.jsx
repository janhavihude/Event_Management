import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Heart, Bell, Calendar, Sparkles } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import EventCard from '../../components/EventCard';
import { useAuth } from '../../context/AuthContext';
import useSocket from '../../hooks/useSocket';
import api from '../../services/api';
import EventImage from '../../components/EventImage';

const UserDashboard = () => {
  const { user } = useAuth();
  useSocket();
  const [bookings, setBookings] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get('/users/bookings'),
      api.get('/users/recommendations'),
      api.get('/users/notifications'),
    ]).then(([bookRes, recRes, notifRes]) => {
      setBookings(bookRes.data.bookings?.slice(0, 3) || []);
      setRecommendations(recRes.data.recommendations || []);
      setUnreadCount(notifRes.data.unreadCount || 0);
    });
  }, []);

  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed' && new Date(b.event?.date) > new Date());

  return (
    <DashboardLayout type="user">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your events</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="My Bookings" value={bookings.length} icon={Ticket} color="primary" />
        <StatCard title="Saved Events" value={user?.savedEvents?.length || 0} icon={Heart} color="rose" />
        <StatCard title="Notifications" value={unreadCount} icon={Bell} color="amber" />
        <StatCard title="Upcoming" value={upcomingBookings.length} icon={Calendar} color="secondary" />
      </div>

      {/* Recent Bookings */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Recent Bookings</h2>
          <Link to="/dashboard/bookings" className="text-primary-600 text-sm font-medium hover:text-primary-700">View All</Link>
        </div>
        {bookings.length === 0 ? (
          <div className="card text-center py-8">
            <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No bookings yet</p>
            <Link to="/events" className="btn-primary inline-block mt-4 text-sm">Browse Events</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking._id} className="card flex items-center justify-between !py-4">
                <div className="flex items-center gap-4">
                  <EventImage src={booking.event?.images?.[0]} alt={booking.event?.title || 'Event'} className="w-14 h-14 rounded-lg object-cover" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{booking.event?.title}</p>
                    <p className="text-sm text-gray-500">{booking.bookingReference} • {booking.ticketCount} ticket(s)</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  booking.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                }`}>{booking.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Recommended for You</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((event, i) => (
              <EventCard key={event._id} event={event} index={i} />
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserDashboard;
