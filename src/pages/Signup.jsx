import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Signup() {
  const [form, setForm] = useState({ membershipId: '', name: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (!form.membershipId.trim() || !form.name.trim() || !form.password.trim()) {
      setError('Sabhi fields required hain.'); return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords match nahi kar rahe.'); return;
    }
    if (form.password.length < 6) {
      setError('Password kam se kam 6 characters ka hona chahiye.'); return;
    }

    setLoading(true);
    try {
      await api.post('/auth/member-signup', {
        membershipId: form.membershipId.toUpperCase(),
        name: form.name.trim(),
        password: form.password,
      });
      setSuccess('Account ban gaya! Login page pe ja rahe hain...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">

        
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📚</div>
          <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
          <p className="text-slate-500 mt-1 text-sm">Library Member Registration</p>
        </div>

       
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg px-4 py-3 mb-5 text-sm">
            ✅ {success}
          </div>
        )}

        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Membership ID *</label>
            <input
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-mono"
              value={form.membershipId}
              onChange={e => f('membershipId', e.target.value.toUpperCase())}
              placeholder="e.g. MEM00001"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
            <input
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              value={form.name}
              onChange={e => f('name', e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
            <input
              type="password"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              value={form.password}
              onChange={e => f('password', e.target.value)}
              placeholder="Min. 6 characters"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password *</label>
            <input
              type="password"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              value={form.confirmPassword}
              onChange={e => f('confirmPassword', e.target.value)}
              placeholder="Re-enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2.5 rounded-lg transition text-sm"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}