import Link from "next/link";
export const metadata = { title: "Sensors" };

async function fetchSensors() {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
  try {
    const r = await fetch(`${base}/api/sensors`, { cache: "no-store" });
    if (!r.ok) return [] as any[];
    return (await r.json()) as any[];
  } catch {
    return [] as any[];
  }
}

export default async function SensorsPage() {
  const sensors = await fetchSensors();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Sensors</h1>
          <Link href="/sensors/new" className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700">
            New Sensor
          </Link>
        </div>

        {sensors.length === 0 ? (
          <div className="text-slate-500">No sensors found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-3">Tag</th>
                  <th className="text-left p-3">Unit</th>
                  <th className="text-left p-3">Source</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sensors.map((s: any) => (
                  <tr key={s.id}>
                    <td className="p-3 font-medium text-slate-800">{s.tag}</td>
                    <td className="p-3">{s.unit}</td>
                    <td className="p-3">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded">{JSON.stringify(s.source)}</code>
                    </td>
                    <td className="p-3 text-right">
                      <Link href={`/sensors/${s.id}`} className="px-3 py-1 rounded border hover:bg-slate-50 mr-2">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
