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

export default function UpdateMembership() {
  const [memId, setMemId]     = useState('');
  const [member, setMember]   = useState(null);
  const [action, setAction]   = useState('EXTEND');
  const [extType, setExtType] = useState('SIX_MONTHS');
  const [alert, setAlert]     = useState({ type:'', msg:'' });
  const [loading, setLoading] = useState(false);

  const fetchMember = async () => {
    if (!memId.trim()) { setAlert({ type:'error', msg:'Enter a membership number.' }); return; }
    setAlert({ type:'', msg:'' }); setMember(null);
    try {
      const res = await api.get(`/memberships/${memId.trim()}`);
      setMember(res.data.data);
    } catch { setAlert({ type:'error', msg:'Membership not found.' }); }
  };

  const handleUpdate = async () => {
    setLoading(true); setAlert({ type:'', msg:'' });
    try {
      const body = action === 'CANCEL' ? { action:'CANCEL' } : { action:'EXTEND', extensionType: extType };
      const res = await api.put(`/memberships/${member.membershipId}`, body);
      setAlert({ type:'success', msg: res.data.message || 'Updated successfully!' });
      setMember(res.data.data);
    } catch (err) {
      setAlert({ type:'error', msg: err.response?.data?.message || 'Update failed.' });
    } finally { setLoading(false); }
  };

  const statusColor = (s) => ({ ACTIVE:'text-green-600', INACTIVE:'text-red-600', CANCELLED:'text-slate-500' }[s] || 'text-slate-700');

  return (
    <div className="max-w-2xl">
      <PageHeader title="Update Membership" subtitle="Search by Membership ID to extend or cancel." />
      <Card className="mb-4">
        <div className="flex gap-2">
          <input className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Membership ID (e.g. MEM00001)"
            value={memId} onChange={e => setMemId(e.target.value)}
            onKeyDown={e => e.key==='Enter' && fetchMember()} />
          <button onClick={fetchMember} className="bg-slate-700 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-slate-800 transition">Search</button>
        </div>
      </Card>
      <Alert type={alert.type} message={alert.msg} />
      {member && (
        <Card>
          <div className="grid grid-cols-2 gap-2 text-sm mb-5 pb-5 border-b border-slate-100">
            <div><span className="text-slate-500">ID:</span> <span className="font-mono font-bold">{member.membershipId}</span></div>
            <div><span className="text-slate-500">Name:</span> {member.firstName} {member.lastName}</div>
            <div><span className="text-slate-500">Contact:</span> {member.contactNumber}</div>
            <div><span className="text-slate-500">Status:</span> <span className={`font-semibold ${statusColor(member.status)}`}>{member.status}</span></div>
            <div><span className="text-slate-500">Start:</span> {member.startDate}</div>
            <div><span className="text-slate-500">End:</span> {member.endDate}</div>
            <div><span className="text-slate-500">Type:</span> {member.membershipType?.replace('_',' ')}</div>
            <div><span className="text-slate-500">Fine:</span> ₹{member.pendingFine || 0}</div>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-slate-700 mb-3">Action:</p>
            <div className="flex gap-4 mb-4">
              {['EXTEND','CANCEL'].map(a => (
                <label key={a} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" checked={action===a} onChange={() => setAction(a)} className="accent-blue-600" />
                  {a === 'EXTEND' ? '🔄 Extend Membership' : '❌ Cancel Membership'}
                </label>
              ))}
            </div>
            {action === 'EXTEND' && (
              <div className="flex flex-col gap-2 ml-4">
                {MEM_TYPES.map(t => (
                  <label key={t.value} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="ext" checked={extType===t.value} onChange={() => setExtType(t.value)} className="accent-blue-600" />
                    {t.label}
                  </label>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleUpdate} disabled={loading}
            className={`w-full font-semibold py-2.5 rounded-lg text-sm transition text-white ${action==='CANCEL' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50`}>
            {loading ? 'Updating...' : action === 'CANCEL' ? 'Cancel Membership' : 'Extend Membership'}
          </button>
        </Card>
      )}
    </div>
  );
}
