import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get('/admin/reports').then(({ data }) => setReports(data.reports || []));
  }, []);

  const resolveReport = async (id, status) => {
    try {
      const { data } = await api.put(`/admin/reports/${id}`, { status, resolution: `${status} by admin` });
      setReports(reports.map((r) => (r._id === id ? data.report : r)));
      toast.success('Report updated');
    } catch {
      toast.error('Failed to update report');
    }
  };

  return (
    <DashboardLayout type="admin">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">Reports Management</h1>
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report._id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">{report.type}</span>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                    report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    report.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>{report.status}</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">{report.reason}</p>
                <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                <p className="text-xs text-gray-400 mt-2">By {report.reportedBy?.name} • {new Date(report.createdAt).toLocaleDateString()}</p>
              </div>
              {report.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={() => resolveReport(report._id, 'resolved')} className="btn-primary !py-1.5 !px-3 text-xs">Resolve</button>
                  <button onClick={() => resolveReport(report._id, 'dismissed')} className="btn-outline !py-1.5 !px-3 text-xs">Dismiss</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {reports.length === 0 && <div className="card text-center py-12"><p className="text-gray-500">No reports</p></div>}
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
