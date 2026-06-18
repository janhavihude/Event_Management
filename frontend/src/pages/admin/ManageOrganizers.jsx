import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ManageOrganizers = () => {
  const [organizers, setOrganizers] = useState([]);

  useEffect(() => {
    api.get('/admin/organizers').then(({ data }) => setOrganizers(data.organizers || []));
  }, []);

  const handleApproval = async (id, isApproved) => {
    try {
      const { data } = await api.put(`/admin/organizers/${id}`, { isApproved, isVerified: isApproved });
      setOrganizers(organizers.map((o) => (o._id === id ? data.organizer : o)));
      toast.success(isApproved ? 'Organizer approved' : 'Organizer rejected');
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <DashboardLayout type="admin">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">Manage Organizers</h1>
      <div className="space-y-4">
        {organizers.map((org) => (
          <div key={org._id} className="card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{org.organizationName}</h3>
              <p className="text-sm text-gray-500">{org.user?.name} • {org.user?.email}</p>
              <p className="text-sm text-gray-400 mt-1">{org.totalEvents} events • ₹{org.totalRevenue?.toLocaleString()} revenue</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${org.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {org.isApproved ? 'Approved' : 'Pending'}
              </span>
              {!org.isApproved && (
                <>
                  <button onClick={() => handleApproval(org._id, true)} className="btn-primary !py-1.5 !px-3 text-xs">Approve</button>
                  <button onClick={() => handleApproval(org._id, false)} className="btn-outline !py-1.5 !px-3 text-xs text-red-600 border-red-300">Reject</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ManageOrganizers;
