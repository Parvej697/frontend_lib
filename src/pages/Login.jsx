import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const [mode, setMode] = useState('admin'); 
  const [form, setForm] = useState({ username: '', membershipId: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const switchMode = (m) => {
    setMode(m);
    setForm({ username: '', membershipId: '', password: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'admin') {
      if (!form.username.trim() || !form.password.trim()) {
        setError('Username and password required.');
        return;
      }
    } else {
      if (!form.membershipId.trim() || !form.password.trim()) {
        setError('Membership ID and password required.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'admin') {
        const res = await api.post('/auth/login', {
          username: form.username,
          password: form.password,
        });
        const { token, isAdmin, name, username } = res.data;
        const isAdminBool = isAdmin === true || isAdmin === 'true';
        login(token, isAdminBool, name, username, null);
        navigate(isAdminBool ? '/admin/dashboard' : '/user/dashboard', { replace: true });

      } else {
        const res = await api.post('/auth/member-login', {
          membershipId: form.membershipId.toUpperCase(),
          password: form.password,
        });
        const { token, name, membershipId } = res.data;
        login(token, false, name, null, membershipId);
        navigate('/user/dashboard', { replace: true });
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">

    
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">📚</div>
          <h1 className="text-3xl font-bold text-slate-800">Library Management</h1>
          <p className="text-slate-500 mt-1 text-sm">Sign in to continue</p>
        </div>

      
        <div className="flex rounded-lg border border-slate-200 p-1 mb-6 bg-slate-50">
          <button
            type="button"
            onClick={() => switchMode('admin')}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${
              mode === 'admin'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Admin / Staff
          </button>
          <button
            type="button"
            onClick={() => switchMode('member')}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${
              mode === 'member'
                ? 'bg-green-600 text-white shadow'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Member
          </button>
        </div>

       
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
            {error}
          </div>
        )}

     
        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'admin' ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="Enter username"
                autoFocus
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Membership ID</label>
              <input
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-mono"
                value={form.membershipId}
                onChange={e => setForm({ ...form, membershipId: e.target.value.toUpperCase() })}
                placeholder="e.g. MEM00001"
                autoFocus
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              className={`w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 text-sm ${
                mode === 'admin' ? 'focus:ring-blue-500' : 'focus:ring-green-500'
              }`}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2.5 rounded-lg transition text-sm ${
              mode === 'admin'
                ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'
                : 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

      
        {mode === 'member' && (
          <p className="text-center text-sm text-slate-500 mt-5">
            Naya account?{' '}
            <Link to="/signup" className="text-green-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        )}

       
        <div className="mt-6 p-4 bg-slate-50 rounded-xl text-xs text-slate-500 space-y-1">
          <div className="font-semibold text-slate-600 mb-1">Demo Credentials:</div>
          <div><span className="font-semibold text-blue-600">Admin:</span> adm / adm → Admin Dashboard</div>
          <div><span className="font-semibold text-green-600">Member:</span> MEM00001 / password → User Dashboard</div>
        </div>

      </div>
    </div>
  );
}