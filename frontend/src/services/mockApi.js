import {
  getStore,
  saveStore,
  delay,
  findCategory,
  populateEvent,
  categories,
  organizers,
  demoUsers,
  stats,
  monthlyBookings,
  categoryStats,
  reviews as seedReviews,
} from '../data/store.js';

const ok = (data) => ({ data: { success: true, ...data } });

const getUserById = (store, id) => {
  const all = [...store.users, ...store.registeredUsers];
  return all.find((u) => u._id === id);
};

const getUserByEmail = (store, email) => {
  const all = [...store.users, ...store.registeredUsers];
  return all.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

const populateEventFull = (event, store) => {
  if (!event) return null;
  const cat = findCategory(event.category);
  const org = organizers.find((o) => o._id === event.organizer);
  return {
    ...event,
    category: cat,
    organizer: org ? { ...org, organizationName: org.organizationName } : event.organizer,
  };
};

const filterEvents = (events, params) => {
  let result = events.filter((e) => e.status === (params.status || 'approved'));
  if (params.category) result = result.filter((e) => e.category === params.category);
  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags?.some((t) => t.includes(q))
    );
  }
  if (params.city) result = result.filter((e) => e.venue.city?.toLowerCase().includes(params.city.toLowerCase()));
  if (params.minPrice) result = result.filter((e) => e.ticketPricing.regular >= Number(params.minPrice));
  if (params.maxPrice) result = result.filter((e) => e.ticketPricing.regular <= Number(params.maxPrice));
  if (!params.date) {
    result = result.filter((e) => new Date(e.date) >= new Date() || params.status !== 'approved');
  }
  return result.sort((a, b) => new Date(a.date) - new Date(b.date));
};

