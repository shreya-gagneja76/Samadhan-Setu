import React, { useState, useRef, useEffect } from 'react';
import { TabName, Issue, SeverityLevel, UserProfile } from '../types';
import { Layers, CheckCircle, Clock, ZoomIn, ZoomOut, Search, Navigation, Eye, Globe, Map as MapIcon, Compass, Sparkles } from 'lucide-react';
import ComplaintDetailModal from './ComplaintDetailModal';
import L from 'leaflet';

interface MapTabProps {
  setActiveTab: (tab: TabName) => void;
  issues: Issue[];
  profile: UserProfile | null;
  upvoteIssue: (id: string) => void;
  updateIssueStatus?: (id: string, status: 'Open' | 'In Progress' | 'Resolved', notes?: string) => void;
  verifyResolution: (id: string, afterImage: string, result: { resolved: boolean; confidence: number; reason: string }) => void;
  showToast: (type: 'success' | 'error' | 'warning' | 'info', text: string) => void;
}

export default function MapTab({
  setActiveTab,
  issues,
  profile,
  upvoteIssue,
  updateIssueStatus,
  verifyResolution,
  showToast
}: MapTabProps) {
  const [filterMode, setFilterMode] = useState<'All' | 'Critical' | 'Unresolved'>('All');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<'vector' | 'satellite' | 'terrain'>('vector');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Full detail modal overlay toggler
  const [modalIssueId, setModalIssueId] = useState<string | null>(null);

  // Map elements references
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Center coordinate of New Delhi
  const mapCenter: [number, number] = [28.6139, 77.2090];

  // Helper to parse estimatedFixTime and return SLA countdown
  const getSlaText = (issue: Issue) => {
    let durationDays = 3;
    const est = issue.estimatedFixTime || "3 days";
    const numbers = est.match(/\d+/g);
    let baseNumber = 3;
    if (numbers && numbers.length > 0) {
      baseNumber = parseInt(numbers[0], 10);
    }
    if (est.toLowerCase().includes('week')) {
      durationDays = baseNumber * 7;
    } else if (est.toLowerCase().includes('day')) {
      durationDays = baseNumber;
    }
    const elapsedMs = Date.now() - issue.timestamp;
    const durationMs = durationDays * 24 * 60 * 60 * 1000;
    const remainingMs = durationMs - elapsedMs;
    const daysLeft = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

    if (issue.status === 'Resolved') return '✅ SLA Met';
    if (remainingMs <= 0 || daysLeft <= 0) return '🔴 Overdue';
    return `⏱️ ${daysLeft}d left`;
  };

  // Generate deterministic lat/lng coordinates for issues based on id hashes
  const getIssueLatLng = (id: string, locationName: string): [number, number] => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Spread markers ±0.018 degrees around center
    const latOffset = ((Math.abs(hash * 17) % 1000) / 1000 - 0.5) * 0.036;
    const lngOffset = ((Math.abs(hash * 31) % 1000) / 1000 - 0.5) * 0.036;
    return [mapCenter[0] + latOffset, mapCenter[1] + lngOffset];
  };

  // Map tiles configuration
  const getTileLayerUrl = (style: 'vector' | 'satellite' | 'terrain', isDark: boolean) => {
    if (style === 'satellite') {
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    }
    if (style === 'terrain') {
      return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    }
    if (isDark) {
      return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }
    return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  };

  const getTileLayerAttribution = (style: 'vector' | 'satellite' | 'terrain') => {
    if (style === 'satellite') {
      return 'Tiles &copy; Esri &mdash; Source: Esri, USDA, USGS, and the GIS User Community';
    }
    if (style === 'terrain') {
      return 'Map data: &copy; OpenStreetMap contributors | Style: &copy; OpenTopoMap';
    }
    return '&copy; OpenStreetMap contributors &copy; CARTO';
  };

  const getSeverityMarkerColor = (sev: SeverityLevel) => {
    switch (sev) {
      case 'Critical': return '#EF4444'; // Red
      case 'High': return '#F97316';     // Orange
      case 'Medium': return '#EAB308';   // Yellow
      case 'Low': return '#22C55E';      // Green
    }
  };

  // Filter issues according to selected mode & search query
  const displayedIssues = issues.filter((issue) => {
    if (filterMode === 'Critical' && issue.severity !== 'Critical') return false;
    if (filterMode === 'Unresolved' && issue.status === 'Resolved') return false;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(query) ||
        issue.category.toLowerCase().includes(query) ||
        issue.location.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const selectedIssue = issues.find(i => i.id === selectedIssueId);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');

    // Create Map Instance
    const map = L.map(mapContainerRef.current, {
      center: mapCenter,
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;

    // Layer group for markers
    const markerGroup = L.layerGroup().addTo(map);
    markersRef.current = markerGroup;

    // Load Initial Tile Layer
    const tileUrl = getTileLayerUrl(mapStyle, isDark);
    const tileAttr = getTileLayerAttribution(mapStyle);
    const tiles = L.tileLayer(tileUrl, {
      attribution: tileAttr,
      maxZoom: 18
    }).addTo(map);
    tileLayerRef.current = tiles;

    // Bind Details function to window to enable popup button click
    (window as any).viewIssueDetails = (id: string) => {
      setModalIssueId(id);
    };

    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 150);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      delete (window as any).viewIssueDetails;
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    }
  }, []); // runs after every mount

  // Sync Map style tiles
  useEffect(() => {
    if (!mapRef.current) return;
    const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');

    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    const tileUrl = getTileLayerUrl(mapStyle, isDark);
    const tileAttr = getTileLayerAttribution(mapStyle);
    const tiles = L.tileLayer(tileUrl, {
      attribution: tileAttr,
      maxZoom: 18
    }).addTo(mapRef.current);

    tileLayerRef.current = tiles;
  }, [mapStyle]);

  // Sync markers
  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();

    displayedIssues.forEach((issue) => {
      const latlng = getIssueLatLng(issue.id, issue.location);
      const color = getSeverityMarkerColor(issue.severity);

      const marker = L.circleMarker(latlng, {
        radius: 11,
        fillColor: color,
        color: '#FFFFFF',
        weight: 2,
        fillOpacity: 0.95
      });

      // Construct visually rich Leaflet Popup HTML
      const isResolved = issue.status === 'Resolved';
      const statusBadgeClass = isResolved
        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
        : issue.status === 'In Progress'
        ? 'bg-amber-100 text-amber-800 border-amber-200'
        : 'bg-red-100 text-red-800 border-red-200';

      const popupHtml = `
        <div class="p-2 font-sans text-slate-800 dark:text-slate-100" style="min-width: 210px;">
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">${issue.category}</span>
            <span class="px-2 py-0.5 text-[8px] font-black rounded-full uppercase border ${statusBadgeClass}">${issue.status}</span>
          </div>
          <h4 class="text-xs font-black text-[#1B3A6B] leading-tight mb-1" style="margin-top: 2px; margin-bottom: 4px;">${issue.title}</h4>
          <p class="text-[9px] text-slate-500 font-bold mb-2">📍 ${issue.location}</p>
          <div class="flex items-center justify-between border-t border-slate-100 pt-2 mt-1.5">
            <span class="text-[9px] font-bold text-[#FF6B35]">👍 ${issue.upvotes} Upvotes</span>
            <button 
              onclick="window.viewIssueDetails('${issue.id}')"
              class="bg-[#1B3A6B] hover:bg-blue-800 text-white px-2.5 py-1 rounded text-[9px] font-black cursor-pointer transition-all border-none"
            >
              View Details
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'custom-leaflet-popup'
      });

      marker.on('click', () => {
        setSelectedIssueId(issue.id);
      });

      marker.addTo(markersRef.current!);
    });
  }, [displayedIssues, mapStyle]);

  const handleResetMap = () => {
    if (mapRef.current) {
      mapRef.current.setView(mapCenter, 13);
      setSelectedIssueId(null);
      setSearchQuery('');
      showToast('success', 'Map centered and query reset.');
    }
  };

  return (
    <div className="animate-fadeIn space-y-6 pb-16">
      
      {/* Title & Info Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3.5xl font-black text-[#1B3A6B] dark:text-white flex items-center gap-2">
            <MapIcon className="text-[#FF6B35]" /> Comprehensive Ward Audit Canvas
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Interactive Leaflet.js mapping coordinates. Real-time civic issue spatial tracking & telemetry.
          </p>
          <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-semibold border border-blue-100 dark:border-blue-900/60 shadow-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            <span className="font-bold">Live Leaflet Map:</span> Interactive map centered on Ward Divisions. Explore reported grievances, upvote them directly, or click to verify repairs!
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Style toggler */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner text-xs font-bold gap-1">
            <button
              onClick={() => setMapStyle('vector')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1 ${
                mapStyle === 'vector'
                  ? 'bg-white dark:bg-slate-700 text-[#1B3A6B] dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <MapIcon size={12} /> Standard
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1 ${
                mapStyle === 'satellite'
                  ? 'bg-[#1B3A6B] text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Globe size={12} /> Satellite
            </button>
            <button
              onClick={() => setMapStyle('terrain')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1 ${
                mapStyle === 'terrain'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Compass size={12} /> Terrain
            </button>
          </div>

          {/* Severity Mode Filter */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner text-xs font-bold gap-1">
            <button
              onClick={() => setFilterMode('All')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                filterMode === 'All'
                  ? 'bg-white dark:bg-slate-700 text-[#1B3A6B] dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              All ({issues.length})
            </button>
            <button
              onClick={() => setFilterMode('Critical')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                filterMode === 'Critical'
                  ? 'bg-[#EF4444] text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              🔴 Critical ({issues.filter(i => i.severity === 'Critical').length})
            </button>
            <button
              onClick={() => setFilterMode('Unresolved')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                filterMode === 'Unresolved'
                  ? 'bg-[#1B3A6B] text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              ⚠️ Active ({issues.filter(i => i.status !== 'Resolved').length})
            </button>
          </div>
        </div>
      </div>

      {/* Control Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search complaints on the interactive grid (e.g. 'Pothole', 'MG Road', 'Water')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2.5 pl-10 pr-4 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-[10px] font-bold"
            >
              Clear
            </button>
          )}
        </div>

        <button
          onClick={handleResetMap}
          className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-[#1B3A6B] dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 hover:bg-slate-200 transition-all cursor-pointer whitespace-nowrap"
        >
          <Compass size={14} className="text-[#FF6B35]" /> Recenter Map
        </button>
      </div>

      {/* Main Map Visual Canvas Block */}
      <div className="relative bg-slate-200 dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-2xl h-[550px] flex items-stretch">
        
        {/* Leaflet container */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Popup Card Details on Marker Selection */}
        {selectedIssue && (
          <div className="absolute top-4 right-4 max-w-sm w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-150 dark:border-slate-700/80 p-4 space-y-4 animate-scaleUp z-30">
            <div className="flex justify-between items-start">
              <span className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                {selectedIssue.category}
              </span>
              <button 
                onClick={() => setSelectedIssueId(null)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-mono text-xs leading-none focus:outline-none cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-3">
              <img src={selectedIssue.image} alt={selectedIssue.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-slate-100" />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-[#1B3A6B] dark:text-blue-200 leading-tight line-clamp-2">
                  {selectedIssue.title}
                </h4>
                <div className="flex flex-wrap gap-1">
                  <span className="bg-red-500 text-white rounded px-1.5 py-0.5 text-[8px] font-black uppercase">
                    {selectedIssue.severity}
                  </span>
                  <span className="bg-slate-600 text-white rounded px-1.5 py-0.5 text-[8px] font-black uppercase">
                    {selectedIssue.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 dark:text-slate-300 font-extrabold flex items-center gap-1">
                📍 {selectedIssue.location}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                <span>Estimated Resolution SLA:</span>
                <span className="font-extrabold">{getSlaText(selectedIssue)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-3">
              <span className="text-[10px] text-slate-400 font-bold">👍 {selectedIssue.upvotes} Endorsements</span>
              
              <div className="flex gap-1.5">
                <button
                  onClick={() => setModalIssueId(selectedIssue.id)}
                  className="px-2.5 py-1.5 bg-[#FF6B35] hover:bg-orange-600 text-white font-black text-[9px] rounded-lg transition-all focus:outline-none shadow-sm cursor-pointer flex items-center gap-0.5"
                >
                  <Eye size={10} /> Open Details
                </button>
                
                <button
                  onClick={() => {
                    setActiveTab('Issues Feed');
                  }}
                  className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-black text-[9px] rounded-lg transition-all focus:outline-none cursor-pointer"
                >
                  Feed →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Map Legend (Bottom-Left Corner) */}
        <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-md border rounded-xl p-3 space-y-2 text-[10px] font-bold pointer-events-none z-30 flex flex-col">
          <span className="text-slate-400 dark:text-slate-400 uppercase text-[8px] font-black tracking-widest flex items-center gap-1">
            <Layers size={10} /> Legend Priority
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="text-slate-600 dark:text-slate-300">Critical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
              <span className="text-slate-600 dark:text-slate-300">High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
              <span className="text-slate-600 dark:text-slate-300">Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
              <span className="text-slate-600 dark:text-slate-300">Low</span>
            </div>
          </div>
        </div>

      </div>

      {/* COMPLAINT DETAIL MODAL LINKED DIRECTLY TO MAP PIN */}
      {modalIssueId && issues.find(i => i.id === modalIssueId) && (
        <ComplaintDetailModal
          issue={issues.find(i => i.id === modalIssueId)!}
          onClose={() => setModalIssueId(null)}
          profile={profile}
          upvoteIssue={upvoteIssue}
          updateIssueStatus={updateIssueStatus}
          verifyResolution={verifyResolution}
          showToast={showToast}
        />
      )}

    </div>
  );
}
