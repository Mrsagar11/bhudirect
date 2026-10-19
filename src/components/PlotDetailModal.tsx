import React from 'react';
import { Plot } from '../types';
import { formatINR, formatFullINR } from '../utils/geoCalculations';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Car, 
  Mountain, 
  Droplet, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight,
  UserCheck,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface PlotDetailModalProps {
  plot: Plot | null;
  onClose: () => void;
  onMakeOffer: (plot: Plot) => void;
  onScheduleVisit: (plot: Plot) => void;
  onOpenTitleScanner: (plot: Plot) => void;
}

export const PlotDetailModal: React.FC<PlotDetailModalProps> = ({
  plot,
  onClose,
  onMakeOffer,
  onScheduleVisit,
  onOpenTitleScanner,
}) => {
  if (!plot) return null;

  const circleRateTotal = plot.areaSqM * plot.readyReckonerRate;
  const valuationDeltaPercent = Math.round(
    ((plot.askingPrice - circleRateTotal) / circleRateTotal) * 100
  );
  const brokerSavingsBuyer = Math.round(plot.askingPrice * 0.02);
  const brokerSavingsSeller = Math.round(plot.askingPrice * 0.02);
  const totalBrokerageEliminated = brokerSavingsBuyer + brokerSavingsSeller;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col my-auto">
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {plot.gatNumber}
            </span>
            <span className="text-xs text-slate-400">
              {plot.village}, {plot.taluka}, {plot.district}, {plot.state}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Main Title & Image Gallery */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {plot.title}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-xs">
                    Zone: {plot.zone}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium text-xs flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> Direct Khata Holder Listing
                  </span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="text-left sm:text-right bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div className="text-2xl font-black text-emerald-400">
                  {formatINR(plot.askingPrice)}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {formatFullINR(plot.askingPrice)}
                </div>
                <div className="text-[11px] text-emerald-300 font-semibold mt-1">
                  ₹{Math.round(plot.askingPrice / plot.areaSqM)} / m² (₹{Math.round(plot.askingPrice / plot.areaGunthas)} / Guntha)
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl overflow-hidden h-64 sm:h-72">
              <div className="sm:col-span-2 h-full">
                <img
                  src={plot.images[0]}
                  alt="Plot View"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:flex flex-col gap-3 h-full">
                {plot.images.slice(1, 3).map((img, idx) => (
                  <div key={idx} className="flex-1 overflow-hidden">
                    <img
                      src={img}
                      alt="Cadastral View"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Area & Perimeter Measurement Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Accurate Cadastral Spatial Measurements (Turf.js)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400">Area in Gunthas</div>
                <div className="text-xl font-black text-white mt-0.5">{plot.areaGunthas}</div>
                <div className="text-[10px] text-slate-500">1 Guntha = 1,089 sq ft</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400">Area in Acres</div>
                <div className="text-xl font-black text-emerald-400 mt-0.5">{plot.areaAcres} Ac</div>
                <div className="text-[10px] text-slate-500">40 Gunthas per Acre</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400">Square Meters</div>
                <div className="text-xl font-black text-white mt-0.5">{plot.areaSqM.toLocaleString()} m²</div>
                <div className="text-[10px] text-slate-500">{(plot.areaSqM * 10.7639).toFixed(0)} Sq. Feet</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400">Boundary Perimeter</div>
                <div className="text-xl font-black text-cyan-400 mt-0.5">{plot.perimeterM} m</div>
                <div className="text-[10px] text-slate-500">Fencing Length</div>
              </div>
            </div>
          </div>

          {/* Valuation Benchmarking & 0% Broker Savings */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Valuation Benchmark vs Official Ready Reckoner (Circle Rate)
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Transparent Pricing
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-xs text-slate-400 block">Govt Circle Rate (Ready Reckoner)</span>
                <span className="text-lg font-bold text-amber-400">
                  ₹{plot.readyReckonerRate} / m²
                </span>
                <span className="text-xs text-slate-400 block mt-1">
                  Total Govt Valuation: {formatINR(circleRateTotal)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-xs text-slate-400 block">Seller Asking Rate</span>
                <span className="text-lg font-bold text-white">
                  ₹{Math.round(plot.askingPrice / plot.areaSqM)} / m²
                </span>
                <span className="text-xs text-emerald-400 block mt-1 font-medium">
                  {valuationDeltaPercent > 0 ? `+${valuationDeltaPercent}%` : `${valuationDeltaPercent}%`} over circle rate
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-xs text-slate-400 block">Fair Market Benchmark</span>
                <span className="text-lg font-bold text-cyan-400">
                  ₹{plot.marketBenchmarkRate} / m²
                </span>
                <span className="text-xs text-slate-400 block mt-1">
                  Based on recent SRO registration deeds
                </span>
              </div>
            </div>

            {/* Zero Brokerage Savings Highlight Card */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Broker Commission Eliminated: {formatINR(totalBrokerageEliminated)} Saved!
                  </div>
                  <div className="text-[11px] text-emerald-300">
                    You save {formatINR(brokerSavingsBuyer)} (2%) • Seller saves {formatINR(brokerSavingsSeller)} (2%)
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 font-mono mt-2 sm:mt-0 px-3 py-1 rounded-lg bg-emerald-900/60 border border-emerald-500/40">
                Zero Middlemen
              </span>
            </div>
          </div>

          {/* Access Road & Elevation Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Access Road */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-400" />
                Access Road Connectivity
              </h4>
              <div className="text-sm font-semibold text-white">
                {plot.accessRoad.widthMeters}m {plot.accessRoad.type}
              </div>
              <p className="text-xs text-slate-300">
                Status: <span className="text-emerald-400 font-medium">{plot.accessRoad.connectivityStatus}</span>
              </p>
              <p className="text-xs text-slate-400">
                Road Frontage: <span className="text-white font-medium">{plot.accessRoad.roadFrontageMeters} meters</span> along perimeter
              </p>
            </div>

            {/* Elevation & Slope */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Mountain className="w-4 h-4 text-cyan-400" />
                Contour Slope & Flood Risk
              </h4>
              <div className="text-sm font-semibold text-white">
                Elevation {plot.elevation.avgAltitudeM}m MSL • {plot.elevation.slopeCategory}
              </div>
              <p className="text-xs text-slate-300">
                Flood Risk: <span className="text-emerald-400 font-medium">{plot.elevation.floodRiskLevel}</span>
              </p>
              <p className="text-xs text-slate-400">
                Groundwater Table: <span className="text-white font-medium">{plot.elevation.groundwaterPotential}</span>
              </p>
            </div>
          </div>

          {/* Title Health & Verified Khatedar Section */}
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Automated Title Health & 7/12 Audit
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Audited via Mahabhulekh & Department of Registration and Stamps (IGR)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">Title Score</div>
                  <div className="text-lg font-black text-emerald-400">
                    {plot.titleHealth.score}/100 ({plot.titleHealth.grade})
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenTitleScanner(plot);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 border border-slate-700 transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Full Scanner
                </button>
              </div>
            </div>

            {/* Audit Breakdown Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {plot.titleHealth.flags.map((flag, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    flag.type === 'success'
                      ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-200'
                      : flag.type === 'warning'
                      ? 'bg-amber-950/30 border-amber-500/20 text-amber-200'
                      : 'bg-rose-950/30 border-rose-500/20 text-rose-200'
                  }`}
                >
                  {flag.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-xs font-bold text-white">{flag.label}</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">{flag.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Verified Seller Card */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                  {plot.seller.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs text-slate-400">Direct Verified Land Owner (Khatedar)</div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    {plot.seller.name}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                      Aadhaar: {plot.seller.aadhaarMasked}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                PAN: <span className="text-slate-200 font-semibold">{plot.seller.panMasked}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="hidden sm:block">
            <span className="text-xs text-slate-400">Direct Negotiation Guarantee</span>
            <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> 100% Broker-Free • Escrow Protected
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onScheduleVisit(plot);
              }}
              className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              Schedule Field Visit
            </button>

            <button
              onClick={() => {
                onClose();
                onMakeOffer(plot);
              }}
              className="flex-1 sm:flex-none py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Make Direct Counter-Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
