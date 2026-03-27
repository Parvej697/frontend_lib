import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Check Book Availability',
      icon:  '🔍',
      path:  '/user/search',
      desc:  'Search books by name or author',
      color: 'hover:border-blue-400',
    },
    {
      label: 'View My Reports',
      icon:  '📊',
      path:  '/user/reports',
      desc:  'See active issues, overdue, fines',
      color: 'hover:border-purple-400',
    },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name} 👋`}
        subtitle="Library Management System — User Dashboard"
      />

      
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="text-2xl">ℹ️</div>
          <div>
            <div className="font-semibold text-blue-800 text-sm">User Account</div>
            <div className="text-blue-600 text-xs mt-0.5">
              You are logged in as <strong>{user?.username}</strong>. Book issue aur return ke liye
              library staff se contact karein ya admin se request karein.
            </div>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map(a => (
          <button
            key={a.label}
            onClick={() => navigate(a.path)}
            className={`bg-white border border-slate-200 rounded-2xl p-6 text-left ${a.color} hover:shadow-md transition-all`}
          >
            <div className="text-4xl mb-4">{a.icon}</div>
            <div className="font-semibold text-slate-800 text-base">{a.label}</div>
            <div className="text-xs text-slate-500 mt-1">{a.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
