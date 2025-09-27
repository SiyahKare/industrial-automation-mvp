export async function GET(req: Request) {
  const url = new URL(req.url);
  const qs = url.search; // ?tags=...&start=...&bucket=...&agg=...
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/series${qs}`);
  const body = await r.text();
  return new Response(body, {
    status: r.status,
    headers: { "content-type": r.headers.get("content-type") || "application/json" },
  });
}



