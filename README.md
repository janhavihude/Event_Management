# EventOrganizer — Frontend Application

A modern, standalone event management website built with **React**, **Vite**, and **Tailwind CSS**. Runs entirely in the browser with no backend required.

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

## Features

- Landing page with video hero, categories, events, testimonials
- Event search, filters, and **localized calendar** (English, Hindi, Marathi)
- Seat booking with mock payment
- **PDF ticket download** with QR code (generated client-side)
- User, Organizer, and Admin dashboards
- Pastel purple + neutral theme

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| User | user@eventorganizer.com | user123 |
| Organizer | organizer@eventorganizer.com | organizer123 |
| Admin | admin@eventorganizer.com | admin123 |

## Language

Switch language via the globe icon in the navbar. Calendar month names, weekdays, and dates update automatically for Marathi (मराठी) and Hindi (हिंदी).

## Project Structure

```
frontend/
├── src/
│   ├── components/    # UI components
│   ├── data/          # Mock data & localStorage store
│   ├── i18n/          # Translations (en, hi, mr)
│   ├── pages/         # All routes
│   ├── services/      # Mock API (no server)
│   └── utils/           # PDF tickets, date locales
└── package.json
```
