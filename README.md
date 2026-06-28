# Samadhan Setu — AI-Powered Civic Issue Resolution Platform

> Bridging citizens to municipal solutions through AI.

## The Problem
India's 4,000+ urban local bodies receive millions of civic complaints annually — potholes, broken streetlights, garbage overflow, water leaks — but most go unresolved due to lack of accountability, visibility, and verification. Citizens have no easy way to report, track, or confirm resolution.

## Our Solution
Samadhan Setu ("Bridge to Solutions") is a full-stack civic tech platform where citizens photograph issues, AI instantly categorises and prioritises them, and inspectors verify resolution using before/after image comparison — all powered by Gemini 2.5 Flash Vision.

**Key capabilities:**
-  AI Vision Analysis — auto-categorise, severity-score, and tag issues from a single photo
-  AI Resolution Verification — before/after image comparison to confirm genuine fixes
-  Gemini Chatbot — citizens ask questions about their ward's issues in natural language
-  Live Leaflet Map — real interactive map with severity-coded pins across ward divisions
-  SLA Accountability — countdown timers show resolution deadlines and overdue alerts
-  Gamified Civic Engagement — karma points, rank progression, and ward leaderboard

## Impact
Reduces unresolved issue backlog, creates transparent accountability between citizens and municipal bodies, and enables data-driven decision making through real-time analytics dashboards.

# Samadhan Setu 
### Bridging Citizens to Municipal Solutions

Samadhan Setu is an AI-powered civic issue reporting and resolution platform 
that connects citizens directly to municipal departments. Built for the 
hackathon, it enables citizens to report infrastructure problems using 
AI vision analysis, track resolution progress, and earn karma points for 
civic participation.

##  Features

-  **AI Issue Reporting** — Upload a photo; Gemini 2.5 Flash Vision 
  auto-detects category, severity, department, and urgency score
-  **Resolution Verification** — Before/after image comparison using 
  Gemini Vision to confirm if an issue is genuinely fixed
-  **Ward Map View** — Offline SVG ward canvas with real-time issue pins
-  **Analytics Dashboard** — Live charts for category breakdown, 
  severity distribution, and recurrence probability
-  **Dual Role System** — Citizen and Municipal Inspector roles with 
  different permissions and activity logs
-  **Karma & Badges** — Points system rewarding reporting, upvoting, 
  and verifying resolutions
-  **Dark Mode** — Full dark/light theme with persistence

##  Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Recharts, Lucide React
- **Backend:** Node.js, Express, Vite (full-stack SSR dev mode)
- **AI:** Google Gemini 2.5 Flash Vision API (@google/genai)
- **Storage:** localStorage (client-side persistence)
- **Deployment:** Google Cloud Run via AI Studio

## Deployed Link
https://samadhan-setu-604711183064.asia-southeast1.run.app 

## Demo Login

- **As Citizen:** Any standard email (e.g. `citizen@gmail.com`) + any password
- **As Inspector:** Email containing `inspector` / `officer` or ending 
  in `.gov.in` (e.g. `officer@ward.gov.in`) + any password

> Note: Authentication is demo-mode only for hackathon purposes.

##  Project Structure
src/

├── App.tsx                    # Root state, handlers, toast system

├── types.ts                   # TypeScript interfaces

├── initialIssues.ts           # Seed data with inline SVG previews

└── components/

├── AuthTab.tsx            # Login / Signup

├── HomeTab.tsx            # Landing with animated stats

├── ReportTab.tsx          # AI-powered issue reporting flow

├── FeedTab.tsx            # Issue feed with filters & verification

├── MapTab.tsx             # SVG ward map with issue pins

├── DashboardTab.tsx       # Analytics & charts

├── ProfileTab.tsx         # Karma, badges, activity log

├── Navbar.tsx             # Navigation & dark mode toggle

└── ComplaintDetailModal.tsx # Issue detail & resolution verification

server.ts                      # Express server + Gemini API endpoints

##  AI Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/analyze` | POST | Analyzes civic issue image via Gemini Vision |
| `/api/verify-resolution` | POST | Compares before/after images to confirm fix |
| `/api/chat` | POST | Gemini-powered civic assistant chatbot for citizen queries |
| `/api/health` | GET | Server health check |
