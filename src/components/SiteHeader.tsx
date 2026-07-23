import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-slate-900">
          Himalaya Hazard Tracker
        </Link>
        <nav className="flex gap-5 text-sm text-slate-600">
          <Link href="/" className="hover:text-slate-900">
            Live map
          </Link>
          <Link href="/rivers" className="hover:text-slate-900">
            Rivers
          </Link>
          <Link href="/glacial-lakes" className="hover:text-slate-900">
            Glacial lakes
          </Link>
        </nav>
      </div>
    </header>
  );
}
