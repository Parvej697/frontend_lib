import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
  { section: 'Main' },
  { to: '/admin/dashboard',                     label: 'Dashboard',           icon: '🏠' },
  { section: 'Maintenance' },
  { to: '/admin/maintenance/add-book',           label: 'Add Book/Movie',      icon: '➕' },
  { to: '/admin/maintenance/update-book',        label: 'Update Book/Movie',   icon: '✏️' },
  { to: '/admin/maintenance/membership',         label: 'Add Membership',      icon: '🪪' },
  { to: '/admin/maintenance/update-membership',  label: 'Update Membership',   icon: '🔄' },
  { to: '/admin/maintenance/users',              label: 'User Management',     icon: '👥' },
  { section: 'Transactions' },
  { to: '/admin/transactions/issue',             label: 'Issue Book',          icon: '📤' },
  { to: '/admin/transactions/return',            label: 'Return Book',         icon: '📥' },
  { to: '/admin/transactions/pay-fine',          label: 'Pay Fine',            icon: '💰' },
  { section: 'Reports' },
  { to: '/admin/reports/books',                  label: 'Books Report',        icon: '📚' },
  { to: '/admin/reports/movies',                 label: 'Movies Report',       icon: '🎬' },
  { to: '/admin/reports/memberships',            label: 'Memberships',         icon: '📋' },
  { to: '/admin/reports/active-issues',          label: 'Active Issues',       icon: '📌' },
  { to: '/admin/reports/overdue',                label: 'Overdue Returns',     icon: '⚠️' },
  { to: '/admin/reports/issue-requests',         label: 'Issue Requests',      icon: '📝' },
];

const userLinks = [
  { section: 'Main' },
  { to: '/user/dashboard',   label: 'Home',              icon: '🏠' },
  { to: '/user/search',      label: 'Book Availability', icon: '🔍' },
  { to: '/user/reports',     label: 'My Reports',        icon: '📊' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.isAdmin ? adminLinks : userLinks;

  return (
    <div className="w-60 min-h-screen bg-slate-900 text-white flex flex-col flex-shrink-0">
 
      <div className="p-5 border-b border-slate-700">
        <div className="text-xl font-bold text-white">📚 Library MS</div>
        <div className="text-slate-400 text-xs mt-1 truncate">{user?.name}</div>
        <span className={`text-xs px-2 py-0.5 rounded-full mt-1.5 inline-block font-medium ${
          user?.isAdmin ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
        }`}>
          {user?.isAdmin ? 'ADMIN' : 'USER'}
        </span>
      </div>

    
      <nav className="flex-1 p-3 overflow-y-auto">
        {links.map((link, i) => {
          if (link.section) {
            return (
              <div key={i} className="px-3 pt-4 pb-1">
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest">
                  {link.section}
                </span>
              </div>
            );
          }
          return (
            <NavLink key={link.to} to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all mt-0.5 ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <span className="text-base">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

 
      <div className="p-3 border-t border-slate-700">
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-red-700 hover:text-white transition-all"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
