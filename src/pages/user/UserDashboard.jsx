import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const actions = [
    { label:'Check Book Availability', icon:'🔍', path:'/user/search',   desc:'Search by name or author' },
    { label:'Issue a Book',           icon:'📤', path:'/user/issue',     desc:'Borrow a book or movie' },
    { label:'Return a Book',          icon:'📥', path:'/user/return',    desc:'Return a borrowed item' },
    { label:'Pay Fine',               icon:'💰', path:'/user/pay-fine',  desc:'Clear overdue fine' },
    { label:'View Reports',           icon:'📊', path:'/user/reports',   desc:'View available reports' },
  ];
  return (
    <div>
      <PageHeader title={`Welcome, ${user?.name}`} subtitle="Library Management System" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map(a => (
          <button key={a.label} onClick={() => navigate(a.path)}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-blue-400 hover:shadow-md transition-all">
            <div className="text-3xl mb-3">{a.icon}</div>
            <div className="font-semibold text-slate-800">{a.label}</div>
            <div className="text-xs text-slate-500 mt-1">{a.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
