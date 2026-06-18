import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', images: [''], category: '', date: '', endDate: '',
    venue: { name: '', address: '', city: '', state: '', country: 'India', coordinates: { lat: '', lng: '' } },
    ticketPricing: { regular: '', vip: '', premium: '' },
    totalSeats: '', tags: '',
  });

  useEffect(() => {
    api.get('/events/categories/all').then(({ data }) => setCategories(data.categories));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        images: form.images.filter(Boolean),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        ticketPricing: {
          regular: Number(form.ticketPricing.regular),
          vip: Number(form.ticketPricing.vip) || 0,
          premium: Number(form.ticketPricing.premium) || 0,
        },
        totalSeats: Number(form.totalSeats),
        venue: {
          ...form.venue,
          coordinates: {
            lat: Number(form.venue.coordinates.lat) || 0,
            lng: Number(form.venue.coordinates.lng) || 0,
          },
        },
      };
      await api.post('/organizer/events', payload);
      toast.success('Event created! Pending admin approval.');
      navigate('/organizer/events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field, value) => setForm({ ...form, [field]: value });
  const updateVenue = (field, value) => setForm({ ...form, venue: { ...form.venue, [field]: value } });
  const updatePricing = (field, value) => setForm({ ...form, ticketPricing: { ...form.ticketPricing, [field]: value } });

  return (
    <DashboardLayout type="organizer">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">Create New Event</h1>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Basic Information</h3>
          <input className="input-field" placeholder="Event Title" value={form.title} onChange={(e) => updateForm('title', e.target.value)} required />
          <textarea className="input-field resize-none" rows={4} placeholder="Event Description" value={form.description} onChange={(e) => updateForm('description', e.target.value)} required />
          <select className="input-field" value={form.category} onChange={(e) => updateForm('category', e.target.value)} required>
            <option value="">Select Category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
          </select>
          <input className="input-field" placeholder="Image URL" value={form.images[0]} onChange={(e) => updateForm('images', [e.target.value])} />
          <input className="input-field" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => updateForm('tags', e.target.value)} />
        </div>

        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Date & Time</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Start Date & Time</label>
              <input type="datetime-local" className="input-field" value={form.date} onChange={(e) => updateForm('date', e.target.value)} required />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">End Date & Time</label>
              <input type="datetime-local" className="input-field" value={form.endDate} onChange={(e) => updateForm('endDate', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Venue</h3>
          <input className="input-field" placeholder="Venue Name" value={form.venue.name} onChange={(e) => updateVenue('name', e.target.value)} required />
          <input className="input-field" placeholder="Address" value={form.venue.address} onChange={(e) => updateVenue('address', e.target.value)} required />
          <div className="grid sm:grid-cols-2 gap-4">
            <input className="input-field" placeholder="City" value={form.venue.city} onChange={(e) => updateVenue('city', e.target.value)} />
            <input className="input-field" placeholder="State" value={form.venue.state} onChange={(e) => updateVenue('state', e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <input className="input-field" placeholder="Latitude" value={form.venue.coordinates.lat} onChange={(e) => setForm({ ...form, venue: { ...form.venue, coordinates: { ...form.venue.coordinates, lat: e.target.value } } })} />
            <input className="input-field" placeholder="Longitude" value={form.venue.coordinates.lng} onChange={(e) => setForm({ ...form, venue: { ...form.venue, coordinates: { ...form.venue.coordinates, lng: e.target.value } } })} />
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Tickets & Pricing</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Regular (₹)</label>
              <input type="number" className="input-field" value={form.ticketPricing.regular} onChange={(e) => updatePricing('regular', e.target.value)} required />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">VIP (₹)</label>
              <input type="number" className="input-field" value={form.ticketPricing.vip} onChange={(e) => updatePricing('vip', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Premium (₹)</label>
              <input type="number" className="input-field" value={form.ticketPricing.premium} onChange={(e) => updatePricing('premium', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Total Seats</label>
            <input type="number" className="input-field" value={form.totalSeats} onChange={(e) => updateForm('totalSeats', e.target.value)} required min={1} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary !px-8">
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </DashboardLayout>
  );
};

export default CreateEventPage;
