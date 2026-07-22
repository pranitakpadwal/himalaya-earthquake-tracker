import { isInHimalayaBelt } from "./himalaya";

// USGS "all earthquakes, past week, magnitude 2.5+" feed. Updated by USGS
// roughly every minute.
const USGS_FEED_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

interface UsgsFeature {
  id: string;
  properties: {
    mag: number | null;
    place: string | null;
    time: number;
    updated: number;
    url: string;
    tsunami: number;
    magType: string | null;
    type: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number, number]; // lon, lat, depth
  };
}

interface UsgsFeed {
  metadata: { generated: number; title: string };
  features: UsgsFeature[];
}

export interface HimalayaQuake {
  id: string;
  mag: number;
  place: string;
  time: number;
  url: string;
  lat: number;
  lon: number;
  depthKm: number;
  tsunami: boolean;
}

export interface HimalayaQuakeFeed {
  generatedAt: number;
  fetchedAt: number;
  source: string;
  count: number;
  quakes: HimalayaQuake[];
}

/** Server-side fetch + filter of USGS quakes down to the Himalaya belt. */
export async function fetchHimalayaQuakes(revalidateSeconds: number): Promise<HimalayaQuakeFeed> {
  const res = await fetch(USGS_FEED_URL, {
    headers: { Accept: "application/geo+json" },
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    throw new Error(`USGS feed responded with ${res.status}`);
  }

  const feed = (await res.json()) as UsgsFeed;

  const quakes: HimalayaQuake[] = feed.features
    .filter((f) => f.properties.type === "earthquake" && f.properties.mag !== null)
    .map((f) => {
      const [lon, lat, depth] = f.geometry.coordinates;
      return {
        id: f.id,
        mag: f.properties.mag as number,
        place: f.properties.place ?? "Unknown location",
        time: f.properties.time,
        url: f.properties.url,
        lat,
        lon,
        depthKm: depth,
        tsunami: f.properties.tsunami === 1,
      };
    })
    .filter((q) => isInHimalayaBelt(q.lat, q.lon))
    .sort((a, b) => b.time - a.time);

  return {
    generatedAt: feed.metadata.generated,
    fetchedAt: Date.now(),
    source: "USGS Earthquake Hazards Program",
    count: quakes.length,
    quakes,
  };
}
