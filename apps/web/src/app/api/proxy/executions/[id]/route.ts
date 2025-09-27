interface CtxParams { params: { id: string } }

export async function GET(_req: Request, ctx: CtxParams) {
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/executions/${ctx.params.id}`);
  const text = await r.text();
  return new Response(text, { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' } });
}


