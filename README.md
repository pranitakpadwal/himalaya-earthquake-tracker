# Himalaya Earthquake & River Flood-Risk Tracker

A live dashboard tracking seismic activity across the Hindu Kush–Himalaya
belt (Pakistan, India, Nepal, Bhutan, Tibet/China, N. Myanmar) and
cross-checking it against flood risk on the major rivers that drain the
region.

## Why this exists

Earthquake trackers already exist (USGS, EMSC, LastQuake, etc.). What's
missing is the regional correlation: earthquakes in this belt can
destabilize glacial lakes and slopes, triggering glacial lake outburst
floods (GLOFs) — the 2015 Nepal earthquake and the 2023 South Lhonak
disaster in Sikkim are documented examples. This dashboard is the first
step toward surfacing that connection in one place: when a quake happens
near a monitored glacial lake, the flood-risk status of the river it feeds
is automatically raised.

## What it does

- **Live earthquake feed** — polls the USGS earthquake GeoJSON feed
  (past week, M2.5+), filtered to the Himalaya belt, refreshed server-side
  every 60s and auto-refreshed on the client.
- **River flood-risk panel** — pulls daily river discharge for major
  Himalaya-fed rivers (Ganga, Brahmaputra, Teesta, Koshi, Gandaki, Indus,
  Jhelum) from Open-Meteo's Flood API (Copernicus GloFAS model) and
  compares it to a typical baseline.
- **Correlation logic** — if a M4.5+ quake occurs within 120km of a
  monitored glacial lake in the last 30 days, the flood-risk level for the
  river that lake feeds is bumped up a tier, with the reason shown inline.
- **Map view** — earthquakes (sized/colored by magnitude), glacial lakes,
  and river gauge points plotted together.

## Data sources

- Earthquakes: [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson) (free, no key)
- River discharge: [Open-Meteo Flood API](https://open-meteo.com/en/docs/flood-api) (free, no key, Copernicus GloFAS model)
- Glacial lake / river reference data: curated from published GLOF risk
  assessments (ICIMOD, Nepal DHM, Indian NDMA) — see `src/lib/himalaya.ts`

Flood risk shown here is a hydrological model estimate, not an official
gauge reading or warning. Always follow local authority guidance.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

- `src/lib/himalaya.ts` — Himalaya bounding box, glacial lake list, river gauge list
- `src/lib/quakes.ts` — USGS feed fetch + filter
- `src/lib/risk.ts` — distance/correlation logic and flood risk classification
- `src/app/api/earthquakes` — earthquake API route
- `src/app/api/flood-risk` — flood risk API route
- `src/components/Dashboard.tsx` — client dashboard with polling
- `src/components/MapView.tsx` — Leaflet map
