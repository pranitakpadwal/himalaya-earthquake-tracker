import { fetchHimalayaQuakes } from "@/lib/quakes";

export const revalidate = 60;

export async function GET() {
  try {
    const feed = await fetchHimalayaQuakes(revalidate);
    return Response.json(feed);
  } catch (err) {
    return Response.json(
      {
        error: err instanceof Error ? err.message : "Failed to fetch USGS feed",
        quakes: [],
      },
      { status: 502 }
    );
  }
}
