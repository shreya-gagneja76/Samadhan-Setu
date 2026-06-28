import { Issue } from './types';

// Highly realistic, beautifully detailed inline SVGs for instant loading and stunning visual fidelity
const potholeSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250">
  <rect width="400" height="250" fill="%23334155" />
  <path d="M 0,40 L 400,40 M 0,100 L 400,100 M 0,160 L 400,160 M 0,220 L 400,220" stroke="%231e293b" stroke-width="0.5" opacity="0.3"/>
  <line x1="0" y1="50" x2="400" y2="50" stroke="%23f59e0b" stroke-width="4" stroke-dasharray="25 15" />
  <path d="M 120,80 L 140,90 L 130,110 L 150,115" stroke="%231e293b" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M 220,130 L 260,120 L 280,140" stroke="%231e293b" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <ellipse cx="200" cy="140" rx="90" ry="45" fill="%231e293b" />
  <ellipse cx="195" cy="142" rx="85" ry="40" fill="%230f172a" />
  <ellipse cx="185" cy="148" rx="55" ry="25" fill="%2338bdf8" fill-opacity="0.2" />
  <path d="M 150,145 Q 170,135 190,148 T 230,140 Q 190,160 150,145" fill="%230284c7" opacity="0.4" />
  <g transform="translate(310, 100)">
    <polygon points="10,50 30,50 22,10 18,10" fill="%23f97316"/>
    <ellipse cx="20" cy="50" rx="14" ry="4" fill="%23f97316"/>
    <polygon points="14,35 26,35 24,25 16,25" fill="%23ffffff"/>
  </g>
</svg>`;

const streetlightSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250">
  <rect width="400" height="250" fill="%230f172a" />
  <circle cx="50" cy="40" r="1" fill="%23ffffff" opacity="0.8"/>
  <circle cx="120" cy="30" r="1" fill="%23ffffff" opacity="0.6"/>
  <circle cx="280" cy="50" r="1.5" fill="%23ffffff" opacity="0.9"/>
  <circle cx="340" cy="35" r="1" fill="%23ffffff" opacity="0.5"/>
  <path d="M 0,250 L 0,210 L 40,180 L 80,210 L 80,250 Z" fill="%23020617" />
  <path d="M 300,250 L 300,200 L 350,170 L 400,200 L 400,250 Z" fill="%23020617" />
  <line x1="200" y1="250" x2="200" y2="60" stroke="%23475569" stroke-width="8" />
  <path d="M 200,60 C 200,40 240,40 250,55" fill="none" stroke="%23475569" stroke-width="6" />
  <rect x="240" y="55" width="20" height="10" rx="3" fill="%23334155" />
  <polygon points="250,65 140,250 360,250" fill="url(%23lamp-glow)" opacity="0.35" />
  <circle cx="250" cy="65" r="6" fill="%23fef08a" />
  <defs>
    <linearGradient id="lamp-glow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%23fbbf24"/>
      <stop offset="100%" stop-color="%23fbbf24" stop-opacity="0"/>
    </linearGradient>
  </defs>
</svg>`;

const garbageSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250">
  <rect width="400" height="250" fill="%23cbd5e1" />
  <rect x="0" y="0" width="400" height="150" fill="%2394a3b8" />
  <line x1="0" y1="50" x2="400" y2="50" stroke="%2364748b" stroke-width="2" />
  <line x1="0" y1="100" x2="400" y2="100" stroke="%2364748b" stroke-width="2" />
  <line x1="0" y1="150" x2="400" y2="150" stroke="%23475569" stroke-width="3" />
  <line x1="80" y1="0" x2="80" y2="50" stroke="%2364748b" stroke-width="1" />
  <line x1="180" y1="0" x2="180" y2="50" stroke="%2364748b" stroke-width="1" />
  <line x1="280" y1="0" x2="280" y2="50" stroke="%2364748b" stroke-width="1" />
  <line x1="120" y1="50" x2="120" y2="100" stroke="%2364748b" stroke-width="1" />
  <line x1="220" y1="50" x2="220" y2="100" stroke="%2364748b" stroke-width="1" />
  <line x1="320" y1="50" x2="320" y2="100" stroke="%2364748b" stroke-width="1" />
  <rect x="180" y="110" width="90" height="100" rx="6" fill="%2315803d" stroke="%23166534" stroke-width="2" />
  <rect x="175" y="102" width="100" height="10" rx="3" fill="%23166534" />
  <path d="M 110,210 C 100,180 140,160 150,180 C 160,190 150,210 110,210 Z" fill="%231e293b" stroke="%230f172a" stroke-width="1" />
  <path d="M 125,175 L 122,168 L 129,170 Z" fill="%231e293b" />
  <path d="M 260,210 C 255,185 295,170 305,190 C 315,200 290,210 260,210 Z" fill="%231e3a8a" stroke="%23172554" stroke-width="1" />
  <path d="M 280,183 L 278,176 L 285,178 Z" fill="%231e3a8a" />
  <ellipse cx="160" cy="225" rx="8" ry="4" fill="%23ef4444" transform="rotate(30, 160, 225)" />
  <rect x="145" y="222" width="12" height="4" fill="%2338bdf8" rx="1" />
  <g transform="translate(140, 140)">
    <circle cx="0" cy="0" r="1.5" fill="%23000000" />
    <ellipse cx="-2" cy="-2" rx="1" ry="2" fill="%23e2e8f0" opacity="0.6" transform="rotate(-30, -2, -2)" />
    <ellipse cx="2" cy="-2" rx="1" ry="2" fill="%23e2e8f0" opacity="0.6" transform="rotate(30, 2, -2)" />
  </g>
</svg>`;

const waterleakSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250">
  <rect width="400" height="250" fill="%2394a3b8" />
  <rect x="0" y="110" width="400" height="40" fill="%23475569" stroke="%23334155" stroke-width="2" />
  <rect x="150" y="105" width="14" height="50" fill="%23334155" />
  <rect x="250" y="105" width="14" height="50" fill="%23334155" />
  <path d="M 200,120 Q 200,30 180,20 Q 160,30 160,110" fill="none" stroke="%2360a5fa" stroke-width="6" stroke-linecap="round" opacity="0.8"/>
  <path d="M 202,120 Q 215,40 230,30 Q 245,40 235,130" fill="none" stroke="%2393c5fd" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
  <circle cx="180" cy="20" r="4" fill="%23e0f2fe" />
  <circle cx="230" cy="30" r="3.5" fill="%23e0f2fe" />
  <circle cx="195" cy="45" r="3" fill="%23e0f2fe" />
  <ellipse cx="200" cy="180" rx="120" ry="30" fill="url(%23puddle-grad)" opacity="0.6" />
  <ellipse cx="200" cy="180" rx="80" ry="20" fill="none" stroke="%2360a5fa" stroke-width="1.5" opacity="0.4" />
  <ellipse cx="190" cy="185" rx="40" ry="10" fill="none" stroke="%2393c5fd" stroke-width="1" opacity="0.5" />
  <defs>
    <linearGradient id="puddle-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%2338bdf8"/>
      <stop offset="100%" stop-color="%230284c7" stop-opacity="0.3"/>
    </linearGradient>
  </defs>
</svg>`;

const fixedPotholeSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250">
  <rect width="400" height="250" fill="%23334155" />
  <path d="M 0,40 L 400,40 M 0,100 L 400,100 M 0,160 L 400,160 M 0,220 L 400,220" stroke="%231e293b" stroke-width="0.5" opacity="0.3"/>
  <line x1="0" y1="50" x2="400" y2="50" stroke="%23f59e0b" stroke-width="4" stroke-dasharray="25 15" />
  <rect x="110" y="95" width="180" height="90" fill="%231e293b" rx="20" opacity="0.8" />
  <path d="M 110,140 Q 200,120 290,140" stroke="%230f172a" stroke-width="2" fill="none" opacity="0.4" />
</svg>`;

const fixedStreetlightSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250">
  <rect width="400" height="250" fill="%231e293b" />
  <line x1="200" y1="250" x2="200" y2="60" stroke="%23475569" stroke-width="8" />
  <path d="M 200,60 C 200,40 240,40 250,55" fill="none" stroke="%23475569" stroke-width="6" />
  <rect x="240" y="55" width="20" height="10" rx="3" fill="%23475569" />
  <polygon points="250,65 -50,250 450,250" fill="url(%23lamp-glow-full)" opacity="0.6" />
  <circle cx="250" cy="65" r="8" fill="%23fef08a" />
  <defs>
    <linearGradient id="lamp-glow-full" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%23fde047"/>
      <stop offset="100%" stop-color="%23fbbf24" stop-opacity="0"/>
    </linearGradient>
  </defs>
</svg>`;

