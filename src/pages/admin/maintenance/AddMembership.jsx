import { useState } from 'react';
import api from '../../../api/axios';
import PageHeader from '../../../components/PageHeader';
import Card from '../../../components/Card';
import Alert from '../../../components/Alert';

const MEM_TYPES = [
  { value:'SIX_MONTHS', label:'6 Months' },
  { value:'ONE_YEAR',   label:'1 Year' },
  { value:'TWO_YEARS',  label:'2 Years' },
];

export default function AddMembership() {
  const [form, setForm] = useState({
    firstName:'', lastName:'', contactNumber:'', contactAddress:'',
    aadharCardNo:'', membershipType:'SIX_MONTHS', startDate: new Date().toISOString().split('T')[0]
  });
  const [alert, setAlert] = useState({ type:'', msg:'' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ['firstName','lastName','contactNumber','aadharCardNo'];
    for (const k of required) {
      if (!form[k].trim()) { setAlert({ type:'error', msg:`${k} is required.` }); return; }
    }
    if (!/^\d{12}$/.test(form.aadharCardNo)) {
      setAlert({ type:'error', msg:'Aadhar card must be 12 digits.' }); return;
    }
    setLoading(true); setAlert({ type:'', msg:'' }); setResult(null);
    try {
      const res = await api.post('/memberships', form);
      setAlert({ type:'success', msg: res.data.message });
      setResult(res.data.data);
      setForm({ firstName:'', lastName:'', contactNumber:'', contactAddress:'', aadharCardNo:'', membershipType:'SIX_MONTHS', startDate: new Date().toISOString().split('T')[0] });
    } catch (err) {
      setAlert({ type:'error', msg: err.response?.data?.message || 'Failed to create membership.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Add Membership" subtitle="All fields are mandatory." />
      {result && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
          <p className="font-bold">✅ Membership Created!</p>
          <p>Membership ID: <span className="font-mono font-bold">{result.membershipId}</span></p>
          <p>Valid: {result.startDate} → {result.endDate}</p>
        </div>
      )}
      <Card>
        <Alert type={alert.type} message={alert.msg} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
              <input className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.firstName} onChange={e => f('firstName',e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
              <input className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.lastName} onChange={e => f('lastName',e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number *</label>
              <input className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.contactNumber} onChange={e => f('contactNumber',e.target.value)} maxLength={10} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Aadhar Card No *</label>
              <input className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.aadharCardNo} onChange={e => f('aadharCardNo',e.target.value.replace(/\D/,''))} maxLength={12} required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Address</label>
              <textarea className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2} value={form.contactAddress} onChange={e => f('contactAddress',e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input type="date" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.startDate} onChange={e => f('startDate',e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Membership Duration *</label>
              <div className="flex flex-col gap-2">
                {MEM_TYPES.map(t => (
                  <label key={t.value} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="radio" name="memType" value={t.value} checked={form.membershipType===t.value}
                      onChange={() => f('membershipType',t.value)} className="accent-blue-600" />
                    <span>{t.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition">
            {loading ? 'Creating...' : 'Create Membership'}
          </button>
        </form>
      </Card>
    </div>
  );
}
