import React, { useState } from 'react';
import { Plot } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Navigation, 
  UserCheck, 
  CheckCircle2,
  Compass,
  Phone
} from 'lucide-react';

interface ScheduleVisitModalProps {
  plot: Plot | null;
  onClose: () => void;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({ plot, onClose }) => {
  if (!plot) return null;

  const [date, setDate] = useState<string>('2026-10-22');
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM - 12:00 PM');
  const [visitType, setVisitType] = useState<'self' | 'accompanied'>('accompanied');
  const [name, setName] = useState<string>('Dr. Vikramaditya Kulkarni');
  const [phone, setPhone] = useState<string>('+91 98230 77112');
  const [isBooked, setIsBooked] = useState<boolean>(false);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${plot.center[0]},${plot.center[1]}`;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-lg text-slate-100 flex flex-col my-auto overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950/80 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Schedule Field Visit</h3>
              <p className="text-xs text-slate-400">
                Gat {plot.gatNumber} • {plot.village}, {plot.district}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isBooked ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">Field Visit Scheduled!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Your visit to <span className="text-emerald-400 font-bold">{plot.gatNumber}</span> is confirmed for{' '}
              <span className="text-white font-semibold">{date}</span> at{' '}
              <span className="text-white font-semibold">{timeSlot}</span>.
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2">
              <div className="text-xs text-slate-400">Assigned Local Field Concierge</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Santosh Chavan</div>
                  <div className="text-xs text-emerald-400">BhuDirect Empanelled Surveyor Assistant</div>
                </div>
                <a
                  href="tel:+919822998811"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Concierge
                </a>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                Navigate in Google Maps
              </a>
              <button
                onClick={onClose}
                className="py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="p-6 space-y-4">
            {/* Visit Type Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Choose Visit Experience</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVisitType('accompanied')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all text-left ${
                    visitType === 'accompanied'
                      ? 'bg-emerald-950/40 border-emerald-500/80 text-white ring-1 ring-emerald-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    Accompanied by Field Assistant
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Free on-site escort to verify boundary pegs & meet the village Talathi.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setVisitType('self')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all text-left ${
                    visitType === 'self'
                      ? 'bg-emerald-950/40 border-emerald-500/80 text-white ring-1 ring-emerald-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    Self-Guided GPS Plot Walk
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Receive direct GPS coordinates & walk the perimeter autonomously.
                  </p>
                </button>
              </div>
            </div>

            {/* Date and Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Select Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Preferred Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="08:00 AM - 10:00 AM">Morning (08:00 AM - 10:00 AM)</option>
                  <option value="10:00 AM - 12:00 PM">Mid-day (10:00 AM - 12:00 PM)</option>
                  <option value="02:00 PM - 04:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                  <option value="04:30 PM - 06:30 PM">Sunset (04:30 PM - 06:30 PM)</option>
                </select>
              </div>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Your Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Mobile Number (WhatsApp SMS)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* GPS Coordinates Direct Pin */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-bold text-white">Plot Centroid GPS</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {plot.center[0].toFixed(5)}° N, {plot.center[1].toFixed(5)}° E
                  </div>
                </div>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                Open Maps <Navigation className="w-3 h-3" />
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-emerald-500/25 cursor-pointer mt-2"
            >
              Confirm Field Visit Appointment
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