export const getInitialIssues = (): Issue[] => [
  {
    id: "init-1",
    category: "Pothole",
    severity: "Critical",
    title: "Major Potholes near Metro Station exit",
    description: "Huge craters have formed exactly at the exit gate of Sector 5 Metro Station in Delhi. It is creating severe bottlenecks and poses a high risk to two-wheelers during rush hours.",
    department: "PWD",
    urgencyScore: 9,
    estimatedFixTime: "2-3 days",
    tags: ["Road_Safety", "Metro_Traffic", "Hazard"],
    confidence: 0.94,
    image: potholeSvg,
    location: "Metro Station Gate 2, Noida Sector 15, NCR, Delhi",
    notes: "Nearly 4 serious accidents occurred at this spot last week when vehicles tried to brake suddenly.",
    timestamp: Date.now() - 4 * 3600000, // 4 hours ago
    upvotes: 24,
    status: "Resolved",
    afterImage: fixedPotholeSvg,
    verificationResult: {
      resolved: true,
      confidence: 92,
      reason: "Road surface has been repaired. No visible pothole or damage in the after image."
    }
  },
  {
    id: "init-2",
    category: "Broken Streetlight",
    severity: "High",
    title: "Broken streetlights along residential sector lane",
    description: "Three consecutive streetlights are completely non-functional for over 2 weeks along Lane 4, Indiranagar. The entire block stays pitch black at night, making it unsafe for pedestrians and elder citizens.",
    department: "Electricity Board",
    urgencyScore: 7,
    estimatedFixTime: "1 week",
    tags: ["Broken_Light", "Indiranagar", "Pedestrian_Safety"],
    confidence: 0.97,
    image: streetlightSvg,
    location: "Lane 4, opposite Public Park, Indiranagar, Bengaluru, KA",
    notes: "The poles are intact, but direct bulbs have burnt out. Local security reports multiple theft attempts.",
    timestamp: Date.now() - 25 * 3600000, // ~1 day ago
    upvotes: 18,
    status: "Resolved",
    afterImage: fixedStreetlightSvg,
    verificationResult: {
      resolved: true,
      confidence: 92,
      reason: "Streetlights are fully lit and functional. No dark areas visible in the after image."
    }
  },
  {
    id: "init-3",
    category: "Garbage",
    severity: "Medium",
    title: "Overflowing garbage dump yard near Public School",
    description: "The official municipal waste storage on Market Road is overflowing heavily. Garbage has spread to the main road pavement, smelling toxic and blocking school bus entry gates.",
    department: "Sanitation Department",
    urgencyScore: 6,
    estimatedFixTime: "2-3 days",
    tags: ["Waste_Management", "Public_Health", "School_Zone"],
    confidence: 0.91,
    image: garbageSvg,
    location: "Dharavi Junction, opp. Sacred Heart School, Mumbai, MH",
    notes: "Stray dogs and cattle gather near this pile and obstruct vehicles.",
    timestamp: Date.now() - 48 * 3600000, // 2 days ago
    upvotes: 35,
    status: "Resolved",
    afterImage: garbageSvg, // Mock verification payload
    verificationResult: {
      resolved: true,
      confidence: 96,
      reason: "The post-action image demonstrates that the garbage pile has been completely swept and cleared, exposing clean paved flooring."
    }
  },
  {
    id: "init-4",
    category: "Water Leak",
    severity: "Medium",
    title: "Main water pipe leakage flooding local market entrance",
    description: "Large volume drinking water leaking from a crack in the local supply valve near Dadar Vegetable Market. Thousands of liters of water are wasting and pooling into the pedestrian tracks daily.",
    department: "Water Authority",
    urgencyScore: 5,
    estimatedFixTime: "2 weeks",
    tags: ["Water_Wastage", "Flooding", "Dadar_Market"],
    confidence: 0.89,
    image: waterleakSvg,
    location: "Dadar Market Crossing Lane A, Mumbai, MH",
    notes: "Water pressure has decreased in surrounding residential complexes due to this break.",
    timestamp: Date.now() - 72 * 3600000, // 3 days ago
    upvotes: 3,
    status: "Open"
  }
];
