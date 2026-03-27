import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Card from '../../components/Card';
import PageHeader from '../../components/PageHeader';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ books:0, movies:0, members:0, activeIssues:0, overdue:0 });

  useEffect(() => {
    Promise.all([
      api.get('/books?type=BOOK'),
      api.get('/books?type=MOVIE'),
      api.get('/memberships/active'),
      api.get('/reports/active-issues'),
      api.get('/reports/overdue'),
    ]).then(([b, m, mem, ai, ov]) => {
      setStats({
        books:        b.data.data?.length  || 0,
        movies:       m.data.data?.length  || 0,
        members:      mem.data.data?.length|| 0,
        activeIssues: ai.data.data?.length || 0,
        overdue:      ov.data.data?.length || 0,
      });
    }).catch(() => {});
  }, []);

  const statCards = [
    { label:'Total Books',    value: stats.books,        color:'bg-blue-500',   icon:'📚', link:'/admin/reports/books' },
    { label:'Total Movies',   value: stats.movies,       color:'bg-purple-500', icon:'🎬', link:'/admin/reports/movies' },
    { label:'Active Members', value: stats.members,      color:'bg-green-500',  icon:'👥', link:'/admin/reports/memberships' },
    { label:'Active Issues',  value: stats.activeIssues, color:'bg-orange-500', icon:'📤', link:'/admin/reports/active-issues' },
    { label:'Overdue',        value: stats.overdue,      color:'bg-red-500',    icon:'⚠️', link:'/admin/reports/overdue' },
  ];

  const quickActions = [
    { label:'Issue Book',      icon:'📤', path:'/admin/transactions/issue' },
    { label:'Return Book',     icon:'📥', path:'/admin/transactions/return' },
    { label:'Add Book',        icon:'➕', path:'/admin/maintenance/add-book' },
    { label:'Add Membership',  icon:'🪪', path:'/admin/maintenance/membership' },
  ];

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.name}`} subtitle="Library Management System — Admin Panel" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map(s => (
          <div key={s.label} onClick={() => navigate(s.link)}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 cursor-pointer hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
            <div className="text-2xl font-bold text-slate-800">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map(a => (
            <button key={a.label} onClick={() => navigate(a.path)}
              className="bg-white border border-slate-200 rounded-xl p-4 text-left hover:border-blue-400 hover:shadow-sm transition-all">
              <div className="text-2xl mb-2">{a.icon}</div>
              <div className="text-sm font-medium text-slate-700">{a.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-base font-semibold text-slate-700 mb-3">Book Categories & Codes</h2>
        <Card>
          <table className="min-w-full text-sm">
            <thead><tr className="border-b border-slate-100">
              <th className="text-left py-2 px-3 text-slate-500 font-medium">Code From</th>
              <th className="text-left py-2 px-3 text-slate-500 font-medium">Code To</th>
              <th className="text-left py-2 px-3 text-slate-500 font-medium">Category</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {[['SC(B)000001','SC(B)999999','Science'],['EC(B)000001','EC(B)999999','Economics'],
                ['FC(B)000001','FC(B)999999','Fiction'],['CH(B)000001','CH(B)999999','Children'],
                ['PD(B)000001','PD(B)999999','Personal Development']].map(([a,b,c]) => (
                <tr key={c}><td className="py-2 px-3 font-mono text-xs">{a}</td><td className="py-2 px-3 font-mono text-xs">{b}</td><td className="py-2 px-3">{c}</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
