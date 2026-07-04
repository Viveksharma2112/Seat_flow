import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function Error403() {
  return (
    <div className="min-h-screen bg-background px-4 py-10 flex items-center justify-center">
      <div className="card relative w-full max-w-xl overflow-hidden p-8 sm:p-10 text-center">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-reserved to-occupied" />
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-occupied/10 text-occupied">
          <ShieldAlert size={38} />
        </div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.28em] text-secondary">403 Unauthorized</p>
        <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">Access denied</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-secondary sm:text-base">
          You do not have permission to access this area. Please return to a page that matches your role.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/" className="btn-outline h-11 px-6">
            Go home
          </Link>
          <Link to="/dashboard" className="btn-primary h-11 px-6">
            Open dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
