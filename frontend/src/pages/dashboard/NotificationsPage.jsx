import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { format } from 'date-fns';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get('/users/notifications').then(({ data }) => {
      setNotifications(data.notifications || []);
      api.put('/users/notifications/read');
    });
  }, []);

  return (
    <DashboardLayout type="user">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">Notifications</h1>
      {notifications.length === 0 ? (
        <div className="card text-center py-12">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif._id} className={`card !py-4 ${!notif.isRead ? 'border-l-4 border-l-primary-500' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{notif.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{notif.message}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{format(new Date(notif.createdAt), 'MMM dd')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default NotificationsPage;
