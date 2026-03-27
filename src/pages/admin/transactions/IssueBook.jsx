import { useState } from 'react';
import api from '../../../api/axios';
import PageHeader from '../../../components/PageHeader';
import Card from '../../../components/Card';
import Alert from '../../../components/Alert';

export default function IssueBook() {
  const today = new Date().toISOString().split('T')[0];
  const maxReturn = new Date(Date.now() + 15*86400000).toISOString().split('T')[0];

  const [form, setForm] = useState({ bookSerialNo:'', membershipId:'', issueDate: today, returnDate: maxReturn, remarks:'' });
  const [bookInfo, setBookInfo] = useState(null);
  const [alert, setAlert] = useState({ type:'', msg:'' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const lookupBook = async () => {
    if (!form.bookSerialNo.trim()) return;
    try {
      const res = await api.get(`/books/${form.bookSerialNo.trim()}`);
      setBookInfo(res.data.data);
    } catch { setBookInfo(null); }
  };

  const handleIssueDate = (v) => {
    f('issueDate', v);
    const maxRet = new Date(new Date(v).getTime() + 15*86400000).toISOString().split('T')[0];
    f('returnDate', maxRet);
  };

  const handleReturnDate = (v) => {
    const issue = new Date(form.issueDate);
    const ret   = new Date(v);
    const max   = new Date(issue.getTime() + 15*86400000);
    if (ret > max) { setAlert({ type:'error', msg:'Return date cannot be more than 15 days from issue date.' }); return; }
    setAlert({ type:'', msg:'' }); f('returnDate', v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bookSerialNo.trim()) { setAlert({ type:'error', msg:'Book serial number is required.' }); return; }
    if (!form.membershipId.trim()) { setAlert({ type:'error', msg:'Membership ID is required.' }); return; }
    if (new Date(form.issueDate) < new Date(today)) { setAlert({ type:'error', msg:'Issue date cannot be in the past.' }); return; }
    setLoading(true); setAlert({ type:'', msg:'' }); setResult(null);
    try {
      const res = await api.post('/issues/issue', form);
      setResult(res.data.data);
      setAlert({ type:'success', msg: res.data.message });
      setForm({ bookSerialNo:'', membershipId:'', issueDate: today, returnDate: maxReturn, remarks:'' });
      setBookInfo(null);
    } catch (err) {
      setAlert({ type:'error', msg: err.response?.data?.message || 'Issue failed.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Issue Book / Movie" subtitle="Issue date cannot be in the past. Return date max 15 days." />
      {result && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
          <p className="font-bold text-base">✅ Book Issued Successfully!</p>
          <p>Book: <strong>{result.bookName}</strong> ({result.bookSerialNo})</p>
          <p>Member ID: {result.membershipId}</p>
          <p>Return by: <strong>{result.expectedReturnDate}</strong></p>
        </div>
      )}
      <Card>
        <Alert type={alert.type} message={alert.msg} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Book / Movie Serial No *</label>
            <div className="flex gap-2">
              <input className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                value={form.bookSerialNo} onChange={e => f('bookSerialNo',e.target.value.toUpperCase())}
                onBlur={lookupBook} placeholder="e.g. SC(B)000001" required />
              <button type="button" onClick={lookupBook} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs transition">Lookup</button>
            </div>
            {bookInfo && (
              <div className={`mt-2 text-xs p-2 rounded-lg ${bookInfo.status==='AVAILABLE' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                📖 {bookInfo.name} by {bookInfo.authorName} — <strong>{bookInfo.status}</strong>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Membership ID *</label>
            <input className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              value={form.membershipId} onChange={e => f('membershipId',e.target.value.toUpperCase())} placeholder="e.g. MEM00001" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Issue Date *</label>
              <input type="date" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.issueDate} min={today} onChange={e => handleIssueDate(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Return Date * <span className="text-xs text-slate-400">(max 15 days)</span></label>
              <input type="date" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.returnDate} min={form.issueDate} max={new Date(new Date(form.issueDate).getTime()+15*86400000).toISOString().split('T')[0]}
                onChange={e => handleReturnDate(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Remarks <span className="text-slate-400 text-xs">(optional)</span></label>
            <textarea className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2} value={form.remarks} onChange={e => f('remarks',e.target.value)} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition">
            {loading ? 'Issuing...' : 'Issue Book'}
          </button>
        </form>
      </Card>
    </div>
  );
}
