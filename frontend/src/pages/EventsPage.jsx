import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import api from '../services/api';
import { HERO_BG_CONCERT } from '../data/eventImages';
import EventImage from '../components/EventImage';

const EventsPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    city: '',
    minPrice: '',
    maxPrice: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    api.get('/events/categories/all').then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => { if (val) params.set(key, val); });

    api.get(`/events?${params}`).then(({ data }) => {
      setEvents(data.events || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, search: e.target.search.value });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Navbar />
      <div className="relative pt-16 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${HERO_BG_CONCERT}')` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-800/80 via-neutral-900/75 to-neutral-800/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-display text-4xl font-extrabold text-white mb-2">Discover Events</h1>
          <p className="text-white/70 text-lg">Find and book amazing events near you</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6">

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input name="search" type="text" placeholder={t('events.search')} defaultValue={filters.search} className="input-field !pl-12 !py-3" />
          </form>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-outline flex items-center gap-2 !py-3">
            <SlidersHorizontal className="w-4 h-4" /> {t('events.filter')}
          </button>
        </div>

        {showFilters && (
          <div className="card mb-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <select className="input-field" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
            </select>
            <input type="text" placeholder="City" className="input-field" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
            <input type="number" placeholder="Min Price" className="input-field" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
            <input type="number" placeholder="Max Price" className="input-field" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
          </div>
        )}

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <button
            onClick={() => setFilters({ ...filters, category: '' })}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!filters.category ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}
          >
            All Events
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setFilters({ ...filters, category: cat._id })}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filters.category === cat._id ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}
            >
              <EventImage src={cat.image} alt={cat.name} className="w-6 h-6 rounded-full object-cover" />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card !p-0 animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t('events.noEvents')}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => <EventCard key={event._id} event={event} index={i} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EventsPage;
