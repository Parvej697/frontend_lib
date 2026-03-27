import { useState } from 'react';
import api from '../../../api/axios';
import PageHeader from '../../../components/PageHeader';
import Card from '../../../components/Card';
import Alert from '../../../components/Alert';

const STATUSES = ['AVAILABLE','ISSUED','LOST','DAMAGED'];

export default function UpdateBook() {
  const [type, setType]       = useState('BOOK');
  const [serialNo, setSerialNo] = useState('');
  const [book, setBook]       = useState(null);
  const [form, setForm]       = useState({});
  const [alert, setAlert]     = useState({ type:'', msg:'' });
  const [loading, setLoading] = useState(false);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const fetchBook = async () => {
    if (!serialNo.trim()) { setAlert({ type:'error', msg:'Enter a serial number.' }); return; }
    setAlert({ type:'', msg:'' });
    try {
      const res = await api.get(`/books/${serialNo.trim()}`);
      const b = res.data.data;
      setBook(b);
      setForm({ name: b.name, authorName: b.authorName, status: b.status, cost: b.cost, procurementDate: b.procurementDate || '' });
    } catch { setAlert({ type:'error', msg:'Book not found for that serial number.' }); setBook(null); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.name?.trim()) { setAlert({ type:'error', msg:'Name is required.' }); return; }
    setLoading(true); setAlert({ type:'', msg:'' });
    try {
      const res = await api.put(`/books/${book.id}`, { ...form, cost: Number(form.cost) });
      setAlert({ type:'success', msg: res.data.message || 'Updated successfully!' });
      setBook(res.data.data);
    } catch (err) {
      setAlert({ type:'error', msg: err.response?.data?.message || 'Update failed.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Update Book / Movie" />
      <Card className="mb-4">
        <div className="flex gap-3 mb-4">
          {['BOOK','MOVIE'].map(t => (
            <button key={t} onClick={() => { setType(t); setBook(null); setSerialNo(''); }}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${type===t ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {t === 'BOOK' ? '📚 Book' : '🎬 Movie'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Serial No (e.g. SC(B)000001)"
            value={serialNo} onChange={e => setSerialNo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchBook()} />
          <button onClick={fetchBook} className="bg-slate-700 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-slate-800 transition">Search</button>
        </div>
      </Card>
      <Alert type={alert.type} message={alert.msg} />
      {book && (
        <Card>
          <div className="text-xs text-slate-500 mb-4 font-mono bg-slate-50 rounded px-3 py-2">Serial: {book.serialNo} · ID: {book.id}</div>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
              <input className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name} onChange={e => f('name',e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Author / Director</label>
              <input className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.authorName} onChange={e => f('authorName',e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.status} onChange={e => f('status',e.target.value)}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cost (₹)</label>
                <input type="number" min="0" step="0.01" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.cost} onChange={e => f('cost',e.target.value)} />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition">
              {loading ? 'Updating...' : 'Update'}
            </button>
          </form>
        </Card>
      )}
    </div>
  );
}
