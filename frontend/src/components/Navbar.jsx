import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Sun, Moon, Globe, Ticket, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ variant = 'default' }) => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHero = variant === 'hero' || location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' },
  ];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    setLangOpen(false);
  };

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/events', label: t('nav.events') },
    { to: '/calendar', label: t('nav.calendar') },
    { to: '/#contact', label: t('nav.contact') },
  ];

  const transparent = isHero && !scrolled;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        transparent
          ? 'bg-transparent border-transparent'
          : 'bg-neutral-50/90 dark:bg-neutral-900/90 backdrop-blur-xl border-b border-neutral-200/60 dark:border-neutral-800/50 shadow-sm shadow-primary-200/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center shadow-md shadow-primary-300/30"
            >
              <Ticket className="w-5 h-5 text-white" />
            </motion.div>
            <span className={`font-display font-bold text-xl ${transparent ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>
              Event<span className="text-transparent bg-clip-text bg-brand-gradient">Organizer</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  transparent
                    ? 'text-white/90 hover:text-white hover:bg-white/10'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  transparent ? 'hover:bg-white/10 text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                <Globe className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-36 glass rounded-xl py-1 shadow-2xl"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-primary-500/10 ${
                          i18n.language === lang.code ? 'text-primary-500 font-semibold' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                transparent ? 'hover:bg-white/10 text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-neutral-500" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-2">
                <Link to={user.role === 'admin' ? '/admin' : user.role === 'organizer' ? '/organizer' : '/dashboard'} className="btn-primary text-sm !px-4 !py-2">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  {t('nav.dashboard')}
                </Link>
                <button onClick={logout} className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${transparent ? 'text-white/80 hover:text-white' : 'text-neutral-500 hover:text-primary-600'}`}>
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/login" className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all ${transparent ? 'text-white hover:bg-white/10' : 'text-neutral-600 hover:text-primary-600'}`}>
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn-primary text-sm !px-5 !py-2">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-xl ${transparent ? 'text-white' : 'text-slate-900 dark:text-white'}`}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="block py-3 px-4 rounded-xl text-slate-700 dark:text-slate-200 font-medium hover:bg-primary-500/10">
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="flex gap-3 pt-3">
                  <Link to="/login" className="btn-outline flex-1 text-center text-sm" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/register" className="btn-primary flex-1 text-center text-sm" onClick={() => setMobileOpen(false)}>Register</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
