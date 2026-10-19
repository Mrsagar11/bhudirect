import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Plot } from '../types';
import { formatINR, formatFullINR } from '../utils/geoCalculations';
import { 
  X, 
  Handshake, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  Wallet, 
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface MakeOfferModalProps {
  plot: Plot | null;
  onClose: () => void;
  onSubmitOffer: (offerData: {
    plot: Plot;
    offeredPrice: number;
    tokenAdvance: number;
    timelineDays: number;
    financing: 'Self-Funded / Cash' | 'Pre-Approved Land Loan' | 'Bank Loan Pending';
    message: string;
  }) => void;
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  plot,
  onClose,
  onSubmitOffer,
}) => {
  if (!plot) return null;

  // Initial state default: 5% below asking price
  const [offeredPrice, setOfferedPrice] = useState<number>(
    Math.round(plot.askingPrice * 0.95 / 50000) * 50000
  );
  const [tokenAdvance, setTokenAdvance] = useState<number>(100000); // ₹1 Lakh standard earnest token
  const [timelineDays, setTimelineDays] = useState<number>(30);
  const [financing, setFinancing] = useState<'Self-Funded / Cash' | 'Pre-Approved Land Loan' | 'Bank Loan Pending'>('Self-Funded / Cash');
  const [note, setNote] = useState<string>(
    `Namaste ${plot.seller.name}. I have inspected Gat ${plot.gatNumber} on BhuDirect and love the parcel. I am ready to lock a ₹${(tokenAdvance/100000).toFixed(1)} Lakh earnest advance in BhuDirect escrow today.`
  );

  const discountPercent = Math.round(((offeredPrice - plot.askingPrice) / plot.askingPrice) * 100);
  const buyerBrokerageSaved = Math.round(offeredPrice * 0.02);
  const sellerBrokerageSaved = Math.round(offeredPrice * 0.02);
  const totalSaved = buyerBrokerageSaved + sellerBrokerageSaved;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#6ee7b7', '#38bdf8'],
    });

    onSubmitOffer({
      plot,
      offeredPrice,
      tokenAdvance,
      timelineDays,
      financing,
      message: note,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-lg text-slate-100 flex flex-col my-auto overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950/80 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Direct Counter-Offer</h3>
              <p className="text-xs text-slate-400">
                Gat {plot.gatNumber} • {plot.village}, {plot.taluka}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Asking Price vs Offer Price */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Seller Asking Price</span>
              <span className="text-sm font-bold text-slate-300 font-mono">
                {formatINR(plot.askingPrice)} ({formatFullINR(plot.askingPrice)})
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-400">Your Proposed Counter-Offer</label>
                <span className={`text-xs font-bold font-mono ${discountPercent < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {discountPercent}% vs Asking
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  step="25000"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-lg font-black text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              {/* Slider Helper */}
              <input
                type="range"
                min={plot.askingPrice * 0.75}
                max={plot.askingPrice * 1.15}
                step={25000}
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>-25% (₹{formatINR(plot.askingPrice * 0.75)})</span>
                <span>Asking (₹{formatINR(plot.askingPrice)})</span>
                <span>+15% (₹{formatINR(plot.askingPrice * 1.15)})</span>
              </div>
            </div>
          </div>

          {/* Token Advance & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Escrow Token Advance
              </label>
              <select
                value={tokenAdvance}
                onChange={(e) => setTokenAdvance(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={50000}>₹50,000 (Standard Token)</option>
                <option value={100000}>₹1,00,000 (Recommended 1 Lakh)</option>
                <option value={200000}>₹2,00,000 (Serious Buyer Fast-Track)</option>
                <option value={500000}>₹5,00,000 (5 Lakhs High Commitment)</option>
              </select>
              <span className="text-[10px] text-slate-400 block">
                Held safe in ICICI Escrow until title due diligence clears.
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Closing / Registry Timeline
              </label>
              <select
                value={timelineDays}
                onChange={(e) => setTimelineDays(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={15}>15 Days (Instant Cash Registry)</option>
                <option value={30}>30 Days (Standard Title Search + Mojni)</option>
                <option value={45}>45 Days (Bank Land Loan Processing)</option>
                <option value={60}>60 Days (Extended Mutual Agreement)</option>
              </select>
              <span className="text-[10px] text-slate-400 block">
                Days to execute final registered conveyance deed at SRO.
              </span>
            </div>
          </div>

          {/* Financing Status */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              Buyer Financing Readiness
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Self-Funded / Cash', 'Pre-Approved Land Loan', 'Bank Loan Pending'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFinancing(mode)}
                  className={`p-2 rounded-lg text-[11px] font-semibold border transition-all ${
                    financing === mode
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Note to Seller */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Message to Verified Land Owner</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Brokerage Savings Reminder */}
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Direct P2P: Both parties eliminate commission</span>
            </div>
            <span className="font-bold text-emerald-400 font-mono">
              Save {formatINR(totalSaved)}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Transmit Offer to Verified Owner</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
