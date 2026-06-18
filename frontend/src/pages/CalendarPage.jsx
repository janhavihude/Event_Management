import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  addDays,
} from 'date-fns';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getDateLocale } from '../utils/dateLocale';

const CalendarPage = () => {
  const { t, i18n } = useTranslation();
  const locale = useMemo(() => getDateLocale(i18n.language), [i18n.language]);

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

  // Localized weekday headers (short)
  const weekdayLabels = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
    return eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) }).map((d) =>
      format(d, 'EEE', { locale })
    );
  }, [locale]);

  const getEventsForDay = (day) => events.filter((e) => isSameDay(new Date(e.date), day));
  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <h1 className="font-display text-3xl font-bold text-neutral-900 dark:text-white mb-8">
          {t('calendar.title')}
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                aria-label={t('calendar.prevMonth')}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="font-semibold text-lg text-neutral-900 dark:text-white capitalize">
                {format(currentDate, 'MMMM yyyy', { locale })}
              </h2>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                aria-label={t('calendar.nextMonth')}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekdayLabels.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-neutral-500 py-2 capitalize">
                  {d}
                </div>
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
                    className={`aspect-square p-1 rounded-lg text-sm transition-all duration-200 relative ${
                      isSelected
                        ? 'bg-primary-500 text-white shadow-md scale-105'
                        : isToday
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold'
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {format(day, 'd', { locale })}
                    {dayEvents.length > 0 && (
                      <div
                        className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-white' : 'bg-primary-500'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
              {selectedDate
                ? format(selectedDate, 'PPPP', { locale })
                : t('calendar.selectDate')}
            </h3>
            {selectedEvents.length === 0 ? (
              <p className="text-neutral-500 text-sm">{t('calendar.noEvents')}</p>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((event) => (
                  <Link
                    key={event._id}
                    to={`/events/${event._id}`}
                    className="block p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors border border-neutral-100 dark:border-neutral-700"
                  >
                    <p className="font-medium text-sm text-neutral-900 dark:text-white">{event.title}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {format(new Date(event.date), 'p', { locale })} • {event.venue?.city}
                    </p>
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
