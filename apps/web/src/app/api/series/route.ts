export async function GET(req: Request) {
  const u = new URL(req.url);
  const qs = u.search; // ?tags=...&start=...
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/series${qs}`);
  return new Response(await r.text(), { status: r.status, headers: r.headers });
}

