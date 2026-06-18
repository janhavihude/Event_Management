import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, IndianRupee } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import toast from 'react-hot-toast';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    Promise.all([
      api.get(`/events/${id}`),
      api.get(`/events/${id}/seats`),
    ]).then(([eventRes, seatsRes]) => {
      setEvent(eventRes.data.event);
      setSeats(seatsRes.data.seats || []);
    });
  }, [id]);

  const toggleSeat = (seat) => {
    if (seat.isBooked) return;
    const key = `${seat.row}${seat.number}`;
    const exists = selectedSeats.find((s) => `${s.row}${s.number}` === key);
    if (exists) {
      setSelectedSeats(selectedSeats.filter((s) => `${s.row}${s.number}` !== key));
    } else if (selectedSeats.length < 6) {
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      toast.error('Maximum 6 seats per booking');
    }
  };

  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return toast.error('Please select at least one seat');
    setLoading(true);

    try {
      const { data: bookingData } = await api.post('/bookings', {
        eventId: id,
        seats: selectedSeats.map((s) => ({ row: s.row, number: s.number })),
        paymentProvider: paymentMethod,
      });

      // Process payment
      if (paymentMethod === 'razorpay') {
        const { data: paymentData } = await api.post('/payments/razorpay/create-order', {
          bookingId: bookingData.booking._id,
          amount: totalAmount,
        });

        if (paymentData.devMode) {
          toast.success('Booking confirmed! (Dev mode)');
          navigate(`/dashboard/bookings`);
          return;
        }

        // Load Razorpay script and open checkout
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const options = {
            key: paymentData.order.key,
            amount: paymentData.order.amount,
            currency: paymentData.order.currency,
            order_id: paymentData.order.id,
            name: 'EventOrganizer',
            description: event.title,
            handler: async (response) => {
              await api.post('/payments/razorpay/verify', {
                ...response,
                bookingId: bookingData.booking._id,
              });
              toast.success('Payment successful! Booking confirmed.');
              navigate('/dashboard/bookings');
            },
          };
          new window.Razorpay(options).open();
        };
        document.body.appendChild(script);
      } else {
        const { data: paymentData } = await api.post('/payments/stripe/create-intent', {
          bookingId: bookingData.booking._id,
          amount: totalAmount,
        });

        if (paymentData.devMode) {
          toast.success('Booking confirmed! (Dev mode)');
          navigate('/dashboard/bookings');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;
  }

  const seatColors = { regular: 'bg-neutral-100 border-neutral-300 text-neutral-700', vip: 'bg-amber-50 border-amber-200 text-amber-800', premium: 'bg-primary-50 border-primary-200 text-primary-800' };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">Book Tickets</h1>
        <p className="text-gray-500 mb-8">{event.title}</p>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {['Select Seats', 'Payment', 'Confirmation'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step > i ? 'bg-primary-500 text-white' : step === i + 1 ? 'bg-primary-100 text-primary-600 border-2 border-primary-500' : 'bg-gray-200 text-gray-500'}`}>
                {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:block ${step === i + 1 ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500'}`}>{label}</span>
              {i < 2 && <div className="w-8 h-0.5 bg-gray-200 dark:bg-gray-700" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2 card">
            <div className="text-center mb-6">
              <div className="inline-block bg-gray-800 text-white text-xs px-8 py-2 rounded-t-full mb-4">STAGE</div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {[...new Set(seats.map((s) => s.row))].map((row) => (
                <div key={row} className="flex items-center justify-center gap-2">
                  <span className="w-6 text-xs text-gray-500 font-medium">{row}</span>
                  {seats.filter((s) => s.row === row).map((seat) => {
                    const isSelected = selectedSeats.find((s) => s.row === seat.row && s.number === seat.number);
                    return (
                      <button
                        key={`${seat.row}${seat.number}`}
                        onClick={() => toggleSeat(seat)}
                        disabled={seat.isBooked}
                        className={`w-8 h-8 rounded text-xs font-medium border transition-all ${
                          seat.isBooked ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed line-through' :
                          isSelected ? 'bg-primary-500 border-primary-600 text-white scale-110' :
                          seatColors[seat.type]
                        }`}
                      >
                        {seat.number}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 mt-6 text-xs">
              {Object.entries(seatColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div className={`w-4 h-4 rounded border ${color}`} />
                  <span className="capitalize text-gray-500">{type}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-primary-500" />
                <span className="text-gray-500">Selected</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card h-fit sticky top-24">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>

            {selectedSeats.length === 0 ? (
              <p className="text-gray-500 text-sm">No seats selected</p>
            ) : (
              <div className="space-y-2 mb-4">
                {selectedSeats.map((seat) => (
                  <div key={`${seat.row}${seat.number}`} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Seat {seat.row}{seat.number} ({seat.type})</span>
                    <span className="font-medium flex items-center"><IndianRupee className="w-3 h-3" />{seat.price}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="flex items-center text-primary-600"><IndianRupee className="w-4 h-4" />{totalAmount}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Method</p>
              <div className="grid grid-cols-2 gap-2">
                {['razorpay', 'stripe'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-2 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                      paymentMethod === method ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={loading || selectedSeats.length === 0}
              className="btn-primary w-full !py-3 disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
