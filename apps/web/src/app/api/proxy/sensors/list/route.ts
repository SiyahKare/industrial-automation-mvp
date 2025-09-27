export async function GET() {
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/sensors`);
  const body = await r.text();
  return new Response(body, {
    status: r.status,
    headers: { "content-type": r.headers.get("content-type") || "application/json" },
  });
}



