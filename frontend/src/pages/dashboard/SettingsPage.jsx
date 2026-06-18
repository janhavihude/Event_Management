import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../components/DashboardLayout';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleTheme } = useTheme();
  const { user, updateUser } = useAuth();
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    api.put('/users/profile', { preferences: { ...user.preferences, language: lang } });
    toast.success('Language updated');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/update-password', passwords);
      toast.success('Password updated!');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <DashboardLayout type="user">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>
      <div className="max-w-2xl space-y-6">
        {/* Theme */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Dark Mode</span>
            <button onClick={toggleTheme} className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary-500' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Language</h3>
          <div className="grid grid-cols-3 gap-3">
            {[{ code: 'en', label: 'English' }, { code: 'hi', label: 'हिंदी' }, { code: 'mr', label: 'मराठी' }].map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  i18n.language === lang.code ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Change Password */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <input type="password" className="input-field" placeholder="Current Password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required />
            <input type="password" className="input-field" placeholder="New Password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required minLength={6} />
            <button type="submit" className="btn-primary">Update Password</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
