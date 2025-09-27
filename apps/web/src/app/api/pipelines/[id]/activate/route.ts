export async function PUT(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/pipelines/${id}/activate`, {
    method: "PUT",
  });
  return new Response(await r.text(), { status: r.status, headers: r.headers });
}
