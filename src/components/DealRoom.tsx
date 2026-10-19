import React, { useState } from 'react';
import { EscrowDeal, NegotiationOffer, Plot } from '../types';
import { MOCK_ACTIVE_DEAL, MOCK_ACTIVE_OFFER, MOCK_PLOTS } from '../data/mockData';
import { formatINR, formatFullINR } from '../utils/geoCalculations';
import { DeedModal } from './DeedModal';
import { 
  Handshake, 
  ShieldCheck, 
  FileText, 
  Lock, 
  CheckCircle2, 
  Send, 
  Clock, 
  Building2, 
  Sparkles, 
  Calendar,
  AlertCircle,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

interface DealRoomProps {
  onOpenServicesTab: () => void;
}

export const DealRoom: React.FC<DealRoomProps> = ({ onOpenServicesTab }) => {
  const [deal, setDeal] = useState<EscrowDeal>(MOCK_ACTIVE_DEAL);
  const [offer, setOffer] = useState<NegotiationOffer>(MOCK_ACTIVE_OFFER);
  const [newMessage, setNewMessage] = useState('');
  const [counterPrice, setCounterPrice] = useState<number>(deal.totalPrice);
  const [isCounterOpen, setIsCounterOpen] = useState(false);
  const [showDeedModal, setShowDeedModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'escrow' | 'negotiation'>('escrow');

  // Milestone toggler
  const handleToggleMilestone = (milestoneId: string) => {
    setDeal((prev) => {
      const updated = prev.milestones.map((m) => {
        if (m.id === milestoneId) {
          return {
            ...m,
            completed: !m.completed,
            date: !m.completed ? 'Just now (Verified)' : undefined,
          };
        }
        return m;
      });

      // If all completed, update deal status
      const allDone = updated.every((m) => m.completed);
      return {
        ...prev,
        milestones: updated,
        status: allDone ? 'Completed' : 'In Verification',
      };
    });
  };

  // Send message in thread
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: `msg-${Date.now()}`,
      sender: 'buyer' as const,
      text: newMessage.trim(),
      timestamp: 'Just now',
    };

    setOffer((prev) => ({
      ...prev,
      messages: [...prev.messages, msg],
    }));
    setNewMessage('');
  };

  // Submit counter
  const handleSubmitCounter = () => {
    const msg = {
      id: `msg-${Date.now()}`,
      sender: 'buyer' as const,
      text: `Buyer proposed revised consideration: ${formatINR(counterPrice)} (${formatFullINR(counterPrice)}). Ready for immediate registry update.`,
      timestamp: 'Just now',
      proposedAmount: counterPrice,
    };

    setOffer((prev) => ({
      ...prev,
      offeredPrice: counterPrice,
      messages: [...prev.messages, msg],
    }));

    setDeal((prev) => ({
      ...prev,
      totalPrice: counterPrice,
    }));

    setIsCounterOpen(false);
  };

  // Calculate brokerage savings
  const buyerSavings = Math.round(deal.totalPrice * 0.02);
  const sellerSavings = Math.round(deal.totalPrice * 0.02);
  const totalBrokerageEliminated = buyerSavings + sellerSavings;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Handshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE DEAL ROOM #{deal.id}
              </span>
              <span className="text-xs text-slate-400">{deal.gatNumber} • {deal.village}</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              {deal.plotTitle}
            </h2>
          </div>
        </div>

        {/* Brokerage Elimination Ticker Banner */}
        <div className="flex items-center gap-3 bg-emerald-950/60 border border-emerald-500/40 p-3.5 rounded-2xl text-emerald-200">
          <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <div className="text-xs font-bold text-white">
              {formatINR(totalBrokerageEliminated)} Commission Eliminated!
            </div>
            <div className="text-[11px] text-emerald-300">
              Buyer saved {formatINR(buyerSavings)} • Seller saved {formatINR(sellerSavings)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Escrow Milestones (2 cols) & Direct Negotiation Chat (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Smart Escrow Deal Room */}
        <div className="lg:col-span-2 space-y-6">
          {/* Escrow Status & Locked Token Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Regulated Smart Escrow Account
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Protected
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Account: {deal.escrowAccountNumber} • {deal.escrowBank}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-xs text-slate-400 font-medium">Locked Token Advance</div>
                <div className="text-2xl font-black text-emerald-400">
                  {formatINR(deal.tokenAmount)}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  Full Agreed Value: {formatINR(deal.totalPrice)}
                </span>
              </div>
            </div>

            {/* Conditions-based Milestone Release Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Conditions-Based Escrow Release Checklist
                </h4>
                <span className="text-[11px] text-slate-400">
                  Funds released strictly upon SRO biometric execution
                </span>
              </div>

              <div className="space-y-3">
                {deal.milestones.map((m, idx) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      m.completed
                        ? 'bg-slate-950/80 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950/40 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleMilestone(m.id)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 transition-colors cursor-pointer ${
                            m.completed
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'border border-slate-700 bg-slate-900 text-transparent hover:border-emerald-500'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{m.title}</span>
                            {m.completed && (
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                            {m.description}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
                            <span>Authority: {m.authority}</span>
                            {m.date && <span>• Date: {m.date}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Micro-Service Trigger button if surveyor or SRO not completed */}
                      {!m.completed && m.id === 'm3' && (
                        <button
                          onClick={onOpenServicesTab}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold whitespace-nowrap border border-slate-700 transition-colors"
                        >
                          Book Surveyor (₹4,499)
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-generation of Draft Sale Agreement Deed Button */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Standard Sale Agreement / Conveyance Deed Generated
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Pre-populated with Gat {deal.gatNumber} parcel coordinates, verified Khatedar, and token terms.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDeedModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <FileText className="w-4 h-4" />
                View & Print Draft Deed
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Direct Negotiation Thread & Counter-Offers */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col h-[640px]">
            {/* Thread Header */}
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Direct Negotiation Thread</h3>
                <p className="text-xs text-slate-400">
                  {offer.buyerName} ↔ {offer.sellerName}
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                P2P Encrypted
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
              {offer.messages.map((msg) => {
                const isBuyer = msg.sender === 'buyer';
                const isSystem = msg.sender === 'system';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center text-xs text-emerald-200">
                      <div className="flex items-center justify-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{msg.text}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">{msg.timestamp}</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isBuyer ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-xs space-y-1 ${
                        isBuyer
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                      }`}
                    >
                      <div className="text-[10px] opacity-75 font-bold">
                        {isBuyer ? 'You (Buyer)' : `${offer.sellerName} (Owner)`}
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                      {msg.proposedAmount && (
                        <div className="text-[11px] font-mono font-bold bg-slate-950/40 px-2 py-0.5 rounded mt-1 inline-block">
                          Proposed Consideration: {formatINR(msg.proposedAmount)}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Interactive Counter-Offer Popover */}
            {isCounterOpen && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-700 mb-2 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Adjust Offer Price</span>
                  <button
                    onClick={() => setIsCounterOpen(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    step="25000"
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-7 pr-3 py-1.5 text-sm font-bold text-white font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSubmitCounter}
                  className="w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  Confirm Revised Counter: {formatINR(counterPrice)}
                </button>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCounterOpen(!isCounterOpen)}
                  className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 border border-slate-700 transition-colors whitespace-nowrap"
                >
                  ± Revise Price
                </button>
                <input
                  type="text"
                  placeholder="Type direct message to owner..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Draft Deed Modal Popup */}
      {showDeedModal && (
        <DeedModal
          deal={deal}
          plot={MOCK_PLOTS[0]}
          onClose={() => setShowDeedModal(false)}
        />
      )}
    </div>
  );
};
