import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { ProfileSkeleton } from '../components/SkeletonLoader';
import { Link } from 'react-router-dom';
import { UserCircle2, Mail, Shield, CalendarDays } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <DashboardLayout>
        <ProfileSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Profile</h1>
          <p className="mt-1 text-sm text-secondary">Review your SeatFlow account details.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <div className="card p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/15 text-primary">
                <UserCircle2 size={38} />
              </div>
              <h2 className="text-xl font-semibold text-text">{user.name}</h2>
              <p className="mt-1 text-sm text-secondary">{user.role}</p>
            </div>

            <div className="mt-6 space-y-4 border-t border-border/60 pt-6 text-sm">
              <div className="flex items-center gap-3 text-secondary">
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-secondary">
                <Shield size={16} />
                <span>Active account</span>
              </div>
              <div className="flex items-center gap-3 text-secondary">
                <CalendarDays size={16} />
                <span>SeatFlow member</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-text">Account summary</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-background/60 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">Role</p>
                  <p className="mt-2 text-lg font-semibold text-text">{user.role}</p>
                </div>
                <div className="rounded-2xl bg-background/60 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">Status</p>
                  <p className="mt-2 text-lg font-semibold text-available">Active</p>
                </div>
                <div className="rounded-2xl bg-background/60 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">Workspace</p>
                  <p className="mt-2 text-lg font-semibold text-text">SeatFlow</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-semibold text-text">Recommended actions</h2>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link className="btn-primary h-11 px-6" to={user.role === 'Admin' ? '/admin' : '/dashboard'}>
                  Open dashboard
                </Link>
                <Link className="btn-outline h-11 px-6" to="/settings">
                  Open settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}