import type { Metadata } from "next";
import Link from "next/link";
import { RIVER_GAUGES } from "@/lib/himalaya";
import { RIVER_CONTENT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Himalaya Flood-Risk Rivers",
  description:
    "Live flood-risk tracking for the major rivers fed by Himalayan glaciers and snowmelt: Ganga, Brahmaputra, Teesta, Koshi, Gandaki, Indus and Jhelum.",
};

export default function RiversIndexPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Himalaya flood-risk rivers</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          These rivers all originate in or draw meltwater from the Hindu Kush–Himalaya, and each
          page below tracks live discharge against a typical baseline, plus any earthquake
          activity near the glacial lakes that feed it.
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {RIVER_GAUGES.map((g) => (
          <li key={g.id}>
            <Link
              href={`/rivers/${g.id}`}
              className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="font-semibold text-slate-900">
                {g.river} at {g.location}
              </div>
              <div className="text-xs text-slate-500">{g.country}</div>
              <p className="mt-2 text-sm text-slate-600">{RIVER_CONTENT[g.id]?.overview}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
