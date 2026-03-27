import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const [form, setForm]   = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Username and password are required.'); return;
    }
    setError(''); setLoading(true);
    try {
  const res = await api.post('/auth/login', form);

  // ✅ YAHI ADD KARNA HAI
  console.log("Login Response:", res.data);
  console.log("isAdmin type:", typeof res.data.isAdmin);

  const { token, isAdmin, name, username } = res.data;

  login(token, isAdmin, name, username);
  navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard');
} catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📚</div>
          <h1 className="text-3xl font-bold text-slate-800">Library Management</h1>
          <p className="text-slate-500 mt-1 text-sm">Sign in to continue</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={form.username} onChange={e => setForm({...form, username: e.target.value})}
              placeholder="Enter username" autoFocus />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              placeholder="Enter password" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition text-sm">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
       <div className="mt-6 p-4 bg-slate-50 rounded-xl text-xs text-slate-500 space-y-1">
            <div><span className="font-semibold">Admin:</span> adm / adm</div>
            <div><span className="font-semibold">User:</span> user / user</div>
      </div>
      </div>
    </div>
  );
}
