import { GLACIAL_LAKES, RIVER_GAUGES, type GlacialLake, type RiverGauge } from "./himalaya";

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export interface QuakeLike {
  id: string;
  mag: number;
  lat: number;
  lon: number;
  time: number; // epoch ms
}

export interface LakeThreat {
  lake: GlacialLake;
  quake: QuakeLike;
  distanceKm: number;
}

// A quake this close to a monitored glacial lake, at or above this
// magnitude, is treated as a plausible trigger for slope failure / lake
// instability (GLOF precursor), per the pattern seen before the 2015
// Gorkha earthquake's downstream glacial-lake disturbances.
const TRIGGER_RADIUS_KM = 120;
const TRIGGER_MIN_MAGNITUDE = 4.5;
const TRIGGER_WINDOW_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function findLakeThreats(quakes: QuakeLike[]): LakeThreat[] {
  const now = Date.now();
  const threats: LakeThreat[] = [];

  for (const quake of quakes) {
    if (quake.mag < TRIGGER_MIN_MAGNITUDE) continue;
    if (now - quake.time > TRIGGER_WINDOW_MS) continue;

    for (const lake of GLACIAL_LAKES) {
      const distanceKm = haversineKm(quake.lat, quake.lon, lake.lat, lake.lon);
      if (distanceKm <= TRIGGER_RADIUS_KM) {
        threats.push({ lake, quake, distanceKm });
      }
    }
  }

  return threats.sort((a, b) => a.distanceKm - b.distanceKm);
}

export type FloodRiskLevel = "normal" | "watch" | "elevated" | "severe";

export interface RiverRiskAssessment {
  gauge: RiverGauge;
  currentDischarge: number | null;
  typicalDischarge: number;
  ratio: number | null;
  level: FloodRiskLevel;
  quakeBump: boolean;
  relatedThreats: LakeThreat[];
}

export function classifyDischargeRatio(ratio: number | null): FloodRiskLevel {
  if (ratio === null) return "normal";
  if (ratio >= 2.5) return "severe";
  if (ratio >= 1.8) return "elevated";
  if (ratio >= 1.3) return "watch";
  return "normal";
}

function bumpLevel(level: FloodRiskLevel): FloodRiskLevel {
  const order: FloodRiskLevel[] = ["normal", "watch", "elevated", "severe"];
  const idx = order.indexOf(level);
  return order[Math.min(idx + 1, order.length - 1)];
}

export function assessRiverRisk(
  gauge: RiverGauge,
  currentDischarge: number | null,
  lakeThreats: LakeThreat[]
): RiverRiskAssessment {
  const ratio =
    currentDischarge === null ? null : currentDischarge / gauge.typicalDischarge;
  let level = classifyDischargeRatio(ratio);

  const relatedThreats = lakeThreats.filter((t) =>
    gauge.river
      .toLowerCase()
      .split(/[\s/]+/)
      .some((word) => t.lake.feedsRiver.toLowerCase().includes(word))
  );

  const quakeBump = relatedThreats.length > 0;
  if (quakeBump) {
    level = bumpLevel(level);
  }

  return {
    gauge,
    currentDischarge,
    typicalDischarge: gauge.typicalDischarge,
    ratio,
    level,
    quakeBump,
    relatedThreats,
  };
}

export function assessAllRivers(
  discharges: Record<string, number | null>,
  quakes: QuakeLike[]
): RiverRiskAssessment[] {
  const lakeThreats = findLakeThreats(quakes);
  return RIVER_GAUGES.map((gauge) =>
    assessRiverRisk(gauge, discharges[gauge.id] ?? null, lakeThreats)
  );
}
