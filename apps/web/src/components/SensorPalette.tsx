"use client";
import useSWR from "swr";
import { useMemo, useState } from "react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

type Sensor = { tag: string; unit?: string };

type Props = {
  className?: string;
};

export default function SensorPalette({ className = "" }: Props) {
  const { data } = useSWR<Sensor[]>("/api/proxy/sensors/list", fetcher);
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const list = data ?? [];
    const dq = q.trim().toLowerCase();
    if (!dq) return list;
    return list.filter((s) => s.tag.toLowerCase().includes(dq) || (s.unit ?? "").toLowerCase().includes(dq));
  }, [data, q]);

  return (
    <div className={className}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Sensör ara…"
        className="border p-2 w-full mb-2 rounded"
      />
      <div className="border rounded divide-y max-h-64 overflow-auto">
        {(items ?? []).map((s) => (
          <div
            key={s.tag}
            draggable
            onDragStart={(e) => {
              const payload = { type: "sensor", sensorTag: s.tag, label: `Sensor: ${s.tag}` };
              e.dataTransfer.setData("application/reactflow", JSON.stringify(payload));
              e.dataTransfer.setData("application/json", JSON.stringify(payload));
              e.dataTransfer.effectAllowed = "move";
            }}
            className="p-2 text-sm cursor-grab hover:bg-gray-50"
            title={s.tag}
          >
            <div className="font-medium">{s.tag}</div>
            {s.unit && <div className="text-xs text-gray-500">{s.unit}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
