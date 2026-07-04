import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-sm">S</span>
            </div>
            SeatFlow
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-secondary md:flex">
            <a href="#features" className="hover:text-text transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-text transition-colors">How it works</a>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to={user.role === 'Admin' ? '/admin' : '/dashboard'} className="btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-outline hidden sm:inline-flex border-transparent hover:bg-border/50">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
