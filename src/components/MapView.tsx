"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { GLACIAL_LAKES, RIVER_GAUGES } from "@/lib/himalaya";
import type { HimalayaQuake } from "@/lib/quakes";

function magColor(mag: number): string {
  if (mag >= 6) return "#dc2626"; // red-600
  if (mag >= 5) return "#f97316"; // orange-500
  if (mag >= 4) return "#eab308"; // yellow-500
  return "#3b82f6"; // blue-500
}

function magRadius(mag: number): number {
  return Math.max(4, mag * 2.6);
}

export default function MapView({ quakes }: { quakes: HimalayaQuake[] }) {
  return (
    <MapContainer
      center={[29, 84]}
      zoom={5}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {quakes.map((q) => (
        <CircleMarker
          key={q.id}
          center={[q.lat, q.lon]}
          radius={magRadius(q.mag)}
          pathOptions={{
            color: magColor(q.mag),
            fillColor: magColor(q.mag),
            fillOpacity: 0.6,
            weight: 1,
          }}
        >
          <Tooltip>
            <strong>M{q.mag.toFixed(1)}</strong> — {q.place}
            <br />
            {new Date(q.time).toLocaleString()}
            <br />
            Depth: {q.depthKm.toFixed(0)} km
          </Tooltip>
        </CircleMarker>
      ))}

      {GLACIAL_LAKES.map((lake) => (
        <CircleMarker
          key={lake.id}
          center={[lake.lat, lake.lon]}
          radius={5}
          pathOptions={{ color: "#0ea5e9", fillColor: "#0ea5e9", fillOpacity: 0.9, weight: 1 }}
        >
          <Tooltip>
            <strong>{lake.name}</strong> ({lake.country})
            <br />
            Feeds: {lake.feedsRiver}
            <br />
            {lake.note}
          </Tooltip>
        </CircleMarker>
      ))}

      {RIVER_GAUGES.map((gauge) => (
        <CircleMarker
          key={gauge.id}
          center={[gauge.lat, gauge.lon]}
          radius={4}
          pathOptions={{ color: "#16a34a", fillColor: "#16a34a", fillOpacity: 0.9, weight: 1 }}
        >
          <Tooltip>
            <strong>{gauge.river}</strong> at {gauge.location}
            <br />
            {gauge.country}
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
