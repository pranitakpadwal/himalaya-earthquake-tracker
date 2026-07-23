import Link from "next/link";
import Dashboard from "@/components/Dashboard";
import { RIVER_GAUGES, GLACIAL_LAKES } from "@/lib/himalaya";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <Dashboard />

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              What is a glacial lake outburst flood (GLOF)?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              As Himalayan glaciers retreat, meltwater collects behind loose rock and ice debris
              (moraine) to form glacial lakes. These natural dams can fail suddenly — from an
              earthquake, an avalanche, or simple overfilling — releasing a huge volume of water
              and debris downstream within minutes. GLOFs are one of the fastest-moving, least
              predictable flood hazards in mountain regions, and their frequency is increasing as
              glaciers retreat and more lakes form.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Why track earthquakes and floods together?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Earthquakes in the Himalaya can destabilize slopes and glacial lake moraines
              directly. The October 2023 South Lhonak GLOF and disturbances documented after the
              2015 Gorkha earthquake both show the same pattern: seismic activity near a glacial
              lake is a leading indicator of downstream flood risk, days to weeks before it shows
              up in river discharge data. This site is the only tracker that puts the two together
              automatically instead of treating quakes and floods as separate hazards.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Rivers we track for flood risk
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Each river page below shows live discharge data, a 7-day trend, and any earthquake
            activity near the glacial lakes that feed it.
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {RIVER_GAUGES.map((g) => (
              <li key={g.id}>
                <Link
                  href={`/rivers/${g.id}`}
                  className="block rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                >
                  {g.river} <span className="text-slate-400">— {g.location}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Glacial lakes we monitor
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Documented high-risk glacial lakes across the Hindu Kush–Himalaya, each linked to the
            river it would affect in an outburst.
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {GLACIAL_LAKES.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/glacial-lakes/${l.id}`}
                  className="block rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                >
                  {l.name} <span className="text-slate-400">— {l.country}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
