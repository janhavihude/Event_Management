import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { downloadTicketPdf } from '../../utils/generateTicketPdf';
import { getDateLocale } from '../../utils/dateLocale';
import EventImage from '../../components/EventImage';

const MyBookingsPage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const locale = getDateLocale(i18n.language);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    api.get('/users/bookings').then(({ data }) => {
      setBookings(data.bookings || []);
      setLoading(false);
    });
  }, []);

  const downloadTicket = async (booking) => {
    if (booking.status !== 'confirmed') {
      toast.error(t('bookings.ticketNotReady'));
      return;
    }
    setDownloading(booking._id);
    try {
      await downloadTicketPdf(booking, user, i18n.language);
      toast.success(t('bookings.ticketDownloaded'));
    } catch (err) {
      console.error(err);
      toast.error(t('bookings.ticketFailed'));
    } finally {
      setDownloading(null);
    }
  };

  return (
    <DashboardLayout type="user">
      <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-white mb-8">
        {t('dashboard.bookings')}
      </h1>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card h-24 bg-neutral-200 dark:bg-neutral-700" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-neutral-500">{t('bookings.none')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="card">
              <div className="flex flex-col sm:flex-row gap-4">
                <EventImage
                  src={booking.event?.images?.[0]}
                  alt={booking.event?.title || 'Event'}
                  className="w-full sm:w-32 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">{booking.event?.title}</h3>
                      <p className="text-sm text-neutral-500 mt-1">
                        {format(new Date(booking.event?.date), 'PPP p', { locale })}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {t('bookings.ref')}: {booking.bookingReference}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-neutral-600 dark:text-neutral-300">
                    <span>
                      {booking.ticketCount} {t('bookings.tickets')}
                    </span>
                    <span>₹{booking.totalAmount}</span>
                    {booking.seats?.length > 0 && (
                      <span>
                        {t('bookings.seats')}: {booking.seats.map((s) => `${s.row}${s.number}`).join(', ')}
                      </span>
                    )}
                  </div>
                  {booking.status === 'confirmed' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => downloadTicket(booking)}
                        disabled={downloading === booking._id}
                        className="btn-outline !py-1.5 !px-3 text-xs flex items-center gap-1 disabled:opacity-50"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {downloading === booking._id ? t('common.loading') : t('bookings.download')}
                      </button>
                      <div className="flex items-center gap-1 text-xs text-neutral-500">
                        <QrCode className="w-3.5 h-3.5" /> {t('bookings.qrIncluded')}
                      </div>
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
