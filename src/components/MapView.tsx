"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from "react-leaflet";
import type { CircleMarker as LeafletCircleMarker } from "leaflet";
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

export interface MapFocus {
  id: string;
  lat: number;
  lon: number;
}

function FlyToFocus({
  focus,
  markerRefs,
}: {
  focus: MapFocus | null;
  markerRefs: React.RefObject<Map<string, LeafletCircleMarker>>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!focus) return;
    map.flyTo([focus.lat, focus.lon], Math.max(map.getZoom(), 7), { duration: 0.8 });
    const marker = markerRefs.current.get(focus.id);
    // Popup opens once the marker exists; a short delay lets flyTo settle.
    const t = setTimeout(() => marker?.openPopup(), 400);
    return () => clearTimeout(t);
  }, [focus, map, markerRefs]);

  return null;
}

export default function MapView({
  quakes,
  focus,
  onSelectQuake,
  onSelectRiver,
}: {
  quakes: HimalayaQuake[];
  focus?: MapFocus | null;
  onSelectQuake?: (id: string) => void;
  onSelectRiver?: (id: string) => void;
}) {
  const markerRefs = useRef<Map<string, LeafletCircleMarker>>(new Map());

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

      <FlyToFocus focus={focus ?? null} markerRefs={markerRefs} />

      {quakes.map((q) => (
        <CircleMarker
          key={q.id}
          ref={(instance) => {
            if (instance) markerRefs.current.set(q.id, instance);
            else markerRefs.current.delete(q.id);
          }}
          center={[q.lat, q.lon]}
          radius={magRadius(q.mag)}
          eventHandlers={{ click: () => onSelectQuake?.(q.id) }}
          pathOptions={{
            color: magColor(q.mag),
            fillColor: magColor(q.mag),
            fillOpacity: 0.6,
            weight: 1,
          }}
        >
          <Tooltip>
            M{q.mag.toFixed(1)} — {q.place}
          </Tooltip>
          <Popup>
            <div className="text-sm">
              <strong>M{q.mag.toFixed(1)}</strong> — {q.place}
              <br />
              {new Date(q.time).toLocaleString()}
              <br />
              Depth: {q.depthKm.toFixed(0)} km
              {q.tsunami && (
                <>
                  <br />
                  <span className="font-semibold text-red-600">Tsunami flag set by USGS</span>
                </>
              )}
              <br />
              <a
                href={q.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Full USGS report →
              </a>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {GLACIAL_LAKES.map((lake) => (
        <CircleMarker
          key={lake.id}
          center={[lake.lat, lake.lon]}
          radius={5}
          pathOptions={{ color: "#0ea5e9", fillColor: "#0ea5e9", fillOpacity: 0.9, weight: 1 }}
        >
          <Tooltip>{lake.name}</Tooltip>
          <Popup>
            <div className="text-sm">
              <strong>{lake.name}</strong> ({lake.country})
              <br />
              Feeds: {lake.feedsRiver}
              <br />
              {lake.note}
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {RIVER_GAUGES.map((gauge) => (
        <CircleMarker
          key={gauge.id}
          ref={(instance) => {
            if (instance) markerRefs.current.set(gauge.id, instance);
            else markerRefs.current.delete(gauge.id);
          }}
          center={[gauge.lat, gauge.lon]}
          radius={4}
          eventHandlers={{ click: () => onSelectRiver?.(gauge.id) }}
          pathOptions={{ color: "#16a34a", fillColor: "#16a34a", fillOpacity: 0.9, weight: 1 }}
        >
          <Tooltip>
            {gauge.river} at {gauge.location}
          </Tooltip>
          <Popup>
            <div className="text-sm">
              <strong>{gauge.river}</strong> at {gauge.location}
              <br />
              {gauge.country}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
