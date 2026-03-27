import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';

// Admin pages
import Dashboard        from './pages/admin/Dashboard';
import AddBook          from './pages/admin/maintenance/AddBook';
import UpdateBook       from './pages/admin/maintenance/UpdateBook';
import AddMembership    from './pages/admin/maintenance/AddMembership';
import UpdateMembership from './pages/admin/maintenance/UpdateMembership';
import UserManagement   from './pages/admin/maintenance/UserManagement';
import IssueBook        from './pages/admin/transactions/IssueBook';
import ReturnBook       from './pages/admin/transactions/ReturnBook';
import PayFine          from './pages/admin/transactions/PayFine';
import BooksReport      from './pages/admin/reports/BooksReport';
import MoviesReport     from './pages/admin/reports/MoviesReport';
import MembershipsReport from './pages/admin/reports/MembershipsReport';
import ActiveIssues     from './pages/admin/reports/ActiveIssues';
import OverdueReturns   from './pages/admin/reports/OverdueReturns';
import IssueRequests    from './pages/admin/reports/IssueRequests';

// User pages
import UserDashboard from './pages/user/UserDashboard';
import SearchBooks   from './pages/user/SearchBooks';
import UserReports   from './pages/user/UserReports';

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 p-7 overflow-auto">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Root → Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* ===== ADMIN ONLY ROUTES ===== */}
          <Route path="/admin/dashboard"
            element={<ProtectedRoute adminOnly><Layout><Dashboard /></Layout></ProtectedRoute>} />

          {/* Maintenance — Admin only */}
          <Route path="/admin/maintenance/add-book"
            element={<ProtectedRoute adminOnly><Layout><AddBook /></Layout></ProtectedRoute>} />
          <Route path="/admin/maintenance/update-book"
            element={<ProtectedRoute adminOnly><Layout><UpdateBook /></Layout></ProtectedRoute>} />
          <Route path="/admin/maintenance/membership"
            element={<ProtectedRoute adminOnly><Layout><AddMembership /></Layout></ProtectedRoute>} />
          <Route path="/admin/maintenance/update-membership"
            element={<ProtectedRoute adminOnly><Layout><UpdateMembership /></Layout></ProtectedRoute>} />
          <Route path="/admin/maintenance/users"
            element={<ProtectedRoute adminOnly><Layout><UserManagement /></Layout></ProtectedRoute>} />

          {/* Transactions — Admin only */}
          <Route path="/admin/transactions/issue"
            element={<ProtectedRoute adminOnly><Layout><IssueBook /></Layout></ProtectedRoute>} />
          <Route path="/admin/transactions/return"
            element={<ProtectedRoute adminOnly><Layout><ReturnBook /></Layout></ProtectedRoute>} />
          <Route path="/admin/transactions/pay-fine"
            element={<ProtectedRoute adminOnly><Layout><PayFine /></Layout></ProtectedRoute>} />

          {/* Reports — Admin only */}
          <Route path="/admin/reports/books"
            element={<ProtectedRoute adminOnly><Layout><BooksReport /></Layout></ProtectedRoute>} />
          <Route path="/admin/reports/movies"
            element={<ProtectedRoute adminOnly><Layout><MoviesReport /></Layout></ProtectedRoute>} />
          <Route path="/admin/reports/memberships"
            element={<ProtectedRoute adminOnly><Layout><MembershipsReport /></Layout></ProtectedRoute>} />
          <Route path="/admin/reports/active-issues"
            element={<ProtectedRoute adminOnly><Layout><ActiveIssues /></Layout></ProtectedRoute>} />
          <Route path="/admin/reports/overdue"
            element={<ProtectedRoute adminOnly><Layout><OverdueReturns /></Layout></ProtectedRoute>} />
          <Route path="/admin/reports/issue-requests"
            element={<ProtectedRoute adminOnly><Layout><IssueRequests /></Layout></ProtectedRoute>} />

          {/* ===== USER ROUTES ===== */}
          <Route path="/user/dashboard"
            element={<ProtectedRoute><Layout><UserDashboard /></Layout></ProtectedRoute>} />
          <Route path="/user/search"
            element={<ProtectedRoute><Layout><SearchBooks /></Layout></ProtectedRoute>} />
          <Route path="/user/reports"
            element={<ProtectedRoute><Layout><UserReports /></Layout></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
