import { useState, useEffect } from 'react';
import { Download, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/bookings').then(({ data }) => {
      setBookings(data.bookings || []);
      setLoading(false);
    });
  }, []);

  const downloadTicket = async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}/ticket`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${bookingId}.pdf`;
    link.click();
  };

  return (
    <DashboardLayout type="user">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">My Bookings</h1>

      {loading ? (
        <div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="card h-24 bg-gray-200 dark:bg-gray-700" />)}</div>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="card">
              <div className="flex flex-col sm:flex-row gap-4">
                <img src={booking.event?.images?.[0] || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200'} alt="" className="w-full sm:w-32 h-24 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{booking.event?.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{format(new Date(booking.event?.date), 'MMM dd, yyyy • hh:mm a')}</p>
                      <p className="text-sm text-gray-500">Ref: {booking.bookingReference}</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>{booking.status}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-300">
                    <span>{booking.ticketCount} ticket(s)</span>
                    <span>₹{booking.totalAmount}</span>
                    {booking.seats?.length > 0 && <span>Seats: {booking.seats.map((s) => `${s.row}${s.number}`).join(', ')}</span>}
                  </div>
                  {booking.status === 'confirmed' && (
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => downloadTicket(booking._id)} className="btn-outline !py-1.5 !px-3 text-xs flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" /> Download Ticket
                      </button>
                      {booking.qrCode && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <QrCode className="w-3.5 h-3.5" /> QR Available
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyBookingsPage;
