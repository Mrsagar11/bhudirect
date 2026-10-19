import React from 'react';
import { EscrowDeal, Plot } from '../types';
import { formatINR, formatFullINR } from '../utils/geoCalculations';
import { X, Printer, Download, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

interface DeedModalProps {
  deal: EscrowDeal;
  plot?: Plot;
  onClose: () => void;
}

export const DeedModal: React.FC<DeedModalProps> = ({ deal, plot, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([document.getElementById('deed-document-content')?.innerText || ''], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Sale_Agreement_${deal.gatNumber.replace(/\s+/g, '_')}_BhuDirect.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-lg text-slate-100 flex flex-col my-auto">
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Standard Agreement for Sale / Conveyance Deed (सठेखत)
              </h3>
              <p className="text-xs text-slate-400">
                Generated pursuant to Section 54, Transfer of Property Act, 1882
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              Print Deed
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Download Draft
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Paper Container (Simulating Stamp Paper Legal Document) */}
        <div className="p-6 sm:p-10 bg-slate-950/90 overflow-y-auto">
          <div 
            id="deed-document-content" 
            className="max-w-3xl mx-auto bg-white text-slate-900 rounded-2xl p-8 sm:p-12 border border-slate-200 font-serif leading-relaxed text-sm space-y-6 shadow-sm"
          >
            {/* Header Stamp Paper Simulator */}
            <div className="border-4 border-double border-emerald-900 p-6 text-center space-y-2 bg-emerald-50/40 rounded-xl">
              <div className="text-xs font-sans font-extrabold uppercase tracking-widest text-emerald-900">
                GOVERNMENT OF MAHARASHTRA • DEPARTMENT OF REGISTRATION & STAMPS
              </div>
              <div className="text-lg font-serif font-bold text-slate-900">
                NON-JUDICIAL E-STAMP CERTIFICATE
              </div>
              <div className="text-xs font-mono text-slate-600">
                Certificate No: IN-MH904128941029K • Date: {deal.agreementDate}
              </div>
              <div className="text-xs font-sans font-bold text-emerald-800">
                Consideration: {formatFullINR(deal.totalPrice)} • Escrow Token: {formatFullINR(deal.tokenAmount)}
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold uppercase tracking-wide text-slate-950 font-sans">
                AGREEMENT FOR SALE (ISAR PAWATI / SATHEKHAT)
              </h2>
              <p className="text-xs italic text-slate-600">
                Direct Peer-to-Peer Transaction Executed via BhuDirect Smart Escrow Platform
              </p>
            </div>

            {/* Parties */}
            <div className="space-y-4">
              <p>
                This Agreement for Sale is executed on this <strong>{deal.agreementDate}</strong> by and between:
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-sans font-bold text-xs uppercase text-slate-500">
                  PARTY OF THE FIRST PART (THE "VENDORS / SELLER"):
                </span>
                <p className="font-semibold text-slate-900">
                  {deal.sellerName},
                </p>
                <p className="text-xs text-slate-600">
                  Residing at Village {deal.village}, Taluka Mulshi, District Pune, Maharashtra. (Aadhaar Verified Title Holder under Revenue Khata #481), hereinafter referred to as the <strong>"VENDOR"</strong>.
                </p>
              </div>

              <div className="text-center font-bold text-xs uppercase text-slate-400">
                — AND —
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-sans font-bold text-xs uppercase text-slate-500">
                  PARTY OF THE SECOND PART (THE "PURCHASER / BUYER"):
                </span>
                <p className="font-semibold text-slate-900">
                  {deal.buyerName},
                </p>
                <p className="text-xs text-slate-600">
                  Residing in Pune, Maharashtra. (Aadhaar & PAN Verified on BhuDirect), hereinafter referred to as the <strong>"PURCHASER"</strong>.
                </p>
              </div>
            </div>

            {/* Recitals */}
            <div className="space-y-3">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800">
                WHEREAS:
              </h3>
              <p className="text-xs leading-relaxed text-slate-700">
                A. The Vendor is the absolute and undisputed owner, in physical lawful possession of all that piece and parcel of land bearing <strong>{deal.gatNumber}</strong>, admeasuring <strong>33 Gunthas (0.825 Acres / 3338.6 Sq. Meters)</strong>, situated at Village <strong>{deal.village}</strong>.
              </p>
              <p className="text-xs leading-relaxed text-slate-700">
                B. The property is recorded under Bhogwatdar Class-1 (Freehold Unrestricted tenure) with clean, marketable title and zero pending civil court disputes, as cross-audited on the BhuDirect trust engine.
              </p>
              <p className="text-xs leading-relaxed text-slate-700">
                C. The Vendor has agreed to sell and the Purchaser has agreed to purchase the said property for a total mutually agreed consideration of <strong>{formatFullINR(deal.totalPrice)} ({formatINR(deal.totalPrice)})</strong> directly without any middleman or brokerage fees.
              </p>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800">
                NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:
              </h3>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-700">
                <li>
                  <strong>Escrow Advance Deposit:</strong> The Purchaser has locked an Earnest Money Deposit of <strong>{formatFullINR(deal.tokenAmount)}</strong> in the regulated Escrow Account (<strong>{deal.escrowAccountNumber}</strong>, {deal.escrowBank}), receipt whereof the Vendor hereby acknowledges.
                </li>
                <li>
                  <strong>Conditions Precedent to Escrow Release:</strong> The escrow deposit shall remain securely held by the Escrow Trustee and shall be released to the Vendor only upon:
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-600">
                    <li>Execution of official e-Mojni boundary pegging by certified surveyor.</li>
                    <li>Completion of clean 30-year Non-Encumbrance Title Search Report.</li>
                    <li>Biometric execution of registered final conveyance deed at {deal.sroSubRegistrarOffice}.</li>
                  </ul>
                </li>
                <li>
                  <strong>Schedule of Property Boundaries:</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-600 font-mono text-[11px]">
                    <li>North By: Gat No. 141 (Agricultural Land of V. T. More)</li>
                    <li>South By: Gat No. 143 (Village Grazing Land)</li>
                    <li>East By: Gat No. 142/2B (Land of P. G. Patil)</li>
                    <li>West By: 9m Paved Tar Village Access Road</li>
                  </ul>
                </li>
                <li>
                  <strong>Covenant of Zero Brokerage:</strong> Both parties explicitly record that neither party has engaged any broker or middleman, and no third-party claim for brokerage shall lie against either party.
                </li>
              </ol>
            </div>

            {/* Signatures */}
            <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
              <div className="space-y-12">
                <div className="font-mono text-emerald-800 font-bold text-sm">
                  [Digitally Signed via BhuDirect Aadhaar OTP]
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <strong>{deal.sellerName}</strong>
                  <div className="text-[10px] text-slate-500 font-sans">VENDOR / REGISTERED OWNER</div>
                </div>
              </div>

              <div className="space-y-12">
                <div className="font-mono text-emerald-800 font-bold text-sm">
                  [Digitally Signed via BhuDirect Aadhaar OTP]
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <strong>{deal.buyerName}</strong>
                  <div className="text-[10px] text-slate-500 font-sans">PURCHASER / BUYER</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
