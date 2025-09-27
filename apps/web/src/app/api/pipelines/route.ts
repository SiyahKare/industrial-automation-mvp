export async function POST(req: Request) {
  const body = await req.text();
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/pipelines`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
  return new Response(await r.text(), { status: r.status, headers: r.headers });
}

