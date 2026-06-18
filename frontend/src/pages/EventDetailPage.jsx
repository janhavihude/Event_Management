import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Star, Share2, Heart, IndianRupee, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import EventImage from '../components/EventImage';

const EventDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/events/${id}`).then(({ data }) => {
      setEvent(data.event);
      setReviews(data.reviews || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleSave = async () => {
    if (!isAuthenticated) return toast.error('Please login to save events');
    try {
      const { data } = await api.post(`/users/saved-events/${id}`);
      toast.success(data.saved ? 'Event saved!' : 'Event removed from saved');
    } catch {
      toast.error('Failed to save event');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 text-lg mb-4">Event not found</p>
        <Link to="/events" className="btn-primary">Browse Events</Link>
      </div>
    );
  }

  const image = event.images?.[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 lg:h-96">
        <EventImage src={image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <Link to="/events" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Events
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">About This Event</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>

            {/* Venue & Map */}
            <div className="card">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Venue</h2>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{event.venue.name}</p>
                  <p className="text-gray-500 text-sm">{event.venue.address}, {event.venue.city}</p>
                </div>
              </div>
              {event.venue.coordinates?.lat && (
                <div className="rounded-lg overflow-hidden h-48 bg-gray-200 dark:bg-gray-700">
                  <iframe
                    title="Event Location"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${event.venue.coordinates.lat},${event.venue.coordinates.lng}&zoom=15`}
                  />
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Reviews</h2>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{event.averageRating || 'New'}</span>
                  <span className="text-gray-500 text-sm">({event.totalReviews} reviews)</span>
                </div>
              </div>
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-600">
                          {review.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">{review.user?.name}</p>
                          <div className="flex gap-0.5">
                            {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{format(new Date(event.date), 'EEEE, MMM dd, yyyy')}</p>
                    <p className="text-gray-500">{format(new Date(event.date), 'hh:mm a')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-5 h-5 text-secondary-500" />
                  <span className="text-gray-600 dark:text-gray-300">{event.availableSeats} seats available</span>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 text-sm">Regular</span>
                  <span className="font-semibold flex items-center"><IndianRupee className="w-4 h-4" />{event.ticketPricing.regular}</span>
                </div>
                {event.ticketPricing.vip > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">VIP</span>
                    <span className="font-semibold flex items-center"><IndianRupee className="w-4 h-4" />{event.ticketPricing.vip}</span>
                  </div>
                )}
              </div>

              <Link to={`/events/${id}/book`} className="btn-primary w-full text-center block !py-3 mb-3">
                Book Tickets
              </Link>

              <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 btn-outline !py-2 text-sm flex items-center justify-center gap-1">
                  <Heart className="w-4 h-4" /> Save
                </button>
                <button onClick={handleShare} className="flex-1 btn-outline !py-2 text-sm flex items-center justify-center gap-1">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>

              {event.organizer && (
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 mb-2">Organized by</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center font-semibold text-secondary-600">
                      {event.organizer.organizationName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{event.organizer.organizationName}</p>
                      {event.organizer.isVerified && <span className="text-xs text-primary-500">✓ Verified</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetailPage;
