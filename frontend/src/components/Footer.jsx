import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-neutral-900 text-neutral-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950/50 via-neutral-900 to-accent-950/30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/50 to-accent-400/50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Event<span className="text-transparent bg-clip-text bg-brand-gradient">Organizer</span>
              </span>
            </div>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              Your one-stop platform to discover, book, and manage amazing events across India.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-neutral-800/80 hover:bg-primary-500 rounded-xl flex items-center justify-center transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Events', to: '/events' },
                { label: 'Calendar', to: '/calendar' },
                { label: 'Contact', to: '/#contact' },
                { label: 'Login', to: '/login' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-neutral-400 hover:text-primary-300 transition-colors duration-300 hover:translate-x-1 inline-block">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5">Categories</h4>
            <ul className="space-y-3 text-sm">
              {['Music', 'Technology', 'Sports', 'Business', 'Food & Drink', 'Wellness'].map((cat) => (
                <li key={cat}>
                  <Link to="/events" className="text-neutral-400 hover:text-neutral-200 transition-colors duration-300">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-neutral-400">
                <Mail className="w-4 h-4 text-primary-300 flex-shrink-0" />
                support@eventorganizer.com
              </li>
              <li className="flex items-center gap-3 text-neutral-400">
                <Phone className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex items-start gap-3 text-neutral-400">
                <MapPin className="w-4 h-4 text-primary-300 flex-shrink-0 mt-0.5" />
                Mumbai, Maharashtra, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800/80 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
          <p className="flex items-center gap-1">
            &copy; {new Date().getFullYear()} EventOrganizer. Made with <Heart className="w-4 h-4 text-primary-400 fill-primary-400" /> in India
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
