export async function POST(req: Request) {
  try {
    const pipeline = await req.json();
    
    // Forward to backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/pipelines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pipeline)
    });
    
    const result = await response.json();
    return Response.json(result, { status: response.status });
  } catch (error) {
    return Response.json({ error: 'Failed to save pipeline' }, { status: 500 });
  }
}

