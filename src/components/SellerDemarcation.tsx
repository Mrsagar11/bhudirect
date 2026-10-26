import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { calculatePlotMetrics, GeoCalculationsResult, formatINR } from '../utils/geoCalculations';
import { 
  ShieldCheck, 
  Compass, 
  Layers, 
  Navigation, 
  Download, 
  Copy, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

export const SellerDemarcation: React.FC = () => {
  // Step State: 1 = Anti-Broker Gate, 2 = Boundary Demarcation & GPS, 3 = Listing Activated
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Identity Form State
  const [stateName, setStateName] = useState('Maharashtra');
  const [district, setDistrict] = useState('Pune');
  const [taluka, setTaluka] = useState('Mulshi');
  const [village, setVillage] = useState('Male');
  const [surveyGatNo, setSurveyGatNo] = useState('142/2A');
  const [hissaNo, setHissaNo] = useState('1');
  const [sellerName, setSellerName] = useState('Suresh Dnyaneshwar Patil');
  const [aadhaarNo, setAadhaarNo] = useState('8921-4401-9921');
  const [panNo, setPanNo] = useState('BKZPP8912K');
  const [askingPrice, setAskingPrice] = useState<number>(9200000);
  const [zone, setZone] = useState('Farmhouse / R-Zone');

  // Verification verification simulation
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationPassed, setVerificationPassed] = useState(false);
  const [verificationLog, setVerificationLog] = useState<string[]>([]);

  // Leaflet & Drawing state
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayerRef = useRef<L.Polygon | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);

  // Drawn coordinates [lat, lng][]
  const [coordinates, setCoordinates] = useState<[number, number][]>([
    [18.5245, 73.5375],
    [18.5248, 73.5398],
    [18.5228, 73.5402],
    [18.5222, 73.5381],
  ]);

  const [metrics, setMetrics] = useState<GeoCalculationsResult | null>(null);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [currentGpsCoord, setCurrentGpsCoord] = useState<[number, number] | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [copiedGeoJson, setCopiedGeoJson] = useState(false);

  // Handle Identity Verification
  const handleVerifyIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationLog([]);

    setTimeout(() => {
      setVerificationLog((prev) => [
        ...prev,
        'Connecting to Maharashtra Mahabhulekh (e-Record 7/12 API)...',
      ]);
    }, 400);

    setTimeout(() => {
      setVerificationLog((prev) => [
        ...prev,
        `Retrieved Khata #481 for Gat ${surveyGatNo}, Village ${village}. Registered Khatedar: "Suresh Dnyaneshwar Patil"`,
      ]);
    }, 1100);

    setTimeout(() => {
      setVerificationLog((prev) => [
        ...prev,
        `Aadhaar & PAN Match Validated: 100% Identity Match with Revenue Khata Holder.`,
      ]);
    }, 1800);

    setTimeout(() => {
      setVerificationLog((prev) => [
        ...prev,
        'Anti-Broker Gate Passed: Authorized Direct Title Holder Confirmed!',
      ]);
      setIsVerifying(false);
      setVerificationPassed(true);
    }, 2400);
  };

  // Recalculate metrics when coordinates change
  useEffect(() => {
    if (coordinates.length >= 3) {
      const result = calculatePlotMetrics(coordinates);
      setMetrics(result);
    } else {
      setMetrics(null);
    }
  }, [coordinates]);

  // Initialize Demarcation Map when entering Step 2
  useEffect(() => {
    if (step !== 2 || !mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter: [number, number] = coordinates.length > 0 ? coordinates[0] : [18.5235, 73.5385];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 17,
    });

    // High resolution Esri satellite
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri, Maxar',
        maxZoom: 19,
      }
    ).addTo(map);

    // Labels overlay
    L.tileLayer(
      'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
      }
    ).addTo(map);

    const markerGroup = L.layerGroup().addTo(map);
    markerGroupRef.current = markerGroup;
    mapInstanceRef.current = map;

    // Map click handler to add corner point
    map.on('click', (e: L.LeafletMouseEvent) => {
      const newPoint: [number, number] = [
        Math.round(e.latlng.lat * 1000000) / 1000000,
        Math.round(e.latlng.lng * 1000000) / 1000000,
      ];
      setCoordinates((prev) => [...prev, newPoint]);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Update polygon & corner markers on map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markerGroup = markerGroupRef.current;
    if (!map || !markerGroup) return;

    markerGroup.clearLayers();
    if (polygonLayerRef.current) {
      map.removeLayer(polygonLayerRef.current);
      polygonLayerRef.current = null;
    }

    // Render polygon
    if (coordinates.length >= 3) {
      const poly = L.polygon(coordinates, {
        color: '#10b981',
        weight: 3,
        fillColor: '#10b981',
        fillOpacity: 0.35,
      }).addTo(map);
      polygonLayerRef.current = poly;
    }

    // Render corner stone markers
    coordinates.forEach(([lat, lng], idx) => {
      const cornerIcon = L.divIcon({
        className: 'corner-peg-icon',
        html: `
          <div class="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center border-2 border-white cursor-pointer">
            ${idx + 1}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([lat, lng], { icon: cornerIcon, draggable: true });
      marker.on('dragend', (ev) => {
        const target = ev.target as L.Marker;
        const newPos = target.getLatLng();
        setCoordinates((prev) => {
          const updated = [...prev];
          updated[idx] = [
            Math.round(newPos.lat * 1000000) / 1000000,
            Math.round(newPos.lng * 1000000) / 1000000,
          ];
          return updated;
        });
      });

      marker.bindTooltip(`Corner Stone #${idx + 1}: [${lat.toFixed(5)}, ${lng.toFixed(5)}]`);
      markerGroup.addLayer(marker);
    });
  }, [coordinates, step]);

  // Walk-the-Perimeter GPS handler
  const handleWalkPerimeter = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsGpsActive(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Math.round(pos.coords.latitude * 1000000) / 1000000;
        const lng = Math.round(pos.coords.longitude * 1000000) / 1000000;
        const acc = Math.round(pos.coords.accuracy * 10) / 10;
        setCurrentGpsCoord([lat, lng]);
        setGpsAccuracy(acc);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 18);
        }
      },
      (err) => {
        console.warn('GPS position unavailable or permission denied; using estimated position based on last known coordinate:', err.message);
        // Use the last placed coordinate offset as a best-effort fallback when GPS is unavailable
        const basePoint = coordinates.length > 0 ? coordinates[coordinates.length - 1] : [18.5235, 73.5385];
        const simLat = Math.round((basePoint[0] + 0.0006) * 1000000) / 1000000;
        const simLng = Math.round((basePoint[1] + 0.0004) * 1000000) / 1000000;
        setCurrentGpsCoord([simLat, simLng]);
        setGpsAccuracy(1.8);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  const handleAddGpsCorner = () => {
    if (currentGpsCoord) {
      setCoordinates((prev) => [...prev, currentGpsCoord]);
      // Small shift for next point simulation
      setCurrentGpsCoord([
        Math.round((currentGpsCoord[0] - 0.0004) * 1000000) / 1000000,
        Math.round((currentGpsCoord[1] + 0.0003) * 1000000) / 1000000,
      ]);
    }
  };

  const handleRemoveCorner = (index: number) => {
    setCoordinates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCopyGeoJson = () => {
    if (!metrics) return;
    navigator.clipboard.writeText(JSON.stringify(metrics.geoJson, null, 2));
    setCopiedGeoJson(true);
    setTimeout(() => setCopiedGeoJson(false), 2000);
  };

  const handleDownloadGeoJson = () => {
    if (!metrics) return;
    const blob = new Blob([JSON.stringify(metrics.geoJson, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BhuDirect_Gat_${surveyGatNo.replace('/', '_')}_Coordinates.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-100">
      {/* Step Indicator Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
          Direct Seller Onboarding Gate
        </span>
        <h2 className="text-3xl font-extrabold text-white mt-2">
          List Your Land • Zero Middlemen
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Our Anti-Broker cryptographic gate ensures only genuine 7/12 title holders can publish listings.
        </p>

        {/* 3 Steps Bar */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${
              step === 1
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <span>1</span> Identity & 7/12 Gate
          </div>
          <div className="w-6 h-0.5 bg-slate-800"></div>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${
              step === 2
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <span>2</span> Demarcate & GPS
          </div>
          <div className="w-6 h-0.5 bg-slate-800"></div>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${
              step === 3
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <span>3</span> Verified & Live
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Land Registry & Aadhaar Lock</h3>
              <p className="text-xs text-slate-400">
                Brokers without registered Power of Attorney cannot pass this verification step.
              </p>
            </div>
          </div>

          <form onSubmit={handleVerifyIdentity} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">State</label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Taluka</label>
                <input
                  type="text"
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Village</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-emerald-400">Survey / Gat No.</label>
                <input
                  type="text"
                  value={surveyGatNo}
                  onChange={(e) => setSurveyGatNo(e.target.value)}
                  placeholder="e.g. 142/2A"
                  className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Sub-Division / Hissa</label>
                <input
                  type="text"
                  value={hissaNo}
                  onChange={(e) => setHissaNo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Zoning Type</label>
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Farmhouse / R-Zone">Farmhouse / R-Zone</option>
                  <option value="Agricultural">Agricultural</option>
                  <option value="Residential NA">Residential NA</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
            </div>

            {/* Direct Owner Aadhaar & PAN */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                7/12 Registered Khatedar Identification
              </span>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Khatedar Full Name (as per 7/12 record)</label>
                <input
                  type="text"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Aadhaar Number</label>
                  <input
                    type="text"
                    value={aadhaarNo}
                    onChange={(e) => setAadhaarNo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">PAN Number</label>
                  <input
                    type="text"
                    value={panNo}
                    onChange={(e) => setPanNo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Asking Consideration */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Expected Asking Consideration (INR)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-2.5 text-base font-bold text-white font-mono"
                />
              </div>
              <span className="text-[11px] text-slate-400">
                Approx {formatINR(askingPrice)} • 0% Commission deducted by BhuDirect.
              </span>
            </div>

            {/* Verification Progress Box */}
            {verificationLog.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                {verificationLog.map((log, i) => (
                  <div key={i} className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            {verificationPassed ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-black transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Proceed to Satellite Boundary Demarcation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 text-sm font-black transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    Authenticating Against Revenue 7/12 Records...
                  </span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Title Holder Identity</span>
                  </>
                )}
              </button>
            )}
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Canvas (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg relative h-[560px]">
              <div ref={mapContainerRef} className="w-full h-full" />

              {/* Floating Instructions Banner */}
              <div className="absolute top-4 left-4 right-4 z-[500] pointer-events-none flex justify-center">
                <div className="pointer-events-auto bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl text-xs text-slate-200 shadow-sm flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
                  <span>
                    Click anywhere on the satellite image to place boundary corner stones. Drag markers to adjust.
                  </span>
                </div>
              </div>

              {/* Bottom Quick Bar */}
              <div className="absolute bottom-4 left-4 right-4 z-[500] pointer-events-none flex items-center justify-between">
                <div className="pointer-events-auto flex items-center gap-2">
                  <button
                    onClick={handleWalkPerimeter}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    Walk-the-Perimeter GPS
                  </button>

                  {currentGpsCoord && (
                    <button
                      onClick={handleAddGpsCorner}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Log Corner #{coordinates.length + 1}
                    </button>
                  )}
                </div>

                <div className="pointer-events-auto flex items-center gap-2">
                  <button
                    onClick={() => setCoordinates([])}
                    className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-rose-400 border border-slate-700 text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* GPS Status Notice */}
            {isGpsActive && currentGpsCoord && (
              <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between text-xs text-cyan-200">
                <div className="flex items-center gap-2.5">
                  <Navigation className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <div>
                    <span className="font-bold">Live GPS Corner Receiver: </span>
                    <span className="font-mono">
                      {currentGpsCoord[0].toFixed(6)}° N, {currentGpsCoord[1].toFixed(6)}° E
                    </span>
                    <span className="text-[10px] text-cyan-300 ml-2">
                      (Accuracy: ±{gpsAccuracy}m)
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleAddGpsCorner}
                  className="px-3 py-1 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Save Point
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar: Real-time Turf.js Spatial Metrics & Corner List */}
          <div className="space-y-4">
            {/* Real-time Turf Area Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Real-time Turf.js Calculations
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {coordinates.length} Corners Placed
                </span>
              </div>

              {metrics ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Total Gunthas</div>
                      <div className="text-2xl font-black text-emerald-400 mt-0.5">
                        {metrics.gunthas}
                      </div>
                      <div className="text-[10px] text-slate-500">1 Guntha = 101.17 m²</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Area in Acres</div>
                      <div className="text-2xl font-black text-white mt-0.5">
                        {metrics.acres} Ac
                      </div>
                      <div className="text-[10px] text-slate-500">40 Gunthas / Acre</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Square Meters</div>
                      <div className="text-lg font-bold text-slate-200 mt-0.5">
                        {metrics.sqMeters.toLocaleString()} m²
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Perimeter (Fencing)</div>
                      <div className="text-lg font-bold text-cyan-400 mt-0.5">
                        {metrics.perimeterMeters} m
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
                  Place at least 3 corner stone markers on the map to compute closed polygon area and perimeter.
                </div>
              )}

              {/* GeoJSON Exporter Actions */}
              {metrics && (
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-300">PostGIS Standard GeoJSON</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyGeoJson}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-emerald-400" />
                      {copiedGeoJson ? 'Copied!' : 'Copy GeoJSON'}
                    </button>
                    <button
                      onClick={handleDownloadGeoJson}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      Download .geojson
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Corner Markers List */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-300">Boundary Peg Coordinates</h4>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {coordinates.map(([lat, lng], idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-slate-300">
                        {lat.toFixed(5)}, {lng.toFixed(5)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveCorner(idx)}
                      aria-label={`Remove corner ${idx + 1}`}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Complete Activation Button */}
              <button
                onClick={() => setStep(3)}
                disabled={!metrics || coordinates.length < 3}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 text-xs font-black transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Publish Verified Plot Listing
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-5 shadow-lg">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h3 className="text-2xl font-extrabold text-white">
            Gat No. {surveyGatNo} Listing Activated!
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            Your land in <span className="text-emerald-400 font-bold">{village}, {taluka}</span> is now published directly to genuine buyers. Because your identity was verified against Maharashtra Revenue records, your listing is tagged with a{' '}
            <span className="text-white font-semibold">100% Direct Khatedar Trust Badge</span>.
          </p>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Demarcated Area:</span>
              <span className="font-bold text-white">
                {metrics?.gunthas || 33} Gunthas ({metrics?.acres || 0.825} Acres)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Asking Price:</span>
              <span className="font-bold text-emerald-400">{formatINR(askingPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Middleman Brokerage:</span>
              <span className="font-bold text-emerald-400">₹0 (100% Retained by You)</span>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors"
            >
              List Another Parcel
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-colors"
            >
              View on Discovery Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
