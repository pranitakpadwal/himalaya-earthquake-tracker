import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RIVER_GAUGES, GLACIAL_LAKES } from "@/lib/himalaya";
import { RIVER_CONTENT } from "@/lib/content";
import RiverRiskCard from "@/components/RiverRiskCard";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return RIVER_GAUGES.map((g) => ({ slug: g.id }));
}

function getGauge(slug: string) {
  return RIVER_GAUGES.find((g) => g.id === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const gauge = getGauge(slug);
  if (!gauge) return {};

  const title = `${gauge.river} Flood Risk Today — ${gauge.location}`;
  const description = `Live flood-risk status for the ${gauge.river} at ${gauge.location}, ${gauge.country}: current discharge, 7-day trend, and earthquake activity near the glacial lakes that feed it.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/rivers/${gauge.id}` },
    openGraph: { title, description, url: `${SITE_URL}/rivers/${gauge.id}` },
  };
}

export default async function RiverPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gauge = getGauge(slug);
  if (!gauge) notFound();

  const content = RIVER_CONTENT[gauge.id];
  const relatedLakes = GLACIAL_LAKES.filter((l) =>
    gauge.river
      .toLowerCase()
      .split(/[\s/]+/)
      .some((word) => l.feedsRiver.toLowerCase().includes(word))
  );

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <div>
        <Link href="/rivers" className="text-sm text-blue-600 underline">
          ← All rivers
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {gauge.river} at {gauge.location}
        </h1>
        <p className="text-sm text-slate-500">{gauge.country}</p>
      </div>

      <RiverRiskCard gaugeId={gauge.id} />

      {content && (
        <div className="flex flex-col gap-4 text-sm leading-6 text-slate-700">
          <p>{content.overview}</p>
          <p>{content.locationContext}</p>
          <p className="rounded-md bg-slate-100 p-3 text-slate-600">{content.historicalNote}</p>
        </div>
      )}

      {relatedLakes.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Glacial lakes feeding this river
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            An earthquake near any of these lakes automatically raises this river&apos;s flood-risk
            level above.
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {relatedLakes.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/glacial-lakes/${l.id}`}
                  className="block rounded-md border border-slate-200 bg-white p-3 hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="font-medium text-slate-800">{l.name}</div>
                  <div className="text-xs text-slate-500">{l.country}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-slate-500">
        River discharge is a hydrological model estimate (Open-Meteo / Copernicus GloFAS), not an
        official gauge reading. This is a risk indicator, not an official warning — always follow
        local authority guidance.
      </p>
    </div>
  );
}
