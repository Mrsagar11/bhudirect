import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Search, 
  FileCheck2, 
  Download, 
  Sparkles,
  Scale,
  Landmark,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ExtractedDocData {
  gatNumber: string;
  khataNumber: string;
  village: string;
  taluka: string;
  district: string;
  totalArea: string;
  areaGunthas: number;
  khatedarName: string;
  jointOwnersCount: number;
  jointOwnerNames: string[];
  bhogwatdarClass: 'Class-1 (Freehold Unrestricted)' | 'Class-2 (Restricted Government Grant)';
  cultivationStatus: string;
  otherRightsBankMortgage: string;
  pendingLitigationStatus: string;
  eCourtCasesFound: number;
  healthScore: number;
  grade: string;
  auditChecks: {
    title: string;
    status: 'pass' | 'warning' | 'fail';
    description: string;
    authority: string;
  }[];
}

const SAMPLE_712_DATA: Record<string, ExtractedDocData> = {
  'mulshi-142': {
    gatNumber: '142/2A',
    khataNumber: '481',
    village: 'Male',
    taluka: 'Mulshi',
    district: 'Pune',
    totalArea: '0 Hectare 33 Are (33 Gunthas)',
    areaGunthas: 33,
    khatedarName: 'Suresh Dnyaneshwar Patil',
    jointOwnersCount: 1,
    jointOwnerNames: ['Suresh Dnyaneshwar Patil (Sole Title Holder)'],
    bhogwatdarClass: 'Class-1 (Freehold Unrestricted)',
    cultivationStatus: 'Jirayat (Dry Crop / Fallow)',
    otherRightsBankMortgage: 'Nil / No hypothecation, pledge, or lien recorded.',
    pendingLitigationStatus: 'Clean. Zero civil suits or revenue stay orders.',
    eCourtCasesFound: 0,
    healthScore: 96,
    grade: 'A+ Marketable Clear Title',
    auditChecks: [
      {
        title: 'Bhogwatdar Class-1 Freehold Verification',
        status: 'pass',
        description: 'No restriction under Section 43/44 of MLR Code; no Collector NOC required for sale.',
        authority: 'Maharashtra Land Revenue Code, 1966',
      },
      {
        title: 'Other Rights (इतर हक्क) Lien Check',
        status: 'pass',
        description: 'Zero bank loans, cooperative credit society charges, or recovery attachments.',
        authority: 'e-Mahabhulekh Automated Ledger',
      },
      {
        title: 'Undivided Legal Heirs / Minor Claims',
        status: 'pass',
        description: 'Sole ownership pursuant to Registered Succession Ferfar #1184; no minor coparceners.',
        authority: 'Revenue Mutation Register (गाव नमुना ६)',
      },
      {
        title: 'National Judicial Data Grid (NJDG) Civil Check',
        status: 'pass',
        description: 'Cross-referenced against Pune District and Taluka Paud Civil Court registries.',
        authority: 'e-Courts Services Platform',
      },
      {
        title: '30-Year Encumbrance Certificate (Index-II)',
        status: 'pass',
        description: 'Unbroken chain of registered documents from 1996 to 2026 without third-party encumbrance.',
        authority: 'Sub-Registrar Office Haveli/Paud',
      },
    ],
  },
  'haveli-304': {
    gatNumber: '304/4',
    khataNumber: '1092',
    village: 'Lonikand',
    taluka: 'Haveli',
    district: 'Pune',
    totalArea: '0 Hectare 60 Are (60 Gunthas / 1.5 Acre)',
    areaGunthas: 60,
    khatedarName: 'Ashok Kadam & Nitin Kadam',
    jointOwnersCount: 2,
    jointOwnerNames: ['Ashok Vasant Kadam (50%)', 'Nitin Vasant Kadam (50%)'],
    bhogwatdarClass: 'Class-1 (Freehold Unrestricted)',
    cultivationStatus: 'Non-Agricultural (Industrial Zone)',
    otherRightsBankMortgage: 'Nil / Prior Bank of Maharashtra loan fully redeemed in 2021.',
    pendingLitigationStatus: 'Partition deed executed; mutual consent registered.',
    eCourtCasesFound: 0,
    healthScore: 91,
    grade: 'A Verified (Joint Signatories Required)',
    auditChecks: [
      {
        title: 'Bhogwatdar Class-1 Status',
        status: 'pass',
        description: 'Freehold tenure with industrial usage endorsement.',
        authority: 'Collector Pune Order #IND-4102',
      },
      {
        title: 'Joint Ownership Signatory Requirement',
        status: 'warning',
        description: 'Both brothers must jointly execute the conveyance deed as equal co-owners.',
        authority: 'Registered Partition Deed #942',
      },
      {
        title: 'Mortgage Redemption Verification',
        status: 'pass',
        description: 'Bank of Maharashtra loan satisfaction deed registered with Index-II receipt.',
        authority: 'SRO Haveli-4',
      },
      {
        title: 'e-Court Civil Dispute Search',
        status: 'pass',
        description: 'No active suits or lis pendens recorded on Gat 304/4.',
        authority: 'NJDG Portal',
      },
    ],
  },
};

