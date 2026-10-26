import React from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  FileText, 
  Handshake, 
  Wrench, 
  Compass, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export type ActiveTab = 'discovery' | 'demarcation' | 'title-parser' | 'deal-room' | 'services';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  brokerageSavedTotal?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  brokerageSavedTotal = 48200000 
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <button 
            type="button" 
            className="flex items-center gap-3 text-left focus:outline-none cursor-pointer" 
            onClick={() => setActiveTab('discovery')}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 border border-emerald-500/40 flex items-center justify-center">
              <Compass className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  BhuDirect
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider">
                  0% Brokerage
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Direct P2P Cadastral Land & Plot Marketplace
              </p>
            </div>
          </button>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('discovery')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                activeTab === 'discovery'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-4 h-4" />
              GIS Discovery
            </button>

            <button
              onClick={() => setActiveTab('demarcation')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                activeTab === 'demarcation'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              List & Demarcate
            </button>

            <button
              onClick={() => setActiveTab('title-parser')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                activeTab === 'title-parser'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              Title Health
            </button>

            <button
              onClick={() => setActiveTab('deal-room')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 relative ${
                activeTab === 'deal-room'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Handshake className="w-4 h-4" />
              Deal Room
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1" aria-hidden="true" />
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                activeTab === 'services'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Micro-Services
            </button>
          </nav>

          {/* Right Action / Savings Ticker & Identity Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[10px] text-emerald-300 font-medium">Brokerage Eliminated</div>
                <div className="text-xs font-bold text-emerald-400 font-mono">
                  ₹{(brokerageSavedTotal / 10000000).toFixed(2)} Cr Saved
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/70 border border-slate-700 px-3 py-1.5 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[11px] font-semibold text-slate-200">Aadhaar Verified</div>
                <div className="text-[9px] text-slate-400 font-mono">Direct Khatedar</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/60 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('discovery')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap ${
              activeTab === 'discovery' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            GIS Map
          </button>
          <button
            onClick={() => setActiveTab('demarcation')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap ${
              activeTab === 'demarcation' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Demarcate
          </button>
          <button
            onClick={() => setActiveTab('title-parser')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap ${
              activeTab === 'title-parser' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Title Scan
          </button>
          <button
            onClick={() => setActiveTab('deal-room')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap ${
              activeTab === 'deal-room' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            <Handshake className="w-3.5 h-3.5" />
            Deal Room
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap ${
              activeTab === 'services' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Services
          </button>
        </div>
      </div>
    </header>
  );
};
