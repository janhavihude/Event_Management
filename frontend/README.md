# EventOrganizer — Frontend (Standalone)

Runs **without backend or MongoDB**. All data is stored in the browser via localStorage.

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

## What's Included

### 8 Event Categories (with real images)
| Category | Events |
|----------|--------|
| 🎵 Music | 4 events |
| 💻 Technology | 4 events |
| ⚽ Sports | 3 events |
| 🎨 Arts & Culture | 3 events |
| 💼 Business | 3 events |
| 🍽️ Food & Drink | 3 events |
| 📚 Education | 3 events |
| 🧘 Health & Wellness | 3 events |

**26 total events** with high-quality Unsplash images, venues in Mumbai/Pune, pricing, and seat maps.

### Demo Login Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@eventorganizer.com | admin123 |
| Organizer | organizer@eventorganizer.com | organizer123 |
| User | user@eventorganizer.com | user123 |

### Features Working Offline
- Landing page with categories, events, testimonials, stats
- Event browse, search, filter by category/city/price
- Event detail with map, reviews, save & share
- Seat selection & mock payment booking
- User dashboard (bookings, saved, notifications, history)
- Organizer panel (create events, analytics, verify tickets)
- Admin panel (approve events, manage users)
- Dark/light mode + English/Hindi/Marathi

## Reset Data

Open browser DevTools → Application → Local Storage → delete `eventorganizer_store`, then refresh.
