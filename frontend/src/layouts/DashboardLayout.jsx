import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  LayoutDashboard, 
  Map, 
  BookOpen, 
  History, 
  Settings, 
  Users, 
  CalendarRange, 
  BarChart3, 
  LogOut, 
  Search, 
  Bell, 
  Menu,
  X,
  ChevronDown,
  UserCircle2,
} from 'lucide-react';

const studentLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/seats', label: 'Browse Seats', icon: Map },
  { to: '/bookings', label: 'My Bookings', icon: BookOpen },
  { to: '/bookings?tab=history', label: 'History', icon: History },
];

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/seats', label: 'Manage Seats', icon: Map },
  { to: '/admin/floors', label: 'Floors & Sections', icon: Settings },
  { to: '/admin/users', label: 'Manage Users', icon: Users },
  { to: '/admin/reservations', label: 'Reservations', icon: CalendarRange },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const links = user?.role === 'Admin' ? adminLinks : studentLinks;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const isActive = (path) => {
    if (path.includes('?')) return location.pathname + location.search === path;
    return location.pathname === path;
  };

  useEffect(() => {
    const onPointerDown = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setProfileMenuOpen(false);
      }
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const getBreadcrumbs = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length === 0) return 'Overview';
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' > ');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card p-5 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-sm">S</span>
            </div>
            SeatFlow
          </Link>
          <button className="lg:hidden btn-icon" onClick={() => setSidebarOpen(false)} aria-label="Close navigation menu">
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1.5 flex-1 h-[calc(100vh-160px)] overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-secondary hover:bg-background hover:text-text'
                }`}
              >
                <Icon size={18} className={active ? 'text-primary' : 'text-secondary'} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="pt-4 border-t border-border mt-auto text-sm text-secondary">
          <p className="px-3 pb-2 font-medium text-text">Quick Access</p>
          <Link to="/profile" className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-background hover:text-text">
            <UserCircle2 size={18} />
            Profile
          </Link>
          <Link to="/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-background hover:text-text">
            <Settings size={18} />
            Settings
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              setProfileMenuOpen(false);
              toast.success('Logged out successfully');
              navigate('/login', { replace: true });
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-secondary transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button className="lg:hidden btn-icon" onClick={() => setSidebarOpen(true)} aria-label="Open navigation menu">
              <Menu size={20} />
            </button>
            
            {/* Breadcrumbs */}
            <div className="hidden md:flex items-center text-sm text-secondary">
              <span className="text-text font-medium">{user?.role === 'Admin' ? 'Admin' : 'Dashboard'}</span>
              <span className="mx-2 text-border">/</span>
              <span>{getBreadcrumbs()}</span>
            </div>
          </div>

            <div className="flex items-center gap-3 sm:gap-5">
            {/* Search Input */}
            <div className="hidden sm:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
              <input 
                type="text" 
                placeholder="Search seats..." 
                className="input-field pl-9 h-9 py-0 text-sm bg-background border-transparent w-48 lg:w-64"
              />
            </div>

            {/* Notifications */}
              <button className="btn-icon relative" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border-2 border-card"></span>
            </button>

            {/* User Profile */}
            <div className="relative flex items-center gap-3 pl-2 sm:border-l border-border" ref={profileMenuRef}>
              <button
                type="button"
                className="flex items-center gap-3 rounded-2xl px-2 py-1.5 transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                onClick={() => setProfileMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
                aria-label="Open profile menu"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-text leading-none">{user?.name || 'User'}</p>
                  <p className="text-xs text-secondary mt-1">{user?.role}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <ChevronDown size={16} className="text-secondary hidden sm:block" />
              </button>

              {profileMenuOpen && (
                <div
                  role="menu"
                  aria-label="Profile menu"
                  className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
                >
                  <Link role="menuitem" to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-text hover:bg-background">
                    <UserCircle2 size={16} className="text-secondary" />
                    Profile
                  </Link>
                  <Link role="menuitem" to="/settings" className="flex items-center gap-3 px-4 py-3 text-sm text-text hover:bg-background">
                    <Settings size={16} className="text-secondary" />
                    Settings
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-occupied hover:bg-occupied/5"
                    onClick={() => {
                      logout();
                      setProfileMenuOpen(false);
                      toast.success('Logged out successfully');
                      navigate('/login', { replace: true });
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
