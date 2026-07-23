import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GLACIAL_LAKES, RIVER_GAUGES } from "@/lib/himalaya";
import { LAKE_CONTENT } from "@/lib/content";
import LakeQuakeWatch from "@/components/LakeQuakeWatch";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return GLACIAL_LAKES.map((l) => ({ slug: l.id }));
}

function getLake(slug: string) {
  return GLACIAL_LAKES.find((l) => l.id === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lake = getLake(slug);
  if (!lake) return {};

  const title = `${lake.name} — Glacial Lake Outburst Flood (GLOF) Risk`;
  const description = `${lake.name} in ${lake.country} feeds the ${lake.feedsRiver}. Live earthquake activity nearby, GLOF background, and downstream flood-risk link.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/glacial-lakes/${lake.id}` },
    openGraph: { title, description, url: `${SITE_URL}/glacial-lakes/${lake.id}` },
  };
}

export default async function LakePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lake = getLake(slug);
  if (!lake) notFound();

  const content = LAKE_CONTENT[lake.id];
  const relatedRivers = RIVER_GAUGES.filter((g) =>
    lake.feedsRiver.toLowerCase().includes(g.river.toLowerCase())
  );

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <div>
        <Link href="/glacial-lakes" className="text-sm text-blue-600 underline">
          ← All glacial lakes
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{lake.name}</h1>
        <p className="text-sm text-slate-500">
          {lake.country} · {lake.lat.toFixed(3)}, {lake.lon.toFixed(3)} · feeds the{" "}
          {lake.feedsRiver}
        </p>
      </div>

      <p className="text-sm leading-6 text-slate-700">{content?.intro ?? lake.note}</p>

      <div>
        <h2 className="text-lg font-semibold text-slate-900">Nearby earthquake activity</h2>
        <p className="mt-1 text-sm text-slate-600">
          Earthquakes within 150km of this lake in the last week. A M4.5+ quake within 120km in
          the last 30 days raises the flood-risk level of the river below.
        </p>
        <div className="mt-3">
          <LakeQuakeWatch lat={lake.lat} lon={lake.lon} />
        </div>
      </div>

      {relatedRivers.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Downstream river</h2>
          <ul className="mt-2 flex flex-col gap-2">
            {relatedRivers.map((g) => (
              <li key={g.id}>
                <Link
                  href={`/rivers/${g.id}`}
                  className="block rounded-md border border-slate-200 bg-white p-3 hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="font-medium text-slate-800">
                    {g.river} at {g.location}
                  </div>
                  <div className="text-xs text-slate-500">{g.country}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
