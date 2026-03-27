import { useState } from 'react';
import api from '../../../api/axios';
import PageHeader from '../../../components/PageHeader';
import Card from '../../../components/Card';
import Alert from '../../../components/Alert';

const CATEGORIES = ['Science','Economics','Fiction','Children','Personal Development'];

export default function AddBook() {
  const [type, setType] = useState('BOOK');
  const [form, setForm] = useState({ name:'', authorName:'', category:'Science', cost:'', procurementDate:'', totalCopies:'1' });
  const [alert, setAlert] = useState({ type:'', msg:'' });
  const [loading, setLoading] = useState(false);

  const f = (k,v) => setForm(p => ({...p,[k]:v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.authorName.trim() || !form.category) {
      setAlert({ type:'error', msg:'Name, author, and category are required.' }); return;
    }
    if (!form.cost || isNaN(form.cost) || Number(form.cost) < 0) {
      setAlert({ type:'error', msg:'Enter a valid cost.' }); return;
    }
    setLoading(true); setAlert({ type:'', msg:'' });
    try {
      const res = await api.post('/books', {
        ...form, type,
        cost: Number(form.cost),
        totalCopies: Number(form.totalCopies) || 1,
        procurementDate: form.procurementDate || new Date().toISOString().split('T')[0],
      });
      setAlert({ type:'success', msg: res.data.message || 'Added successfully!' });
      setForm({ name:'', authorName:'', category:'Science', cost:'', procurementDate:'', totalCopies:'1' });
    } catch (err) {
      setAlert({ type:'error', msg: err.response?.data?.message || 'Failed to add.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Add Book / Movie" subtitle="All fields are required." />
      <Card>
        <div className="flex gap-3 mb-6">
          {['BOOK','MOVIE'].map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${type===t ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {t === 'BOOK' ? '📚 Book' : '🎬 Movie'}
            </button>
          ))}
        </div>
        <Alert type={alert.type} message={alert.msg} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">{type === 'BOOK' ? 'Book Name' : 'Movie Name'} *</label>
              <input className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name} onChange={e => f('name',e.target.value)} placeholder="Enter title" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">{type === 'BOOK' ? 'Author Name' : 'Director Name'} *</label>
              <input className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.authorName} onChange={e => f('authorName',e.target.value)} placeholder="Enter author/director" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.category} onChange={e => f('category',e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Copies *</label>
              <input type="number" min="1" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.totalCopies} onChange={e => f('totalCopies',e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cost (₹) *</label>
              <input type="number" min="0" step="0.01" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.cost} onChange={e => f('cost',e.target.value)} placeholder="0.00" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Procurement Date</label>
              <input type="date" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.procurementDate} onChange={e => f('procurementDate',e.target.value)}
                max={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
          <div className="pt-2 bg-slate-50 rounded-lg p-3 text-xs text-slate-500">
            Serial No will be auto-generated. e.g. <span className="font-mono">SC(B)000001</span> for Science Book.
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition">
            {loading ? 'Adding...' : `Add ${type}`}
          </button>
        </form>
      </Card>
    </div>
  );
}
