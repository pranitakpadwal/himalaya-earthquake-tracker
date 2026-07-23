import type { MetadataRoute } from "next";
import { RIVER_GAUGES, GLACIAL_LAKES } from "@/lib/himalaya";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/rivers`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    {
      url: `${SITE_URL}/glacial-lakes`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...RIVER_GAUGES.map((g) => ({
      url: `${SITE_URL}/rivers/${g.id}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    })),
    ...GLACIAL_LAKES.map((l) => ({
      url: `${SITE_URL}/glacial-lakes/${l.id}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.6,
    })),
  ];
}
