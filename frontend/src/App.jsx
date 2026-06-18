import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import AuthCallback from './pages/auth/AuthCallback';
import BookingPage from './pages/BookingPage';

// User Dashboard
import UserDashboard from './pages/dashboard/UserDashboard';
import ProfilePage from './pages/dashboard/ProfilePage';
import MyBookingsPage from './pages/dashboard/MyBookingsPage';
import SavedEventsPage from './pages/dashboard/SavedEventsPage';
import NotificationsPage from './pages/dashboard/NotificationsPage';
import HistoryPage from './pages/dashboard/HistoryPage';
import SettingsPage from './pages/dashboard/SettingsPage';

// Organizer Dashboard
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import OrganizerEvents from './pages/organizer/OrganizerEvents';
import CreateEventPage from './pages/organizer/CreateEventPage';
import OrganizerAnalytics from './pages/organizer/OrganizerAnalytics';
import AttendeesPage from './pages/organizer/AttendeesPage';
import VerifyTicketPage from './pages/organizer/VerifyTicketPage';
import RevenuePage from './pages/organizer/RevenuePage';

// Admin Dashboard
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageOrganizers from './pages/admin/ManageOrganizers';
import ManageEvents from './pages/admin/ManageEvents';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import ReportsPage from './pages/admin/ReportsPage';
import AdminSettings from './pages/admin/AdminSettings';

// Chat
import ChatSupport from './pages/ChatSupport';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected - Booking */}
      <Route path="/events/:id/book" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatSupport /></ProtectedRoute>} />

      {/* User Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/dashboard/bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
      <Route path="/dashboard/saved" element={<ProtectedRoute><SavedEventsPage /></ProtectedRoute>} />
      <Route path="/dashboard/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/dashboard/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
      <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* Organizer Dashboard */}
      <Route path="/organizer" element={<ProtectedRoute roles={['organizer', 'admin']}><OrganizerDashboard /></ProtectedRoute>} />
      <Route path="/organizer/events" element={<ProtectedRoute roles={['organizer', 'admin']}><OrganizerEvents /></ProtectedRoute>} />
      <Route path="/organizer/create" element={<ProtectedRoute roles={['organizer', 'admin']}><CreateEventPage /></ProtectedRoute>} />
      <Route path="/organizer/analytics" element={<ProtectedRoute roles={['organizer', 'admin']}><OrganizerAnalytics /></ProtectedRoute>} />
      <Route path="/organizer/attendees" element={<ProtectedRoute roles={['organizer', 'admin']}><AttendeesPage /></ProtectedRoute>} />
      <Route path="/organizer/verify" element={<ProtectedRoute roles={['organizer', 'admin']}><VerifyTicketPage /></ProtectedRoute>} />
      <Route path="/organizer/revenue" element={<ProtectedRoute roles={['organizer', 'admin']}><RevenuePage /></ProtectedRoute>} />
      <Route path="/organizer/profile" element={<ProtectedRoute roles={['organizer', 'admin']}><SettingsPage /></ProtectedRoute>} />

      {/* Admin Dashboard */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>} />
      <Route path="/admin/organizers" element={<ProtectedRoute roles={['admin']}><ManageOrganizers /></ProtectedRoute>} />
      <Route path="/admin/events" element={<ProtectedRoute roles={['admin']}><ManageEvents /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><AdminAnalytics /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><ReportsPage /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute roles={['admin']}><AdminSettings /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
