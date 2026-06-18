import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import api from '../services/api';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    api.get(`/events/calendar?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`)
      .then(({ data }) => setEvents(data.events || []));
  }, [currentDate]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const startDay = startOfMonth(currentDate).getDay();
  const padding = Array(startDay).fill(null);

  const getEventsForDay = (day) => events.filter((e) => isSameDay(new Date(e.date), day));
  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-8">Event Calendar</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {padding.map((_, i) => <div key={`pad-${i}`} />)}
              {days.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square p-1 rounded-lg text-sm transition-colors relative ${
                      isSelected ? 'bg-primary-500 text-white' :
                      isToday ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700' :
                      'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {format(day, 'd')}
                    {dayEvents.length > 0 && (
                      <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-primary-500'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Select a date'}
            </h3>
            {selectedEvents.length === 0 ? (
              <p className="text-gray-500 text-sm">No events on this date</p>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((event) => (
                  <Link key={event._id} to={`/events/${event._id}`} className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{event.title}</p>
                    <p className="text-xs text-gray-500">{format(new Date(event.date), 'hh:mm a')} • {event.venue?.city}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CalendarPage;
