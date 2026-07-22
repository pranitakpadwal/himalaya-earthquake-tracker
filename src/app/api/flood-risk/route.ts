import { RIVER_GAUGES } from "@/lib/himalaya";
import { fetchHimalayaQuakes, type HimalayaQuake } from "@/lib/quakes";
import { assessAllRivers } from "@/lib/risk";

// Open-Meteo's Flood API (backed by the Copernicus GloFAS model) is free,
// keyless, and gives daily river discharge for any coordinate worldwide.
// It is a hydrological model/forecast, not a physical gauge reading, so we
// treat it as a risk signal rather than an official flood warning.
const FLOOD_API_URL = "https://flood-api.open-meteo.com/v1/flood";

export const revalidate = 1800; // discharge is a daily model value; refresh every 30 min

interface OpenMeteoFloodResponse {
  latitude: number;
  longitude: number;
  daily?: {
    time: string[];
    river_discharge: (number | null)[];
  };
}

async function fetchDischarges(): Promise<Record<string, number | null>> {
  const lats = RIVER_GAUGES.map((g) => g.lat).join(",");
  const lons = RIVER_GAUGES.map((g) => g.lon).join(",");

  const url = `${FLOOD_API_URL}?latitude=${lats}&longitude=${lons}&daily=river_discharge&forecast_days=1&past_days=1`;

  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`Open-Meteo flood API responded with ${res.status}`);
  }

  const body = await res.json();
  const results: OpenMeteoFloodResponse[] = Array.isArray(body) ? body : [body];

  const discharges: Record<string, number | null> = {};
  RIVER_GAUGES.forEach((gauge, i) => {
    const entry = results[i];
    const series = entry?.daily?.river_discharge;
    const latest = series?.length ? series[series.length - 1] : null;
    discharges[gauge.id] = typeof latest === "number" ? latest : null;
  });

  return discharges;
}

export async function GET() {
  try {
    const [discharges, recentQuakes] = await Promise.all([
      fetchDischarges(),
      fetchHimalayaQuakes(60)
        .then((feed) => feed.quakes)
        .catch((): HimalayaQuake[] => []),
    ]);

    const assessments = assessAllRivers(discharges, recentQuakes);

    return Response.json({
      fetchedAt: Date.now(),
      source: "Open-Meteo Flood API (Copernicus GloFAS)",
      rivers: assessments,
    });
  } catch (err) {
    return Response.json(
      {
        error: err instanceof Error ? err.message : "Failed to fetch flood risk data",
        rivers: [],
      },
      { status: 502 }
    );
  }
}
