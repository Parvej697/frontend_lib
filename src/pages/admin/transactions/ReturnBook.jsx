import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import PageHeader from '../../../components/PageHeader';
import Card from '../../../components/Card';
import Alert from '../../../components/Alert';

export default function ReturnBook() {
  const today = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();
  const [serialNo, setSerialNo] = useState('');
  const [issue, setIssue]       = useState(null);
  const [returnDate, setReturnDate] = useState(today);
  const [remarks, setRemarks]   = useState('');
  const [alert, setAlert]       = useState({ type:'', msg:'' });
  const [loading, setLoading]   = useState(false);

  const fetchIssue = async () => {
    if (!serialNo.trim()) { setAlert({ type:'error', msg:'Enter a book serial number.' }); return; }
    setAlert({ type:'', msg:'' }); setIssue(null);
    try {
      const res = await api.get(`/issues/by-serial/${serialNo.trim()}`);
      const data = res.data.data;
      setIssue(data);
      setReturnDate(data.expectedReturnDate || today);
    } catch { setAlert({ type:'error', msg:'No active issue found for this serial number.' }); }
  };

  const handleReturn = async () => {
    setLoading(true); setAlert({ type:'', msg:'' });
    try {
      const res = await api.post('/issues/return', { bookSerialNo: serialNo.trim(), actualReturnDate: returnDate, remarks });
      setAlert({ type:'success', msg:'Proceeding to Pay Fine screen...' });
      setTimeout(() => navigate(`/admin/transactions/pay-fine?issueId=${res.data.data.id}&serial=${serialNo.trim()}`), 1200);
    } catch (err) {
      setAlert({ type:'error', msg: err.response?.data?.message || 'Return failed.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Return Book" subtitle="After confirming return, you will be taken to the Pay Fine screen." />
      <Card className="mb-4">
        <div className="flex gap-2">
          <input className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder="Book / Movie Serial No"
            value={serialNo} onChange={e => setSerialNo(e.target.value.toUpperCase())}
            onKeyDown={e => e.key==='Enter' && fetchIssue()} />
          <button onClick={fetchIssue} className="bg-slate-700 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-slate-800 transition">Search</button>
        </div>
      </Card>
      <Alert type={alert.type} message={alert.msg} />
      {issue && (
        <Card>
          <div className="grid grid-cols-2 gap-3 text-sm mb-5 pb-5 border-b border-slate-100">
            <div><span className="text-slate-500">Book:</span> <span className="font-semibold">{issue.bookName}</span></div>
            <div><span className="text-slate-500">Author:</span> {issue.authorName}</div>
            <div><span className="text-slate-500">Serial No:</span> <span className="font-mono">{issue.bookSerialNo}</span></div>
            <div><span className="text-slate-500">Member ID:</span> <span className="font-mono">{issue.membershipId}</span></div>
            <div><span className="text-slate-500">Issue Date:</span> {issue.issueDate}</div>
            <div><span className="text-slate-500">Expected Return:</span> <span className="font-semibold text-orange-600">{issue.expectedReturnDate}</span></div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Actual Return Date</label>
              <input type="date" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={returnDate} onChange={e => setReturnDate(e.target.value)} />
              {returnDate > issue.expectedReturnDate && (
                <p className="text-xs text-red-600 mt-1">⚠️ Overdue — fine of ₹5/day will be calculated.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Remarks <span className="text-slate-400 text-xs">(optional)</span></label>
              <textarea className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2} value={remarks} onChange={e => setRemarks(e.target.value)} />
            </div>
            <button onClick={handleReturn} disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition">
              {loading ? 'Processing...' : 'Confirm Return → Proceed to Pay Fine'}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
