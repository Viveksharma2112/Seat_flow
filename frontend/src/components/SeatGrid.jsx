import { MapPin, Info } from 'lucide-react';

export default function SeatGrid({ seats, selectedId, onSelect }) {
  // Group by Floor then Section
  const grouped = seats.reduce((acc, seat) => {
    const floorName = seat.floor?.name || 'Unknown Floor';
    const sectionName = seat.section?.name || 'Unknown Section';
    if (!acc[floorName]) acc[floorName] = {};
    if (!acc[floorName][sectionName]) acc[floorName][sectionName] = [];
    acc[floorName][sectionName].push(seat);
    return acc;
  }, {});

  const getSeatStyles = (seat) => {
    if (selectedId === seat._id) return 'bg-primary text-white border-primary shadow-soft ring-4 ring-primary/20 scale-105 z-10';
    if (seat.status === 'Available') return 'bg-available/10 text-available border-available/30 hover:bg-available hover:text-white hover:border-available hover:scale-105';
    if (seat.status === 'Occupied') return 'bg-occupied/10 text-occupied/50 border-occupied/20 cursor-not-allowed opacity-60';
    return 'bg-reserved/10 text-reserved border-reserved/30 cursor-not-allowed opacity-80'; // Reserved
  };

  if (!seats.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/50">
        <MapPin className="text-secondary/50 mb-4" size={48} />
        <h3 className="text-lg font-medium text-text mb-1">No seats found</h3>
        <p className="text-sm text-secondary">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {Object.entries(grouped).map(([floor, sections]) => (
        <div key={floor} className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <h2 className="text-xl font-semibold text-text">{floor}</h2>
            <span className="text-xs font-medium bg-secondary/10 text-secondary px-2.5 py-1 rounded-full">Floor Map</span>
          </div>

          <div className="space-y-8 pl-4 border-l-2 border-border/50">
            {Object.entries(sections).map(([section, sectionSeats]) => (
              <div key={section}>
                <h3 className="mb-4 text-sm font-medium text-secondary uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                  {section}
                </h3>
                <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                  {/* Visual Grid representing rows implicitly by columns */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 sm:gap-4">
                    {sectionSeats.map((seat) => (
                      <button
                        key={seat._id}
                        type="button"
                        disabled={seat.status !== 'Available' && selectedId !== seat._id}
                        onClick={() => onSelect?.(seat)}
                        aria-label={`Seat ${seat.seatNumber}, ${seat.status}`}
                        aria-pressed={selectedId === seat._id}
                        className={`relative aspect-square flex flex-col items-center justify-center rounded-xl border transition-all duration-200 ${getSeatStyles(seat)} group`}
                      >
                        <span className="font-semibold text-sm sm:text-base">{seat.seatNumber}</span>
                        {seat.status === 'Available' && selectedId !== seat._id && (
                          <span className="text-[10px] opacity-70 mt-0.5 group-hover:text-white transition-colors">Seat</span>
                        )}
                        {/* Tooltip for extra feedback on hover if disabled */}
                        {seat.status !== 'Available' && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-text text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                            {seat.status}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SeatLegend() {
  const items = [
    { label: 'Available', color: 'bg-available', border: 'border-available/30', bg: 'bg-available/10' },
    { label: 'Selected', color: 'bg-primary', border: 'border-primary', bg: 'bg-primary' },
    { label: 'Reserved', color: 'bg-reserved', border: 'border-reserved/30', bg: 'bg-reserved/10' },
    { label: 'Occupied', color: 'bg-occupied', border: 'border-occupied/20', bg: 'bg-occupied/10' },
  ];

  return (
    <div className="card bg-background border-border/60 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/50 text-sm font-medium text-text">
        <Info size={16} className="text-secondary" />
        Map Legend
      </div>
      <div className="flex flex-wrap gap-6 text-sm text-secondary">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5">
            <div className={`w-6 h-6 rounded-md border ${item.border} ${item.bg} flex items-center justify-center`}>
              {item.label === 'Selected' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
              {item.label === 'Available' && <span className="w-1.5 h-1.5 rounded-full bg-available"></span>}
            </div>
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
