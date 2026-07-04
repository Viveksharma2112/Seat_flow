import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../hooks/useAsync';
import Alert from '../components/Alert';
import { Loader2, ArrowRight, ShieldCheck, Zap, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { loading, error, setError, run } = useAsync();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const user = await run(() => register({ name: form.name, email: form.email, password: form.password }));
      toast.success('Registration successful. Welcome to SeatFlow!');
      navigate(user.role === 'Admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error('Registration failed. Please check your details.');
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
            Smart Seat Reservation Platform
          </h1>
          <p className="text-lg text-secondary mb-12 max-w-md">
            Reserve seats for libraries, labs, coworking spaces, and study rooms with real-time availability.
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
          
          <h2 className="text-2xl font-bold text-text mb-2 text-center md:text-left">Create your account</h2>
          <p className="text-secondary text-sm mb-8 text-center md:text-left">Enter your details below to get started</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <Alert message={error} onClose={() => setError(null)} type="error" />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Full name</label>
              <input
                className="input-field"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

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
              <label className="mb-1.5 block text-sm font-medium text-text">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Confirm Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                minLength={6}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full h-11 text-base group" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <span className="flex items-center justify-center gap-2">
                  Create account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
