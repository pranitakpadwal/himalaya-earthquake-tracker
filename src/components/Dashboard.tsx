"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { HimalayaQuake } from "@/lib/quakes";
import type { RiverRiskAssessment, FloodRiskLevel } from "@/lib/risk";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-slate-500">
      Loading map…
    </div>
  ),
});

const QUAKE_POLL_MS = 60_000;
const FLOOD_POLL_MS = 60_000;

interface QuakeApiResponse {
  fetchedAt: number;
  count: number;
  quakes: HimalayaQuake[];
  error?: string;
}

interface FloodApiResponse {
  fetchedAt: number;
  rivers: RiverRiskAssessment[];
  error?: string;
}

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const LEVEL_STYLES: Record<FloodRiskLevel, string> = {
  normal: "bg-emerald-100 text-emerald-800 border-emerald-300",
  watch: "bg-yellow-100 text-yellow-800 border-yellow-300",
  elevated: "bg-orange-100 text-orange-800 border-orange-300",
  severe: "bg-red-100 text-red-800 border-red-300",
};

const LEVEL_LABEL: Record<FloodRiskLevel, string> = {
  normal: "Normal",
  watch: "Watch",
  elevated: "Elevated risk",
  severe: "Severe risk",
};

function magBadgeClass(mag: number): string {
  if (mag >= 6) return "bg-red-600";
  if (mag >= 5) return "bg-orange-500";
  if (mag >= 4) return "bg-yellow-500";
  return "bg-blue-500";
}

export default function Dashboard() {
  const [quakeData, setQuakeData] = useState<QuakeApiResponse | null>(null);
  const [floodData, setFloodData] = useState<FloodApiResponse | null>(null);
  const [quakeError, setQuakeError] = useState<string | null>(null);
  const [floodError, setFloodError] = useState<string | null>(null);
  const [lastPolled, setLastPolled] = useState<number | null>(null);

  const loadQuakes = useCallback(async () => {
    try {
      const res = await fetch("/api/earthquakes", { cache: "no-store" });
      const json: QuakeApiResponse = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load earthquakes");
      setQuakeData(json);
      setQuakeError(null);
    } catch (err) {
      setQuakeError(err instanceof Error ? err.message : "Failed to load earthquakes");
    } finally {
      setLastPolled(Date.now());
    }
  }, []);

  const loadFloodRisk = useCallback(async () => {
    try {
      const res = await fetch("/api/flood-risk", { cache: "no-store" });
      const json: FloodApiResponse = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load flood risk");
      setFloodData(json);
      setFloodError(null);
    } catch (err) {
      setFloodError(err instanceof Error ? err.message : "Failed to load flood risk");
    }
  }, []);

  useEffect(() => {
    // Poll-on-mount data sync, not derived state — setState happens inside
    // an awaited fetch, not synchronously during the effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadQuakes();
    loadFloodRisk();

    const quakeInterval = setInterval(loadQuakes, QUAKE_POLL_MS);
    const floodInterval = setInterval(loadFloodRisk, FLOOD_POLL_MS);

    return () => {
      clearInterval(quakeInterval);
      clearInterval(floodInterval);
    };
  }, [loadQuakes, loadFloodRisk]);

  const quakes = quakeData?.quakes ?? [];
  const rivers = floodData?.rivers ?? [];
  const activeThreatRivers = rivers.filter((r) => r.quakeBump);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Himalaya Earthquake &amp; River Flood-Risk Tracker
          </h1>
          <p className="text-sm text-slate-600">
            Live seismic activity across the Hindu Kush–Himalaya belt, cross-checked against
            glacial-lake outburst flood (GLOF) exposure on major downstream rivers.
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">
          {lastPolled && <div>Last checked: {timeAgo(lastPolled)}</div>}
          <div>Auto-refreshing every 60s</div>
        </div>
      </header>

      {activeThreatRivers.length > 0 && (
        <div className="rounded-lg border border-orange-300 bg-orange-50 p-4 text-sm text-orange-900">
          <strong>Correlated risk alert:</strong> recent earthquake activity was detected near
          glacial lakes feeding {activeThreatRivers.map((r) => r.gauge.river).join(", ")}. Flood
          risk levels below have been raised as a precaution.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="h-[480px] overflow-hidden rounded-lg border border-slate-200 lg:col-span-2">
          <MapView quakes={quakes} />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent earthquakes {quakeData ? `(${quakeData.count})` : ""}
          </h2>
          {quakeError && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{quakeError}</p>
          )}
          {!quakeError && quakes.length === 0 && (
            <p className="text-sm text-slate-500">No quakes in the belt in the last week.</p>
          )}
          <ul className="flex max-h-[440px] flex-col gap-2 overflow-y-auto pr-1">
            {quakes.map((q) => (
              <li
                key={q.id}
                className="flex items-start gap-3 rounded-md border border-slate-200 p-2 text-sm"
              >
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${magBadgeClass(q.mag)}`}
                >
                  {q.mag.toFixed(1)}
                </span>
                <div className="min-w-0">
                  <div className="truncate font-medium text-slate-800">{q.place}</div>
                  <div className="text-xs text-slate-500">
                    {timeAgo(q.time)} · depth {q.depthKm.toFixed(0)} km
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-slate-900">River flood-risk watch</h2>
        {floodError && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{floodError}</p>
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {rivers.map((r) => (
            <div
              key={r.gauge.id}
              className={`rounded-lg border p-3 ${LEVEL_STYLES[r.level]}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{r.gauge.river}</span>
                <span className="text-xs font-medium uppercase tracking-wide">
                  {LEVEL_LABEL[r.level]}
                </span>
              </div>
              <div className="text-xs opacity-80">
                {r.gauge.location}, {r.gauge.country}
              </div>
              <div className="mt-2 text-sm">
                {r.currentDischarge !== null ? (
                  <>
                    {r.currentDischarge.toFixed(0)} m³/s
                    <span className="opacity-70"> (typical {r.typicalDischarge} m³/s)</span>
                  </>
                ) : (
                  <span className="opacity-70">Discharge data unavailable</span>
                )}
              </div>
              {r.quakeBump && (
                <div className="mt-2 text-xs font-medium">
                  ⚠ Elevated due to nearby quake near {r.relatedThreats[0]?.lake.name}
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          River discharge is a hydrological model estimate (Open-Meteo / Copernicus GloFAS), not
          an official gauge reading. Flood levels are automatically raised when a magnitude 4.5+
          earthquake occurs within 120 km of a monitored glacial lake in the last 30 days. This is
          a risk indicator, not an official warning — always follow local authority guidance.
        </p>
      </section>
    </div>
  );
}
