# BhuDirect — Direct P2P Cadastral Land & Plot Marketplace

> **Zero Middlemen • 0% Commission • Cadastral GIS Precision • Regulated Escrow**

BhuDirect is a peer-to-peer (P2P) land & plot buying and selling marketplace that eliminates traditional commission-based brokers. The platform replaces middleman reliance through high-resolution cadastral map visualization, automated land record (7/12, 8A, Index-II) due diligence, Anti-Broker cryptographic identity gating, and on-demand micro-services (surveyors, title lawyers, and registry concierges).

---

## 🌟 Key Features

### 1. Interactive Satellite & Cadastral GIS Discovery (Buyer View)
- **High-Resolution Satellite Basemap**: Leaflet.js with Esri World Imagery and hybrid placename overlays.
- **Cadastral Layer Toggles**:
  - Official Survey / Gat cadastral boundary lines with neighboring land holdings.
  - Access road connectivity indicator: displays connecting road width in meters (e.g. 12m Paved Highway vs. 6m Kutcha dirt road).
  - Contour slope and flood risk elevation overlays.
- **Plot Due Diligence & Valuation Benchmarking**:
  - Spatial metric conversions: **Gunthas**, **Acres**, **Square Meters**, and fencing perimeter.
  - Valuation Benchmarking: compares asking prices against the official **Ready Reckoner / Circle rate** for that village/taluka.
  - Direct **"Make an Offer"** bidding flow and **"Schedule Field Visit"** with GPS navigation pins.

### 2. Seller Verification Gate & Interactive Boundary Demarcation (Seller View)
- **Anti-Broker Identity Gate**:
  - Requires District, Taluka, Village, and Survey/Gat Number.
  - Cross-matches Aadhaar/PAN identity with the registered 7/12 Khatedar name, preventing unauthorized brokers from posting listings.
- **Boundary Drawing Tool**:
  - Interactive polygon demarcation over satellite imagery.
  - Real-time calculation of area and perimeter using **Turf.js**.
  - **"Walk-the-Perimeter" Mobile GPS**: Logs physical corner stones on-site via `navigator.geolocation.getCurrentPosition` with an accuracy indicator (±1.5m).
  - Export coordinates as standard **GeoJSON** for PostGIS spatial databases.

### 3. Automated Title Health & Land Document Parser (Trust Engine)
- Upload interface for 7/12 extracts, 8A holdings, Index-II, and Encumbrance Certificates.
- **Automated Diligence Analyzer**:
  - Extracts Survey/Gat number, Khata number, Area, and ownership records.
  - Detects joint owners and undivided legal heirs.
  - Flags tenure restrictions: **Bhogwatdar Class-1 (Freehold Unrestricted)** vs. **Class-2 (Restricted Grant)**.
  - Cross-checks National Judicial Data Grid (NJDG) / e-Court civil suit records.
  - Computes a visual **"Title Health Score"** (e.g. 96/100, A+ Clear Title) with audit breakdown tags.

### 4. Direct Digital Negotiation & Smart Escrow Deal Room
- Direct counter-offer thread between buyer and seller with an active **Brokerage Elimination Counter**.
- **Regulated Escrow Advance Flow**:
  - Shows locked earnest token advance held in an ICICI Trustee Escrow account.
  - Conditions-based milestone release checklist (Token Locked → 30-Year Title Search Verified → DGPS Boundary Pegging → SRO Biometric Registration → Funds Disbursed).
- **Auto-Generated Draft Sale Agreement / Conveyance Deed (सठेखत)**:
  - Generates authentic legal agreement populated with parcel boundaries (North, South, East, West), consideration, and print/download options.

### 5. On-Demand Micro-Services Marketplace (A La Carte Add-ons)
- Transparent, flat-fee physical services without percentage commissions:
  - **High-Definition Drone Flyover & 360° Video** (₹1,499 flat)
  - **Certified Land Surveyor / e-Mojni Boundary Pegging** (₹4,499 flat)
  - **Independent Lawyer 30-Year Title Search & NEC** (₹2,999 flat)
  - **SRO Sub-Registrar Concierge & Biometric Execution** (₹3,999 flat)
  - **Hydrogeology & Groundwater Borewell Survey** (₹2,199 flat)

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Mapping & GIS**: Leaflet.js with Esri World Imagery + Turf.js for real-time spatial calculations
- **Styling**: Modern dark slate/navy theme (`#0f172a`), emerald trust accents (`#10b981`), and responsive spatial layouts

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/bhudirect.git
cd bhudirect

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📄 License
MIT License. Built for direct transparent peer-to-peer land transactions.
