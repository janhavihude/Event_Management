import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, IndianRupee, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import EventImage from './EventImage';

const EventCard = ({ event, index = 0 }) => {
  const image = event.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      className="card-hover group !p-0 overflow-hidden"
    >
      <Link to={`/events/${event._id}`}>
        <div className="relative h-52 overflow-hidden">
          <EventImage
            src={image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/75 via-neutral-900/15 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500" />

          {event.isFeatured && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="absolute top-3 left-3 bg-primary-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-md"
            >
              ✨ Featured
            </motion.span>
          )}
          {event.category && (
            <span className="absolute top-3 right-3 glass text-white text-xs font-medium px-3 py-1 rounded-full">
              {event.category.icon} {event.category.name}
            </span>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-display font-bold text-lg text-white mb-1 line-clamp-1 drop-shadow-lg">
              {event.title}
            </h3>
          </div>
        </div>

        <div className="p-5 space-y-2.5">
          <div className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-500 flex-shrink-0" />
              <span>{format(new Date(event.date), 'MMM dd, yyyy • hh:mm a')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-neutral-400 flex-shrink-0" />
              <span className="line-clamp-1">{event.venue?.name}, {event.venue?.city}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4 text-primary-500" />
                <span className="font-bold text-lg text-primary-600 dark:text-primary-400">
                  {event.ticketPricing?.regular?.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">onwards</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-primary-500 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                Book <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