const genRef = () => `EVT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const parseUrl = (url, baseURL) => {
  const path = url.replace(baseURL, '').replace(/^\//, '');
  const [pathname, queryString] = path.split('?');
  const params = Object.fromEntries(new URLSearchParams(queryString || ''));
  const parts = pathname.split('/').filter(Boolean);
  return { parts, params, pathname };
};

const mockHandler = async (method, url, data, baseURL = '/api') => {
  await delay(200);
  const store = getStore();
  const { parts, params } = parseUrl(url, baseURL);

  // AUTH
  if (parts[0] === 'auth') {
    if (parts[1] === 'login' && method === 'POST') {
      const user = getUserByEmail(store, data.email);
      if (!user || user.password !== data.password) throw { response: { data: { message: 'Invalid credentials' } } };
      if (!user.isActive) throw { response: { data: { message: 'Account deactivated' } } };
      const { password, ...safe } = user;
      return ok({ token: `mock_token_${user._id}`, user: safe });
    }
    if (parts[1] === 'register' && method === 'POST') {
      if (getUserByEmail(store, data.email)) throw { response: { data: { message: 'Email already registered' } } };
      const newUser = {
        _id: `user_${Date.now()}`,
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role === 'organizer' ? 'organizer' : 'user',
        phone: data.phone || '',
        isVerified: true,
        isActive: true,
        savedEvents: [],
        wishlist: [],
        preferences: { language: 'en', theme: 'light', notifications: true },
      };
      store.registeredUsers.push(newUser);
      saveStore(store);
      const { password, ...safe } = newUser;
      return ok({ token: `mock_token_${newUser._id}`, user: safe });
    }
    if (parts[1] === 'me' && method === 'GET') {
      const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null;
      const user = getUserById(store, userId);
      if (!user) throw { response: { status: 401 } };
      const saved = user.savedEvents?.map((id) => populateEventFull(store.events.find((e) => e._id === id), store)).filter(Boolean);
      const { password, ...safe } = user;
      return ok({ user: { ...safe, savedEvents: saved } });
    }
    if (parts[1] === 'forgot-password' && method === 'POST') return ok({ message: 'Password reset email sent (demo mode)' });
    if (parts[1] === 'reset-password' && method === 'PUT') return ok({ message: 'Password reset successful' });
    if (parts[1] === 'update-password' && method === 'PUT') return ok({ token: 'mock_token', message: 'Password updated' });
  }

  // EVENTS
  if (parts[0] === 'events') {
    if (parts[1] === 'featured') {
      const featured = store.events
        .filter((e) => e.status === 'approved' && new Date(e.date) >= new Date())
        .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
        .slice(0, 8)
        .map((e) => populateEventFull(e, store));
      return ok({ events: featured });
    }
    if (parts[1] === 'categories' && parts[2] === 'all') {
      const cats = categories.map((c) => ({
        ...c,
        eventCount: store.events.filter((e) => e.category === c._id && e.status === 'approved').length,
      }));
      return ok({ categories: cats });
    }
    if (parts[1] === 'stats') return ok({ stats });
    if (parts[1] === 'calendar') {
      const month = Number(params.month || new Date().getMonth() + 1);
      const year = Number(params.year || new Date().getFullYear());
      const calEvents = store.events
        .filter((e) => {
          const d = new Date(e.date);
          return e.status === 'approved' && d.getMonth() + 1 === month && d.getFullYear() === year;
        })
        .map((e) => populateEventFull(e, store));
      return ok({ events: calEvents });
    }
    if (parts[1] && parts[2] === 'seats') {
      const event = store.events.find((e) => e._id === parts[1]);
      if (!event) throw { response: { data: { message: 'Event not found' } } };
      return ok({ seats: event.seats, availableSeats: event.availableSeats });
    }
    if (parts[1] && parts.length === 2) {
      const event = store.events.find((e) => e._id === parts[1]);
      if (!event) throw { response: { data: { message: 'Event not found' } } };
      event.views = (event.views || 0) + 1;
      saveStore(store);
      const eventReviews = seedReviews.filter((r) => r.event === event._id);
      return ok({ event: populateEventFull(event, store), reviews: eventReviews });
    }
    if (parts.length === 1 || !parts[1]) {
      const filtered = filterEvents(store.events, params).map((e) => populateEventFull(e, store));
      return ok({ events: filtered, total: filtered.length, count: filtered.length, pages: 1, currentPage: 1 });
    }
  }

  // USERS
  if (parts[0] === 'users') {
    const userId = JSON.parse(localStorage.getItem('user') || '{}')._id;
    const user = getUserById(store, userId);
    if (parts[1] === 'profile') {
      if (method === 'GET') {
        const saved = user.savedEvents?.map((id) => populateEventFull(store.events.find((e) => e._id === id), store)).filter(Boolean);
        const wish = user.wishlist?.map((id) => populateEventFull(store.events.find((e) => e._id === id), store)).filter(Boolean);
        const { password, ...safe } = user;
        return ok({ user: { ...safe, savedEvents: saved, wishlist: wish } });
      }
      if (method === 'PUT') {
        Object.assign(user, data);
        saveStore(store);
        const { password, ...safe } = user;
        return ok({ user: safe });
      }
    }
    if (parts[1] === 'bookings') {
      const bookings = store.bookings
        .filter((b) => b.user === userId)
        .map((b) => ({ ...b, event: populateEventFull(store.events.find((e) => e._id === b.event), store) }));
      return ok({ bookings, count: bookings.length });
    }
    if (parts[1] === 'history') {
      const history = store.bookings
        .filter((b) => b.user === userId && ['confirmed', 'used'].includes(b.status))
        .map((b) => ({ ...b, event: populateEventFull(store.events.find((e) => e._id === b.event), store) }))
        .filter((b) => b.event && new Date(b.event.date) < new Date());
      return ok({ history, count: history.length });
    }
    if (parts[1] === 'notifications') {
      if (method === 'PUT') {
        store.notifications.forEach((n) => { if (n.user === userId) n.isRead = true; });
        saveStore(store);
        return ok({ message: 'Marked as read' });
      }
      const notifications = store.notifications.filter((n) => n.user === userId);
      return ok({ notifications, unreadCount: notifications.filter((n) => !n.isRead).length });
    }
    if (parts[1] === 'saved-events' && parts[2]) {
      const eventId = parts[2];
      const idx = user.savedEvents.indexOf(eventId);
      if (idx > -1) user.savedEvents.splice(idx, 1);
      else user.savedEvents.push(eventId);
      saveStore(store);
      return ok({ saved: idx === -1, savedEvents: user.savedEvents });
    }
    if (parts[1] === 'recommendations') {
      const recs = store.events
        .filter((e) => e.status === 'approved' && new Date(e.date) >= new Date())
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 6)
        .map((e) => populateEventFull(e, store));
      return ok({ recommendations: recs });
    }
  }

  // BOOKINGS
  if (parts[0] === 'bookings') {
    const userId = JSON.parse(localStorage.getItem('user') || '{}')._id;
    if (method === 'POST' && parts.length === 1) {
      const event = store.events.find((e) => e._id === data.eventId);
      if (!event) throw { response: { data: { message: 'Event not found' } } };
      let total = 0;
      const bookedSeats = [];
      for (const s of data.seats) {
        const seat = event.seats.find((x) => x.row === s.row && x.number === s.number && !x.isBooked);
        if (!seat) throw { response: { data: { message: `Seat ${s.row}${s.number} unavailable` } } };
        seat.isBooked = true;
        bookedSeats.push({ ...seat });
        total += seat.price;
      }
      event.availableSeats -= data.seats.length;
      const booking = {
        _id: `book_${Date.now()}`,
        user: userId,
        event: data.eventId,
        seats: bookedSeats,
        totalAmount: total,
        ticketCount: data.seats.length,
        bookingReference: genRef(),
        qrCode: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%2310b981" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="12">QR</text></svg>',
        status: 'pending',
        checkedIn: false,
        createdAt: new Date().toISOString(),
      };
      store.bookings.push(booking);
      saveStore(store);
      return ok({ booking, paymentRequired: true, amount: total, provider: data.paymentProvider });
    }
    if (parts[1] && parts[2] === 'cancel') {
      const booking = store.bookings.find((b) => b._id === parts[1]);
      booking.status = 'cancelled';
      saveStore(store);
      return ok({ booking, message: 'Cancelled' });
    }
    if (parts[1]) {
      const booking = store.bookings.find((b) => b._id === parts[1]);
      return ok({
        booking: {
          ...booking,
          event: populateEventFull(store.events.find((e) => e._id === booking.event), store),
          user: getUserById(store, booking.user),
        },
      });
    }
  }

  // PAYMENTS
  if (parts[0] === 'payments') {
    if (parts[1] === 'razorpay' && parts[2] === 'create-order') {
      const booking = store.bookings.find((b) => b._id === data.bookingId);
      if (booking) booking.status = 'confirmed';
      saveStore(store);
      return ok({ devMode: true, message: 'Payment simulated', payment: { status: 'completed' } });
    }
    if (parts[1] === 'razorpay' && parts[2] === 'verify') {
      const booking = store.bookings.find((b) => b._id === data.bookingId);
      if (booking) booking.status = 'confirmed';
      saveStore(store);
      return ok({ booking });
    }
    if (parts[1] === 'stripe' && parts[2] === 'create-intent') {
      const booking = store.bookings.find((b) => b._id === data.bookingId);
      if (booking) booking.status = 'confirmed';
      saveStore(store);
      return ok({ devMode: true });
    }
    if (parts[1] === 'history') return ok({ payments: [] });
  }

  // ORGANIZER
  if (parts[0] === 'organizer') {
    const orgEvents = store.events.filter((e) => e.organizer === 'org_1' || e.organizer === 'org_2');
    if (parts[1] === 'dashboard') {
      const revenue = store.bookings.filter((b) => b.status === 'confirmed').reduce((s, b) => s + b.totalAmount, 0);
      return ok({
        stats: {
          totalEvents: orgEvents.length,
          totalRevenue: revenue,
          totalBookings: store.bookings.length,
          upcomingEvents: orgEvents.filter((e) => new Date(e.date) > new Date()).length,
        },
        recentEvents: orgEvents.slice(0, 5),
      });
    }
    if (parts[1] === 'events' && method === 'GET' && parts.length === 2) {
      return ok({ events: orgEvents.map((e) => populateEventFull(e, store)) });
    }
    if (parts[1] === 'events' && method === 'POST') {
      const newEvent = {
        _id: `evt_${Date.now()}`,
        ...data,
        organizer: 'org_1',
        status: 'pending',
        availableSeats: data.totalSeats,
        seats: [],
        averageRating: 0,
        totalReviews: 0,
        totalBookings: 0,
        revenue: 0,
        views: 0,
        isFeatured: false,
      };
      store.events.push(newEvent);
      saveStore(store);
      return ok({ event: newEvent });
    }
    if (parts[1] === 'events' && method === 'DELETE') {
      store.events = store.events.filter((e) => e._id !== parts[2]);
      saveStore(store);
      return ok({ message: 'Deleted' });
    }
    if (parts[1] === 'events' && parts[3] === 'analytics') {
      const event = store.events.find((e) => e._id === parts[2]);
      const bookings = store.bookings.filter((b) => b.event === parts[2] && b.status === 'confirmed');
      const revenue = bookings.reduce((s, b) => s + b.totalAmount, 0);
      return ok({
        analytics: {
          totalBookings: bookings.length,
          totalTickets: bookings.reduce((s, b) => s + b.ticketCount, 0),
          revenue,
          views: event?.views || 0,
          availableSeats: event?.availableSeats,
          totalSeats: event?.totalSeats,
          occupancyRate: event ? (((event.totalSeats - event.availableSeats) / event.totalSeats) * 100).toFixed(1) : 0,
          ticketTypes: { regular: 10, vip: 5, premium: 3 },
        },
      });
    }
    if (parts[1] === 'events' && parts[3] === 'attendees') {
      const attendees = store.bookings
        .filter((b) => b.event === parts[2])
        .map((b) => ({ ...b, user: getUserById(store, b.user) }));
      return ok({ attendees });
    }
    if (parts[1] === 'verify-ticket' && method === 'POST') {
      const booking = store.bookings.find((b) => b.bookingReference === data.bookingReference);
      if (!booking) throw { response: { data: { message: 'Invalid ticket' } } };
      if (booking.checkedIn) throw { response: { data: { message: 'Already used' } } };
      booking.checkedIn = true;
      booking.status = 'used';
      saveStore(store);
      return ok({
        attendee: getUserById(store, booking.user),
        event: populateEventFull(store.events.find((e) => e._id === booking.event), store),
      });
    }
  }

  // ADMIN
  if (parts[0] === 'admin') {
    if (parts[1] === 'dashboard') {
      return ok({
        stats: {
          totalUsers: store.users.length + store.registeredUsers.length,
          totalOrganizers: organizers.length,
          totalEvents: store.events.length,
          pendingEvents: store.events.filter((e) => e.status === 'pending').length,
          totalBookings: store.bookings.length,
          totalRevenue: store.bookings.reduce((s, b) => s + (b.totalAmount || 0), 0),
        },
        recentBookings: store.bookings.slice(0, 5).map((b) => ({
          ...b,
          user: getUserById(store, b.user),
          event: store.events.find((e) => e._id === b.event),
        })),
      });
    }
    if (parts[1] === 'users') {
      const allUsers = [...store.users, ...store.registeredUsers].map(({ password, ...u }) => u);
      return ok({ users: allUsers, total: allUsers.length, pages: 1 });
    }
    if (parts[1] === 'users' && method === 'PUT') {
      const user = getUserById(store, parts[2]);
      Object.assign(user, data);
      saveStore(store);
      const { password, ...safe } = user;
      return ok({ user: safe });
    }
    if (parts[1] === 'organizers') {
      const orgs = organizers.map((o) => ({
        ...o,
        user: getUserById(store, o.user) || demoUsers.find((u) => u._id === o.user),
      }));
      return ok({ organizers: orgs });
    }
    if (parts[1] === 'organizers' && method === 'PUT') {
      return ok({ organizer: { ...organizers[0], ...data } });
    }
    if (parts[1] === 'events' && parts[2] === 'pending') {
      return ok({ events: store.events.filter((e) => e.status === 'pending').map((e) => populateEventFull(e, store)) });
    }
    if (parts[1] === 'events' && method === 'GET') {
      return ok({ events: store.events.map((e) => populateEventFull(e, store)) });
    }
    if (parts[1] === 'events' && parts[3] === 'status' && method === 'PUT') {
      const event = store.events.find((e) => e._id === parts[2]);
      if (event) { event.status = data.status; event.rejectionReason = data.rejectionReason; }
      saveStore(store);
      return ok({ event: populateEventFull(event, store) });
    }
    if (parts[1] === 'reports') {
      if (method === 'PUT') {
        const report = store.reports.find((r) => r._id === parts[2]);
        if (report) Object.assign(report, data);
        saveStore(store);
        return ok({ report });
      }
      return ok({ reports: store.reports });
    }
    if (parts[1] === 'analytics') return ok({ monthlyBookings, categoryStats });
  }

  // MISC
  if (parts[0] === 'contact' && method === 'POST') return ok({ message: 'Thank you!' });
  if (parts[0] === 'chat') {
    if (method === 'POST') {
      const msg = { _id: `msg_${Date.now()}`, user: JSON.parse(localStorage.getItem('user')), message: data.message, sessionId: data.sessionId, isFromSupport: false, createdAt: new Date().toISOString() };
      if (!store.chatMessages[data.sessionId]) store.chatMessages[data.sessionId] = [];
      store.chatMessages[data.sessionId].push(msg);
      saveStore(store);
      return ok({ message: { ...msg, user: JSON.parse(localStorage.getItem('user')) } });
    }
    const messages = store.chatMessages[parts[1]] || [];
    return ok({ messages });
  }
  if (parts[0] === 'reviews' && parts[1] === 'event') {
    return ok({ reviews: seedReviews.filter((r) => r.event === parts[2]) });
  }

  throw { response: { data: { message: 'Not found' }, status: 404 } };
};

export default mockHandler;
