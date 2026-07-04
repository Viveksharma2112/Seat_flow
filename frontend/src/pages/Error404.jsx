import { Link } from 'react-router-dom';
import { Ghost } from 'lucide-react';

export default function Error404() {
  return (
    <div className="min-h-screen bg-background px-4 py-10 flex items-center justify-center">
      <div className="card relative w-full max-w-xl overflow-hidden p-8 sm:p-10 text-center">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-available to-secondary" />
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary/10 text-secondary">
          <Ghost size={38} />
        </div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.28em] text-secondary">404 Not Found</p>
        <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">We could not find that page</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-secondary sm:text-base">
          The link may be broken, expired, or the page may have moved.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/" className="btn-outline h-11 px-6">
            Back to home
          </Link>
          <Link to="/dashboard" className="btn-primary h-11 px-6">
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
