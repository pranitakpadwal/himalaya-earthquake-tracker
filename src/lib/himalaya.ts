// Bounding box roughly covering the Hindu Kush–Himalaya belt:
// N Pakistan, N India, Nepal, Bhutan, N Bangladesh, N Myanmar, S Tibet (China).
export const HIMALAYA_BBOX = {
  minLat: 25,
  maxLat: 37,
  minLon: 70,
  maxLon: 98,
};

export function isInHimalayaBelt(lat: number, lon: number): boolean {
  return (
    lat >= HIMALAYA_BBOX.minLat &&
    lat <= HIMALAYA_BBOX.maxLat &&
    lon >= HIMALAYA_BBOX.minLon &&
    lon <= HIMALAYA_BBOX.maxLon
  );
}

export interface GlacialLake {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  /** River system this lake drains into if it fails (GLOF). */
  feedsRiver: string;
  note: string;
}

// A curated set of glacial lakes with documented GLOF (glacial lake outburst
// flood) risk in scientific literature (ICIMOD, Nepal DHM, Indian NDMA
// assessments). Coordinates are approximate lake centroids.
export const GLACIAL_LAKES: GlacialLake[] = [
  {
    id: "south-lhonak",
    name: "South Lhonak Lake",
    country: "India (Sikkim)",
    lat: 27.9167,
    lon: 88.1833,
    feedsRiver: "Teesta",
    note: "Caused the Oct 2023 Sikkim GLOF disaster; still classified high risk.",
  },
  {
    id: "imja-tsho",
    name: "Imja Tsho",
    country: "Nepal",
    lat: 27.9,
    lon: 86.9167,
    feedsRiver: "Dudh Koshi / Koshi",
    note: "One of the fastest-growing glacial lakes in the Everest region.",
  },
  {
    id: "tsho-rolpa",
    name: "Tsho Rolpa",
    country: "Nepal",
    lat: 27.8667,
    lon: 86.4667,
    feedsRiver: "Rolwaling / Tama Koshi / Koshi",
    note: "Long-monitored high-risk lake with an artificial outlet channel.",
  },
  {
    id: "thulagi",
    name: "Thulagi Lake",
    country: "Nepal",
    lat: 28.55,
    lon: 84.4167,
    feedsRiver: "Marsyangdi / Gandaki",
    note: "Large moraine-dammed lake near the Annapurna range.",
  },
  {
    id: "lower-barun",
    name: "Lower Barun Lake",
    country: "Nepal",
    lat: 27.8167,
    lon: 87.15,
    feedsRiver: "Barun / Arun / Koshi",
    note: "Rapidly expanding lake below Makalu.",
  },
  {
    id: "gangabal",
    name: "Gangabal Lake",
    country: "India (Kashmir)",
    lat: 34.4167,
    lon: 74.85,
    feedsRiver: "Jhelum",
    note: "High-altitude lake in a seismically active part of the western Himalaya.",
  },
  {
    id: "chorabari",
    name: "Chorabari (Kedarnath) area",
    country: "India (Uttarakhand)",
    lat: 30.7667,
    lon: 79.0667,
    feedsRiver: "Mandakini / Ganga",
    note: "Site of the 2013 Kedarnath flood disaster; steep, glacier-fed catchment.",
  },
  {
    id: "raphstreng",
    name: "Raphstreng Tsho",
    country: "Bhutan",
    lat: 27.9333,
    lon: 90.2,
    feedsRiver: "Pho Chhu",
    note: "Monitored after the 1994 Luggye Tsho GLOF nearby.",
  },
];

export interface RiverGauge {
  id: string;
  river: string;
  location: string;
  country: string;
  lat: number;
  lon: number;
  /** Approximate normal discharge (m^3/s) used only as a rough baseline for display. */
  typicalDischarge: number;
}

// Downstream monitoring points along major Himalaya-fed rivers, chosen at
// towns/cities with real flood exposure. Open-Meteo's Flood API (GloFAS
// based) is queried at these coordinates for daily river discharge.
export const RIVER_GAUGES: RiverGauge[] = [
  {
    id: "ganga-haridwar",
    river: "Ganga",
    location: "Haridwar",
    country: "India",
    lat: 29.9457,
    lon: 78.1642,
    typicalDischarge: 700,
  },
  {
    id: "ganga-varanasi",
    river: "Ganga",
    location: "Varanasi",
    country: "India",
    lat: 25.3176,
    lon: 82.9739,
    typicalDischarge: 2500,
  },
  {
    id: "brahmaputra-guwahati",
    river: "Brahmaputra",
    location: "Guwahati",
    country: "India",
    lat: 26.1445,
    lon: 91.7362,
    typicalDischarge: 9000,
  },
  {
    id: "teesta-siliguri",
    river: "Teesta",
    location: "Siliguri / Coronation Bridge",
    country: "India",
    lat: 26.8467,
    lon: 88.4666,
    typicalDischarge: 300,
  },
  {
    id: "koshi-chatara",
    river: "Koshi",
    location: "Chatara barrage",
    country: "Nepal",
    lat: 26.85,
    lon: 87.1667,
    typicalDischarge: 1300,
  },
  {
    id: "gandaki-narayanghat",
    river: "Gandaki",
    location: "Narayanghat",
    country: "Nepal",
    lat: 27.6939,
    lon: 84.4306,
    typicalDischarge: 1400,
  },
  {
    id: "indus-skardu",
    river: "Indus",
    location: "Skardu",
    country: "Pakistan",
    lat: 35.2971,
    lon: 75.6333,
    typicalDischarge: 700,
  },
  {
    id: "jhelum-srinagar",
    river: "Jhelum",
    location: "Srinagar",
    country: "India (Kashmir)",
    lat: 34.0837,
    lon: 74.7973,
    typicalDischarge: 300,
  },
];
