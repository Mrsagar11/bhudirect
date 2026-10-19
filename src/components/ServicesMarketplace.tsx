import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { MicroService } from '../types';
import { MOCK_SERVICES, MOCK_PLOTS } from '../data/mockData';
import { formatINR } from '../utils/geoCalculations';
import { 
  Wrench, 
  Camera, 
  Compass, 
  FileCheck, 
  Building, 
  Droplets, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  UserCheck,
  X
} from 'lucide-react';

interface BookedServiceOrder {
  orderId: string;
  serviceTitle: string;
  plotGat: string;
  fee: number;
  scheduledDate: string;
  status: 'Dispatched' | 'Scheduled' | 'Completed';
}

export const ServicesMarketplace: React.FC = () => {
  const [selectedService, setSelectedService] = useState<MicroService | null>(null);
  const [selectedPlotGat, setSelectedPlotGat] = useState<string>(MOCK_PLOTS[0].gatNumber);
  const [scheduledDate, setScheduledDate] = useState<string>('2026-10-23');
  const [contactName, setContactName] = useState<string>('Dr. Vikramaditya Kulkarni');
  const [contactPhone, setContactPhone] = useState<string>('+91 98230 77112');
  const [bookedOrders, setBookedOrders] = useState<BookedServiceOrder[]>([
    {
      orderId: 'SRV-8941',
      serviceTitle: 'High-Definition Drone Flyover & 360° Video',
      plotGat: 'Gat No. 142/2A (Mulshi)',
      fee: 1499,
      scheduledDate: '21 Oct 2026',
      status: 'Scheduled',
    },
  ]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Icon mapping
  const renderIcon = (name: string) => {
    switch (name) {
      case 'Camera':
        return <Camera className="w-6 h-6 text-emerald-400" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-amber-400" />;
      case 'FileCheck':
        return <FileCheck className="w-6 h-6 text-cyan-400" />;
      case 'Building':
        return <Building className="w-6 h-6 text-indigo-400" />;
      case 'Droplets':
        return <Droplets className="w-6 h-6 text-blue-400" />;
      default:
        return <Wrench className="w-6 h-6 text-emerald-400" />;
    }
  };

  const handleBookService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10b981', '#38bdf8', '#fbbf24'],
    });

    const newOrder: BookedServiceOrder = {
      orderId: `SRV-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceTitle: selectedService.title,
      plotGat: selectedPlotGat,
      fee: selectedService.fee,
      scheduledDate: scheduledDate,
      status: 'Scheduled',
    };

    setBookedOrders((prev) => [newOrder, ...prev]);
    setShowConfirmation(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-100">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
          A La Carte Micro-Services Marketplace
        </span>
        <h2 className="text-3xl font-extrabold text-white mt-2">
          Transparent Flat-Fee Services • Zero 2% Commission
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Brokers traditionally charge 2% just to arrange a surveyor or lawyer. On BhuDirect, book certified professionals at guaranteed flat government and market benchmark rates.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {MOCK_SERVICES.map((srv) => (
          <div
            key={srv.id}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-xl relative group"
          >
            {srv.popularTag && (
              <span className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {srv.popularTag}
              </span>
            )}

            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {renderIcon(srv.iconName)}
              </div>

              <h3 className="text-base font-bold text-white mb-1.5">{srv.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{srv.shortDesc}</p>

              {/* Price & SLA Bar */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
                <div>
                  <div className="text-[10px] text-slate-500">Flat Fee (No Commission)</div>
                  <div className="text-xl font-black text-emerald-400">
                    ₹{srv.fee.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500">Service SLA</div>
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {srv.sla}
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div className="space-y-2 mb-6">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Included Deliverables:
                </span>
                {srv.deliverables.map((deliv, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{deliv}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedService(srv);
                setShowConfirmation(false);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-bold border border-slate-700 hover:border-emerald-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Book Service (₹{srv.fee})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Active Orders List */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Active Service Dispatches & On-Demand Bookings
          </h3>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            {bookedOrders.length} Orders Active
          </span>
        </div>

        <div className="space-y-3">
          {bookedOrders.map((ord) => (
            <div
              key={ord.orderId}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold flex-shrink-0">
                  {ord.orderId.substring(4)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{ord.serviceTitle}</div>
                  <div className="text-slate-400 mt-0.5">
                    Target: <span className="text-emerald-400 font-semibold">{ord.plotGat}</span> • Scheduled for {ord.scheduledDate}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <div className="text-right">
                  <div className="font-bold text-white text-sm">₹{ord.fee.toLocaleString()}</div>
                  <span className="text-[10px] text-slate-500">Flat Fee Paid</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {ord.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Checkout Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl text-slate-100 flex flex-col my-auto overflow-hidden">
            {/* Header */}
            <div className="bg-slate-950/80 border-b border-slate-800 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Book Micro-Service</h3>
                  <p className="text-xs text-slate-400">{selectedService.title}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {showConfirmation ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Specialist Dispatched!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Your booking for <span className="text-emerald-400 font-bold">{selectedService.title}</span> on{' '}
                  <span className="text-white font-semibold">{selectedPlotGat}</span> is confirmed for{' '}
                  <span className="text-white font-semibold">{scheduledDate}</span>.
                </p>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Flat Fee:</span>
                    <span className="font-bold text-emerald-400">₹{selectedService.fee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Traditional Broker Fee:</span>
                    <span className="font-bold text-slate-500 line-through">₹{formatINR(Math.round(MOCK_PLOTS[0].askingPrice * 0.02))}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-slate-800">
                    <span>You Saved:</span>
                    <span>100% Commission-Free</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedService(null)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-colors"
                >
                  Return to Marketplace
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookService} className="p-6 space-y-4">
                {/* Target Plot Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Select Land Parcel</label>
                  <select
                    value={selectedPlotGat}
                    onChange={(e) => setSelectedPlotGat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {MOCK_PLOTS.map((p) => (
                      <option key={p.id} value={`${p.gatNumber} (${p.village}, ${p.taluka})`}>
                        {p.gatNumber} • {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    Preferred Dispatch Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Contact Name</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Phone</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Flat Fee Summary */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Fixed Transparent Price</span>
                    <div className="text-lg font-black text-emerald-400">
                      ₹{selectedService.fee.toLocaleString()} Flat
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-1 rounded border border-emerald-800 font-mono">
                    Zero Broker Markup
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
                >
                  Confirm & Dispatch Specialist (₹{selectedService.fee})
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
