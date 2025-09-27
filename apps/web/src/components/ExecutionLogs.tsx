"use client";
import { useEffect, useState } from "react";

type Step = { ts: string; node_id: string; level: string; message: string; data?: any };

export function ExecutionLogs({ executionId }: { executionId: string }) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [poll, setPoll] = useState<boolean>(true);

  useEffect(() => {
    if (!executionId) return;
    let alive = true;
    async function load() {
      try {
        const r = await fetch(`/api/proxy/executions/${executionId}/steps`);
        if (!r.ok) return;
        const json = await r.json();
        if (alive) setSteps(json);
      } catch {}
    }
    load();
    if (poll) {
      const id = setInterval(load, 1000);
      return () => { alive = false; clearInterval(id); };
    }
    return () => { alive = false; };
  }, [executionId, poll]);

  return (
    <div className="h-48 overflow-auto rounded-md border border-slate-200/60 bg-white/70 p-2 text-xs space-y-1">
      {steps.length === 0 ? (
        <div className="text-slate-500">No logs yet...</div>
      ) : steps.map((s, i) => (
        <div key={i} className="font-mono">
          <span className="text-slate-400">{new Date(s.ts).toLocaleTimeString()}</span>
          <span className="mx-2">[{s.level}]</span>
          <span className="text-emerald-600">{s.node_id}</span>
          <span className="mx-2">-</span>
          <span>{s.message}</span>
          {s.data && s.data.outputs && (
            <pre className="mt-1 bg-slate-50 border border-slate-200 rounded p-2 overflow-auto">{JSON.stringify(s.data.outputs, null, 2)}</pre>
          )}
        </div>
      ))}
    </div>
  );
}


