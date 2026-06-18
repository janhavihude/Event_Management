# EventOrganizer - Full Stack Event Management Platform

A modern, production-ready event organizer website built with React.js, Node.js, Express.js, MongoDB, Tailwind CSS, and JWT Authentication.

## Features

### Public
- Landing page with hero, categories, events, testimonials, stats, and contact
- Event search, filters, and calendar view
- Event details with Google Maps, reviews, and sharing
- Multi-language support (English, Hindi, Marathi)

### Authentication
- User registration and login with JWT
- Google OAuth login
- Forgot/reset password
- Role-based access (Admin, Organizer, User)

### User Dashboard
- Profile management
- My bookings with PDF ticket download
- Saved events and wishlist
- Real-time notifications (Socket.io)
- Event history and AI recommendations
- Dark/light mode toggle

### Organizer Dashboard
- Create, edit, and delete events
- Event analytics with charts
- Attendee management
- QR ticket verification
- Revenue tracking

### Admin Dashboard
- Manage users and organizers
- Approve/reject events
- Site analytics and reports
- System settings

### Booking & Payments
- Online seat selection
- Razorpay and Stripe integration
- QR code tickets and PDF download
- Payment history and refunds

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT, Passport Google OAuth |
| Payments | Razorpay, Stripe |
| Real-time | Socket.io |
| Charts | Recharts |
| i18n | i18next |

## Project Structure

```
pranoti/
├── backend/
│   ├── config/          # DB and Passport config
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth and error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Email, tickets, notifications
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth and theme providers
│   │   ├── hooks/       # Custom hooks
│   │   ├── i18n/        # Translations
│   │   ├── pages/       # All page components
│   │   └── services/    # API client
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. **Clone and install dependencies:**
```bash
cd backend && npm install
cd ../frontend && npm install
```

2. **Configure environment:**
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with your credentials
```

3. **Seed the database:**
```bash
cd backend && npm run seed
```

4. **Start development servers:**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

5. Open http://localhost:5173

### Demo Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@eventorganizer.com | admin123 |
| Organizer | organizer@eventorganizer.com | organizer123 |
| User | user@eventorganizer.com | user123 |

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `GET /api/auth/google` - Google OAuth

### Events
- `GET /api/events` - List events (with filters)
- `GET /api/events/:id` - Event details
- `GET /api/events/featured` - Featured events
- `GET /api/events/calendar` - Calendar view

### Bookings & Payments
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id/ticket` - Download PDF ticket
- `POST /api/payments/razorpay/create-order` - Razorpay payment
- `POST /api/payments/stripe/create-intent` - Stripe payment

### Organizer (protected)
- `POST /api/organizer/events` - Create event
- `GET /api/organizer/dashboard` - Dashboard stats
- `POST /api/organizer/verify-ticket` - Verify QR ticket

### Admin (protected)
- `GET /api/admin/dashboard` - Admin stats
- `PUT /api/admin/events/:id/status` - Approve/reject events
- `GET /api/admin/users` - Manage users

## Deployment

### Backend (e.g., Railway, Render)
```bash
cd backend
npm start
# Set MONGODB_URI, JWT_SECRET, and payment keys in environment
```

### Frontend (e.g., Vercel, Netlify)
```bash
cd frontend
npm run build
# Set VITE_API_URL to your backend URL
```

## Database Collections

Users, Events, Bookings, Payments, Reviews, Notifications, Categories, Organizers, Reports, ChatMessages

## License

MIT
