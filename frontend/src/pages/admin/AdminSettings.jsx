import DashboardLayout from '../../components/DashboardLayout';

const AdminSettings = () => {
  return (
    <DashboardLayout type="admin">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">System Settings</h1>
      <div className="max-w-2xl space-y-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">General Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Event Auto-Approval</p>
                <p className="text-sm text-gray-500">Automatically approve events from verified organizers</p>
              </div>
              <button className="w-12 h-6 rounded-full bg-gray-300 transition-colors">
                <div className="w-5 h-5 bg-white rounded-full shadow translate-x-0.5" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                <p className="text-sm text-gray-500">Send email notifications for bookings</p>
              </div>
              <button className="w-12 h-6 rounded-full bg-primary-500 transition-colors">
                <div className="w-5 h-5 bg-white rounded-full shadow translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Maintenance Mode</p>
                <p className="text-sm text-gray-500">Put the site in maintenance mode</p>
              </div>
              <button className="w-12 h-6 rounded-full bg-gray-300 transition-colors">
                <div className="w-5 h-5 bg-white rounded-full shadow translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Payment Settings</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Razorpay</span><span className="text-green-600 font-medium">Configured</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Stripe</span><span className="text-green-600 font-medium">Configured</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Platform Fee</span><span className="font-medium">5%</span></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
