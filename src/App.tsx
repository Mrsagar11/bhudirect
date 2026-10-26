import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { MapExplorer } from './components/MapExplorer';
import { PlotDetailModal } from './components/PlotDetailModal';
import { MakeOfferModal } from './components/MakeOfferModal';
import { ScheduleVisitModal } from './components/ScheduleVisitModal';
import { SellerDemarcation } from './components/SellerDemarcation';
import { TitleHealthParser } from './components/TitleHealthParser';
import { DealRoom } from './components/DealRoom';
import { ServicesMarketplace } from './components/ServicesMarketplace';
import { Plot } from './types';
import { 
  Compass, 
  Lock, 
  CheckCircle2,
  Award
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('discovery');
  const [selectedPlotForDetail, setSelectedPlotForDetail] = useState<Plot | null>(null);
  const [selectedPlotForOffer, setSelectedPlotForOffer] = useState<Plot | null>(null);
  const [selectedPlotForVisit, setSelectedPlotForVisit] = useState<Plot | null>(null);
  const [brokerageSavedTotal, setBrokerageSavedTotal] = useState<number>(48200000); // ₹4.82 Cr

  // Handle Offer Submission
  const handleSubmitOffer = (offerData: {
    plot: Plot;
    offeredPrice: number;
    tokenAdvance: number;
    timelineDays: number;
    financing: string;
    message: string;
  }) => {
    // Add savings to platform ticker
    const savings = Math.round(offerData.offeredPrice * 0.04);
    setBrokerageSavedTotal((prev) => prev + savings);

    setSelectedPlotForOffer(null);
    // Switch to Deal Room to show the negotiation and escrow
    setActiveTab('deal-room');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Main Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        brokerageSavedTotal={brokerageSavedTotal} 
      />

      {/* Main Content Area Based on Active Tab */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'discovery' && (
          <MapExplorer
            onSelectPlot={(plot) => setSelectedPlotForDetail(plot)}
            onMakeOffer={(plot) => setSelectedPlotForOffer(plot)}
            onScheduleVisit={(plot) => setSelectedPlotForVisit(plot)}
          />
        )}

        {activeTab === 'demarcation' && <SellerDemarcation />}

        {activeTab === 'title-parser' && <TitleHealthParser />}

        {activeTab === 'deal-room' && (
          <DealRoom onOpenServicesTab={() => setActiveTab('services')} />
        )}

        {activeTab === 'services' && <ServicesMarketplace />}
      </main>

      {/* Detail Modal */}
      {selectedPlotForDetail && (
        <PlotDetailModal
          plot={selectedPlotForDetail}
          onClose={() => setSelectedPlotForDetail(null)}
          onMakeOffer={(plot) => {
            setSelectedPlotForDetail(null);
            setSelectedPlotForOffer(plot);
          }}
          onScheduleVisit={(plot) => {
            setSelectedPlotForDetail(null);
            setSelectedPlotForVisit(plot);
          }}
          onOpenTitleScanner={(_plot) => {
            setSelectedPlotForDetail(null);
            setActiveTab('title-parser');
          }}
        />
      )}

      {/* Make Offer Modal */}
      {selectedPlotForOffer && (
        <MakeOfferModal
          plot={selectedPlotForOffer}
          onClose={() => setSelectedPlotForOffer(null)}
          onSubmitOffer={handleSubmitOffer}
        />
      )}

      {/* Schedule Visit Modal */}
      {selectedPlotForVisit && (
        <ScheduleVisitModal
          plot={selectedPlotForVisit}
          onClose={() => setSelectedPlotForVisit(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white">BhuDirect</span>
              <span className="text-[11px] text-slate-500 ml-2">
                Cadastral Land Marketplace • 0% Broker Commission
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> e-Mahabhulekh & Bhoomi Integrated
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <Lock className="w-3.5 h-3.5" /> ICICI Trustee Escrow Regulated
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Award className="w-3.5 h-3.5 text-amber-400" /> DILRMP Spatial Standard
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            © 2026 BhuDirect Technologies India Pvt Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
