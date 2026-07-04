import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import SeatAvailabilityPage from './pages/SeatAvailabilityPage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import AdminDashboard from './pages/AdminDashboard';
import ManageSeatsPage from './pages/ManageSeatsPage';
import ManageUsersPage from './pages/ManageUsersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ManageFloorsPage from './pages/ManageFloorsPage';
import AdminReservationsPage from './pages/AdminReservationsPage';
import Error403 from './pages/Error403';
import Error404 from './pages/Error404';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#FFFDF9',
            color: '#2F2F2F',
            border: '1px solid #E7E0D3',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: 500,
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#FFF' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#FFF' },
          },
        }} 
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        <Route path="/403" element={<Error403 />} />
        <Route path="/404" element={<Error404 />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['Student']} />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/seats" element={<SeatAvailabilityPage />} />
          <Route path="/bookings" element={<BookingHistoryPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['Admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/seats" element={<ManageSeatsPage />} />
          <Route path="/admin/floors" element={<ManageFloorsPage />} />
          <Route path="/admin/users" element={<ManageUsersPage />} />
          <Route path="/admin/reservations" element={<AdminReservationsPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['Student', 'Admin']} />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
}
