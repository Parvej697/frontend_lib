import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import PageHeader from '../../../components/PageHeader';
import Card from '../../../components/Card';
import Alert from '../../../components/Alert';

export default function UserManagement() {
  const [users, setUsers]   = useState([]);
  const [mode, setMode]     = useState('NEW'); 
  const [selected, setSelected] = useState(null);
  const [form, setForm]     = useState({ username:'', name:'', password:'', isAdmin:false, isActive:true });
  const [alert, setAlert]   = useState({ type:'', msg:'' });
  const [loading, setLoading] = useState(false);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const load = async () => {
    try { const r = await api.get('/users'); setUsers(r.data.data || []); }
    catch { setAlert({ type:'error', msg:'Failed to load users.' }); }
  };

  useEffect(() => { load(); }, []);

  const selectUser = (u) => {
    setSelected(u); setMode('EXISTING');
    setForm({ username: u.username, name: u.name, password:'', isAdmin: u.admin, isActive: u.active });
    setAlert({ type:'', msg:'' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setAlert({ type:'error', msg:'Name is required.' }); return; }
    if (mode === 'NEW' && !form.username.trim()) { setAlert({ type:'error', msg:'Username is required.' }); return; }
    setLoading(true); setAlert({ type:'', msg:'' });
    try {
      if (mode === 'NEW') {
        await api.post('/users', { username: form.username, name: form.name, password: form.password || 'user123', isAdmin: form.isAdmin, isActive: form.isActive });
        setAlert({ type:'success', msg:'User created. Default password: user123' });
        setForm({ username:'', name:'', password:'', isAdmin:false, isActive:true });
      } else {
        const body = { name: form.name, isAdmin: form.isAdmin, isActive: form.isActive };
        if (form.password) body.password = form.password;
        await api.put(`/users/${selected.id}`, body);
        setAlert({ type:'success', msg:'User updated successfully.' });
      }
      load();
    } catch (err) {
      setAlert({ type:'error', msg: err.response?.data?.message || 'Operation failed.' });
    } finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="User Management" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-sm font-semibold text-slate-600 mb-3">All Users ({users.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead><tr className="border-b border-slate-100">
                  {['Username','Name','Role','Status','Action'].map(h=>(
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-slate-500">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono text-xs">{u.username}</td>
                      <td className="py-2 px-3">{u.name}</td>
                      <td className="py-2 px-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.admin ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {u.admin ? 'ADMIN' : 'USER'}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <button onClick={() => selectUser(u)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        <div>
          <Card>
            <div className="flex gap-2 mb-4">
              {['NEW','EXISTING'].map(m=>(
                <button key={m} onClick={() => { setMode(m); setSelected(null); setForm({ username:'', name:'', password:'', isAdmin:false, isActive:true }); setAlert({type:'',msg:''}); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${mode===m ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {m === 'NEW' ? 'New User' : 'Edit Existing'}
                </button>
              ))}
            </div>
            <Alert type={alert.type} message={alert.msg} />
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'NEW' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Username *</label>
                  <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.username} onChange={e => f('username',e.target.value)} placeholder="e.g. john_doe" />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Name *</label>
                <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.name} onChange={e => f('name',e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password {mode==='NEW'?'(default: user123)':'(leave blank to keep)'}</label>
                <input type="password" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.password} onChange={e => f('password',e.target.value)} placeholder="New password" />
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => f('isActive',e.target.checked)} className="accent-blue-600" />
                  <span className="text-slate-700">Active</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isAdmin} onChange={e => f('isAdmin',e.target.checked)} className="accent-blue-600" />
                  <span className="text-slate-700">Admin</span>
                </label>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition">
                {loading ? 'Saving...' : mode === 'NEW' ? 'Create User' : 'Update User'}
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
