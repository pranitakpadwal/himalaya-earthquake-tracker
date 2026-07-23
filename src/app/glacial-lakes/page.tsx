import type { Metadata } from "next";
import Link from "next/link";
import { GLACIAL_LAKES } from "@/lib/himalaya";
import { LAKE_CONTENT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Himalaya Glacial Lakes (GLOF Risk)",
  description:
    "Documented high-risk glacial lakes across the Hindu Kush–Himalaya, monitored for glacial lake outburst flood (GLOF) risk and nearby earthquake activity.",
};

export default function GlacialLakesIndexPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Himalaya glacial lakes</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          These lakes have documented glacial lake outburst flood (GLOF) risk in scientific and
          government assessments (ICIMOD, national hydrology departments). Each page tracks
          earthquake activity nearby and links to the river it would affect.
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {GLACIAL_LAKES.map((l) => (
          <li key={l.id}>
            <Link
              href={`/glacial-lakes/${l.id}`}
              className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="font-semibold text-slate-900">{l.name}</div>
              <div className="text-xs text-slate-500">
                {l.country} · feeds the {l.feedsRiver}
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {LAKE_CONTENT[l.id]?.intro ?? l.note}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
