import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home', events: 'Events', calendar: 'Calendar', about: 'About', contact: 'Contact',
        login: 'Login', register: 'Register', dashboard: 'Dashboard', logout: 'Logout',
      },
      hero: {
        title: 'Discover Amazing Events Near You',
        subtitle: 'Find, book, and experience the best events in your city. From concerts to conferences, we have it all.',
        cta: 'Explore Events', cta2: 'Create Event',
      },
      events: {
        upcoming: 'Upcoming Events', featured: 'Featured Events', viewAll: 'View All Events',
        search: 'Search events...', filter: 'Filter', noEvents: 'No events found',
      },
      calendar: {
        title: 'Event Calendar',
        selectDate: 'Select a date',
        noEvents: 'No events on this date',
        prevMonth: 'Previous month',
        nextMonth: 'Next month',
      },
      bookings: {
        none: 'No bookings found',
        ref: 'Ref',
        tickets: 'ticket(s)',
        seats: 'Seats',
        download: 'Download Ticket',
        qrIncluded: 'QR included in PDF',
        ticketDownloaded: 'Ticket downloaded successfully!',
        ticketFailed: 'Failed to generate ticket',
        ticketNotReady: 'Ticket not available yet',
      },
      auth: {
        login: 'Login', register: 'Register', email: 'Email', password: 'Password', name: 'Full Name',
        forgotPassword: 'Forgot Password?', noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?', googleLogin: 'Continue with Google',
      },
      dashboard: {
        welcome: 'Welcome back', profile: 'Profile', bookings: 'My Bookings', saved: 'Saved Events',
        notifications: 'Notifications', history: 'Event History', settings: 'Settings',
      },
      common: {
        loading: 'Loading...', save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit',
        view: 'View', back: 'Back', submit: 'Submit', confirm: 'Confirm',
      },
    },
  },
  hi: {
    translation: {
      nav: {
        home: 'होम', events: 'इवेंट्स', calendar: 'कैलेंडर', about: 'हमारे बारे में', contact: 'संपर्क',
        login: 'लॉगिन', register: 'रजिस्टर', dashboard: 'डैशबोर्ड', logout: 'लॉगआउट',
      },
      hero: {
        title: 'अपने पास अद्भुत इवेंट्स खोजें',
        subtitle: 'अपने शहर में सर्वश्रेष्ठ इवेंट्स खोजें, बुक करें और अनुभव करें।',
        cta: 'इवेंट्स देखें', cta2: 'इवेंट बनाएं',
      },
      events: {
        upcoming: 'आगामी इवेंट्स', featured: 'विशेष इवेंट्स', viewAll: 'सभी देखें',
        search: 'इवेंट्स खोजें...', filter: 'फ़िल्टर', noEvents: 'कोई इवेंट नहीं मिला',
      },
      calendar: {
        title: 'इवेंट कैलेंडर',
        selectDate: 'एक तारीख चुनें',
        noEvents: 'इस तारीख पर कोई इवेंट नहीं',
        prevMonth: 'पिछला महीना',
        nextMonth: 'अगला महीना',
      },
      bookings: {
        none: 'कोई बुकिंग नहीं मिली',
        ref: 'संदर्भ',
        tickets: 'टिकट',
        seats: 'सीटें',
        download: 'टिकट डाउनलोड करें',
        qrIncluded: 'PDF में QR शामिल',
        ticketDownloaded: 'टिकट सफलतापूर्वक डाउनलोड हुआ!',
        ticketFailed: 'टिकट बनाने में विफल',
        ticketNotReady: 'टिकट अभी उपलब्ध नहीं',
      },
      auth: {
        login: 'लॉगिन', register: 'रजिस्टर', email: 'ईमेल', password: 'पासवर्ड', name: 'पूरा नाम',
        forgotPassword: 'पासवर्ड भूल गए?', noAccount: 'खाता नहीं है?',
        hasAccount: 'पहले से खाता है?', googleLogin: 'Google से जारी रखें',
      },
      dashboard: {
        welcome: 'वापसी पर स्वागत है', profile: 'प्रोफ़ाइल', bookings: 'मेरी बुकिंग', saved: 'सहेजे गए',
        notifications: 'सूचनाएं', history: 'इतिहास', settings: 'सेटिंग्स',
      },
      common: {
        loading: 'लोड हो रहा है...', save: 'सहेजें', cancel: 'रद्द करें', delete: 'हटाएं', edit: 'संपादित',
        view: 'देखें', back: 'वापस', submit: 'जमा करें', confirm: 'पुष्टि करें',
      },
    },
  },
  mr: {
    translation: {
      nav: {
        home: 'मुख्यपृष्ठ', events: 'कार्यक्रम', calendar: 'दिनदर्शिका', about: 'आमच्याबद्दल', contact: 'संपर्क',
        login: 'लॉगिन', register: 'नोंदणी', dashboard: 'डॅशबोर्ड', logout: 'लॉगआउट',
      },
      hero: {
        title: 'तुमच्या जवळचे अद्भुत कार्यक्रम शोधा',
        subtitle: 'तुमच्या शहरातील सर्वोत्तम कार्यक्रम शोधा, बुक करा आणि अनुभव घ्या.',
        cta: 'कार्यक्रम पहा', cta2: 'कार्यक्रम तयार करा',
      },
      events: {
        upcoming: 'आगामी कार्यक्रम', featured: 'विशेष कार्यक्रम', viewAll: 'सर्व पहा',
        search: 'कार्यक्रम शोधा...', filter: 'फिल्टर', noEvents: 'कोणतेही कार्यक्रम सापडले नाहीत',
      },
      calendar: {
        title: 'कार्यक्रम दिनदर्शिका',
        selectDate: 'एक तारीख निवडा',
        noEvents: 'या तारखेला कोणतेही कार्यक्रम नाहीत',
        prevMonth: 'मागील महिना',
        nextMonth: 'पुढील महिना',
      },
      bookings: {
        none: 'कोणतीही बुकिंग सापडली नाही',
        ref: 'संदर्भ',
        tickets: 'तिकिटे',
        seats: 'जागा',
        download: 'तिकीट डाउनलोड करा',
        qrIncluded: 'PDF मध्ये QR समाविष्ट',
        ticketDownloaded: 'तिकीट यशस्वीरित्या डाउनलोड झाले!',
        ticketFailed: 'तिकीट तयार करण्यात अयशस्वी',
        ticketNotReady: 'तिकीट अद्याप उपलब्ध नाही',
      },
      auth: {
        login: 'लॉगिन', register: 'नोंदणी', email: 'ईमेल', password: 'पासवर्ड', name: 'पूर्ण नाव',
        forgotPassword: 'पासवर्ड विसरलात?', noAccount: 'खाते नाही?',
        hasAccount: 'आधीच खाते आहे?', googleLogin: 'Google सह सुरू ठेवा',
      },
      dashboard: {
        welcome: 'परत स्वागत आहे', profile: 'प्रोफाइल', bookings: 'माझ्या बुकिंग', saved: 'जतन केलेले',
        notifications: 'सूचना', history: 'इतिहास', settings: 'सेटिंग्ज',
      },
      common: {
        loading: 'लोड होत आहे...', save: 'जतन करा', cancel: 'रद्द करा', delete: 'हटवा', edit: 'संपादन',
        view: 'पहा', back: 'मागे', submit: 'सबमिट', confirm: 'पुष्टी करा',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
