export interface AccessRoadInfo {
  widthMeters: number;
  type: 'Tar / Paved Highway' | 'Concrete Village Road' | 'WBM Road' | 'Kutcha Dirt Road';
  connectivityStatus: 'Direct Highway Access' | 'All-Weather Road' | 'Fair-Weather Road' | 'Footpath Only';
  roadFrontageMeters: number;
}

export interface ElevationInfo {
  avgAltitudeM: number;
  slopePercent: number;
  slopeCategory: 'Flat (<2%)' | 'Gentle Slope (2-5%)' | 'Moderate (5-10%)' | 'Steep (>10%)';
  floodRiskLevel: 'Very Low (Safe Zone)' | 'Low' | 'Moderate' | 'High (Catchment Zone)';
  groundwaterPotential: 'High' | 'Moderate' | 'Deep aquifer needed';
}

export interface SellerInfo {
  id: string;
  name: string;
  verifiedAadhaar: boolean;
  verifiedPAN: boolean;
  aadhaarMasked: string;
  panMasked: string;
  khataHolderMatch: boolean;
  phone: string;
  isDirectOwner: boolean;
}

export interface TitleAuditFlag {
  type: 'success' | 'warning' | 'danger';
  label: string;
  description: string;
}

export interface TitleHealthInfo {
  score: number; // 0 - 100
  grade: 'A+ Clear Title' | 'A Verified' | 'B Caution' | 'C High Risk';
  lastAuditDate: string;
  bhogwatdarClass: 'Class-1 (Freehold Unrestricted)' | 'Class-2 (Restricted Grant)';
  legalHeirsCount: number;
  pendingLitigation: boolean;
  activeBankMortgage: boolean;
  ecCleanYears: number; // e.g. 30
  ferfarMutationNo: string;
  flags: TitleAuditFlag[];
}

export interface Plot {
  id: string;
  title: string;
  slug: string;
  gatNumber: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  zone: 'Agricultural' | 'Residential NA' | 'Commercial' | 'Industrial' | 'Farmhouse / R-Zone';
  askingPrice: number;
  readyReckonerRate: number; // INR per Sq. Meter
  marketBenchmarkRate: number; // INR per Sq. Meter
  coordinates: [number, number][]; // [lat, lng] array
  center: [number, number];
  areaGunthas: number;
  areaAcres: number;
  areaSqM: number;
  perimeterM: number;
  accessRoad: AccessRoadInfo;
  elevation: ElevationInfo;
  seller: SellerInfo;
  titleHealth: TitleHealthInfo;
  tags: string[];
  images: string[];
  featured?: boolean;
  verifiedAt: string;
}

export interface NegotiationMessage {
  id: string;
  sender: 'buyer' | 'seller' | 'system';
  text: string;
  timestamp: string;
  proposedAmount?: number;
}

export interface NegotiationOffer {
  id: string;
  plotId: string;
  plotTitle: string;
  buyerName: string;
  buyerContact: string;
  sellerName: string;
  offeredPrice: number;
  initialAsking: number;
  tokenAdvance: number;
  timelineDays: number;
  financing: 'Self-Funded / Cash' | 'Pre-Approved Land Loan' | 'Bank Loan Pending';
  status: 'Pending Seller Review' | 'Countered by Seller' | 'Accepted' | 'Escrow Locked' | 'Deed Executed';
  messages: NegotiationMessage[];
}

export interface EscrowMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date?: string;
  authority: string;
}

export interface EscrowDeal {
  id: string;
  plotId: string;
  plotTitle: string;
  gatNumber: string;
  village: string;
  buyerName: string;
  sellerName: string;
  tokenAmount: number;
  totalPrice: number;
  escrowAccountNumber: string;
  escrowBank: string;
  status: 'Funded' | 'In Verification' | 'Ready for Registry' | 'Completed';
  milestones: EscrowMilestone[];
  agreementDate: string;
  sroSubRegistrarOffice: string;
}

export interface MicroService {
  id: string;
  title: string;
  shortDesc: string;
  fee: number;
  sla: string;
  iconName: string;
  deliverables: string[];
  popularTag?: string;
  badge?: string;
}

export interface CadastralSurrounding {
  gatNumber: string;
  ownerName: string;
  areaGunthas: number;
  polygon: [number, number][];
}
