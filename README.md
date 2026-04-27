# NexusFlow — Smart Supply Chain Intelligence

> **Resilient Logistics & Dynamic Supply Chain Optimization**  
> Prototype website for GitHub Pages hosting

## 🚀 Live Demo

Deploy to GitHub Pages:
1. Upload this repository to GitHub
2. Go to **Settings → Pages → Deploy from branch → main → / (root)**
3. Your site will be live at `https://<username>.github.io/<repo-name>`

---

## 📋 Project Objective

Modern global supply chains manage millions of concurrent shipments across highly complex and inherently volatile transportation networks. Critical transit disruptions — ranging from sudden weather events to hidden operational bottlenecks — are chronically identified only after delivery timelines are already compromised.

**NexusFlow** is a prototype dashboard demonstrating a scalable system capable of:

- **Continuously analyzing** multifaceted transit data to preemptively detect and flag potential supply chain disruptions
- **Dynamic route adjustment** mechanisms that instantly execute or recommend highly optimized route alternatives
- **Cascade prevention** — stopping localized bottlenecks before they propagate into broader delays

---

## 🗂️ Project Structure

```
/
├── index.html          # Main landing page & dashboard
├── css/
│   └── style.css       # Full stylesheet (CSS variables, responsive)
├── js/
│   └── main.js         # Animated canvas, live feed, charts, interactions
└── README.md
```

---

## ✨ Features

| Section | Description |
|---|---|
| **Hero** | Animated node-network background, live stat counters |
| **How It Works** | 4-step system architecture (Ingest → AI Score → Reroute → Alert) |
| **Global Dashboard** | Animated SVG world map with live shipment routes |
| **Disruption Feed** | Real-time simulated alert stream (new alerts every 7s) |
| **Route Optimizer** | 3 active shipments with AI-recommended alternate routes |
| **Predictive Analytics** | Risk score chart, disruption sources bar chart, accuracy gauge |
| **AI Insights** | Contextual intelligence summaries |

---

## 🛠️ Technology Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, animations, CSS Grid/Flexbox
- **Vanilla JavaScript** — Canvas API, IntersectionObserver, simulated live data
- **Google Fonts** — Syne (display), Space Mono (mono), DM Sans (body)
- **No dependencies** — Pure HTML/CSS/JS, works offline

---

## 📐 System Architecture (Prototype Simulates)

```
Data Sources          Processing Layer        Output
─────────────         ────────────────        ──────
GPS Telemetry    →    Stream Ingestion    →   Dashboard
Weather APIs     →    AI Risk Scoring    →   Disruption Alerts
Port Feeds       →    Graph Optimizer    →   Route Recommendations
Carrier EDI      →    Cascade Detector   →   Stakeholder Notifications
IoT Sensors      →    Prediction Engine  →   Analytics
```

---

## 🎨 Design

- **Aesthetic**: Industrial-futuristic dark theme
- **Colors**: Deep navy background, neon green (#00FF88) for healthy routes, amber (#FFAA00) for at-risk, red (#FF3B3B) for disrupted
- **Typography**: Syne (headlines) + Space Mono (data/mono) + DM Sans (body)
- **Responsive**: Mobile-first, works on all screen sizes

---

## 📌 GitHub Pages Deployment

No build step needed. This is a static site.

```bash
git init
git add .
git commit -m "Initial NexusFlow prototype"
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

Then enable GitHub Pages in repository settings.