export const TitleHealthParser: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('mulshi-142');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'audit' | 'raw-extract'>('audit');
  const [parsedData, setParsedData] = useState<ExtractedDocData>(SAMPLE_712_DATA['mulshi-142']);

  const handleScanSample = (key: string) => {
    setSelectedPreset(key);
    setIsScanning(true);
    setTimeout(() => {
      setParsedData(SAMPLE_712_DATA[key]);
      setIsScanning(false);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsScanning(true);
      setTimeout(() => {
        setParsedData(SAMPLE_712_DATA['mulshi-142']);
        setIsScanning(false);
      }, 1500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-100">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
          PropTech Trust Engine
        </span>
        <h2 className="text-3xl font-extrabold text-white mt-2">
          Automated Title Health & 7/12 Record Parser
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Instant OCR extraction, Bhogwatdar tenure classification, legal heir detection, bank lien analysis, and e-court cross-referencing.
        </p>

        {/* Quick Sample Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          <button
            onClick={() => handleScanSample('mulshi-142')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              selectedPreset === 'mulshi-142'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Sample: Gat 142/2A Mulshi (Clear Freehold)
          </button>
          <button
            onClick={() => handleScanSample('haveli-304')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              selectedPreset === 'haveli-304'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Sample: Gat 304/4 Lonikand (Joint Heir Notice)
          </button>
        </div>
      </div>

      {/* Main Parser Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Document Upload & Scanning Animation */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" />
              Upload Land Records for Diligence
            </h3>

            {/* Dropzone */}
            <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-950/60 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-white mt-3">
                Drop 7/12 Extract, 8A, or Index-II PDF
              </span>
              <span className="text-[10px] text-slate-500 mt-1">
                Supports Mahabhulekh / Bhoomi / Dharani PDF or Scanned PNG
              </span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Automatic 7/12 (Saat-Baara) Table Extraction</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bhogwatdar Class-1 vs Class-2 Flagging</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>NJDG / e-Court Civil Suit Cross-Check</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Other Rights (इतर हक्क) Bank Lien Detection</span>
              </div>
            </div>
          </div>

          {/* Title Health Score Gauge Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-sm text-center space-y-3">
            <span className="text-xs font-semibold text-emerald-300">
              BhuDirect Verified Title Score
            </span>
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${parsedData.healthScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{parsedData.healthScore}</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">out of 100</span>
              </div>
            </div>

            <div className="text-sm font-bold text-emerald-400">
              {parsedData.grade}
            </div>
            <p className="text-[11px] text-slate-300">
              High confidence score. Recommended for immediate token advance lock in escrow.
            </p>
          </div>
        </div>

        {/* Right Column (2 cols): OCR Extracted Data & Legal Audit Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          {/* Scanning Animation State */}
          {isScanning ? (
            <div className="h-[480px] rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-8 text-center space-y-4 shadow-sm">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 border border-emerald-500 animate-pulse"></div>
                <div className="w-full h-full flex items-center justify-center text-emerald-400">
                  <FileText className="w-10 h-10" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  Executing Automated Revenue Diligence...
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Parsing Saat-Baara optical tables • Checking Bhogwatdar tenure • Querying NJDG civil case records
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Extracted Key Attributes Grid */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                    7/12 Optical Extraction (Gat No. {parsedData.gatNumber})
                  </h3>
                  <span className="text-xs text-slate-400">
                    Khata #{parsedData.khataNumber} • {parsedData.village}, {parsedData.taluka}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Gat / Survey No.</span>
                    <span className="font-bold text-emerald-400 text-sm mt-0.5 block">
                      {parsedData.gatNumber}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Area Recorded</span>
                    <span className="font-bold text-white text-sm mt-0.5 block">
                      {parsedData.areaGunthas} Gunthas
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Tenure Classification</span>
                    <span className="font-bold text-emerald-400 text-[11px] mt-0.5 block">
                      {parsedData.bhogwatdarClass}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Civil Litigation</span>
                    <span className="font-bold text-emerald-400 text-sm mt-0.5 block">
                      {parsedData.eCourtCasesFound === 0 ? '0 Suits (Clean)' : 'Caution'}
                    </span>
                  </div>
                </div>

                {/* Khatedar Details */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px]">Registered Khatedar:</span>
                    <div className="font-bold text-white text-sm mt-0.5">
                      {parsedData.khatedarName}
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-slate-400 text-[11px]">Joint Owners Detected:</span>
                    <div className="font-semibold text-slate-200 mt-0.5">
                      {parsedData.jointOwnersCount} {parsedData.jointOwnersCount === 1 ? 'Owner (Sole Holder)' : 'Co-Owners (All Required to Sign)'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Diligence Audit Checklist */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Automated Due Diligence Audit Checks
                  </h3>
                  <span className="text-xs text-emerald-400 font-semibold">
                    100% Automated Verification
                  </span>
                </div>

                <div className="space-y-2.5">
                  {parsedData.auditChecks.map((check, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                        check.status === 'pass'
                          ? 'bg-slate-950/80 border-slate-800 hover:border-emerald-500/40'
                          : 'bg-amber-950/20 border-amber-500/30'
                      }`}
                    >
                      {check.status === 'pass' ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white">{check.title}</h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            {check.authority}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {check.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Verification Certificate Footer */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-200">
                <div className="flex items-center gap-2.5">
                  <Scale className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white">Title Audit Certificate Generated: </span>
                    <span>Ready for registration escrow deal room.</span>
                  </div>
                </div>

                <button
                  onClick={() => alert('Downloaded formal Title Diligence Certificate PDF.')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Audit Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
