"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function SensorDetail({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tag, setTag] = useState("");
  const [unit, setUnit] = useState("");
  const [type, setType] = useState<"opcua" | "modbus" | "sim">("opcua");
  const [nodeId, setNodeId] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const r = await fetch("/api/proxy/sensors");
        if (!r.ok) throw new Error("Failed to load sensors");
        const list = await r.json();
        const s = Array.isArray(list) ? list.find((x: any) => String(x.id) === String(params.id)) : null;
        if (!s) throw new Error("Sensor not found");
        if (cancelled) return;
        setTag(s.tag || "");
        setUnit(s.unit || "");
        const src = s.source || {};
        const t = src.type || "opcua";
        setType(t);
        setNodeId(src.nodeId || "");
        setAddress(src.address || "");
        setError(null);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Load error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function save(e: any) {
    e.preventDefault();
    setSaving(true);
    try {
      const source = type === "opcua" ? { type, nodeId } : type === "modbus" ? { type, address } : { type };
      const r = await fetch("/api/proxy/sensors", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tag, unit, source }),
      });
      if (!r.ok) throw new Error("Save failed");
      alert("Sensor güncellendi");
    } catch (e: any) {
      alert(e?.message || "Hata");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Edit Sensor</h1>
          <Link href="/sensors" className="px-4 py-2 rounded border hover:bg-slate-50">Back</Link>
        </div>

        {loading ? (
          <div className="text-slate-600">Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <form onSubmit={save} className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Tag</label>
              <input value={tag} readOnly className="border p-2 rounded w-full bg-slate-50" />
              <p className="text-xs text-slate-500 mt-1">Tag değişikliği veri bütünlüğü için kapalı.</p>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Unit</label>
              <input value={unit} onChange={(e) => setUnit(e.target.value)} className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Source Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as any)} className="border p-2 rounded w-full">
                <option value="opcua">OPC UA</option>
                <option value="modbus">Modbus</option>
                <option value="sim">Sim</option>
              </select>
            </div>
            {type === "opcua" && (
              <div>
                <label className="block text-sm text-slate-600 mb-1">OPC UA NodeId</label>
                <input value={nodeId} onChange={(e) => setNodeId(e.target.value)} placeholder="ns=2;s=Device.Tag" className="border p-2 rounded w-full" />
              </div>
            )}
            {type === "modbus" && (
              <div>
                <label className="block text-sm text-slate-600 mb-1">Modbus Address</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="tcp://host:port:unit:reg" className="border p-2 rounded w-full" />
              </div>
            )}
            <div className="flex items-center justify-between pt-2">
              <button disabled={saving} className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
                {saving ? "Saving..." : "Save"}
              </button>
              <button type="button" disabled className="px-4 py-2 rounded border text-slate-400" title="Silme veri bütünlüğü için devre dışı">
                Delete (disabled)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
