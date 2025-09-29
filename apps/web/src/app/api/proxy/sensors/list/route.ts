export async function GET() {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
  const upstream = `${base}/api/sensors`;
  const r = await fetch(upstream);
  return new Response(await r.text(), {
    status: r.status,
    headers: { "content-type": r.headers.get("content-type") || "application/json" },
  });
}



