"use client";

import { useEffect, useState } from "react";
import type { HimalayaQuake } from "@/lib/quakes";
import { haversineKm } from "@/lib/risk";

const NEARBY_RADIUS_KM = 150;

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function LakeQuakeWatch({ lat, lon }: { lat: number; lon: number }) {
  const [quakes, setQuakes] = useState<HimalayaQuake[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/earthquakes", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Failed to load earthquakes");
        if (cancelled) return;
        const nearby = (json.quakes as HimalayaQuake[])
          .filter((q) => haversineKm(q.lat, q.lon, lat, lon) <= NEARBY_RADIUS_KM)
          .sort((a, b) => b.time - a.time);
        setQuakes(nearby);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load earthquakes");
        }
      }
    }

    load();
    const interval = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [lat, lon]);

  if (error) {
    return <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  }

  if (!quakes) {
    return <p className="text-sm text-slate-500">Checking for nearby earthquakes…</p>;
  }

  if (quakes.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        No earthquakes within {NEARBY_RADIUS_KM}km in the last week.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {quakes.map((q) => (
        <li key={q.id} className="rounded-md border border-slate-200 p-2 text-sm">
          <span className="font-semibold">M{q.mag.toFixed(1)}</span> — {q.place}
          <div className="text-xs text-slate-500">
            {timeAgo(q.time)} · {haversineKm(q.lat, q.lon, lat, lon).toFixed(0)} km from this lake
          </div>
        </li>
      ))}
    </ul>
  );
}
