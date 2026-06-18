import {
  categories,
  events as seedEvents,
  demoUsers,
  organizers,
  reviews,
  initialBookings,
  initialNotifications,
  reports,
  stats,
  monthlyBookings,
  categoryStats,
} from './mockData.js';

const STORAGE_KEY = 'eventorganizer_store';
const STORE_VERSION = 2;

const defaultStore = () => ({
  events: JSON.parse(JSON.stringify(seedEvents)),
  users: JSON.parse(JSON.stringify(demoUsers)),
  bookings: JSON.parse(JSON.stringify(initialBookings)),
  notifications: JSON.parse(JSON.stringify(initialNotifications)),
  reports: JSON.parse(JSON.stringify(reports)),
  chatMessages: {},
  registeredUsers: [],
  version: STORE_VERSION,
});

export const getStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const store = defaultStore();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      return store;
    }
    const store = JSON.parse(raw);
    // Refresh image URLs when seed data is updated
    if (store.version !== STORE_VERSION) {
      seedEvents.forEach((se) => {
        const existing = store.events.find((e) => e._id === se._id);
        if (existing) existing.images = se.images;
        else store.events.push(JSON.parse(JSON.stringify(se)));
      });
      store.version = STORE_VERSION;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } else {
      // Merge any new seed events not in store
      seedEvents.forEach((se) => {
        if (!store.events.find((e) => e._id === se._id)) store.events.push(JSON.parse(JSON.stringify(se)));
      });
    }
    return store;
  } catch {
    const store = defaultStore();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return store;
  }
};

export const saveStore = (store) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const resetStore = () => {
  const store = defaultStore();
  saveStore(store);
  return store;
};

export const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const findCategory = (id) => categories.find((c) => c._id === id);

export const populateEvent = (event, store) => {
  if (!event) return null;
  const cat = categories.find((c) => c._id === (event.category?._id || event.category));
  return { ...event, category: cat || event.category };
};

export { categories, demoUsers, organizers, reviews, stats, monthlyBookings, categoryStats };
