import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { Settings, BellRing, LockKeyhole, Palette } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Settings</h1>
          <p className="mt-1 text-sm text-secondary">Account preferences and notification controls.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BellRing size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-text">Notifications</h2>
                <p className="text-sm text-secondary">Keep track of booking events and seat changes.</p>
              </div>
            </div>

            <label className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/50 px-4 py-3">
              <span>
                <span className="block font-medium text-text">Email notifications</span>
                <span className="text-sm text-secondary">Receive updates about reservations and account changes.</span>
              </span>
              <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-border text-primary focus:ring-primary" />
            </label>
          </div>

          <div className="card p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                <LockKeyhole size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-text">Security</h2>
                <p className="text-sm text-secondary">Your current session is protected with JWT authentication.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/50 p-4 text-sm text-secondary">
              Signed in as <span className="font-medium text-text">{user?.email}</span>
            </div>
          </div>

          <div className="card p-6 space-y-5 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-available/10 text-available">
                <Palette size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-text">Appearance</h2>
                <p className="text-sm text-secondary">SeatFlow uses a consistent light interface optimized for clarity.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {['Primary workspace', 'Focus-friendly contrast', 'Production-ready defaults'].map((item) => (
                <div key={item} className="rounded-2xl border border-border/60 bg-background/50 p-4 text-sm text-text">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}