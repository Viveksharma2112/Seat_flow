import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Search, BarChart2, CheckCircle2, MapPin, Clock } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-5 text-center lg:text-left mb-16 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text mb-6 leading-[1.1]">
                Find your space.<br/>
                <span className="text-primary">Focus better.</span>
              </h1>
              <p className="text-lg text-secondary mb-8 max-w-xl mx-auto lg:mx-0">
                The most elegant way to book your study or coworking space. Experience seamless reservations with real-time availability.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                {user ? (
                  <Link to={user.role === 'Admin' ? '/admin' : '/dashboard'} className="btn-primary w-full sm:w-auto h-12 px-8 text-base shadow-soft">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn-primary w-full sm:w-auto h-12 px-8 text-base shadow-soft">
                      Get Started
                    </Link>
                    <a href="#features" className="btn-outline w-full sm:w-auto h-12 px-8 text-base bg-transparent">
                      Explore Features
                    </a>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 border-t border-border pt-8">
                <div>
                  <div className="text-2xl font-bold text-text mb-1">500+</div>
                  <div className="text-sm text-secondary font-medium">Students</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-text mb-1">1500+</div>
                  <div className="text-sm text-secondary font-medium">Reservations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-text mb-1">98%</div>
                  <div className="text-sm text-secondary font-medium">Utilization</div>
                </div>
              </div>
            </div>

            {/* Right Content - Interactive Map Preview */}
            <div className="lg:col-span-7 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-[2.5rem] transform rotate-3"></div>
              <div className="card bg-card p-6 sm:p-8 rounded-[2rem] shadow-card relative border border-border/60">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-lg text-text">Floor 1 - Quiet Zone</h3>
                    <p className="text-sm text-secondary">Section A</p>
                  </div>
                  <div className="flex gap-2 text-xs font-medium">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-available"></div> Available</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-occupied"></div> Occupied</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                  {/* Mock Seats */}
                  {Array.from({ length: 16 }).map((_, i) => {
                    // Create realistic statuses
                    const isOccupied = [2, 5, 6, 11, 14].includes(i);
                    const isSelected = i === 9;
                    const isReserved = [1, 12].includes(i);
                    
                    let statusClass = "bg-available/10 border-available/30 text-available hover:bg-available hover:text-white";
                    if (isOccupied) statusClass = "bg-occupied/10 border-occupied/20 text-occupied/50 cursor-not-allowed";
                    else if (isReserved) statusClass = "bg-reserved/10 border-reserved/30 text-reserved cursor-not-allowed";
                    else if (isSelected) statusClass = "bg-primary text-white border-primary shadow-soft ring-4 ring-primary/20";

                    return (
                      <div 
                        key={i} 
                        className={`aspect-square rounded-xl border flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${statusClass}`}
                      >
                        <div className="font-semibold text-sm sm:text-base">A{i + 1}</div>
                        {!isOccupied && !isReserved && <div className="text-[10px] sm:text-xs opacity-70 mt-0.5">Seat</div>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-card border-y border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-text mb-4">Premium features for modern spaces</h2>
            <p className="text-secondary max-w-2xl mx-auto text-lg">Everything you need to manage and book seats efficiently, wrapped in a beautiful interface.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 bg-background border-transparent hover:border-border transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time Availability</h3>
              <p className="text-secondary leading-relaxed">See instantly which seats are free, occupied, or reserved. Our interactive map updates in real-time.</p>
            </div>
            
            <div className="card p-8 bg-background border-transparent hover:border-border transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Reserve Instantly</h3>
              <p className="text-secondary leading-relaxed">Book your preferred spot with a single click. Manage upcoming reservations effortlessly.</p>
            </div>

            <div className="card p-8 bg-background border-transparent hover:border-border transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <BarChart2 size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Usage Analytics</h3>
              <p className="text-secondary leading-relaxed">Gain insights into space utilization, peak hours, and popular areas with powerful reporting tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-text mb-4">How it works</h2>
            <p className="text-secondary max-w-2xl mx-auto text-lg">Three simple steps to secure your perfect workspace.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border -z-10"></div>
            
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-card border-2 border-border rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                <MapPin size={32} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Step 1: Browse Available Seats</h3>
              <p className="text-secondary text-sm px-4">Explore our interactive floor maps and find the perfect spot based on real-time availability.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-card border-2 border-border rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                <Clock size={32} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Step 2: Reserve Your Seat</h3>
              <p className="text-secondary text-sm px-4">Select your desired duration and secure your booking instantly with one click.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-primary text-white rounded-3xl flex items-center justify-center mb-6 shadow-soft ring-8 ring-background">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Step 3: Check-In & Use Space</h3>
              <p className="text-secondary text-sm px-4">Arrive at your space, check-in through the app, and focus on what matters most.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
