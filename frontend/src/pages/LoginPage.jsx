import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../hooks/useAsync';
import Alert from '../components/Alert';
import { Loader2, ArrowRight, ShieldCheck, Zap, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, setError, run } = useAsync();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await run(() => login(form));
      toast.success(`Welcome back, ${user.name}!`);
      const from = location.state?.from?.pathname || (user.role === 'Admin' ? '/admin' : '/dashboard');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left Side Branding */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 lg:p-16 bg-card border-r border-border">
        <div>
          <Link to="/" className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-sm">S</span>
            </div>
            SeatFlow
          </Link>
          <h1 className="text-4xl lg:text-5xl font-bold text-text mb-6 leading-tight">
            Welcome back to SeatFlow
          </h1>
          <p className="text-lg text-secondary mb-12 max-w-md">
            Log in to manage your bookings, view analytics, and reserve your perfect spot.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-text">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Zap size={20} />
              </div>
              <span className="font-medium text-lg">Fast Reservations</span>
            </div>
            <div className="flex items-center gap-4 text-text">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck size={20} />
              </div>
              <span className="font-medium text-lg">Real-Time Availability</span>
            </div>
            <div className="flex items-center gap-4 text-text">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <BarChart2 size={20} />
              </div>
              <span className="font-medium text-lg">Usage Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8 text-center">
             <Link to="/" className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
               <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                 <span className="text-white font-bold text-sm">S</span>
               </div>
               SeatFlow
             </Link>
          </div>
          
          <h2 className="text-2xl font-bold text-text mb-2 text-center md:text-left">Sign in to your account</h2>
          <p className="text-secondary text-sm mb-8 text-center md:text-left">Enter your email and password below</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <Alert message={error} onClose={() => setError(null)} type="error" />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Email address</label>
              <input
                type="email"
                className="input-field"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-text">Password</label>
                <a href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full h-11 text-base group" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <span className="flex items-center justify-center gap-2">
                  Sign in <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
