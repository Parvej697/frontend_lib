import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import PageHeader from '../../../components/PageHeader';
import Card from '../../../components/Card';
import Alert from '../../../components/Alert';

export default function PayFine() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const issueId  = params.get('issueId');
  const serial   = params.get('serial');

  const [serialNo, setSerialNo] = useState(serial || '');
  const [issue, setIssue]       = useState(null);
  const [finePaid, setFinePaid] = useState(false);
  const [remarks, setRemarks]   = useState('');
  const [alert, setAlert]       = useState({ type:'', msg:'' });
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (issueId) fetchBySerial();
    else if (serial) fetchBySerial();
  }, []);

  const fetchBySerial = async (sn = serialNo) => {
    if (!sn.trim()) { setAlert({ type:'error', msg:'Enter a serial number.' }); return; }
    setAlert({ type:'', msg:'' }); setIssue(null);
    try {
      const res = await api.get(`/issues/by-serial/${sn.trim()}`);
      setIssue(res.data.data);
    } catch { setAlert({ type:'error', msg:'No pending issue found for this serial.' }); }
  };

  const handleConfirm = async () => {
    if (!issue) { setAlert({ type:'error', msg:'No issue loaded.' }); return; }
    if (issue.fineCalculated > 0 && !finePaid) {
      setAlert({ type:'error', msg: `Fine of ₹${issue.fineCalculated} must be paid before completing return.` }); return;
    }
    setLoading(true); setAlert({ type:'', msg:'' });
    try {
      await api.post(`/issues/pay-fine/${issue.id}`, { finePaid: finePaid || issue.fineCalculated === 0, remarks });
      setAlert({ type:'success', msg:'Book returned successfully! Transaction complete.' });
      setTimeout(() => navigate(window.location.pathname.includes('admin') ? '/admin/dashboard' : '/user/dashboard'), 2000);
    } catch (err) {
      setAlert({ type:'error', msg: err.response?.data?.message || 'Failed to complete return.' });
    } finally { setLoading(false); }
  };

  const hasOverdue = issue && issue.fineCalculated > 0;

  return (
    <div className="max-w-2xl">
      <PageHeader title="Pay Fine" subtitle="Complete the return transaction." />
      {!issue && (
        <Card className="mb-4">
          <div className="flex gap-2">
            <input className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="Book Serial No" value={serialNo} onChange={e => setSerialNo(e.target.value.toUpperCase())}
              onKeyDown={e => e.key==='Enter' && fetchBySerial()} />
            <button onClick={() => fetchBySerial()} className="bg-slate-700 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-slate-800 transition">Search</button>
          </div>
        </Card>
      )}
      <Alert type={alert.type} message={alert.msg} />
      {issue && (
        <Card>
          <div className="grid grid-cols-2 gap-3 text-sm mb-5 pb-5 border-b border-slate-100">
            <div><span className="text-slate-500">Book:</span> <span className="font-semibold">{issue.bookName}</span></div>
            <div><span className="text-slate-500">Serial:</span> <span className="font-mono">{issue.bookSerialNo}</span></div>
            <div><span className="text-slate-500">Author:</span> {issue.authorName}</div>
            <div><span className="text-slate-500">Member:</span> <span className="font-mono">{issue.membershipId}</span></div>
            <div><span className="text-slate-500">Issue Date:</span> {issue.issueDate}</div>
            <div><span className="text-slate-500">Expected Return:</span> {issue.expectedReturnDate}</div>
            <div><span className="text-slate-500">Actual Return:</span> {issue.actualReturnDate || '—'}</div>
            <div>
              <span className="text-slate-500">Fine Calculated:</span>
              <span className={`font-bold ml-1 ${hasOverdue ? 'text-red-600' : 'text-green-600'}`}>
                ₹{issue.fineCalculated ?? 0}
              </span>
            </div>
          </div>
          {hasOverdue ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-700 font-semibold text-sm">⚠️ Fine of ₹{issue.fineCalculated} is pending.</p>
              <label className="flex items-center gap-2 mt-3 cursor-pointer text-sm text-red-700">
                <input type="checkbox" checked={finePaid} onChange={e => setFinePaid(e.target.checked)} className="accent-red-600 w-4 h-4" />
                <span>Fine Paid (₹{issue.fineCalculated})</span>
              </label>
              {!finePaid && <p className="text-xs text-red-500 mt-2">You must check this to complete the return.</p>}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-green-700 text-sm">
              ✅ No fine. You can confirm the return directly.
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Remarks <span className="text-slate-400 text-xs">(optional)</span></label>
            <textarea className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2} value={remarks} onChange={e => setRemarks(e.target.value)} />
          </div>
          <button onClick={handleConfirm} disabled={loading || (hasOverdue && !finePaid)}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition">
            {loading ? 'Processing...' : 'Confirm Return'}
          </button>
        </Card>
      )}
    </div>
  );
}
