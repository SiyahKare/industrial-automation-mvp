export async function PUT(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/pipelines/${id}/activate`, {
      method: 'PUT'
    });

    // Passthrough response (body + status + headers)
    const text = await response.text();
    return new Response(text, { status: response.status, headers: response.headers });
  } catch (_error) {
    return Response.json({ error: 'Failed to activate pipeline' }, { status: 500 });
  }
}
