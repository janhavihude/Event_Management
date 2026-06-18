import { useState } from 'react';
import { QrCode, CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';

const VerifyTicketPage = () => {
  const [reference, setReference] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/organizer/verify-ticket', { bookingReference: reference });
      setResult({ success: true, ...data });
      toast.success('Ticket verified!');
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || 'Verification failed' });
      toast.error(err.response?.data?.message || 'Invalid ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout type="organizer">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">QR Ticket Verification</h1>

      <div className="max-w-md mx-auto">
        <div className="card text-center mb-6">
          <QrCode className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <p className="text-gray-500 text-sm mb-4">Enter booking reference or scan QR code</p>
          <form onSubmit={handleVerify} className="flex gap-2">
            <input className="input-field flex-1" placeholder="EVT-XXXXXX-XXXXXX" value={reference} onChange={(e) => setReference(e.target.value)} required />
            <button type="submit" disabled={loading} className="btn-primary !px-6">{loading ? '...' : 'Verify'}</button>
          </form>
        </div>

        {result && (
          <div className={`card text-center ${result.success ? 'border-green-200' : 'border-red-200'}`}>
            {result.success ? (
              <>
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-green-700 mb-2">Ticket Verified!</h3>
                <p className="text-sm text-gray-600">{result.attendee?.name} - {result.attendee?.email}</p>
                <p className="text-sm text-gray-500 mt-1">{result.event?.title}</p>
              </>
            ) : (
              <>
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <h3 className="font-semibold text-red-700">{result.message}</h3>
              </>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VerifyTicketPage;
