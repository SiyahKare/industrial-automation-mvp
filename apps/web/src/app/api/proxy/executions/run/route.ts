export async function POST(req: Request) {
  const body = await req.text();
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/executions/run`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body
  });
  const text = await r.text();
  return new Response(text, { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' } });
}


