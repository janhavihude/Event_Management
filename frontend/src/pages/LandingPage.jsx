import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Calendar, Ticket, Sparkles, Play, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import HeroVideoBackground from '../components/HeroVideoBackground';
import AnimatedCounter from '../components/AnimatedCounter';
import EventImage from '../components/EventImage';
import api from '../services/api';
import { HERO_BG_CONCERT, HERO_BG_CROWD, HERO_BG_VENUE } from '../data/eventImages';
import toast from 'react-hot-toast';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

const LandingPage = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    Promise.all([
      api.get('/events/featured'),
      api.get('/events/categories/all'),
      api.get('/events/stats'),
    ]).then(([eventsRes, catRes, statsRes]) => {
      setEvents(eventsRes.data.events || []);
      setCategories(catRes.data.categories || []);
      setStats(statsRes.data.stats || {});
    }).catch(console.error);
  }, []);

  const testimonials = [
    { name: 'Priya Sharma', role: 'Event Attendee', text: 'Amazing platform! I discovered so many great events in Mumbai. Booking was seamless.', rating: 5, avatar: 'P', color: 'from-primary-400 to-primary-300' },
    { name: 'Rahul Patel', role: 'Organizer', text: 'As an event organizer, this platform has transformed how I manage and promote my events.', rating: 5, avatar: 'R', color: 'from-primary-500 to-neutral-400' },
    { name: 'Anita Desai', role: 'Music Lover', text: 'The seat selection feature is fantastic. I always get the best seats for concerts!', rating: 5, avatar: 'A', color: 'from-neutral-400 to-primary-400' },
  ];

  const handleContact = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contact', contactForm);
    } catch { /* demo mode */ }
    toast.success('Message sent successfully!');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar variant="hero" />

      {/* Hero with Video Background */}
      <HeroVideoBackground>
        <div className="flex-1 flex items-center pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
                  <span className="inline-flex items-center gap-2 glass text-white text-sm font-semibold px-5 py-2 rounded-full mb-8 shadow-xl">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    #1 Event Platform in India
                  </span>
                </motion.div>

                <motion.h1
                  custom={1}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 text-glow"
                >
                  Discover Amazing{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-primary-200 to-accent-300">
                    Events
                  </span>{' '}
                  Near You
                </motion.h1>

                <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible" className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {t('hero.subtitle')}
                </motion.p>

                <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/events" className="btn-primary inline-flex items-center justify-center gap-2 text-base !py-3.5 !px-8">
                    {t('hero.cta')} <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/register" className="btn-glass inline-flex items-center justify-center gap-2 text-base !py-3.5 !px-8">
                    <Play className="w-4 h-4 fill-white" /> {t('hero.cta2')}
                  </Link>
                </motion.div>

                {/* Trust badges */}
                <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-6 mt-12 justify-center lg:justify-start">
                  <div className="flex -space-x-3">
                    {['P', 'R', 'A', 'V'].map((l, i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-brand-gradient border-2 border-white/40 flex items-center justify-center text-white text-xs font-bold">
                        {l}
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="flex gap-0.5 mb-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="text-white/70 text-sm">50,000+ happy attendees</p>
                  </div>
                </motion.div>
              </div>

              {/* Floating event cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative hidden lg:block h-[500px]"
              >
                {events.slice(0, 3).map((event, i) => (
                  <motion.div
                    key={event._id}
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                    className={`absolute w-64 glass-card shadow-2xl overflow-hidden ${
                      i === 0 ? 'top-0 right-0 z-30' : i === 1 ? 'top-32 left-0 z-20' : 'bottom-0 right-12 z-10'
                    }`}
                  >
                    <EventImage src={event.images?.[0]} alt={event.title} className="w-full h-32 object-cover rounded-xl mb-3" />
                    <p className="text-white font-semibold text-sm line-clamp-1">{event.title}</p>
                    <p className="text-white/60 text-xs mt-1">{event.venue?.city}</p>
                  </motion.div>
                ))}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-white/10 rounded-full"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/50"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </HeroVideoBackground>

      {/* Statistics */}
      <section className="relative py-16 bg-brand-gradient overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay" style={{ backgroundImage: `url('${HERO_BG_CONCERT}')` }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Calendar, label: 'Total Events', value: stats.totalEvents || 500, suffix: '+' },
              { icon: Users, label: 'Happy Users', value: stats.totalUsers || 52480, suffix: '+' },
              { icon: Ticket, label: 'Bookings', value: stats.totalBookings || 128450, suffix: '+' },
              { icon: Star, label: 'Upcoming', value: stats.upcomingEvents || 200, suffix: '+' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="text-center text-white"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <stat.icon className="w-7 h-7" />
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-white/70 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 relative bg-neutral-50 dark:bg-neutral-900 bg-mesh-gradient">
        <div className="absolute inset-0 bg-hero-pattern opacity-40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">Explore</span>
            <h2 className="section-title mt-2 mb-4">Browse by Category</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Explore events across various categories and find something that excites you
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <Link
                  to={`/events?category=${cat._id}`}
                  className="block card-hover !p-0 overflow-hidden group"
                >
                  <div className="relative h-36 sm:h-40 overflow-hidden">
                    <EventImage
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/85 via-primary-900/30 to-transparent" />
                    <span className="absolute top-3 right-3 text-3xl drop-shadow-lg transition-transform duration-300 group-hover:scale-125">
                      {cat.icon}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-display font-bold text-white text-lg">{cat.name}</h3>
                      <p className="text-white/60 text-xs mt-0.5">{cat.eventCount || 0} events available</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-fixed bg-center opacity-5 dark:opacity-[0.03]" style={{ backgroundImage: `url('${HERO_BG_CROWD}')` }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-14 gap-4"
          >
            <div>
              <span className="text-neutral-500 dark:text-neutral-400 font-semibold text-sm uppercase tracking-widest">Hot Picks</span>
              <h2 className="section-title mt-2">{t('events.upcoming')}</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">Don't miss out on these exciting events</p>
            </div>
            <Link to="/events" className="btn-outline inline-flex items-center gap-2 text-sm">
              {t('events.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.slice(0, 4).map((event, i) => (
              <EventCard key={event._id} event={event} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">Reviews</span>
            <h2 className="section-title mt-2 mb-4">What People Say</h2>
            <p className="text-slate-600 dark:text-slate-400">Trusted by thousands of event lovers and organizers</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="card-hover relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`} />
                <div className="flex gap-1 mb-5">
                  {[...Array(item.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 mb-8 text-lg leading-relaxed italic">"{item.text}"</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center font-bold text-white shadow-lg`}>
                    {item.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${HERO_BG_VENUE}')` }} />
        <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-primary-400 font-semibold text-sm uppercase tracking-widest">Contact</span>
              <h2 className="font-display text-4xl font-bold text-white mt-2 mb-6">Get in Touch</h2>
              <p className="text-white/70 mb-10 text-lg leading-relaxed">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
              <div className="space-y-5">
                {[
                  { icon: '📧', text: 'support@eventorganizer.com' },
                  { icon: '📞', text: '+91 98765 43210' },
                  { icon: '📍', text: 'Mumbai, Maharashtra, India' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 glass rounded-xl px-5 py-4"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-white/90 font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.form
              onSubmit={handleContact}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Your Name" className="input-field !bg-white/10 !border-white/20 !text-white placeholder:text-white/50" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} required />
                <input type="email" placeholder="Your Email" className="input-field !bg-white/10 !border-white/20 !text-white placeholder:text-white/50" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} required />
              </div>
              <input type="text" placeholder="Subject" className="input-field !bg-white/10 !border-white/20 !text-white placeholder:text-white/50" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} required />
              <textarea placeholder="Your Message" rows={4} className="input-field resize-none !bg-white/10 !border-white/20 !text-white placeholder:text-white/50" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} required />
              <button type="submit" className="btn-primary w-full !py-3.5 text-base">
                Send Message <ArrowRight className="w-5 h-5 inline ml-2" />
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
