"use client";

import { useEffect, useState } from "react";
import Sparkline from "./Sparkline";
import type { RiverRiskAssessment, FloodRiskLevel } from "@/lib/risk";
import type { RiverHistoryPoint } from "@/app/api/flood-risk/route";

type RiverAssessmentWithHistory = RiverRiskAssessment & { history: RiverHistoryPoint[] };

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

export default function RiverRiskCard({ gaugeId }: { gaugeId: string }) {
  const [assessment, setAssessment] = useState<RiverAssessmentWithHistory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/flood-risk", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Failed to load flood risk");
        if (cancelled) return;
        const found = (json.rivers as RiverAssessmentWithHistory[]).find(
          (r) => r.gauge.id === gaugeId
        );
        setAssessment(found ?? null);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load flood risk");
        }
      }
    }

    load();
    const interval = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [gaugeId]);

  if (error) {
    return <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  }

  if (!assessment) {
    return <p className="text-sm text-slate-500">Loading current flood-risk status…</p>;
  }

  const r = assessment;

  return (
    <div className={`rounded-lg border p-4 ${LEVEL_STYLES[r.level]}`}>
      <div className="flex items-center justify-between">
        <span className="font-semibold">Current status</span>
        <span className="text-xs font-medium uppercase tracking-wide">{LEVEL_LABEL[r.level]}</span>
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
          ⚠ Elevated due to a recent quake near {r.relatedThreats[0]?.lake.name}
        </div>
      )}
      <div className="mt-3">
        <div className="mb-1 text-xs opacity-80">7-day discharge trend (dashed = typical)</div>
        <Sparkline points={r.history} typical={r.typicalDischarge} />
      </div>
    </div>
  );
}
