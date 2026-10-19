import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Plot, CadastralSurrounding } from '../types';
import { MOCK_PLOTS, MOCK_SURROUNDING_PARCELS } from '../data/mockData';
import { formatINR, formatFullINR } from '../utils/geoCalculations';
import { 
  Layers, 
  Eye, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  Car, 
  Mountain, 
  Droplet, 
  Search, 
  SlidersHorizontal,
  ChevronRight,
  Maximize2,
  Compass,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface MapExplorerProps {
  onSelectPlot: (plot: Plot) => void;
  onMakeOffer: (plot: Plot) => void;
  onScheduleVisit: (plot: Plot) => void;
}

export const MapExplorer: React.FC<MapExplorerProps> = ({
  onSelectPlot,
  onMakeOffer,
  onScheduleVisit,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const plotLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const cadastralLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const roadLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const elevationLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // States
  const [selectedPlot, setSelectedPlot] = useState<Plot>(MOCK_PLOTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [showCadastralGatLines, setShowCadastralGatLines] = useState(true);
  const [showAccessRoads, setShowAccessRoads] = useState(true);
  const [showElevationSlope, setShowElevationSlope] = useState(false);
  const [basemapType, setBasemapType] = useState<'satellite' | 'street'>('satellite');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filtered plots
  const filteredPlots = MOCK_PLOTS.filter((plot) => {
    const matchesSearch = 
      plot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plot.gatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plot.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plot.district.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesZone = selectedZone === 'All' || plot.zone === selectedZone;
    return matchesSearch && matchesZone;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Initialize Leaflet Map centered around Mulshi / Pune
    const map = L.map(mapContainerRef.current, {
      center: selectedPlot.center,
      zoom: 16,
      zoomControl: false,
    });

    // Add zoom control at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Layer groups
    const plotGroup = L.layerGroup().addTo(map);
    const cadastralGroup = L.layerGroup().addTo(map);
    const roadGroup = L.layerGroup().addTo(map);
    const elevationGroup = L.layerGroup().addTo(map);

    plotLayerGroupRef.current = plotGroup;
    cadastralLayerGroupRef.current = cadastralGroup;
    roadLayerGroupRef.current = roadGroup;
    elevationLayerGroupRef.current = elevationGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap Tiles
  const satelliteTileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsTileLayerRef = useRef<L.TileLayer | null>(null);
  const streetTileLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean existing basemaps
    if (satelliteTileLayerRef.current) map.removeLayer(satelliteTileLayerRef.current);
    if (labelsTileLayerRef.current) map.removeLayer(labelsTileLayerRef.current);
    if (streetTileLayerRef.current) map.removeLayer(streetTileLayerRef.current);

    if (basemapType === 'satellite') {
      // High-resolution Esri World Imagery
      satelliteTileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics',
          maxZoom: 19,
        }
      ).addTo(map);

      // Esri World Boundaries and Places reference overlay
      labelsTileLayerRef.current = L.tileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
        }
      ).addTo(map);
    } else {
      // CartoDB Dark Matter / Street view
      streetTileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          maxZoom: 19,
        }
      ).addTo(map);
    }
  }, [basemapType]);

  // Render Plots on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const plotGroup = plotLayerGroupRef.current;
    if (!map || !plotGroup) return;

    plotGroup.clearLayers();

    filteredPlots.forEach((plot) => {
      const isCurrentSelected = plot.id === selectedPlot.id;

      // Draw Plot Polygon
      const polygon = L.polygon(plot.coordinates, {
        color: isCurrentSelected ? '#10b981' : '#38bdf8',
        weight: isCurrentSelected ? 3.5 : 2,
        fillColor: isCurrentSelected ? '#10b981' : '#38bdf8',
        fillOpacity: isCurrentSelected ? 0.35 : 0.2,
        dashArray: isCurrentSelected ? undefined : '4, 4',
      });

      // Custom marker icon at center
      const customIcon = L.divIcon({
        className: 'custom-plot-pin',
        html: `
          <div class="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold text-white shadow-lg border cursor-pointer transition-transform hover:scale-110 ${
            isCurrentSelected 
              ? 'bg-emerald-600 border-emerald-300 ring-2 ring-emerald-400/50' 
              : 'bg-slate-900/90 border-slate-700 text-slate-200'
          }">
            <span class="w-2 h-2 rounded-full ${isCurrentSelected ? 'bg-white' : 'bg-emerald-400'}"></span>
            <span>${plot.gatNumber}</span>
          </div>
        `,
        iconSize: [110, 30],
        iconAnchor: [55, 15],
      });

      const centerMarker = L.marker(plot.center, { icon: customIcon });

      // Click event
      const handleClick = () => {
        setSelectedPlot(plot);
        map.flyTo(plot.center, 16, { duration: 1.2 });
      };

      polygon.on('click', handleClick);
      centerMarker.on('click', handleClick);

      // Tooltip popup
      polygon.bindTooltip(`
        <div style="font-family: system-ui; padding: 4px;">
          <div style="font-weight: 700; color: #10b981;">${plot.gatNumber} • ${plot.village}</div>
          <div style="font-size: 11px; color: #cbd5e1;">${plot.areaGunthas} Gunthas (${plot.areaAcres} Acres)</div>
          <div style="font-size: 12px; font-weight: 600; color: #f8fafc; margin-top: 2px;">${formatINR(plot.askingPrice)}</div>
        </div>
      `, { sticky: true, className: 'leaflet-popup-dark' });

      plotGroup.addLayer(polygon);
      plotGroup.addLayer(centerMarker);
    });
  }, [filteredPlots, selectedPlot]);

  // Render Cadastral Gat Survey Lines
  useEffect(() => {
    const cadastralGroup = cadastralLayerGroupRef.current;
    if (!cadastralGroup) return;

    cadastralGroup.clearLayers();
    if (!showCadastralGatLines) return;

    MOCK_SURROUNDING_PARCELS.forEach((parcel) => {
      const poly = L.polygon(parcel.polygon, {
        color: '#f59e0b',
        weight: 1.5,
        dashArray: '5, 5',
        fillColor: '#f59e0b',
        fillOpacity: 0.08,
      });

      poly.bindTooltip(`
        <div style="font-family: system-ui;">
          <div style="font-weight: 600; color: #f59e0b;">Official Cadastral: ${parcel.gatNumber}</div>
          <div style="font-size: 11px; color: #94a3b8;">Owner: ${parcel.ownerName}</div>
          <div style="font-size: 11px; color: #cbd5e1;">Area: ${parcel.areaGunthas} Gunthas</div>
        </div>
      `, { sticky: true });

      cadastralGroup.addLayer(poly);
    });
  }, [showCadastralGatLines]);

  // Render Access Road Layer
  useEffect(() => {
    const roadGroup = roadLayerGroupRef.current;
    if (!roadGroup) return;

    roadGroup.clearLayers();
    if (!showAccessRoads) return;

    // Render road polylines connecting to active plots
    const mulshiRoad = L.polyline([
      [18.5255, 73.5350],
      [18.5248, 73.5375],
      [18.5245, 73.5398],
      [18.5240, 73.5430],
    ], {
      color: '#10b981',
      weight: 6,
      opacity: 0.85,
    });

    mulshiRoad.bindTooltip(`
      <div style="padding: 2px 4px;">
        <span style="font-weight: bold; color: #10b981;">9m Paved Tar Village Road</span>
        <div style="font-size: 10px; color: #e2e8f0;">All-weather connection to Paud-Mulshi Highway</div>
      </div>
    `, { sticky: true });

    roadGroup.addLayer(mulshiRoad);
  }, [showAccessRoads]);

  // Render Elevation & Flood Risk Layer
  useEffect(() => {
    const elevationGroup = elevationLayerGroupRef.current;
    if (!elevationGroup) return;

    elevationGroup.clearLayers();
    if (!showElevationSlope) return;

    // Elevation contour visual lines
    const contour1 = L.polyline([
      [18.5220, 73.5360],
      [18.5230, 73.5380],
      [18.5235, 73.5410],
    ], {
      color: '#06b6d4',
      weight: 2,
      opacity: 0.7,
      dashArray: '3, 6',
    }).bindTooltip('Elevation: 610m MSL (Safe from River Flash Flood)');

    const contour2 = L.polyline([
      [18.5235, 73.5360],
      [18.5245, 73.5385],
      [18.5250, 73.5415],
    ], {
      color: '#06b6d4',
      weight: 2,
      opacity: 0.7,
      dashArray: '3, 6',
    }).bindTooltip('Elevation: 620m MSL (Slope 3.5% Gentle Drainage)');

    elevationGroup.addLayer(contour1);
    elevationGroup.addLayer(contour2);
  }, [showElevationSlope]);

  // Center on plot when selected
  const handleSelectPlotCard = (plot: Plot) => {
    setSelectedPlot(plot);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(plot.center, 16, { duration: 1.2 });
    }
  };

  // Valuation delta calculation
  const circleRateTotal = selectedPlot.areaSqM * selectedPlot.readyReckonerRate;
  const valuationDeltaPercent = Math.round(
    ((selectedPlot.askingPrice - circleRateTotal) / circleRateTotal) * 100
  );
  const brokerSavings = Math.round(selectedPlot.askingPrice * 0.02); // Standard 2% broker cut

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden bg-slate-950">
      {/* Left Sidebar: Plot Discovery & Filters */}
      <div 
        className={`${
          isSidebarOpen ? 'w-full lg:w-[440px]' : 'w-0 hidden'
        } transition-all duration-300 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col z-20 h-full`}
      >
        {/* Header / Search Controls */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/95">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h1 className="text-base font-bold text-white tracking-tight">Verified Cadastral Plots</h1>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800">
              {filteredPlots.length} Listings
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Gat No, Village, Taluka..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Zone Quick Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['All', 'Farmhouse / R-Zone', 'Residential NA', 'Industrial', 'Commercial'].map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedZone === zone
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Plot List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {filteredPlots.map((plot) => {
            const isSelected = plot.id === selectedPlot.id;
            const savings = Math.round(plot.askingPrice * 0.02);

            return (
              <div
                key={plot.id}
                onClick={() => handleSelectPlotCard(plot)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500/80 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/40'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                {/* Image and Badges */}
                <div className="relative h-32 rounded-lg overflow-hidden mb-2.5">
                  <img
                    src={plot.images[0]}
                    alt={plot.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
                      {plot.gatNumber}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-950/80 text-slate-300 backdrop-blur-sm">
                      {plot.zone}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 flex items-center gap-1 shadow">
                      <ShieldCheck className="w-3 h-3" />
                      {plot.titleHealth.score}/100 Clean
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                    <div>
                      <div className="text-[11px] text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {plot.village}, {plot.taluka}
                      </div>
                      <div className="text-sm font-extrabold text-white">
                        {formatINR(plot.askingPrice)}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60 font-mono">
                        Save {formatINR(savings)} Brokerage
                      </span>
                    </div>
                  </div>
                </div>

                {/* Plot Quick Spec Row */}
                <div className="grid grid-cols-3 gap-2 py-1.5 px-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Area</span>
                    <span className="font-bold text-slate-200">
                      {plot.areaGunthas} Gunthas
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Acres</span>
                    <span className="font-semibold text-slate-200">{plot.areaAcres} Ac</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Road Width</span>
                    <span className="font-semibold text-emerald-400">{plot.accessRoad.widthMeters}m Road</span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPlot(plot);
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1 transition-colors"
                  >
                    View Due Diligence
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMakeOffer(plot);
                    }}
                    className="py-1.5 px-3 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-1 transition-colors shadow-md shadow-emerald-500/20"
                  >
                    Make Offer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Map Canvas */}
      <div className="relative flex-1 h-full w-full">
        {/* Leaflet Container */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Toggle Controls Overlay */}
        <div className="absolute top-4 left-4 z-[500] flex flex-wrap items-center gap-2">
          {/* Collapse sidebar toggle on mobile */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="px-3 py-2 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white text-xs font-bold shadow-xl flex items-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>{isSidebarOpen ? 'Hide List' : 'Show Plots'}</span>
          </button>

          {/* Layer 1: Cadastral Survey / Gat Boundary Lines */}
          <button
            onClick={() => setShowCadastralGatLines(!showCadastralGatLines)}
            className={`px-3 py-2 rounded-xl backdrop-blur-md border text-xs font-semibold shadow-xl flex items-center gap-2 transition-all ${
              showCadastralGatLines
                ? 'bg-amber-950/90 border-amber-500/80 text-amber-300 ring-1 ring-amber-500/30'
                : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Cadastral Gat Grid</span>
            <span className={`w-2 h-2 rounded-full ${showCadastralGatLines ? 'bg-amber-400' : 'bg-slate-600'}`} />
          </button>

          {/* Layer 2: Access Road Connectivity */}
          <button
            onClick={() => setShowAccessRoads(!showAccessRoads)}
            className={`px-3 py-2 rounded-xl backdrop-blur-md border text-xs font-semibold shadow-xl flex items-center gap-2 transition-all ${
              showAccessRoads
                ? 'bg-emerald-950/90 border-emerald-500/80 text-emerald-300 ring-1 ring-emerald-500/30'
                : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Road Access (Meters)</span>
            <span className={`w-2 h-2 rounded-full ${showAccessRoads ? 'bg-emerald-400' : 'bg-slate-600'}`} />
          </button>

          {/* Layer 3: Contours & Flood Risk */}
          <button
            onClick={() => setShowElevationSlope(!showElevationSlope)}
            className={`px-3 py-2 rounded-xl backdrop-blur-md border text-xs font-semibold shadow-xl flex items-center gap-2 transition-all ${
              showElevationSlope
                ? 'bg-cyan-950/90 border-cyan-500/80 text-cyan-300 ring-1 ring-cyan-500/30'
                : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Mountain className="w-4 h-4" />
            <span>Slope & Elevation</span>
            <span className={`w-2 h-2 rounded-full ${showElevationSlope ? 'bg-cyan-400' : 'bg-slate-600'}`} />
          </button>

          {/* Basemap Switcher */}
          <button
            onClick={() => setBasemapType(basemapType === 'satellite' ? 'street' : 'satellite')}
            className="px-3 py-2 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-800 text-slate-300 text-xs font-semibold shadow-xl flex items-center gap-2 hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>{basemapType === 'satellite' ? 'Satellite Imagery' : 'Vector Map'}</span>
          </button>
        </div>

        {/* Selected Plot Floating Summary Card on Bottom */}
        {selectedPlot && (
          <div className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-[480px] z-[500] bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    {selectedPlot.gatNumber}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {selectedPlot.village}, {selectedPlot.taluka}, {selectedPlot.district}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1 line-clamp-1">
                  {selectedPlot.title}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-emerald-400">
                  {formatINR(selectedPlot.askingPrice)}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {formatFullINR(selectedPlot.askingPrice)}
                </div>
              </div>
            </div>

            {/* Valuation & Area Benchmark Grid */}
            <div className="grid grid-cols-4 gap-2 my-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Area</span>
                <span className="font-bold text-white">{selectedPlot.areaGunthas} Gunthas</span>
                <span className="text-[9px] text-slate-500 block">({selectedPlot.areaAcres} Ac)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Circle Rate</span>
                <span className="font-bold text-amber-400">₹{selectedPlot.readyReckonerRate}/m²</span>
                <span className="text-[9px] text-slate-500 block">Govt Base</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Asking / m²</span>
                <span className="font-bold text-white">
                  ₹{Math.round(selectedPlot.askingPrice / selectedPlot.areaSqM)}/m²
                </span>
                <span className="text-[9px] text-emerald-400 block font-medium">
                  +{valuationDeltaPercent}% Delta
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Title Health</span>
                <span className="font-bold text-emerald-400">
                  {selectedPlot.titleHealth.score}/100
                </span>
                <span className="text-[9px] text-emerald-300 block">Class-1 Freehold</span>
              </div>
            </div>

            {/* Road & Elevation Indicators */}
            <div className="flex items-center justify-between text-xs text-slate-300 border-t border-slate-800/80 pt-2.5 pb-3">
              <div className="flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedPlot.accessRoad.widthMeters}m {selectedPlot.accessRoad.type}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-cyan-400" />
                <span>{selectedPlot.elevation.avgAltitudeM}m MSL ({selectedPlot.elevation.slopePercent}% Slope)</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Broker Cut</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onSelectPlot(selectedPlot)}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors text-center"
              >
                Inspect Records
              </button>
              <button
                onClick={() => onScheduleVisit(selectedPlot)}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors text-center"
              >
                Schedule Visit
              </button>
              <button
                onClick={() => onMakeOffer(selectedPlot)}
                className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors text-center shadow-lg shadow-emerald-500/20"
              >
                Make Direct Offer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
